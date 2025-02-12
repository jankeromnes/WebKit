/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#include "config.h"

#if USE(ACCELERATED_COMPOSITING)

#include "cc/CCRenderSurface.h"

#include "GraphicsContext3D.h"
#include "LayerRendererChromium.h"
#include "TextStream.h"
#include "cc/CCDamageTracker.h"
#include "cc/CCDebugBorderDrawQuad.h"
#include "cc/CCLayerImpl.h"
#include "cc/CCMathUtil.h"
#include "cc/CCQuadSink.h"
#include "cc/CCRenderPassDrawQuad.h"
#include "cc/CCSharedQuadState.h"
#include <public/WebTransformationMatrix.h>
#include <wtf/text/CString.h>

using WebKit::WebTransformationMatrix;

namespace WebCore {

static const int debugSurfaceBorderWidth = 2;
static const int debugSurfaceBorderAlpha = 100;
static const int debugSurfaceBorderColorRed = 0;
static const int debugSurfaceBorderColorGreen = 0;
static const int debugSurfaceBorderColorBlue = 255;
static const int debugReplicaBorderColorRed = 160;
static const int debugReplicaBorderColorGreen = 0;
static const int debugReplicaBorderColorBlue = 255;

CCRenderSurface::CCRenderSurface(CCLayerImpl* owningLayer)
    : m_owningLayer(owningLayer)
    , m_surfacePropertyChanged(false)
    , m_drawOpacity(1)
    , m_drawOpacityIsAnimating(false)
    , m_targetSurfaceTransformsAreAnimating(false)
    , m_screenSpaceTransformsAreAnimating(false)
    , m_nearestAncestorThatMovesPixels(0)
    , m_targetRenderSurfaceLayerIndexHistory(0)
    , m_currentLayerIndexHistory(0)
{
    m_damageTracker = CCDamageTracker::create();
}

CCRenderSurface::~CCRenderSurface()
{
}

FloatRect CCRenderSurface::drawableContentRect() const
{
    FloatRect drawableContentRect = CCMathUtil::mapClippedRect(m_drawTransform, m_contentRect);
    if (m_owningLayer->hasReplica())
        drawableContentRect.unite(CCMathUtil::mapClippedRect(m_replicaDrawTransform, m_contentRect));

    return drawableContentRect;
}

String CCRenderSurface::name() const
{
    return String::format("RenderSurface(id=%i,owner=%s)", m_owningLayer->id(), m_owningLayer->debugName().utf8().data());
}

static void writeIndent(TextStream& ts, int indent)
{
    for (int i = 0; i != indent; ++i)
        ts << "  ";
}

void CCRenderSurface::dumpSurface(TextStream& ts, int indent) const
{
    writeIndent(ts, indent);
    ts << name() << "\n";

    writeIndent(ts, indent+1);
    ts << "contentRect: (" << m_contentRect.x() << ", " << m_contentRect.y() << ", " << m_contentRect.width() << ", " << m_contentRect.height() << "\n";

    writeIndent(ts, indent+1);
    ts << "drawTransform: ";
    ts << m_drawTransform.m11() << ", " << m_drawTransform.m12() << ", " << m_drawTransform.m13() << ", " << m_drawTransform.m14() << "  //  ";
    ts << m_drawTransform.m21() << ", " << m_drawTransform.m22() << ", " << m_drawTransform.m23() << ", " << m_drawTransform.m24() << "  //  ";
    ts << m_drawTransform.m31() << ", " << m_drawTransform.m32() << ", " << m_drawTransform.m33() << ", " << m_drawTransform.m34() << "  //  ";
    ts << m_drawTransform.m41() << ", " << m_drawTransform.m42() << ", " << m_drawTransform.m43() << ", " << m_drawTransform.m44() << "\n";

    writeIndent(ts, indent+1);
    ts << "damageRect is pos(" << m_damageTracker->currentDamageRect().x() << "," << m_damageTracker->currentDamageRect().y() << "), ";
    ts << "size(" << m_damageTracker->currentDamageRect().width() << "," << m_damageTracker->currentDamageRect().height() << ")\n";
}

int CCRenderSurface::owningLayerId() const
{
    return m_owningLayer ? m_owningLayer->id() : 0;
}


void CCRenderSurface::setClipRect(const IntRect& clipRect)
{
    if (m_clipRect == clipRect)
        return;

    m_surfacePropertyChanged = true;
    m_clipRect = clipRect;
}

bool CCRenderSurface::contentsChanged() const
{
    return !m_damageTracker->currentDamageRect().isEmpty();
}

void CCRenderSurface::setContentRect(const IntRect& contentRect)
{
    if (m_contentRect == contentRect)
        return;

    m_surfacePropertyChanged = true;
    m_contentRect = contentRect;
}

bool CCRenderSurface::surfacePropertyChanged() const
{
    // Surface property changes are tracked as follows:
    //
    // - m_surfacePropertyChanged is flagged when the clipRect or contentRect change. As
    //   of now, these are the only two properties that can be affected by descendant layers.
    //
    // - all other property changes come from the owning layer (or some ancestor layer
    //   that propagates its change to the owning layer).
    //
    ASSERT(m_owningLayer);
    return m_surfacePropertyChanged || m_owningLayer->layerPropertyChanged();
}

bool CCRenderSurface::surfacePropertyChangedOnlyFromDescendant() const
{
    return m_surfacePropertyChanged && !m_owningLayer->layerPropertyChanged();
}

PassOwnPtr<CCSharedQuadState> CCRenderSurface::createSharedQuadState(int id) const
{
    bool isOpaque = false;
    return CCSharedQuadState::create(id, m_drawTransform, m_contentRect, m_scissorRect, m_drawOpacity, isOpaque);
}

PassOwnPtr<CCSharedQuadState> CCRenderSurface::createReplicaSharedQuadState(int id) const
{
    bool isOpaque = false;
    return CCSharedQuadState::create(id, m_replicaDrawTransform, m_contentRect, m_scissorRect, m_drawOpacity, isOpaque);
}

FloatRect CCRenderSurface::computeRootScissorRectInCurrentSurface(const FloatRect& rootScissorRect) const
{
    WebTransformationMatrix inverseScreenSpaceTransform = m_screenSpaceTransform.inverse();
    return CCMathUtil::projectClippedRect(inverseScreenSpaceTransform, rootScissorRect);
}

void CCRenderSurface::appendQuads(CCQuadSink& quadList, CCSharedQuadState* sharedQuadState, bool forReplica, int renderPassId)
{
    ASSERT(!forReplica || m_owningLayer->hasReplica());

    if (m_owningLayer->hasDebugBorders()) {
        int red = forReplica ? debugReplicaBorderColorRed : debugSurfaceBorderColorRed;
        int green = forReplica ?  debugReplicaBorderColorGreen : debugSurfaceBorderColorGreen;
        int blue = forReplica ? debugReplicaBorderColorBlue : debugSurfaceBorderColorBlue;
        SkColor color = SkColorSetARGB(debugSurfaceBorderAlpha, red, green, blue);
        quadList.append(CCDebugBorderDrawQuad::create(sharedQuadState, contentRect(), color, debugSurfaceBorderWidth));
    }

    // FIXME: By using the same RenderSurface for both the content and its reflection,
    // it's currently not possible to apply a separate mask to the reflection layer
    // or correctly handle opacity in reflections (opacity must be applied after drawing
    // both the layer and its reflection). The solution is to introduce yet another RenderSurface
    // to draw the layer and its reflection in. For now we only apply a separate reflection
    // mask if the contents don't have a mask of their own.
    CCLayerImpl* maskLayer = m_owningLayer->maskLayer();
    if (maskLayer && (!maskLayer->drawsContent() || maskLayer->bounds().isEmpty()))
        maskLayer = 0;

    if (!maskLayer && forReplica) {
        maskLayer = m_owningLayer->replicaLayer()->maskLayer();
        if (maskLayer && (!maskLayer->drawsContent() || maskLayer->bounds().isEmpty()))
            maskLayer = 0;
    }

    CCResourceProvider::ResourceId maskResourceId = maskLayer ? maskLayer->contentsResourceId() : 0;
    IntRect contentsChangedSinceLastFrame = contentsChanged() ? m_contentRect : IntRect();

    quadList.append(CCRenderPassDrawQuad::create(sharedQuadState, contentRect(), renderPassId, forReplica, maskResourceId, contentsChangedSinceLastFrame));
}

}
#endif // USE(ACCELERATED_COMPOSITING)
