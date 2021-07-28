<template>
  <el-tree
    class="xml-tree"
    :data="data"
    default-expand-all
    :expand-on-click-node="false"
  >
    <div slot-scope="{ data }">
      <!-- {{ renderXmlNode(data) }} -->
      <span v-if="data.isComment" class="comment">
        &lt;!--{{ data.comment }}--&gt;
      </span>
      <template v-if="data.isEnd">
        &lt;/<span class="tag-name">{{ data.tagName }}</span
        >&gt;
      </template>
      <template v-if="!data.isComment && !data.isEnd">
        &lt;<span class="tag-name">{{ data.tagName }}</span>
        <template v-if="data.attrs">
          <span v-for="(value, key) in data.attrs" :key="key">
            <span class="tag-prop"> {{ key }}</span
            >="<span class="prop-value">{{ value }}</span
            >"</span>
        </template>{{ data.isLeaf && !data.text ? " /&gt;" : ">" }}
        <template v-if="data.text">
          <span class="tag-text">{{ data.text }}</span>
          &lt;/<span class="tag-name">{{ data.tagName }}</span
          >&gt;
        </template>
      </template>
    </div>
  </el-tree>
</template>

<script lang="ts">
import { Tree } from "element-ui";
import { Vue, Component, Watch } from "vue-property-decorator";
Vue.component(Tree.name, Tree);
import "./tree-xml.scss";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const htmlparser2 = require("htmlparser2");
interface XmlNode {
  tagName?: string;
  isLeaf?: boolean;
  text?: string;
  attrs?: any;
  isComment?: boolean;
  comment?: string;
  isEnd?: boolean;
  children?: XmlNode[];
}
@Component({
  name: "TreeXml",
  props: {
    xmlCode: {
      type: String,
      default: "",
    },
  },
})
export default class TreeXml extends Vue {
  data: XmlNode[] = [];
  @Watch("xmlCode", { immediate: true })
  xmlCodeWatcher(value: string) {
    this.data = this.parserXml(value);
  }

  parserXml(xmlCode: string) {
    const tree: XmlNode[] = [];
    const stack: XmlNode[] = [];
    let curNode: XmlNode;
    const pushNode = (node: XmlNode) => {
      const len = stack.length;
      if (len === 0) {
        tree.push(node);
      } else {
        const parent = stack[len - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    };
    const parser = new htmlparser2.Parser(
      {
        onopentag(tagName: string, attrs: any) {
          const node: XmlNode = {
            tagName,
            attrs,
          };
          curNode = node;
          pushNode(node);
          stack.push(node);
        },
        ontext(text: string) {
          // console.log(text);
          if (text.trim() !== "") {
            curNode.text = text;
          }
        },
        onclosetag(tagName: string) {
          // console.log(tagName);
          if (!stack.length) {
            return;
          }
          const node: any = stack.pop();
          const { children } = node;
          if (!children || !children.length) {
            // 无子元素情况
            node.isLeaf = true;
            return;
          }
          const endNode = {
            tagName,
            isEnd: true,
          };
          pushNode(endNode);
        },
        oncomment(comment: string) {
          // console.log(comment);
          if (!comment) {
            return;
          }
          const node: XmlNode = {
            comment,
            isComment: true,
          };
          pushNode(node);
        },
      },
      {
        xmlMode: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
      }
    );
    parser.write(xmlCode);
    // console.log(tree);

    return tree;
  }

  renderXmlNode(node: XmlNode) {
    const { tagName, isLeaf, text, attrs, isComment, comment, isEnd } = node;
    if (isComment) {
      return `<!--${comment}-->`;
    }
    if (isEnd) {
      return `</${tagName}>`;
    }
    const result: string[] = [`<${tagName}`];
    if (attrs) {
      for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
          const value = attrs[key];
          result.push(`${key}="${value}"`);
        }
      }
    }
    if (isLeaf && !text) {
      result.push("/>");
    } else {
      result[result.length - 1] += ">";
    }
    if (text) {
      result.push(text);
      result.push(`</${tagName}>`);
    }
    return result.join(" ");
  }
}
</script>

<style lang="scss" scoped>
.xml-tree {
  .comment {
    color: green;
  }
  .tag-prop{
    color: blue;
  }
  .prop-value{
    color: red;
  }
  .tag-text{
    color: #000;
  }
}
</style>
