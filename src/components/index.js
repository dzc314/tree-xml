import Vue from "vue";
import TreeXml from "./tree-xml.vue";

const Components = {
  TreeXml
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components