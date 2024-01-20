import {createApp} from "vue";
import App from "./App.vue";
import JsonEditorVue from "json-editor-vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);


app.use(JsonEditorVue, {}).use(ElementPlus).mount("#app");
