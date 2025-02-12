/*
 * Copyright (C) 2006, 2008, 2010 Apple Inc. All rights reserved.
 * Copyright (C) 2010 Google Inc. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */
 
#ifndef TextControlInnerElements_h
#define TextControlInnerElements_h

#include "HTMLDivElement.h"
#include "SpeechInputListener.h"
#include "Timer.h"
#include <wtf/Forward.h>

namespace WebCore {

class SpeechInput;

class TextControlInnerElement : public HTMLDivElement {
public:
    static PassRefPtr<TextControlInnerElement> create(Document*);

protected:
    TextControlInnerElement(Document*);
    virtual PassRefPtr<RenderStyle> customStyleForRenderer() OVERRIDE;

private:
    virtual bool isMouseFocusable() const { return false; }
};

class TextControlInnerTextElement : public HTMLDivElement {
public:
    static PassRefPtr<TextControlInnerTextElement> create(Document*);

    virtual void defaultEventHandler(Event*);

private:
    TextControlInnerTextElement(Document*);
    virtual RenderObject* createRenderer(RenderArena*, RenderStyle*);
    virtual PassRefPtr<RenderStyle> customStyleForRenderer() OVERRIDE;
    virtual bool isMouseFocusable() const { return false; }
};

class SearchFieldResultsButtonElement : public HTMLDivElement {
public:
    static PassRefPtr<SearchFieldResultsButtonElement> create(Document*);

    virtual void defaultEventHandler(Event*);

private:
    SearchFieldResultsButtonElement(Document*);
    virtual const AtomicString& shadowPseudoId() const;
    virtual bool isMouseFocusable() const { return false; }
};

class SearchFieldCancelButtonElement : public HTMLDivElement {
public:
    static PassRefPtr<SearchFieldCancelButtonElement> create(Document*);

    virtual void defaultEventHandler(Event*);

private:
    SearchFieldCancelButtonElement(Document*);
    virtual const AtomicString& shadowPseudoId() const;
    virtual void detach();
    virtual bool isMouseFocusable() const { return false; }

    bool m_capturing;
};

class SpinButtonElement : public HTMLDivElement {
public:
    enum UpDownState {
        Indeterminate, // Hovered, but the event is not handled.
        Down,
        Up,
    };

    class StepActionHandler {
    public:
        virtual ~StepActionHandler() { }
        virtual void spinButtonStepDown() = 0;
        virtual void spinButtonStepUp() = 0;
    };

    // The owner of SpinButtonElement must call removeStepActionHandler
    // because SpinButtonElement can be outlive StepActionHandler
    // implementation, e.g. during event handling.
    static PassRefPtr<SpinButtonElement> create(Document*, StepActionHandler&);
    UpDownState upDownState() const { return m_upDownState; }
    virtual void releaseCapture();
    void removeStepActionHandler() { m_stepActionHandler = 0; }

    void step(int amount);
    
private:
    SpinButtonElement(Document*, StepActionHandler&);

    virtual const AtomicString& shadowPseudoId() const;
    virtual void detach();
    virtual bool isSpinButtonElement() const { return true; }
    virtual bool isEnabledFormControl() const { return shadowHost()->isEnabledFormControl(); }
    virtual bool isReadOnlyFormControl() const { return shadowHost()->isReadOnlyFormControl(); }
    virtual void defaultEventHandler(Event*);
    void doStepAction(int);
    void startRepeatingTimer();
    void stopRepeatingTimer();
    void repeatingTimerFired(Timer<SpinButtonElement>*);
    virtual void setHovered(bool = true);
    virtual bool isMouseFocusable() const { return false; }

    StepActionHandler* m_stepActionHandler;
    bool m_capturing;
    UpDownState m_upDownState;
    UpDownState m_pressStartingState;
    Timer<SpinButtonElement> m_repeatingTimer;
};

#if ENABLE(INPUT_SPEECH)

class InputFieldSpeechButtonElement
    : public HTMLDivElement,
      public SpeechInputListener {
public:
    enum SpeechInputState {
        Idle,
        Recording,
        Recognizing,
    };

    static PassRefPtr<InputFieldSpeechButtonElement> create(Document*);
    virtual ~InputFieldSpeechButtonElement();

    virtual void detach();
    virtual void defaultEventHandler(Event*);
    virtual bool isInputFieldSpeechButtonElement() const { return true; }
    SpeechInputState state() const { return m_state; }
    void startSpeechInput();
    void stopSpeechInput();

    // SpeechInputListener methods.
    void didCompleteRecording(int);
    void didCompleteRecognition(int);
    void setRecognitionResult(int, const SpeechInputResultArray&);

private:
    InputFieldSpeechButtonElement(Document*);
    SpeechInput* speechInput();
    void setState(SpeechInputState state);
    virtual const AtomicString& shadowPseudoId() const;
    virtual bool isMouseFocusable() const { return false; }
    virtual void attach();

    bool m_capturing;
    SpeechInputState m_state;
    int m_listenerId;
    SpeechInputResultArray m_results;
};

inline InputFieldSpeechButtonElement* toInputFieldSpeechButtonElement(Element* element)
{
    ASSERT(!element || element->isInputFieldSpeechButtonElement());
    return static_cast<InputFieldSpeechButtonElement*>(element);
}

#endif // ENABLE(INPUT_SPEECH)

} // namespace

#endif
