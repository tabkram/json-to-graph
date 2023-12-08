const JSONEditor = require('jsoneditor');

let editor = null;

function initJsonEditor(jsonValue, onValidate) {
    const container = document.getElementById("jsoneditor")
    const options = {
        mode: "code",
        modes: ["code", "text", "tree", "preview"],
        onValidate: onValidate
    }
    editor = new JSONEditor(container, options)
    updateJsonEditor(jsonValue);
}

function updateJsonEditor(jsonValue) {
    editor.set(jsonValue);
}

module.exports = {
    initJsonEditor,
    updateJsonEditor
};