/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 * Copyright (C) 2010 Apple Inc. All rights reserved.
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
 * @extends {WebInspector.View}
 * @implements {WebInspector.TextEditor}
 * @param {?string} url
 * @param {WebInspector.TextEditorDelegate} delegate
 */
WebInspector.CodeMirrorTextEditor = function(url, delegate)
{
    WebInspector.View.call(this);
    this._delegate = delegate;
    this._url = url;

    this.registerRequiredCSS("codemirror.css");
    this.registerRequiredCSS("cmdevtools.css");

    this._codeMirror = CodeMirror(this.element, {
        lineNumbers: true,
        fixedGutter: true,
        onGutterClick: function(cm, line) {
          var info = cm.lineInfo(line);
          if (info.markerText)
              cm.clearMarker(line);
          else
              cm.setMarker(line, "<span style=\"color: white; border-width: 0 8px 0px 2px; margin-right: -8px; margin-left: -2px; -webkit-border-image: url(Images/breakpointBorder.png) 0 14 0 2;\">%N%</span>");
//            cm.setMarker(line, "<span style=\"background: #0AF; color: white; font-weight: bold; position: absolute; width: 95%; left: 0;\">%N%</span>%N%");
        }
    }); 

    this.element.firstChild.addStyleClass("source-code");
    this.element.firstChild.addStyleClass("fill");
    this.element.instance = this._codeMirror; // FIXME
}

