<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="450px" style="overflow: scroll;">
        <JsonEditor style="height: 100%;" :mode="jsonMode" :mainMenuBar="true" :navigationBar="false" :statusBar="false"
                    :readOnly="false"
                    :value="jsonValue"
                    @update:value="JsonEditorUpdated"
                    @update:mode="JsonEditorModeUpdated"/>
      </el-aside>
      <el-container>
        <el-header>
          <el-space>
            <h1 style="margin: 3px;"> JSON to Graph</h1>
            <el-button-group class="ml-4" size="small">
              <el-button
                  v-for="algorithm in ['layered', 'mrtree', 'force']"
                  type="primary"
                  :key="algorithm"
                  :plain="isSelectedAlgorithm(algorithm)"
                  @click="selectAlgorithm(algorithm)"
              >
                {{ algorithm }}
              </el-button>
            </el-button-group>
          </el-space>

          <div style="float: right;    padding: 3px;">
            <el-button href="https://github.com/tabkram/execution-engine" type="info" size="small">GitHub</el-button>
          </div>
        </el-header>
        <el-main>
          <CytoscapeElk :value="cytoscapeJson" :layout="cytoscapeOptions.layout" :algorithm="cytoscapeOptions.algorithm"
                        @select:value="showSelectedNode"/>
        </el-main>
        <el-footer>
          <JsonEditor style="height: 100vh;" :mainMenuBar="false" :navigationBar="false" :statusBar="false"
                      :readOnly="true"
                      :value="cytoscapeSelectedValue"/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import CytoscapeElk from "@/components/CytoscapeElk.vue";
import JsonEditor from "@/components/JsonEditor.vue";
import {ref} from "vue";
import {getFromSessionStorage, updateSessionStorage} from "@/utils/storageUtils";
import {deleteUrlSearchParam, getUrlSearchParam, isUrl, updateUrlSearchParams} from "@/utils/urlUtils";
import {fetchData} from "@/utils/fetchUtils";
import {deepEqual} from "@/utils/objectUtils";

@Options({
  components: {
    JsonEditor,
    CytoscapeElk
  },
})
export default class App extends Vue {
  // Use 'ref' for reactive properties
  jsonMode: string | null = null;
  jsonValue = ref<{ [key: string]: unknown }>({});
  cytoscapeJson = ref<{ [key: string]: unknown }>({});
  cytoscapeSelectedValue = ref<{ [key: string]: unknown }>({});

  cytoscapeOptions: { layout?: string | null, algorithm?: string | null } = {}

  async mounted() {
    const dataUrl = getUrlSearchParam('data');

    const data = (dataUrl && isUrl(dataUrl)) ? await fetchData(dataUrl) : getFromSessionStorage('data');

    const searchParamsToUpdate = [];
    if (!data) {
      searchParamsToUpdate.push({
        name: 'data',
        value: 'https://raw.githubusercontent.com/tabkram/json-to-graph/main/data/trace.json'
      })
    } else {
      this.jsonValue.value = data;
    }


    this.jsonMode = getUrlSearchParam('mode');
    if (!this.jsonMode || !['text', 'tree', 'table'].includes(this.jsonMode)) {
      searchParamsToUpdate.push({name: 'mode', value: 'text'});
    }

    this.cytoscapeOptions = {
      layout: getUrlSearchParam('layout'),
      algorithm: getUrlSearchParam('algorithm')
    }
    if (!this.cytoscapeOptions?.layout || !this.cytoscapeOptions?.algorithm) {
      searchParamsToUpdate.push({name: 'layout', value: 'elk'});
      searchParamsToUpdate.push({name: 'algorithm', value: 'layered'});
    }
    updateUrlSearchParams(searchParamsToUpdate);
  }


  JsonEditorUpdated(value: { [key: string]: unknown }) {
    if (!deepEqual(this.jsonValue.value, value)) {
      updateSessionStorage('data', value);
      deleteUrlSearchParam('data');
    }
    this.cytoscapeJson.value = value;
  }

  JsonEditorModeUpdated(newMode: string) {
    updateUrlSearchParams([{name: 'mode', value: newMode}]);
  }

  showSelectedNode(value: { [key: string]: unknown }) {
    this.cytoscapeSelectedValue.value = value;
  }

  isSelectedAlgorithm(algorithm: string) {
    return this.cytoscapeOptions.algorithm === algorithm;
  }

  selectAlgorithm(algorithm: string) {
    updateUrlSearchParams([{name: 'algorithm', value: algorithm}]);
  }
}
</script>

<style>
body {
  overflow: hidden;
  height: 100vh;
}

.el-aside {
  overflow: auto !important;
  min-height: 100%;
}

.el-header {
  background-color: #ceffbd;
  height: 32px !important;
}

.el-main {
  --el-main-padding: 0 !important;
  height: 66%;
  flex: none !important;
  padding: 0 !important;
}

.el-container {
  height: 100vh;
}

.el-footer {
  height: 30% !important;
  padding: 0 !important;
  overflow-y: auto;
}

/* Use scoped attribute for style encapsulation */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: -8px;
  overflow: hidden;
}

.jse-contextmenu {
  position: fixed;
  z-index: 1000;
}

.jse-button.jse-contextmenu {
  position: static !important;
}

.common-layout {
  overflow: hidden;
}
</style>
