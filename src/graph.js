require('web-worker');
require('elkjs');
const elk = require('cytoscape-elk');
const JSONEditor = require('jsoneditor');

const cytoscape = require('cytoscape');

class Graph {
    cy;
    layout = {
        nodeDimensionsIncludeLabels: true,
        name: 'elk',
        elk: {
            algorithm: 'layered',
            'elk.spacing.edgeEdge': 50,
            'elk.spacing.edgeNode': 60,
            'elk.spacing.nodeNode': 70,
            'elk.direction': 'RIGHT'
        },
        fit: true,
        padding: 100
    };

    constructor(container, json, layout) {
        this.layout = layout ? layout : this.layout;
        const jsonElement = document.getElementById('jsonViewerContainer');
        const editor = new JSONEditor(jsonElement, {
            mode: 'view',
            modes: ['text', 'code', 'tree', 'form', 'view'],
            onEditable: function (node) {
                if (!node.path) {
                    // In modes code and text, node is empty: no path, field, or value
                    // returning false makes the text area read-only
                    return false;
                }
            },
        })
        cytoscape.use(elk);
        const cy = cytoscape({
            container: container,
            elements: json,
            layout: layout,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        width: '60px',
                        height: '60px',
                        'border-width': 4,
                        'border-color': ele => {
                            const data = ele.data();
                            return !data.inputs || (!data.outputs && !data.outputs) ? '#ffe980' : '#bbe2b5';
                        },
                        'background-fit': 'contain',
                        'background-clip': 'none'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        // label: 'data(label)',
                        'curve-style': 'bezier',
                        // 'curve-style': 'taxi',
                        'taxi-direction': 'rightward',
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 0.95,
                        width: 6
                    }
                }
            ]
        });
        cy.on('tap', 'node', e => {
            let item = e.target;
            console.log(item.data());
            const options = {indent: 3, linkUrls: true};
            editor.set(item.data());
            // jsonElement.innerHTML = prettyPrintJson.toHtml(item.data(), options);
        });
        cy.minZoom(0.3);
        cy.maxZoom(2);
        this.cy = cy;
    }

    updateLayout(newLayout) {
        this.layout = newLayout? {...this.layout, ...newLayout} : this.layout;
        this.cy.layout({...this.layout, ...newLayout}).run();
    }

    updateJson(json) {
        this.cy.json({elements: json});
        this.updateLayout();
    }
}

module.exports.Graph = Graph;
