require('./app.css');
const {Graph} = require("./graph");
const {fetchData} = require("./data");
const {initJsonEditor, updateJsonEditor} = require("./editor");

const demos = [/*'box', 'disco',*/ 'force', 'layered', 'mrtree'/*, 'random', 'stress'*/];

function createDemoLink(demo) {
    const li = document.createElement('li');
    const a = Object.assign(document.createElement('a'), {
        innerText: demo,
        classList: ['btnStack'],
        id: demo
    });
    li.appendChild(a);
    return li;
}

function updateUrlWithQueryParam(demo) {
    const currentUrl = location.href;
    const params = new URLSearchParams(window.location.search);
    params.set('demo', demo);
    window.location.href = `${currentUrl.split('?')[0]}?${params.toString()}`;
}

function initializeDemoLinks() {
    const demosElement = document.getElementById('demos');
    demos.forEach(demo => {
        const demoLink = createDemoLink(demo);
        demosElement.appendChild(demoLink);

        document.getElementById(demo).addEventListener('click', () => {
            updateUrlWithQueryParam(demo);
        });
    });
}

async function handlePopState(event, graph) {
    console.log('URL changed:', window.location.href);
    const params = new URLSearchParams(window.location.search);
    const jsonValue = await fetchData(params.get('data'));
    if (graph && jsonValue) {
        setIsFirstTimeLoaded(true);
        graph.updateJson(jsonValue);
        updateJsonEditor(jsonValue);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    initializeDemoLinks();

    const params = new URLSearchParams(window.location.search);

    const dataValue = params.get('data');
    if (!dataValue) {
        params.set('data', 'https://raw.githubusercontent.com/tabkram/json-to-graph/main/data/trace.json');
        window.location.href = `${location.href.split('?')[0]}?${params.toString()}`;
    }

    const jsonValue = await fetchData(dataValue);
    const graph = await updateEditorAndGraph(jsonValue);

    window.addEventListener('popstate', async function (event) {
        handlePopState(event, graph);
    });

    const demoMatch = params.get('demo');
    if (demoMatch) {
        graph.updateLayout({
            nodeDimensionsIncludeLabels: true,
            elk: {
                algorithm: demoMatch,
                'elk.spacing.edgeEdge': 20,
                'elk.spacing.edgeNode': 20,
                'elk.spacing.nodeNode': 20,
                'elk.direction': 'RIGHT'
            },
            fit: true,
            padding: 100
        });
    }

    document.getElementById("downloadpng").onclick = () => {
        graph.download();
    };
});

let isFirstTimeLoaded = true;

function setIsFirstTimeLoaded(value) {
    isFirstTimeLoaded = value;
}

async function updateEditorAndGraph(jsonValue) {
    const graph = new Graph(document.getElementById('cy'), jsonValue);
    initJsonEditor(jsonValue, (newJsonValue) => {
        graph.updateJson(newJsonValue)
        if (isFirstTimeLoaded) {
            isFirstTimeLoaded = false;
        } else {
            const params = new URLSearchParams(window.location.search);
            if (params.get('data')) {
                params.delete('data');
                history.pushState(null, null, `${location.href.split('?')[0]}?${params.toString()}`);
            }
        }
    });
    return graph;
}
