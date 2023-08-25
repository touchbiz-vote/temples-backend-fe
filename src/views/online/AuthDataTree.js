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
import { defineComponent, ref, computed, watch, resolveComponent, openBlock, createElementBlock, createBlock, Fragment, createElementVNode, createVNode, withCtx, createTextVNode } from "vue";
import { useMessage } from "/@/hooks/web/useMessage";
import { o as authDataLoadTree, l as loadRoleAuthChecked, p as saveAuthData } from "./auth.api.js";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/http/axios";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
var AuthDataTree_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = defineComponent({
  name: "AuthDataTree",
  props: {
    cgformId: { type: String, required: true }
  },
  setup(props) {
    const { createMessage: $message } = useMessage();
    const roleId = ref("");
    const authType = ref(3);
    const autoExpandParent = ref(true);
    const expandedKeys = ref([]);
    const checkedKeys = ref([]);
    const treeData = ref([]);
    const authMode = ref("");
    const disabled = computed(() => !roleId.value);
    watch(() => props.cgformId, loadTree, { immediate: true });
    function loadTree() {
      return __async(this, null, function* () {
        if (!props.cgformId)
          return;
        let result = yield authDataLoadTree(props.cgformId, authType.value);
        treeData.value = result.map((item) => ({ key: item.id, title: item.ruleName }));
      });
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
        yield saveAuthData(roleId.value, props.cgformId, {
          authId: JSON.stringify(checkedKeys.value),
          authMode: authMode.value
        });
        $message.success("\u4FDD\u5B58\u6210\u529F");
      });
    }
    function onExpand($expandedKeys) {
      expandedKeys.value = $expandedKeys;
      autoExpandParent.value = false;
    }
    function clear() {
      roleId.value = "";
      checkedKeys.value = [];
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
      onRefresh,
      clearChecked
    };
  }
});
const _hoisted_1 = { class: "onl-auth-tree-btns" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_empty = resolveComponent("a-empty");
  const _component_a_button = resolveComponent("a-button");
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
var AuthDataTree = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a8874950"]]);
export { AuthDataTree as default };
