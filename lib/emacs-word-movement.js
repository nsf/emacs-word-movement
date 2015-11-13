'use babel';

import {CompositeDisposable, Point, Range} from 'atom';

function getBeginningOfWordPosition(editor, cursor) {
    const first = new Point(0, 0);
    const current = cursor.getBufferPosition();
    const range = new Range(first, current);
    let previous = null;
    editor.backwardsScanInBufferRange(/\w+/, range, it => {
        previous = it.range.start;
        if (!previous.isEqual(current)) {
            stop();
        }
    });
    return previous || first;
}

function getEndOfWordPosition(editor, cursor) {
    const last = editor.getEofBufferPosition();
    const current = cursor.getBufferPosition();
    const range = new Range(current, last);
    let next = null;
    editor.scanInBufferRange(/\w+/, range, it => {
        next = it.range.end;
        if (!next.isEqual(current)) {
            stop();
        }
    });
    return next || last;
}

function modifySelectionToBeginningOfWord(editor, selection) {
    const cursor = selection.cursor;
    selection.modifySelection(() => {
        cursor.setBufferPosition(getBeginningOfWordPosition(editor, cursor));
    });
}

function modifySelectionToEndOfWord(editor, selection) {
    const cursor = selection.cursor;
    selection.modifySelection(() => {
        cursor.setBufferPosition(getEndOfWordPosition(editor, cursor));
    });
}

class EmacsWordMovement {
    subscriptions;

    activate() {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-text-editor', {
            'emacs-word-movement:move-to-beginning-of-word': ::this.moveToBegin,
            'emacs-word-movement:move-to-end-of-word': ::this.moveToEnd,
            'emacs-word-movement:select-to-beginning-of-word': ::this.selectToBegin,
            'emacs-word-movement:select-to-end-of-word': ::this.selectToEnd,
            'emacs-word-movement:delete-to-beginning-of-word': ::this.deleteToBegin,
            'emacs-word-movement:delete-to-end-of-word': ::this.deleteToEnd,
        }));
    }

    deactivate() {
        this.subscriptions.dispose();
    }

    moveToBegin() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.cursors.forEach(cursor => {
            cursor.setBufferPosition(getBeginningOfWordPosition(editor, cursor));
        });
    }

    moveToEnd() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.cursors.forEach(cursor => {
            cursor.setBufferPosition(getEndOfWordPosition(editor, cursor));
        });
    }

    selectToBegin() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.selections.forEach(selection => {
            modifySelectionToBeginningOfWord(editor, selection);
        })
    }

    selectToEnd() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.selections.forEach(selection => {
            modifySelectionToEndOfWord(editor, selection);
        })
    }

    deleteToBegin() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.mutateSelectedText((selection) => {
            if (selection.isEmpty()) {
                modifySelectionToBeginningOfWord(editor, selection);
            }
            selection.deleteSelectedText();
        })
    }

    deleteToEnd() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;
        editor.mutateSelectedText((selection) => {
            if (selection.isEmpty()) {
                modifySelectionToEndOfWord(editor, selection);
            }
            selection.deleteSelectedText();
        })
    }
}

export default new EmacsWordMovement();
