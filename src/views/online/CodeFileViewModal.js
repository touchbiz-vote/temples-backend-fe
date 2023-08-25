var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { defineComponent, ref, reactive, resolveComponent, openBlock, createBlock, withCtx, createVNode, createTextVNode, createElementVNode, normalizeStyle, createCommentVNode } from "vue";
import { defHttp } from "/@/utils/http/axios";
import { BasicModal, useModalInner } from "/@/components/Modal";
import { InfoCircleTwoTone } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { JCodeEditor } from "/@/components/Form";
import { _ as _export_sfc } from "./index.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "CodeFileViewModal",
  components: {
    BasicModal,
    InfoCircleTwoTone,
    JCodeEditor
  },
  emits: ["download", "register", "close"],
  setup(_p, { emit }) {
    const codeList = ref([]);
    const pathKey = ref("");
    const treeData = ref([]);
    const expandStatus = ref(false);
    const height = window.innerHeight - 160;
    const language = ref("java");
    const activeCodeContent = ref("");
    let codeMap = reactive({});
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      codeMap = reactive({});
      activeCodeContent.value = "";
      codeList.value = data.codeList;
      pathKey.value = data.pathKey;
      getTreeData();
      expandStatus.value = true;
    }));
    function getTreeData() {
      let list = getPlainList();
      let root = list[0];
      assembleTree(root, list);
      let treeList = [];
      const getFinalTreeData = function(root2) {
        if (root2.children) {
          let children = root2.children;
          if (children.length == 1) {
            getFinalTreeData(children[0]);
          } else if (children.length > 1) {
            treeList.push(root2);
          }
        }
      };
      getFinalTreeData(root);
      console.log(123, treeList);
      treeData.value = treeList;
      setTimeout(() => {
        loadFirstFileContent(root);
      }, 300);
    }
    function loadFirstFileContent(root) {
      return __async(this, null, function* () {
        const getFirstFile = function(temp) {
          if (temp.isLeaf === true) {
            return temp;
          } else {
            if (temp.children) {
              return getFirstFile(temp.children[0]);
            }
          }
        };
        let node = getFirstFile(root);
        if (node && node.isLeaf === true) {
          let path = node.path;
          if (!codeMap[path]) {
            yield loadCode(path);
          }
          language.value = getCodeLanguage(path);
          activeCodeContent.value = codeMap[path];
        }
      });
    }
    function assembleTree(root, list) {
      for (let item of list) {
        if (root.key == item.pid) {
          let children = root.children;
          if (!children) {
            root.children = [];
          }
          root.children.push(item);
          assembleTree(item, list);
        }
      }
    }
    function getAbsolutePath(arr, index) {
      let i = 0;
      let str = "";
      while (i <= index) {
        str += arr[i];
        i++;
      }
      return str;
    }
    function getPlainList() {
      let list = [];
      let list2 = [];
      let arr = codeList.value;
      for (let item of arr) {
        let temp = item.replace(new RegExp("\\\\", "g"), "/").replace("\u751F\u6210\u6210\u529F\uFF1A", "").trim();
        if (temp) {
          let arr2 = temp.split("/");
          for (let i = 0; i < arr2.length; i++) {
            let a = arr2[i];
            let id = getAbsolutePath(arr2, i);
            if (a) {
              let item2 = {
                title: a,
                key: id
              };
              if (a == 0)
                ;
              else {
                let lastKey = getAbsolutePath(arr2, i - 1);
                if (lastKey) {
                  item2["pid"] = lastKey;
                }
              }
              if (i == arr2.length - 1) {
                item2["isLeaf"] = true;
                item2["path"] = temp;
              }
              if (list2.indexOf(id) < 0 || i == arr2.length - 1) {
                list.push(item2);
                list2.push(id);
              }
            }
          }
        }
      }
      return list;
    }
    function handleClose() {
      closeModal();
      emit("close");
    }
    function onDownloadGenerateCode() {
      emit("download");
    }
    function getCodeLanguage(path) {
      if (path.endsWith("xml")) {
        return "application/xml";
      }
      if (path.endsWith("sql")) {
        return "text/x-sql";
      }
      if (path.endsWith("vue")) {
        return "text/x-vue";
      }
      if (path.endsWith("ts")) {
        return "text/typescript";
      } else {
        return "text/x-java";
      }
    }
    function showCodeContent(_selectedKeys, e) {
      return __async(this, null, function* () {
        let node = e.node.dataRef;
        if (node.isLeaf) {
          let path = node.path;
          if (!codeMap[path]) {
            yield loadCode(path);
          }
          language.value = getCodeLanguage(path);
          activeCodeContent.value = codeMap[path];
        }
      });
    }
    function loadCode(path) {
      return new Promise((resolve) => {
        let params = {
          path: encodeURI(path),
          pathKey: pathKey.value
        };
        defHttp.get({ url: "/online/cgform/api/codeView", params }, { isTransformResponse: false }).then((data) => {
          if (!data || data.size === 0) {
            message.warning("\u6587\u4EF6\u4E0B\u8F7D\u5931\u8D25");
            return;
          }
          let blob = new Blob([data]);
          let reader = new FileReader();
          reader.readAsText(blob, "utf8");
          reader.onload = function() {
            let content = this.result;
            codeMap[path] = content;
            resolve(1);
          };
        });
      });
    }
    return {
      registerModal,
      codeList,
      onDownloadGenerateCode,
      handleClose,
      treeData,
      showCodeContent,
      activeCodeContent,
      expandStatus,
      height,
      language
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_info_circle_two_tone = resolveComponent("info-circle-two-tone");
  const _component_a_directory_tree = resolveComponent("a-directory-tree");
  const _component_a_col = resolveComponent("a-col");
  const _component_JCodeEditor = resolveComponent("JCodeEditor");
  const _component_a_empty = resolveComponent("a-empty");
  const _component_a_row = resolveComponent("a-row");
  const _component_a_button = resolveComponent("a-button");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, {
    onRegister: _ctx.registerModal,
    okText: "",
    cancelText: "\u5173\u95ED",
    width: 1200,
    defaultFullscreen: true,
    canFullscreen: false,
    onOk: _ctx.onDownloadGenerateCode
  }, {
    title: withCtx(() => [
      createVNode(_component_info_circle_two_tone),
      createTextVNode(" \u4EE3\u7801\u5728\u7EBF\u9884\u89C8 ")
    ]),
    footer: withCtx(() => [
      createVNode(_component_a_button, { onClick: _ctx.handleClose }, {
        default: withCtx(() => [
          createTextVNode("\u5173\u95ED")
        ]),
        _: 1
      }, 8, ["onClick"]),
      createVNode(_component_a_button, {
        type: "primary",
        onClick: _ctx.onDownloadGenerateCode
      }, {
        default: withCtx(() => [
          createTextVNode("\u4E0B\u8F7D\u5230\u672C\u5730")
        ]),
        _: 1
      }, 8, ["onClick"])
    ]),
    default: withCtx(() => [
      createElementVNode("div", null, [
        createVNode(_component_a_row, null, {
          default: withCtx(() => [
            createVNode(_component_a_col, {
              span: 6,
              gutter: 3,
              style: { "border-right": "1px solid #eee" }
            }, {
              default: withCtx(() => [
                createElementVNode("div", {
                  style: normalizeStyle({ height: _ctx.height + "px", overflowY: "auto" })
                }, [
                  _ctx.treeData.length ? (openBlock(), createBlock(_component_a_directory_tree, {
                    key: 0,
                    defaultExpandAll: true,
                    "tree-data": _ctx.treeData,
                    onSelect: _ctx.showCodeContent
                  }, null, 8, ["tree-data", "onSelect"])) : createCommentVNode("", true)
                ], 4)
              ]),
              _: 1
            }),
            createVNode(_component_a_col, {
              span: 18,
              gutter: 3
            }, {
              default: withCtx(() => [
                _ctx.activeCodeContent ? (openBlock(), createBlock(_component_JCodeEditor, {
                  key: 0,
                  value: _ctx.activeCodeContent,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => _ctx.activeCodeContent = $event),
                  theme: "idea",
                  language: _ctx.language,
                  fullScreen: false,
                  lineNumbers: true,
                  height: _ctx.height + "px",
                  "language-change": true
                }, null, 8, ["value", "language", "height"])) : (openBlock(), createBlock(_component_a_empty, {
                  key: 1,
                  style: { "margin-top": "50px" },
                  description: "\u8BF7\u9009\u62E9\u5DE6\u4FA7\u6587\u4EF6\uFF0C\u663E\u793A\u8BE6\u7EC6\u4EE3\u7801"
                }))
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ])
    ]),
    _: 1
  }, 8, ["onRegister", "onOk"]);
}
var CodeFileViewModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CodeFileViewModal as default };
