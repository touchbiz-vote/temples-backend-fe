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
import { defineComponent, ref, resolveComponent, openBlock, createBlock, withCtx, createVNode } from "vue";
import { defHttp } from "/@/utils/http/axios";
import { BasicModal, useModalInner } from "/@/components/Modal";
import { _ as _export_sfc } from "./index.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "FileSelectModal",
  components: { BasicModal },
  emits: ["select", "register"],
  setup(_, { emit }) {
    const loading = ref(true);
    const treeData = ref([]);
    const selectedKey = ref("");
    const [registerModal, { closeModal }] = useModalInner(() => __async(this, null, function* () {
      selectedKey.value = "";
      if (treeData.value.length === 0) {
        loadRoot();
      }
    }));
    function onSubmit() {
      emit("select", selectedKey.value);
      closeModal();
    }
    function onCancel() {
      closeModal();
    }
    function loadRoot() {
      return __async(this, null, function* () {
        loading.value = true;
        treeData.value = yield defHttp.get({ url: "/online/cgform/head/rootFile" }).finally(() => {
          loading.value = false;
        });
      });
    }
    function onLoadData(treeNode) {
      return __async(this, null, function* () {
        if (treeNode.dataRef.children) {
          return;
        }
        let params = {
          parentPath: treeNode.dataRef.key
        };
        treeNode.dataRef.children = yield defHttp.get({ url: "/online/cgform/head/fileTree", params });
        treeData.value = [...treeData.value];
      });
    }
    function onSelect(selectedKeys) {
      selectedKey.value = selectedKeys[0];
    }
    return { loading, treeData, onLoadData, onSelect, onSubmit, onCancel, registerModal };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_directory_tree = resolveComponent("a-directory-tree");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, {
    onRegister: _ctx.registerModal,
    title: "\u9009\u62E9\u76EE\u5F55",
    width: 500,
    onOk: _ctx.onSubmit,
    onCancel: _ctx.onCancel
  }, {
    default: withCtx(() => [
      createVNode(_component_a_spin, { spinning: _ctx.loading }, {
        default: withCtx(() => [
          createVNode(_component_a_directory_tree, {
            treeData: _ctx.treeData,
            loadData: _ctx.onLoadData,
            onSelect: _ctx.onSelect
          }, null, 8, ["treeData", "loadData", "onSelect"])
        ]),
        _: 1
      }, 8, ["spinning"])
    ]),
    _: 1
  }, 8, ["onRegister", "onOk", "onCancel"]);
}
var FileSelectModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FileSelectModal as default };
