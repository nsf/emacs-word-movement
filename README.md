# emacs-word-movement package

Emacs-like word movement/selection/editing.

In emacs when you move between words, it jumps to the next/previous `\w+` (in terms of regular expressions) and that's all there is to say. The difference between the rest of the world is that it's very predictable. It's easy to scan with your eyes where's the next `\w+`, unlike a more complicated regular expression used by Atom by default.

The package defines six functions (move, select, delete to beginning/end of the word) and it binds them to default key combinations: C-left, C-right, C-S-left, C-S-right, C-delete, C-backspace (no bindings on mac though, feel free to contribute).

P.S. Regexp `\w` is `[a-zA-Z0-9_]`, some people prefer it even without `_`, perhaps it's worth adding an option at some point. 
