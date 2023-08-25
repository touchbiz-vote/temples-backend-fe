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
import { defineComponent, ref, computed, watch, resolveComponent, openBlock, createElementBlock, createBlock, Fragment, createElementVNode, createVNode, withCtx, createTextVNode, unref } from "vue";
import { useMessage } from "/@/hooks/web/useMessage";
import { k as authFieldLoadTree, l as loadRoleAuthChecked, s as saveAuthField } from "./auth.api.js";
import { DownCircleOutlined, HomeOutlined, UpCircleOutlined, UndoOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/http/axios";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
var AuthFieldTree_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = defineComponent({
  name: "AuthFieldTree",
  components: {
    DownCircleOutlined,
    HomeOutlined,
    UpCircleOutlined,
    UndoOutlined,
    CheckOutlined
  },
  props: {
    cgformId: { type: String, required: true }
  },
  setup(props) {
    const { createMessage: $message } = useMessage();
    const roleId = ref("");
    const authType = ref(1);
    const autoExpandParent = ref(true);
    const expandedKeys = ref([]);
    const checkedKeys = ref([]);
    const allCode = ref([]);
    const treeData = ref([]);
    const authMode = ref("");
    const disabled = computed(() => !roleId.value);
    watch(() => props.cgformId, loadTree, { immediate: true });
    function loadTree() {
      return __async(this, null, function* () {
        if (!props.cgformId)
          return;
        let result = yield authFieldLoadTree(props.cgformId, authType.value);
        let trees = [];
        let codes = [];
        result.forEach((item) => {
          if (!codes.includes(item.code)) {
            codes.push(item.code);
            trees.push({ key: item.code, title: item.title });
          }
        });
        for (let node of trees) {
          let children = [];
          for (let item of result) {
            if (node.key === item.code) {
              let temp = getTreeNodeTitle(item);
              children.push({ key: item.id, title: temp });
            }
          }
          node.children = children;
        }
        treeData.value = trees;
        expandedKeys.value = [...codes];
        allCode.value = codes;
      });
    }
    function getTreeNodeTitle(item) {
      let str = "";
      if (item.page == 3) {
        str += "\u5217\u8868";
      } else if (item.page == 5) {
        str += "\u8868\u5355";
      }
      if (item.control == 3) {
        str += "\u53EF\u7F16\u8F91";
      } else if (item.control == 5) {
        str += "\u53EF\u89C1";
      }
      return str;
    }
    function loadChecked($roleId, $authMode) {
      return __async(this, null, function* () {
        roleId.value = $roleId;
        authMode.value = $authMode;
        checkedKeys.value = [];
        yield loadTree();
        let result = yield loadRoleAuthChecked({
          roleId: $roleId,
          cgformId: props.cgformId,
          type: authType.value,
          authMode: $authMode
        });
        checkedKeys.value = result.map((item) => item.authId);
      });
    }
    function clearChecked() {
      roleId.value = "";
      loadTree();
    }
    function onRefresh() {
      loadTree();
      loadChecked(roleId.value, authMode.value);
    }
    function onSave() {
      return __async(this, null, function* () {
        let ids = checkedKeys.value.filter((i) => allCode.value.indexOf(i) < 0);
        yield saveAuthField(roleId.value, props.cgformId, {
          authId: JSON.stringify(ids),
          authMode: authMode.value
        });
        $message.success("\u4FDD\u5B58\u6210\u529F");
      });
    }
    function onExpandAll() {
      expandedKeys.value = [...allCode.value];
    }
    function onCloseAll() {
      expandedKeys.value = [];
    }
    function onExpand($expandedKeys) {
      expandedKeys.value = $expandedKeys;
      autoExpandParent.value = false;
    }
    function clear() {
      roleId.value = "";
      checkedKeys.value = [];
    }
    function onClearSelected() {
      checkedKeys.value = [];
    }
    function onSelectAll() {
      const selectFun = function(arr) {
        for (let node of arr) {
          checkedKeys.value.push(node.key);
          if (node.children && node.children.length > 0) {
            selectFun.call(null, node.children);
          }
        }
      };
      checkedKeys.value = [];
      selectFun.call(null, unref(treeData));
    }
    return {
      loadChecked,
      clear,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      treeData,
      disabled,
      onSave,
      onExpand,
      clearChecked,
      onCloseAll,
      onExpandAll,
      onRefresh,
      onClearSelected,
      onSelectAll
    };
  }
});
const _hoisted_1 = { class: "onl-auth-tree-btns" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_empty = resolveComponent("a-empty");
  const _component_a_button = resolveComponent("a-button");
  const _component_DownCircleOutlined = resolveComponent("DownCircleOutlined");
  const _component_UpCircleOutlined = resolveComponent("UpCircleOutlined");
  const _component_CheckOutlined = resolveComponent("CheckOutlined");
  const _component_UndoOutlined = resolveComponent("UndoOutlined");
  const _component_a_tree = resolveComponent("a-tree");
  return openBlock(), createElementBlock("div", null, [
    _ctx.disabled ? (openBlock(), createBlock(_component_a_empty, {
      key: 0,
      description: "\u8BF7\u5148\u9009\u4E2D\u5DE6\u4FA7\u89D2\u8272/\u90E8\u95E8/\u7528\u6237"
    })) : _ctx.treeData.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
      key: 1,
      description: "\u65E0\u6743\u9650\u4FE1\u606F"
    })) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
      createElementVNode("div", _hoisted_1, [
        createVNode(_component_a_button, {
          onClick: _ctx.onRefresh,
          size: "small",
          type: "primary",
          preIcon: "ant-design:redo",
          ghost: ""
        }, {
          default: withCtx(() => [
            createTextVNode("\u5237\u65B0")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          onClick: _ctx.onExpandAll,
          size: "small",
          type: "primary",
          ghost: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_DownCircleOutlined),
            createTextVNode("\u5C55\u5F00")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          onClick: _ctx.onCloseAll,
          size: "small",
          type: "primary",
          ghost: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_UpCircleOutlined),
            createTextVNode("\u6298\u53E0")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          onClick: _ctx.onSave,
          size: "small",
          type: "primary",
          preIcon: "ant-design:save",
          ghost: ""
        }, {
          default: withCtx(() => [
            createTextVNode("\u4FDD\u5B58")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          onClick: _ctx.onSelectAll,
          size: "small",
          type: "primary",
          ghost: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_CheckOutlined),
            createTextVNode("\u5168\u9009")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          onClick: _ctx.onClearSelected,
          size: "small",
          type: "primary",
          ghost: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_UndoOutlined),
            createTextVNode("\u91CD\u7F6E")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      createVNode(_component_a_tree, {
        checkable: "",
        checkedKeys: _ctx.checkedKeys,
        "onUpdate:checkedKeys": _cache[0] || (_cache[0] = ($event) => _ctx.checkedKeys = $event),
        expandedKeys: _ctx.expandedKeys,
        autoExpandParent: _ctx.autoExpandParent,
        treeData: _ctx.treeData,
        onExpand: _ctx.onExpand
      }, null, 8, ["checkedKeys", "expandedKeys", "autoExpandParent", "treeData", "onExpand"])
    ], 64))
  ]);
}
var AuthFieldTree = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-909a7fde"]]);
export { AuthFieldTree as default };
