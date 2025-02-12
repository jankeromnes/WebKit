/*
 * Copyright (C) 2005, 2006, 2007, 2008, 2009 Apple Inc. All rights reserved.
 * Copyright (C) 2008, 2009 Google, Inc.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public License
 * along with this library; see the file COPYING.LIB.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301, USA.
 */

#import "config.h"

#import "CalendarPickerMac.h"
#import "LayoutTestSupport.h"
#import "LocalCurrentGraphicsContext.h"
#import "RenderThemeChromiumMac.h"
#import "PaintInfo.h"
#import "RenderMediaControlsChromium.h"
#import "WebCoreSystemInterface.h"
#import "UserAgentStyleSheets.h"
#import <Carbon/Carbon.h>
#import <Cocoa/Cocoa.h>
#import <wtf/RetainPtr.h>
#import <wtf/StdLibExtras.h>
#import <math.h>

@interface RTCMFlippedView : NSView
{}

- (BOOL)isFlipped;
- (NSText *)currentEditor;

@end

@implementation RTCMFlippedView

- (BOOL)isFlipped {
    return [[NSGraphicsContext currentContext] isFlipped];
}

- (NSText *)currentEditor {
    return nil;
}

@end

namespace WebCore {

NSView* FlippedView()
{
    static NSView* view = [[RTCMFlippedView alloc] init];
    return view;
}

PassRefPtr<RenderTheme> RenderTheme::themeForPage(Page*)
{
    static RenderTheme* rt = RenderThemeChromiumMac::create().leakRef();
    return rt;
}

PassRefPtr<RenderTheme> RenderThemeChromiumMac::create()
{
    return adoptRef(new RenderThemeChromiumMac);
}

bool RenderThemeChromiumMac::supportsDataListUI(const AtomicString& type) const
{
    return RenderThemeChromiumCommon::supportsDataListUI(type);
}

bool RenderThemeChromiumMac::usesTestModeFocusRingColor() const
{
    return isRunningLayoutTest();
}

NSView* RenderThemeChromiumMac::documentViewFor(RenderObject*) const
{
    return FlippedView();
}

const int autofillPopupHorizontalPadding = 4;

// These functions are called with MenuListPart or MenulistButtonPart appearance by RenderMenuList, or with TextFieldPart appearance by AutofillPopupMenuClient.
// We assume only AutofillPopupMenuClient gives TexfieldPart appearance here.
// We want to change only Autofill padding.
// In the future, we have to separate Autofill popup window logic from WebKit to Chromium.
int RenderThemeChromiumMac::popupInternalPaddingLeft(RenderStyle* style) const
{
    if (style->appearance() == TextFieldPart)
        return autofillPopupHorizontalPadding;

    return RenderThemeMac::popupInternalPaddingLeft(style);
}

int RenderThemeChromiumMac::popupInternalPaddingRight(RenderStyle* style) const
{
    if (style->appearance() == TextFieldPart)
        return autofillPopupHorizontalPadding;

    return RenderThemeMac::popupInternalPaddingRight(style);
}

// Updates the control tint (a.k.a. active state) of |cell| (from |o|).
// In the Chromium port, the renderer runs as a background process and controls'
// NSCell(s) lack a parent NSView. Therefore controls don't have their tint
// color updated correctly when the application is activated/deactivated.
// FocusController's setActive() is called when the application is
// activated/deactivated, which causes a repaint at which time this code is
// called.
// This function should be called before drawing any NSCell-derived controls,
// unless you're sure it isn't needed.
void RenderThemeChromiumMac::updateActiveState(NSCell* cell, const RenderObject* o)
{
    NSControlTint oldTint = [cell controlTint];
    NSControlTint tint = isActive(o) ? [NSColor currentControlTint] :
                                       static_cast<NSControlTint>(NSClearControlTint);

    if (tint != oldTint)
        [cell setControlTint:tint];
}

bool RenderThemeChromiumMac::shouldShowPlaceholderWhenFocused() const
{
    return true;
}

bool RenderThemeChromiumMac::paintTextField(RenderObject* o, const PaintInfo& paintInfo, const IntRect& r)
{
    // Using the Cocoa code to paint the text field as RenderThemeMac does runs
    // into a bug when building against the 10.5 SDK, so we are forced here to
    // use the SPI. This override of paintTextField should be able to be removed
    // when 10.6 is the minimum required system and Chromium is built against
    // the 10.6 SDK.
    //
    // https://bugs.webkit.org/show_bug.cgi?id=75860
    // http://code.google.com/p/chromium/issues/detail?id=109567

    LocalCurrentGraphicsContext localContext(paintInfo.context);
    wkDrawBezeledTextFieldCell(r, isEnabled(o) && !isReadOnlyControl(o));

    return false;
}

#if ENABLE(VIDEO)

void RenderThemeChromiumMac::adjustMediaSliderThumbSize(RenderStyle* style) const
{
    RenderMediaControlsChromium::adjustMediaSliderThumbSize(style);
}

bool RenderThemeChromiumMac::paintMediaPlayButton(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaPlayButton, object, paintInfo, rect);
}

