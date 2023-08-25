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
import { ref, reactive, resolveComponent, openBlock, createElementBlock, Fragment, createVNode, withCtx, createTextVNode, createElementVNode, normalizeStyle, renderList, toDisplayString } from "vue";
import { defHttp } from "/@/utils/http/axios";
import "/@/components/Form";
import { BasicModal, useModalInner, useModal } from "/@/components/Modal";
import { InfoCircleTwoTone } from "@ant-design/icons-vue";
import CodeFileViewModal from "./CodeFileViewModal.js";
import { useMessage } from "/@/hooks/web/useMessage";
import { downloadByData } from "/@/utils/file/download";
import { _ as _export_sfc } from "./index.js";
import "ant-design-vue";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
const _sfc_main = {
  name: "CodeFileListModal",
  components: {
    BasicModal,
    InfoCircleTwoTone,
    CodeFileViewModal
  },
  emits: ["register"],
  setup() {
    const { createMessage: $message } = useMessage();
    const codeList = ref([]);
    const height = window.innerHeight - 150;
    const divStyle = reactive({
      overflowY: "auto",
      maxHeight: height + "px"
    });
    const loading = ref(false);
    const tableName = ref("");
    const pathKey = ref("");
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      codeList.value = data.codeList;
      tableName.value = data.tableName;
      pathKey.value = data.pathKey;
    }));
    function handleClose() {
      closeModal();
    }
    function onDownloadGenerateCode() {
      let codeFileList = codeList.value;
      if (!codeFileList || codeFileList.length == 0) {
        $message.warning("\u65E0\u4EE3\u7801\uFF01");
        return;
      }
      let temp = codeFileList.join(",");
      return defHttp.post(
        {
          url: "/online/cgform/api/downGenerateCode",
          params: {
            fileList: encodeURI(temp),
            pathKey: pathKey.value
          },
          responseType: "blob"
        },
        { isTransformResponse: false }
      ).then((data) => {
        if (!data || data.size == 0) {
          $message.warning("\u5BFC\u51FA\u4EE3\u7801\u5931\u8D25\uFF01");
          return;
        }
        let fileName = "\u5BFC\u5230\u751F\u6210\u4EE3\u7801_" + tableName.value + "_" + new Date().getTime() + ".zip";
        downloadByData(data, fileName, "application/zip");
      });
    }
    const [registerCodeViewModal, { openModal }] = useModal();
    function handleView() {
      let temp = codeList.value;
      openModal(true, {
        codeList: temp,
        pathKey: pathKey.value
      });
    }
    return {
      registerModal,
      registerCodeViewModal,
      divStyle,
      codeList,
      onDownloadGenerateCode,
      handleClose,
      handleView,
      loading
    };
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_info_circle_two_tone = resolveComponent("info-circle-two-tone");
  const _component_a_button = resolveComponent("a-button");
  const _component_BasicModal = resolveComponent("BasicModal");
  const _component_code_file_view_modal = resolveComponent("code-file-view-modal");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_BasicModal, {
      onRegister: $setup.registerModal,
      width: 1200,
      defaultFullscreen: false,
      canFullscreen: false
    }, {
      title: withCtx(() => [
        createVNode(_component_info_circle_two_tone),
        createTextVNode(" \u4EE3\u7801\u751F\u6210\u7ED3\u679C ")
      ]),
      footer: withCtx(() => [
        createVNode(_component_a_button, { onClick: $setup.handleClose }, {
          default: withCtx(() => [
            createTextVNode("\u5173\u95ED")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          type: "primary",
          ghost: "",
          onClick: $setup.handleView
        }, {
          default: withCtx(() => [
            createTextVNode("\u5728\u7EBF\u9884\u89C8")
          ]),
          _: 1
        }, 8, ["onClick"]),
        createVNode(_component_a_button, {
          type: "primary",
          onClick: $setup.onDownloadGenerateCode,
          loading: $setup.loading
        }, {
          default: withCtx(() => [
            createTextVNode("\u4E0B\u8F7D\u5230\u672C\u5730")
          ]),
          _: 1
        }, 8, ["onClick", "loading"])
      ]),
      default: withCtx(() => [
        createElementVNode("div", {
          style: normalizeStyle($setup.divStyle)
        }, [
          createElementVNode("p", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.codeList, (item) => {
              return openBlock(), createElementBlock(Fragment, null, [
                createTextVNode(toDisplayString(item), 1),
                _hoisted_1
              ], 64);
            }), 256))
          ])
        ], 4)
      ]),
      _: 1
    }, 8, ["onRegister"]),
    createVNode(_component_code_file_view_modal, {
      onRegister: $setup.registerCodeViewModal,
      onDownload: $setup.onDownloadGenerateCode,
      onClose: $setup.handleClose
    }, null, 8, ["onRegister", "onDownload", "onClose"])
  ], 64);
}
var CodeFileListModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CodeFileListModal as default };
