var editor;

editor = ContentTools.EditorApp.get();
editor.init('*[data-tm-editable]', 'data-tm-name');

// for saving, make sure you're using tm-name instead of name as the data attribute
