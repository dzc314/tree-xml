<template>
  <div id="app">
    <tree-xml :xmlCode="xmlCode"></tree-xml>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TreeXml from "@/components/tree-xml.vue";
@Component({
  components: {
    TreeXml,
  },
})
export default class App extends Vue {
  xmlCode = `
    <template>
      <div id="app" ref="app">
        <!---- 注释 ---->
        <tree-xml :xmlCode="xmlCode"></tree-xml>
        <DIV>test</DIV>
        <div prop="prop1"></div>
        <a href="https://41201314.com">情侣照片墙</a>
      </div>
    </template>`;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
