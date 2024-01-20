<template>
  <JsonEditorVue :mode="mode" :modes="['tree', 'text']" :mainMenuBar="mainMenuBar" :navigationBar="navigationBar" :statusBar="statusBar"
                 :readOnly="readOnly"
                 :indentation="2"
                 v-model="localValue.value"
                 :onChange="updateValue"
                 :onError="updateError"
                 :validator="validator"
                 @update:mode="updateMode"
                 @errorCaptured="handleError"

  />
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import JsonEditorVue, {Mode} from "json-editor-vue";
import {ref} from "vue";

@Options({
  components: {
    JsonEditorVue,
  },
  props: {
    mode: {type: String, default: "text"},
    mainMenuBar: {type: Boolean, default: true},
    navigationBar: {type: Boolean, default: true},
    statusBar: {type: Boolean, default: true},
    readOnly: {type: Boolean, default: false},
    value: {type: Object, default: undefined}
  }
})
export default class JsonEditor extends Vue {
  // eslint-disable-next-line
  localValue = ref<{ [key: string]: unknown }>((this as any).value);

  // Add a method to update the value
  updateValue(newValue: { json?: { value?: object }, text?: string }) {
    const newJsonValue = newValue.json ?? (newValue.text ? JSON.parse(newValue.text) : {});
    this.$emit("update:value", newJsonValue);
  }

  updateError(error: Error){
    console.log(error.message);
  }

  validator(json: unknown) {
    console.log("validating", json);
    return [];
  }

  updateMode(newMode: Mode) {
    this.$emit("update:mode", newMode);
  }

  handleError(error: unknown) {
    console.log(error);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
