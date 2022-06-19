require('./app.css');
const defaultJson = require('../data/trace.json');

const JSONEditor = require('jsoneditor');
const {Graph} = require("./graph");

const demos = [/*'box', 'disco',*/ 'force', 'layered', 'mrtree'/*, 'random', 'stress'*/];

function populateDemosList() {
    const el = document.getElementById('demos');
    demos.forEach((demo) => {
        const li = document.createElement('li');
        const a = Object.assign(document.createElement('a'), {
            href: `?demo=${demo}`,
            innerText: demo,
        });
        a.classList.add('btnStack');
        li.appendChild(a);
        el.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    populateDemosList();
    let graph = new Graph(document.getElementById('cy'), defaultJson);
    initJsonEditor((json) => graph.updateJson(json));
    const demoMatch = /demo=([a-z]+)/.exec(location.search);
    if (demoMatch) {
        graph.updateLayout({
            nodeDimensionsIncludeLabels: true,
            elk: {
                algorithm: demoMatch[1],
                'elk.spacing.edgeEdge': 20,
                'elk.spacing.edgeNode': 20,
                'elk.spacing.nodeNode': 20,
                'elk.direction': 'RIGHT'
            },
            fit: true,
            padding: 100
        });
    }
});

function initJsonEditor(onValidate) {
    const container = document.getElementById("jsoneditor")
    const options = {
        mode: "code",
        modes: ["code", "text", "tree", "preview"],
        onValidate: onValidate
    }
    const editor = new JSONEditor(container, options)
    editor.set(defaultJson);
}
