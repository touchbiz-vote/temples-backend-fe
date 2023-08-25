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
import { defineComponent, ref, reactive, resolveComponent, openBlock, createBlock, withCtx, createVNode, createTextVNode, createCommentVNode } from "vue";
import { BasicModal, useModalInner, useModal } from "/@/components/Modal";
import { JCodeEditor } from "/@/components/Form";
import { u as useOnlineTest } from "./useOnlineTest.js";
import { E as EnhanceJsHistory, u as useEnhanceStore } from "./EnhanceJsHistory.js";
import { g as getEnhanceJsByCode, s as saveEnhanceJs } from "./enhance.api.js";
import { useMessage } from "/@/hooks/web/useMessage";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/dateUtil";
import "/@/store";
import "pinia";
import "/@/utils/cache";
import "/@/utils/http/axios";
import "/@/utils/is";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
const _sfc_main = defineComponent({
  name: "EnhanceJs",
  components: { BasicModal, JCodeEditor, EnhanceJsHistory },
  emits: ["register"],
  setup() {
    const { createMessage: $message } = useMessage();
    const enhanceStore = useEnhanceStore();
    const formEditorRef = ref();
    const listEditorRef = ref();
    const models = reactive({ form: {}, list: {} });
    const enhanceType = ref("list");
    const code = ref("");
    const showHistory = ref(false);
    const codeChange = ref(false);
    const tableName = ref("");
    const enhanceValues = reactive({ form: "", list: "" });
    const getFlag = { form: false, list: false };
    const reloading = ref(false);
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      show(data.row);
    }));
    const [registerEnhanceJsHistory, enhanceJsHistory] = useModal();
    const { aiTestMode, genEnhanceJsData } = useOnlineTest();
    function show(row) {
      code.value = row.id;
      codeChange.value = false;
      tableName.value = row.tableName;
      let enhances = enhanceStore.getEnhanceJs(code.value);
      if ((enhances == null ? void 0 : enhances.length) > 0) {
        enhanceType.value = enhances[enhances.length - 1].type;
        showHistory.value = true;
      } else {
        showHistory.value = false;
      }
      getFlag.form = false;
      getFlag.list = false;
      if (!enhanceType.value) {
        onChangeType("form");
      } else {
        onChangeType(enhanceType.value);
      }
      reloading.value = true;
      setTimeout(() => reloading.value = false, 150);
    }
    function onSubmit() {
      return __async(this, null, function* () {
        yield Promise.all([saveEnhanceJsByType("form"), saveEnhanceJsByType("list")]);
        closeModal();
        $message.success("\u4FDD\u5B58\u6210\u529F");
      });
    }
    function saveEnhanceJsByType(type) {
      return __async(this, null, function* () {
        let model = models[type];
        let params = {
          cgJs: enhanceValues[type],
          cgJsType: type
        };
        if (!getFlag[type] || model.cgJs === params.cgJs) {
          return;
        }
        let isUpdate = !!model.id;
        if (isUpdate) {
          params = Object.assign({}, model, params);
        }
        yield saveEnhanceJs(code.value, params, isUpdate);
        enhanceStore.addEnhanceJs({
          code: code.value,
          str: params.cgJs,
          type: params.cgJsType,
          date: new Date().getTime()
        });
      });
    }
    function onCancel() {
      closeModal();
    }
    function onChangeType(type) {
      return __async(this, null, function* () {
        enhanceType.value = type;
        try {
          if (!getFlag[type]) {
            let result = yield getEnhanceJsByCode(code.value, type);
            Object.assign(models[type], { id: null }, result);
            enhanceValues[type] = models[type].cgJs;
            getFlag[type] = true;
          }
        } catch (e) {
          console.error(e);
        }
        setTimeout(() => {
          if (type == "list") {
            listEditorRef.value.refresh();
          } else {
            formEditorRef.value.refresh();
          }
        }, 150);
      });
    }
    function onShowHistory() {
      enhanceJsHistory.openModal(true, {
        code: code.value,
        type: enhanceType.value
      });
    }
    function onCodeChange(value) {
      if (enhanceValues[enhanceType.value] != value) {
        codeChange.value = true;
        enhanceValues[enhanceType.value] = value;
      }
    }
    function onGenTestData() {
      if (enhanceType.value === "form") {
        genEnhanceJsData(tableName.value, enhanceType.value, formEditorRef.value);
      } else {
        genEnhanceJsData(tableName.value, enhanceType.value, listEditorRef.value);
      }
    }
    return {
      formEditorRef,
      listEditorRef,
      reloading,
      enhanceValues,
      enhanceType,
      showHistory,
      aiTestMode,
      tableName,
      genEnhanceJsData,
      onGenTestData,
      onChangeType,
      onCodeChange,
      onShowHistory,
      onSubmit,
      onCancel,
      registerModal,
      registerEnhanceJsHistory
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JCodeEditor = resolveComponent("JCodeEditor");
  const _component_a_tab_pane = resolveComponent("a-tab-pane");
  const _component_a_tabs = resolveComponent("a-tabs");
  const _component_a_button = resolveComponent("a-button");
  const _component_a_space = resolveComponent("a-space");
  const _component_EnhanceJsHistory = resolveComponent("EnhanceJsHistory");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, {
    onRegister: _ctx.registerModal,
    title: "JS\u589E\u5F3A",
    width: 800,
    bodyStyle: { height: "360px" }
  }, {
    footer: withCtx(() => [
      createVNode(_component_a_space, null, {
        default: withCtx(() => [
          createVNode(_component_a_button, { onClick: _ctx.onCancel }, {
            default: withCtx(() => [
              createTextVNode("\u5173\u95ED")
            ]),
            _: 1
          }, 8, ["onClick"]),
          createVNode(_component_a_button, {
            type: "primary",
            onClick: _ctx.onSubmit
          }, {
            default: withCtx(() => [
              createTextVNode("\u786E\u5B9A")
            ]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }),
      createVNode(_component_a_space, { style: { "float": "left" } }, {
        default: withCtx(() => [
          _ctx.showHistory ? (openBlock(), createBlock(_component_a_button, {
            key: 0,
            onClick: _ctx.onShowHistory
          }, {
            default: withCtx(() => [
              createTextVNode("\u67E5\u770B\u5386\u53F2\u7248\u672C")
            ]),
            _: 1
          }, 8, ["onClick"])) : createCommentVNode("", true),
          _ctx.aiTestMode ? (openBlock(), createBlock(_component_a_button, {
            key: 1,
            onClick: _ctx.onGenTestData
          }, {
            default: withCtx(() => [
              createTextVNode("\u751F\u6210\u6D4B\u8BD5\u6570\u636E")
            ]),
            _: 1
          }, 8, ["onClick"])) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ]),
    default: withCtx(() => [
      createVNode(_component_a_tabs, {
        activeKey: _ctx.enhanceType,
        "onUpdate:activeKey": _cache[2] || (_cache[2] = ($event) => _ctx.enhanceType = $event),
        onChange: _ctx.onChangeType
      }, {
        default: withCtx(() => [
          createVNode(_component_a_tab_pane, {
            tab: "form",
            key: "form",
            forceRender: ""
          }, {
            default: withCtx(() => [
              !_ctx.reloading ? (openBlock(), createBlock(_component_JCodeEditor, {
                key: 0,
                ref: "formEditorRef",
                value: _ctx.enhanceValues.form,
                "onUpdate:value": _cache[0] || (_cache[0] = ($event) => _ctx.enhanceValues.form = $event),
                language: "javascript",
                fullScreen: true,
                lineNumbers: false,
                height: "240px",
                "language-change": false,
                onChange: _ctx.onCodeChange
              }, null, 8, ["value", "onChange"])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createVNode(_component_a_tab_pane, {
            tab: "list",
            key: "list",
            forceRender: ""
          }, {
            default: withCtx(() => [
              !_ctx.reloading ? (openBlock(), createBlock(_component_JCodeEditor, {
                key: 0,
                ref: "listEditorRef",
                value: _ctx.enhanceValues.list,
                "onUpdate:value": _cache[1] || (_cache[1] = ($event) => _ctx.enhanceValues.list = $event),
                language: "javascript",
                fullScreen: true,
                lineNumbers: false,
                height: "240px",
                "language-change": false,
                onChange: _ctx.onCodeChange
              }, null, 8, ["value", "onChange"])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["activeKey", "onChange"]),
      createVNode(_component_EnhanceJsHistory, { onRegister: _ctx.registerEnhanceJsHistory }, null, 8, ["onRegister"])
    ]),
    _: 1
  }, 8, ["onRegister"]);
}
var EnhanceJsModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { EnhanceJsModal as default };
