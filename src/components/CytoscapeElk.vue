<template>
  <div ref="cytoscape"></div>
</template>


<script lang="ts">
import {Options, Vue} from "vue-class-component";

import cytoscape, {Core, CytoscapeOptions, ElementDefinition, ElementsDefinition} from 'cytoscape';
import {Ref, toRaw} from "vue";

// eslint-disable-next-line
// @ts-ignore
import elk from 'cytoscape-elk';
import {ElMessage} from "element-plus";

@Options({
  props: {
    value: {type: Object, default: undefined},
    layout: {type: String, default: "elk"},
    algorithm: {type: String, default: "layered"}
  }
})
export default class CytoscapeElk extends Vue {
  instance: Core | undefined = undefined;

  created() {
    this.$watch('value', this.watchValue, {immediate: true, deep: true});
    // Watch for changes in the 'value' prop

  }

  watchValue(newValue: Ref<ElementsDefinition | ElementDefinition[]>) {
    this.$nextTick(() => {
      this.createCytoscape(toRaw(newValue.value));
    });
  }


  mounted() {
    // eslint-disable-next-line
    this.createCytoscape((this as any).value);
  }

  private createCytoscape(elements: CytoscapeOptions['elements']) {
    // create a vue independent element
    const container = document.createElement('div')
    container.setAttribute('id', 'cytoscape-div')
    container.setAttribute('width', '100%')
    container.setAttribute('height', '100%')
    container.setAttribute('style', 'min-height: 600px; height: 100%')
    // add it as a child of the vue managed one
    this.$el.innerHTML = "";
    this.$el.appendChild(container)

    try {
      let layoutOptions = null;
      if ((this as any).layout) {
        cytoscape.use(elk);
        layoutOptions = {
          nodeDimensionsIncludeLabels: true,
          name: 'elk',
          elk: {
            algorithm: (this as any).algorithm,
            'elk.spacing.edgeEdge': 50,
            'elk.spacing.edgeNode': 60,
            'elk.spacing.nodeNode': 70,
            'elk.direction': 'RIGHT'
          },
          fit: true,
          padding: 100
        } as any;
      }

      this.instance = cytoscape({
        container,
        elements,
        // wheelSensitivity: 0.05,
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
        ],
        layout: layoutOptions
      });
      this.instance.on('tap', 'node', e => {
        let item = e.target;
        // const options = {indent: 3, linkUrls: true};
        this.$emit("select:value", item.data());
        // jsonElement.innerHTML = prettyPrintJson.toHtml(item.data(), options);
      });
      this.instance.minZoom(0.3);
      this.instance.maxZoom(2);
    } catch (e: unknown) {
      console.log(e);
      ElMessage({
        offset: 42,
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: "<strong> Cytoscape Error: </strong>" + (e as Error).message,
        type: "error"
      });
    }
  }
}
</script>