WebInspector.CodeMirrorTextEditor.prototype = {
    /**
     * @param {string} mimeType
     */
    set mimeType(mimeType)
    {
        this._codeMirror.setOption("mode", mimeType);
    },

    /**
     * @param {boolean} readOnly
     */
    setReadOnly: function(readOnly)
    {
        console.log('called setReadOnly', arguments);
        this._readOnly = readOnly;
        this._codeMirror.setOption("readOnly", readOnly);
    },

    /**
     * @return {boolean}
     */
    readOnly: function()
    {
        console.log('called readOnly', arguments);
        return this._readOnly;
    },

    /**
     * @return {Element}
     */
    defaultFocusedElement: function()
    {
        console.log('called defaultFocusedElement', arguments);
        this._codeMirror.focus();
        return this.element;
    },

    /**
     * @param {number} lineNumber
     */
    revealLine: function(lineNumber)
    {
        console.log('called revealLine', arguments);
        this._codeMirror.setCursor({line: lineNumber});
        var coords = this._codeMirror.cursorCoords();
        this._codeMirror.scrollTo(coords.x, coords.y);
    },

    /**
     * @param {number} lineNumber
     * @param {string|Element} decoration
     */
    addDecoration: function(lineNumber, decoration)
    {
        console.log('called addDecoration', arguments);
    },

    /**
     * @param {number} lineNumber
     * @param {string|Element} decoration
     */
    removeDecoration: function(lineNumber, decoration)
    {
        console.log('called removeDecoration', arguments);
    },

    /**
     * @param {WebInspector.TextRange} range
     */
    markAndRevealRange: function(range)
    {
        console.log('called markAndRevealRange', arguments);
        var pos = this._toPos(range);
        this.setSelection(pos.start, pos.end);
    },

    /**
     * @param {number} lineNumber
     */
    highlightLine: function(lineNumber)
    {
        console.log('called highlightLine', arguments);
        //this.scrollToLine(lineNumber);
        var line = this._codeMirror.getLine(lineNumber);
        var mark = this._codeMirror.markText({line:lineNumber,ch:0},{line:lineNumber,ch:line.length},"CodeMirror-searching");
        setTimeout(function(){mark.clear();},1000);
    },

    clearLineHighlight: function()
    {
        console.log('called clearLineHighlight', arguments);
    },

    freeCachedElements: function()
    {
        console.log('called freeCachedElements', arguments);
    },

    /**
     * @return {Array.<Element>}
     */
    elementsToRestoreScrollPositionsFor: function()
    {
        console.log('called elementsToRestoreScrollPositionsFor', arguments);
        return [];
    },

    /**
     * @param {WebInspector.TextEditor} textEditor
     */
    inheritScrollPositions: function(textEditor)
    {
        console.log('called inheritScrollPositions', arguments);
    },

    beginUpdates: function()
    {
        console.log('called beginUpdates', arguments);
    },

    endUpdates: function()
    {
        console.log('called endUpdates', arguments);
    },

    onResize: function()
    {
        console.log('called onResize', arguments);
    },

    /**
     * @param {WebInspector.TextRange} range
     * @param {string} text
     * @return {WebInspector.TextRange}
     */
    editRange: function(range, text)
    {
        console.log('called editRange', arguments);
    },

    /**
     * @param {number} lineNumber
     */
    scrollToLine: function(lineNumber)
    {
        console.log('called scrollToLine', arguments);
        this._codeMirror.setCursor({line:lineNumber, ch:0});
        //this._mainPanel.scrollToLine(lineNumber);
    },

    /**
     * @return {WebInspector.TextRange}
     */
    selection: function(textRange)
    {
        console.log('called selection', arguments);
        return null;
    },

    /**
     * @return {WebInspector.TextRange?}
     */
    lastSelection: function()
    {
        console.log('called lastSelection', arguments);
        return this._lastSelection;
    },

    /**
     * @param {WebInspector.TextRange} textRange
     */
    setSelection: function(textRange)
    {
        console.log('called setSelection', arguments);
        this._lastSelection = textRange;
        var pos = this._toPos(textRange);
        this._codeMirror.setSelection(pos.start, pos.end);
        /*if (this.element.isAncestor(document.activeElement)) {
            this._mainPanel._restoreSelection(textRange);
        }*/
    },

    /**
     * @param {string} text 
     */
    setText: function(text)
    {
        console.log('called setText', arguments);
        this._codeMirror.setValue(text);
    },

    /**
     * @return {string}
     */
    text: function()
    {
        console.log('called text', arguments);
        return this._codeMirror.getValue();
    },

    /**
     * @return {WebInspector.TextRange}
     */
    range: function()
    {
        console.log('called range', arguments);
        return null;
    },

    /**
     * @param {number} lineNumber
     * @return {string}
     */
    line: function(lineNumber)
    {
        console.log('called line', arguments);
        return this._codeMirror.getLine(lineNumber);
    },

    /**
     * @return {number}
     */
    get linesCount()
    {
        console.log('called get LinesCount', arguments);
        return this._codeMirror.lineCount();
    },

    /**
     * @param {number} line
     * @param {string} name  
     * @param {Object?} value  
     */
    setAttribute: function(line, name, value)
    {
        console.log('called setAttribute', arguments);
    },

    /**
     * @param {number} line
     * @param {string} name  
     * @return {Object|null} value  
     */
    getAttribute: function(line, name)
    {
        console.log('called getAttribute', arguments);
        return null;
    },

    /**
     * @param {number} line
     * @param {string} name
     */
    removeAttribute: function(line, name)
    {
        console.log('called removeAttribute', arguments);
    },

    wasShown: function()
    {
        console.log('called wasShown', arguments);
        if (this._content) {
            this._codeMirror.replaceRange(this._content.string, this._content.pos.start, this._content.pos.end);
            delete this._content;
        }
    },

    willHide: function()
    {
        console.log('called willHide', arguments);
    },

    _textChanged: function(event)
    {
        console.log('called _textChanged', arguments);
        var string = this._textModel.copyRange(event.data.newRange);
        var pos = this._toPos(event.data.oldRange);
        if (!this.isShowing()) {
            this._content = {string: string, pos: pos};
            return;
        }

        this._codeMirror.replaceRange(string, pos.start, pos.end);
    },

    _toPos: function(range)
    {
        return {
            start: {line: range.startLine, ch: range.startColumn},
            end: {line: range.endLine, ch: range.endColumn}
        }
    }
}

WebInspector.CodeMirrorTextEditor.prototype.__proto__ = WebInspector.View.prototype;
