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
import { defineComponent, ref, resolveComponent, openBlock, createElementBlock, createBlock, withCtx, createVNode, normalizeStyle, createCommentVNode } from "vue";
import { queryTreeList } from "/@/api/common/api";
import { _ as _export_sfc } from "./index.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "LeftDepart",
  emits: ["select"],
  setup(_, { emit }) {
    const treeData = ref([]);
    const selectedKeys = ref([]);
    const expandedKeys = ref([]);
    function onSelect(_2, e) {
      let record = e.node.dataRef;
      selectedKeys.value = [record.key];
      emit("select", record.id);
    }
    loadTree();
    function loadTree() {
      return __async(this, null, function* () {
        let result = yield queryTreeList();
        treeData.value = [];
        result.forEach((node) => initialNode(node));
      });
    }
    function initialNode(node, level = 1) {
      node.slots = { icon: "depIcon" };
      if (level === 1) {
        treeData.value.push(node);
        expandedKeys.value.push(node.id);
      }
      if (node.children && node.children.length > 0) {
        for (const childNode of node.children) {
          initialNode(childNode, level + 1);
        }
      }
    }
    function clearSelected() {
      selectedKeys.value = [];
    }
    return {
      treeData,
      expandedKeys,
      selectedKeys,
      clearSelected,
      onSelect
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_icon = resolveComponent("a-icon");
  const _component_a_tree = resolveComponent("a-tree");
  return openBlock(), createElementBlock("div", null, [
    _ctx.treeData.length > 0 ? (openBlock(), createBlock(_component_a_tree, {
      key: 0,
      showIcon: "",
      autoExpandParent: "",
      treeData: _ctx.treeData,
      selectedKeys: _ctx.selectedKeys,
      expandedKeys: _ctx.expandedKeys,
      "onUpdate:expandedKeys": _cache[0] || (_cache[0] = ($event) => _ctx.expandedKeys = $event),
      onSelect: _ctx.onSelect
    }, {
      depIcon: withCtx(({ selected }) => [
        createVNode(_component_a_icon, {
          style: normalizeStyle({ color: selected ? "blue" : "" }),
          type: "apartment"
        }, null, 8, ["style"])
      ]),
      _: 1
    }, 8, ["treeData", "selectedKeys", "expandedKeys", "onSelect"])) : createCommentVNode("", true)
  ]);
}
var LeftDepart = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LeftDepart as default };
