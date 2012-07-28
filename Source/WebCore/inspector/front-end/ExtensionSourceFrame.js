/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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

/* ExtensionSourceFrame is a View delegate for ExtensionView
 * (WebInspector.editors[currentEditor] */

/* An ExtensionSourceFrame, when shown, will notify the current extension editor
 * iframe (WebInspector.editors[currentEditor] to change its current file to
 * this._contentProvider. */

/**
 * @constructor
 * @param {WebInspector.ContentProvider} contentProvider
 */
WebInspector.ExtensionSourceFrame = function(contentProvider)
{
    this._contentProvider = contentProvider;
    // this.element = WebInspector.editors[currentEditor];
}

WebInspector.ExtensionSourceFrame.prototype = {
    // View delegate
    show: function(parent) {
        var handled = WebInspector.editResourceRegistry.dispatch({ uiSourceCode: this._contentProvider, parent: parent });
        console.log("called show", arguments, 'dispatch handled:', handled);
    },
    addEventListener: function() {
        console.log("called addEventListener", arguments);
    },
    removeEventListener: function() {
        console.log("called removeEventListener", arguments);
    },
    statusBarItems: function() {
        console.log("called statusBarItems", arguments);
    },
    detach: function() {
        console.log("called detach", arguments);
    },
    focus: function() {
        console.log("called focus", arguments);
    },

    // SourceFrame + JavaScriptSourceFrame delegate
    wasShown: function() {
        console.log("called wasShown", arguments);
    },
    willHide: function() {
        console.log("called willHide", arguments);
    },
    defaultFocusedElement: function() {
        console.log("called defaultFocusedElement", arguments);
    },
    hasContent: function() {
        console.log("called hasContent", arguments);
    },
    _ensureContentLoaded: function() {
        console.log("called _ensureContentLoaded", arguments);
    },
    addMessage: function(msg) {
        console.log("called addMessage", arguments);
    },
    clearMessages: function() {
        console.log("called clearMessages", arguments);
    },
    canHighlightLine: function(line) {
        console.log("called canHighlightLine", arguments);
    },
    highlightLine: function(line) {
        console.log("called highlightLine", arguments);
    },
    _innerHighlightLineIfNeeded: function() {
        console.log("called _innerHighlightLineIfNeeded", arguments);
    },
    _clearLineHighlight: function() {
        console.log("called _clearLineHighlight", arguments);
    },
    revealLine: function(line) {
        console.log("called revealLine", arguments);
    },
    _innerRevealLineIfNeeded: function() {
        console.log("called _innerRevealLineIfNeeded", arguments);
    },
    _clearLineToReveal: function() {
        console.log("called _clearLineToReveal", arguments);
    },
    scrollToLine: function(line) {
        console.log("called scrollToLine", arguments);
    },
    _innerScrollToLineIfNeeded: function() {
        console.log("called _innerScrollToLineIfNeeded", arguments);
    },
    _clearLineToScrollTo: function() {
        console.log("called _clearLineToScrollTo", arguments);
    },
    setSelection: function(textRange) {
        console.log("called setSelection", arguments);
    },
    _innerSetSelectionIfNeeded: function() {
        console.log("called _innerSetSelectionIfNeeded", arguments);
    },
    _wasShownOrLoaded: function() {
        console.log("called _wasShownOrLoaded", arguments);
    },
    beforeTextChanged: function() {
        console.log("called beforeTextChanged", arguments);
    },
    afterTextChanged: function(oldRange, newRange) {
        console.log("called afterTextChanged", arguments);
    },
    setContent: function(content, contentEncoded, mimeType) {
        console.log("called setContent", arguments);
    },
    onTextEditorContentLoaded: function() {
        console.log("called onTextEditorContentLoaded", arguments);
    },
    _setTextEditorDecorations: function() {
        console.log("called _setTextEditorDecorations", arguments);
    },
    performSearch: function(query, callback) {
        console.log("called performSearch", arguments);
    },
    searchCanceled: function() {
        console.log("called searchCanceled", arguments);
    },
    hasSearchResults: function() {
        console.log("called hasSearchResults", arguments);
    },
    jumpToFirstSearchResult: function() {
        console.log("called jumpToFirstSearchResult", arguments);
    },
    jumpToLastSearchResult: function() {
        console.log("called jumpToLastSearchResult", arguments);
    },
    jumpToNextSearchResult: function() {
        console.log("called jumpToNextSearchResult", arguments);
    },
    jumpToPreviousSearchResult: function() {
        console.log("called jumpToPreviousSearchResult", arguments);
    },
    showingFirstSearchResult: function() {
        console.log("called showingFirstSearchResult", arguments);
    },
    showingLastSearchResult: function() {
        console.log("called showingLastSearchResult", arguments);
    },
    jumpToSearchResult: function(index) {
        console.log("called jumpToSearchResult", arguments);
    },
    _collectRegexMatches: function(regexObject) {
        console.log("called _collectRegexMatches", arguments);
    },
    _addExistingMessagesToSource: function() {
        console.log("called _addExistingMessagesToSource", arguments);
    },
    addMessageToSource: function(lineNumber, msg) {
        console.log("called addMessageToSource", arguments);
    },
    _updateMessageRepeatCount: function(rowMessage) {
        console.log("called _updateMessageRepeatCount", arguments);
    },
    removeMessageFromSource: function(lineNumber, msg) {
        console.log("called removeMessageFromSource", arguments);
    },
    populateLineGutterContextMenu: function(contextMenu, lineNumber) {
        console.log("called populateLineGutterContextMenu", arguments);
    },
    populateTextAreaContextMenu: function(contextMenu, lineNumber) {
        console.log("called populateTextAreaContextMenu", arguments);
    },
    inheritScrollPositions: function(sourceFrame) {
        console.log("called inheritScrollPositions", arguments);
    },
    canEditSource: function() {
        console.log("called canEditSource", arguments);
    },
    commitEditing: function(text) {
        console.log("called commitEditing", arguments);
    },
    selectionChanged: function(textRange) {
        console.log("called selectionChanged", arguments);
    },
    scrollChanged: function(lineNumber) {
        console.log("called scrollChanged", arguments);
    },
    wasShown: function() {
        console.log("called wasShown", arguments);
    },
    willHide: function() {
        console.log("called willHide", arguments);
    },
    canEditSource: function() {
        console.log("called canEditSource", arguments);
    },
    commitEditing: function(text) {
        console.log("called commitEditing", arguments);
    },
    _onContentChanged: function(event) {
        console.log("called _onContentChanged", arguments);
    },
    populateLineGutterContextMenu: function(contextMenu, lineNumber) {
        console.log("called populateLineGutterContextMenu", arguments);
    },
    populateTextAreaContextMenu: function(contextMenu, lineNumber) {
        console.log("called populateTextAreaContextMenu", arguments);
    },
    afterTextChanged: function(oldRange, newRange) {
        console.log("called afterTextChanged", arguments);
    },
    beforeTextChanged: function() {
        console.log("called beforeTextChanged", arguments);
    },
    _didEditContent: function(error) {
        console.log("called _didEditContent", arguments);
    },
    _removeBreakpointsBeforeEditing: function() {
        console.log("called _removeBreakpointsBeforeEditing", arguments);
    },
    _restoreBreakpointsAfterEditing: function() {
        console.log("called _restoreBreakpointsAfterEditing", arguments);
    },
    _getPopoverAnchor: function(element, event) {
        console.log("called _getPopoverAnchor", arguments);
    },
    _resolveObjectForPopover: function(element, showCallback, objectGroupName) {
        console.log("called _resolveObjectForPopover", arguments);
    },
    _onHidePopover: function() {
        console.log("called _onHidePopover", arguments);
    },
    _highlightExpression: function(element) {
        console.log("called _highlightExpression", arguments);
    },
    _addBreakpointDecoration: function(lineNumber, condition, enabled, mutedWhileEditing) {
        console.log("called _addBreakpointDecoration", arguments);
    },
    _removeBreakpointDecoration: function(lineNumber) {
        console.log("called _removeBreakpointDecoration", arguments);
    },
    _onMouseDown: function(event) {
        console.log("called _onMouseDown", arguments);
    },
    _onKeyDown: function(event) {
        console.log("called _onKeyDown", arguments);
    },
    _editBreakpointCondition: function(lineNumber, breakpoint) {
        console.log("called _editBreakpointCondition", arguments);
    },
    _createConditionElement: function(lineNumber) {
        console.log("called _createConditionElement", arguments);
    },
    setExecutionLine: function(lineNumber) {
        console.log("called setExecutionLine", arguments);
    },
    clearExecutionLine: function() {
        console.log("called clearExecutionLine", arguments);
    },
    _lineNumberAfterEditing: function(lineNumber, oldRange, newRange) {
        console.log("called _lineNumberAfterEditing", arguments);
    },
    _breakpointAdded: function(event) {
        console.log("called _breakpointAdded", arguments);
    },
    _breakpointRemoved: function(event) {
        console.log("called _breakpointRemoved", arguments);
    },
    _consoleMessageAdded: function(event) {
        console.log("called _consoleMessageAdded", arguments);
    },
    _consoleMessageRemoved: function(event) {
        console.log("called _consoleMessageRemoved", arguments);
    },
    _consoleMessagesCleared: function(event) {
        console.log("called _consoleMessagesCleared", arguments);
    },
    onTextEditorContentLoaded: function() {
        console.log("called onTextEditorContentLoaded", arguments);
    },
    _toggleBreakpoint: function(lineNumber, onlyDisable) {
        console.log("called _toggleBreakpoint", arguments);
    },
    toggleBreakpointOnCurrentLine: function() {
        console.log("called toggleBreakpointOnCurrentLine", arguments);
    },
    _setBreakpoint: function(lineNumber, condition, enabled) {
        console.log("called _setBreakpoint", arguments);
    },
    _continueToLine: function(lineNumber) {
        console.log("called _continueToLine", arguments);
    }
}
