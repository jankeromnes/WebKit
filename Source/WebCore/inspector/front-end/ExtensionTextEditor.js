/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @constructor
 * @extends {WebInspector.Object}
 * @implements {WebInspector.TextEditor}
 * @param {WebInspector.ContentProvider} contentProvider
 * @param {WebInspector.TextEditorDelegate} delegate
 * @param {string|null} editorId
 */
WebInspector.ExtensionTextEditor = function(contentProvider, delegate, editorId)
{
    this._delegate = delegate;
    this._contentProvider = contentProvider;
    this._id = editorId;
    this._extensionView = WebInspector.extensionEditors[editorId];
}

WebInspector.ExtensionTextEditor.prototype = {
    /**
     * @param {Element} parentElement
     * @param {Element=} insertBefore
     */
    show: function(parentElement, insertBefore)
    {
        this._extensionView.show(parentElement, insertBefore);
        WebInspector.extensionServer.notifyResourceEdited(this._id, this._contentProvider);
    },

    /**
     * @return (boolean)
     */
    isShowing: function()
    {
        return this._extensionView.isShowing();
    },

    detach: function()
    {
        this._extensionView.detach();
    },

    /**
     * @return {Element}
     */
    get element()
    {
        return this._extensionView.element;
    },

    doResize: function()
    {
        this._extensionView.doResize();
    },

    /**
     * @param {string} mimeType
     */
    set mimeType(mimeType)
    {
    },

    /**
     * @param {boolean} readOnly
     */
    setReadOnly: function(readOnly)
    {
    },

    /**
     * @return {boolean}
     */
    readOnly: function()
    {
    },

    /**
     * @return {Element}
     */
    defaultFocusedElement: function()
    {
    },

    focus: function()
    {
    },

    beginUpdates: function() { },

    endUpdates: function() { },

    /**
     * @param {number} lineNumber
     */
    revealLine: function(lineNumber)
    {
    },

    _onGutterClick: function(instance, lineNumber, event)
    {
        this.dispatchEventToListeners(WebInspector.TextEditor.Events.GutterClick, { lineNumber: lineNumber, event: event });
    },

    /**
     * @param {number} lineNumber
     * @param {boolean} disabled
     * @param {boolean} conditional
     */
    addBreakpoint: function(lineNumber, disabled, conditional)
    {
    },

    /**
     * @param {number} lineNumber
     */
    removeBreakpoint: function(lineNumber)
    {
    },

    /**
     * @param {number} lineNumber
     */
    setExecutionLine: function(lineNumber)
    {
    },

    clearExecutionLine: function()
    {
    },

    /**
     * @param {number} lineNumber
     * @param {Element} element
     */
    addDecoration: function(lineNumber, element)
    {
    },

    /**
     * @param {number} lineNumber
     * @param {Element} element
     */
    removeDecoration: function(lineNumber, element)
    {
    },

    /**
     * @param {WebInspector.TextRange} range
     */
    markAndRevealRange: function(range)
    {
    },

    /**
     * @param {number} lineNumber
     */
    highlightLine: function(lineNumber)
    {
    },

    clearLineHighlight: function()
    {
    },

    /**
     * @return {Array.<Element>}
     */
    elementsToRestoreScrollPositionsFor: function()
    {
        return [];
    },

    /**
     * @param {WebInspector.TextEditor} textEditor
     */
    inheritScrollPositions: function(textEditor)
    {
    },

    onResize: function()
    {
    },

    /**
     * @param {WebInspector.TextRange} range
     * @param {string} text
     * @return {WebInspector.TextRange}
     */
    editRange: function(range, text)
    {
    },

    /**
     * @param {number} lineNumber
     */
    scrollToLine: function(lineNumber)
    {
    },

    /**
     * @return {WebInspector.TextRange}
     */
    selection: function(textRange)
    {
    },

    /**
     * @return {WebInspector.TextRange?}
     */
    lastSelection: function()
    {
    },

    /**
     * @param {WebInspector.TextRange} textRange
     */
    setSelection: function(textRange)
    {
    },

    /**
     * @param {string} text
     */
    setText: function(text)
    {
    },

    /**
     * @return {string}
     */
    text: function()
    {
    },

    /**
     * @return {WebInspector.TextRange}
     */
    range: function()
    {
    },

    /**
     * @param {number} lineNumber
     * @return {string}
     */
    line: function(lineNumber)
    {
    },

    /**
     * @return {number}
     */
    get linesCount()
    {
    },

    /**
     * @param {number} line
     * @param {string} name
     * @param {Object?} value
     */
    setAttribute: function(line, name, value)
    {
    },

    /**
     * @param {number} line
     * @param {string} name
     * @return {Object|null} value
     */
    getAttribute: function(line, name)
    {
    },

    /**
     * @param {number} line
     * @param {string} name
     */
    removeAttribute: function(line, name)
    {
    }
}

WebInspector.ExtensionTextEditor.prototype.__proto__ = WebInspector.Object.prototype;
