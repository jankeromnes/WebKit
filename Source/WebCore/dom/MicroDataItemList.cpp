/*
 * Copyright (c) 2011 Motorola Mobility, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY MOTOROLA MOBILITY, INC. AND ITS CONTRIBUTORS
 * ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL MOTOROLA MOBILITY, INC. OR ITS
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

#include "config.h"

#if ENABLE(MICRODATA)
#include "MicroDataItemList.h"

#include "DOMSettableTokenList.h"
#include "Document.h"
#include "HTMLElement.h"
#include "HTMLNames.h"
#include "NodeRareData.h"

namespace WebCore {

using namespace HTMLNames;

const String& MicroDataItemList::undefinedItemType()
{
    DEFINE_STATIC_LOCAL(String, undefinedItemTypeString, ("http://webkit.org/microdata/undefinedItemType"));
    return undefinedItemTypeString;
}

MicroDataItemList::MicroDataItemList(PassRefPtr<Node> rootNode, const String& typeNames)
    : DynamicSubtreeNodeList(rootNode, MicroDataItemListType, InvalidateOnItemAttrChange)
    , m_typeNames(typeNames, document()->inQuirksMode())
    , m_originalTypeNames(typeNames)
{
}

MicroDataItemList::~MicroDataItemList()
{
    ownerNode()->nodeLists()->removeCacheWithName(this, DynamicNodeList::MicroDataItemListType, m_originalTypeNames);
}

bool MicroDataItemList::nodeMatches(Element* testNode) const
{
    if (!testNode->isHTMLElement())
        return false;

    HTMLElement* testElement = toHTMLElement(testNode);
    if (!testElement->fastHasAttribute(itemscopeAttr) || testElement->fastHasAttribute(itempropAttr))
        return false;

    if (m_originalTypeNames == undefinedItemType())
        return true;

    return testElement->itemType()->tokens().containsAll(m_typeNames);
}

} // namespace WebCore

#endif // ENABLE(MICRODATA)