bool RenderThemeChromiumMac::paintMediaMuteButton(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaMuteButton, object, paintInfo, rect);
}

bool RenderThemeChromiumMac::paintMediaSliderTrack(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaSlider, object, paintInfo, rect);
}

String RenderThemeChromiumMac::extraMediaControlsStyleSheet()
{
    return String(mediaControlsChromiumUserAgentStyleSheet, sizeof(mediaControlsChromiumUserAgentStyleSheet));
}

#if ENABLE(FULLSCREEN_API)
String RenderThemeChromiumMac::extraFullScreenStyleSheet()
{
    // FIXME: Chromium may wish to style its default media controls differently in fullscreen.
    return String();
}
#endif

String RenderThemeChromiumMac::extraDefaultStyleSheet()
{
    return RenderThemeMac::extraDefaultStyleSheet() +
           String(themeChromiumUserAgentStyleSheet, sizeof(themeChromiumUserAgentStyleSheet));
}

#if ENABLE(CALENDAR_PICKER)
CString RenderThemeChromiumMac::extraCalendarPickerStyleSheet()
{
    return CString(calendarPickerMacCss, WTF_ARRAY_LENGTH(calendarPickerMacCss));
}
#endif

bool RenderThemeChromiumMac::paintMediaVolumeSliderContainer(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return true;
}

bool RenderThemeChromiumMac::paintMediaVolumeSliderTrack(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaVolumeSlider, object, paintInfo, rect);
}

bool RenderThemeChromiumMac::paintMediaVolumeSliderThumb(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaVolumeSliderThumb, object, paintInfo, rect);
}

bool RenderThemeChromiumMac::paintMediaSliderThumb(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaSliderThumb, object, paintInfo, rect);
}

IntPoint RenderThemeChromiumMac::volumeSliderOffsetFromMuteButton(RenderBox* muteButtonBox, const IntSize& size) const
{
    return RenderTheme::volumeSliderOffsetFromMuteButton(muteButtonBox, size);
}

String RenderThemeChromiumMac::formatMediaControlsTime(float time) const
{
    return RenderMediaControlsChromium::formatMediaControlsTime(time);
}

String RenderThemeChromiumMac::formatMediaControlsCurrentTime(float currentTime, float duration) const
{
    return RenderMediaControlsChromium::formatMediaControlsCurrentTime(currentTime, duration);
}

String RenderThemeChromiumMac::formatMediaControlsRemainingTime(float currentTime, float duration) const
{
    return RenderThemeChromiumMac::formatMediaControlsRemainingTime(currentTime, duration);
}

bool RenderThemeChromiumMac::paintMediaFullscreenButton(RenderObject* object, const PaintInfo& paintInfo, const IntRect& rect)
{
    return RenderMediaControlsChromium::paintMediaControlsPart(MediaEnterFullscreenButton, object, paintInfo, rect);
}
#endif

} // namespace WebCore
