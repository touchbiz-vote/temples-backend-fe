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
import { defineComponent, ref, nextTick, watch, reactive, markRaw, defineAsyncComponent, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, createTextVNode, resolveDynamicComponent } from "vue";
import { BasicModal, useModalInner } from "/@/components/Modal";
import { g as getRefPromise } from "./useExtendComponent.js";
import { defHttp } from "/@/utils/http/axios";
import { O as OnlineForm } from "./OnlineForm.js";
import { importViewsFile } from "/@/utils";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "@ant-design/icons-vue";
import "/@/hooks/web/useMessage";
import "/@/components/Form/index";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/common/compUtils";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "vue-router";
import "/@/components/Form/src/utils/Area";
import "/@/components/Preview/index";
import "./LinkTableListPiece.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "./OnlineSelectCascade.js";
import "/@/components/Loading";
import "/@/utils/auth";
import "./JModalTip.js";
import "ant-design-vue";
import "@vueuse/core";
import "/@/components/jeecg/JVxeTable/types";
import "/@/hooks/core/useContext";
import "/@/utils/mitt";
import "/@/utils/cache";
import "./omit.js";
import "./_baseClone.js";
import "./_baseSlice.js";
const DEF_CONFIG = {
  code: "",
  title: "\u81EA\u5B9A\u4E49\u5F39\u6846",
  width: 600,
  row: {},
  hide: [],
  show: [],
  requestUrl: "",
  tableType: "",
  foreignKeys: "",
  formComponent: ""
};
const _sfc_main = defineComponent({
  name: "OnlineCustomModal",
  components: {
    OnlineForm,
    BasicModal
  },
  setup(_props, { emit }) {
    const onlineFormCompRef = ref();
    const id = ref("");
    const title = ref("\u81EA\u5B9A\u4E49\u5F39\u6846");
    const width = ref(600);
    let onlineHideFields = [];
    let onlineShowFields = [];
    let onlineFormEditUrl = "";
    let currentRowData = {};
    const url = {
      loadFormItems: "/online/cgform/api/getFormItem/",
      optPre: "/online/cgform/api/form/"
    };
    const modalStyle = { position: "relative" };
    const confirmLoading = ref(false);
    const formRendered = ref(false);
    function renderSuccess() {
      formRendered.value = true;
    }
    const isOnlineForm = ref(true);
    const [registerModal, { setModalProps, closeModal }] = useModalInner((params) => __async(this, null, function* () {
      setModalProps({ confirmLoading: false });
        resetParams(params);
      yield nextTick(() => __async(this, null, function* () {
        if (!params.formComponent) {
          yield showOnlineForm();
        } else {
          showCustomForm(params.formComponent);
        }
      }));
    }));
    function resetParams(params) {
      console.log('resetParams');
      let options = Object.assign({}, DEF_CONFIG, params);
      id.value = options.code;
      title.value = options.title;
      width.value = options.width;
      onlineHideFields = options.hide || [];
      onlineShowFields = options.show || [];
      onlineFormEditUrl = getOnlineFormEditUrl(options.requestUrl);
      currentRowData = options.row;
    }
    function getOnlineFormEditUrl(requestUrl) {
      if (requestUrl) {
        return requestUrl;
      } else {
        return url.optPre + id.value;
      }
    }
    const submitLoading = ref(false);
    function handleSubmit() {
      submitLoading.value = true;
      if (isOnlineForm.value === true) {
        onlineFormCompRef.value.handleSubmit();
      } else {
        customFormRef.value.handleSubmit();
      }
      setTimeout(() => {
        submitLoading.value = true;
      }, 3500);
    }
    function handleCancel() {
      closeModal();
    }
    function handleSuccess(formData) {
      emit("success", formData);
      closeModal();
    }
    function showOnlineForm() {
      return __async(this, null, function* () {
        isOnlineForm.value = true;
        yield getRefPromise(formRendered);
        onlineFormCompRef.value.handleCustomFormSh(onlineShowFields, onlineHideFields);
        onlineFormCompRef.value.handleCustomFormEdit(currentRowData, onlineFormEditUrl);
      });
    }
    const formTemplate = ref(1);
    watch(id, renderFormItems, { immediate: true });
    function renderFormItems() {
      return __async(this, null, function* () {
        formRendered.value = false;
        if (!id.value) {
          return;
        }
        console.log("\u91CD\u65B0\u6E32\u67D3\u8868\u5355\u300B\u300B\u300B\u300Bmodal");
        let result = yield loadFormItems();
        let dataFormTemplate = result.head.formTemplate;
        formTemplate.value = dataFormTemplate ? Number(dataFormTemplate) : 1;
        nextTick(() => __async(this, null, function* () {
          let myForm = yield getRefPromise(onlineFormCompRef);
          myForm.createRootProperties(result);
        }));
      });
    }
    function loadFormItems() {
      let url2 = `/online/cgform/api/getFormItem/${id.value}`;
      return new Promise((resolve, reject) => {
        defHttp.get({ url: url2 }, { isTransformResponse: false }).then((res) => {
          console.log("\u8868\u5355\u7ED3\u679C\u300B\u300Bmodal:", res);
          if (res.success) {
            resolve(res.result);
          } else {
            reject(res.message);
          }
        }).catch(() => {
          reject();
        });
      });
    }
    const customFormRef = ref();
    const customFormComponent = reactive({
      url: "",
      is: "",
      row: {}
    });
    function showCustomForm(formComponent) {
      isOnlineForm.value = false;
      customFormComponent.url = onlineFormEditUrl;
      customFormComponent.row = currentRowData;
      customFormComponent.is = markRaw(defineAsyncComponent(() => importViewsFile(formComponent)));
    }
    return {
      registerModal,
      title,
      width,
      modalStyle,
      handleSubmit,
      handleCancel,
      id,
      onlineFormCompRef,
      formTemplate,
      renderSuccess,
      customFormRef,
      customFormComponent,
      open,
      isOnlineForm,
      confirmLoading,
      submitLoading,
      handleSuccess
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent("a-button");
  const _component_online_form = resolveComponent("online-form");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, mergeProps({
    title: _ctx.title,
    width: _ctx.width
  }, _ctx.$attrs, {
    style: _ctx.modalStyle,
    onRegister: _ctx.registerModal,
    wrapClassName: "jeecg-online-modal2",
    onOk: _ctx.handleSubmit
  }), {
    footer: withCtx(() => [
      createVNode(_component_a_button, {
        key: "submit",
        type: "primary",
        onClick: _ctx.handleSubmit
      }, {
        default: withCtx(() => [
          createTextVNode("\u786E\u5B9A")
        ]),
        _: 1
      }, 8, ["onClick"]),
      createVNode(_component_a_button, {
        key: "back",
        onClick: _ctx.handleCancel
      }, {
        default: withCtx(() => [
          createTextVNode("\u5173\u95ED")
        ]),
        _: 1
      }, 8, ["onClick"])
    ]),
    default: withCtx(() => [
      createVNode(_component_a_spin, { spinning: _ctx.confirmLoading }, {
        default: withCtx(() => [
          _ctx.isOnlineForm ? (openBlock(), createBlock(_component_online_form, {
            key: 0,
            ref: "onlineFormCompRef",
            id: _ctx.id,
            "form-template": _ctx.formTemplate,
            onRendered: _ctx.renderSuccess,
            onSuccess: _ctx.handleSuccess,
            modalClass: "jeecg-online-modal2"
          }, null, 8, ["id", "form-template", "onRendered", "onSuccess"])) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.customFormComponent.is), {
            key: 1,
            ref: "customFormRef",
            url: _ctx.customFormComponent.url,
            row: _ctx.customFormComponent.row,
            onClose: _ctx.handleSuccess
          }, null, 40, ["url", "row", "onClose"]))
        ]),
        _: 1
      }, 8, ["spinning"])
    ]),
    _: 1
  }, 16, ["title", "width", "style", "onRegister", "onOk"]);
}
var OnlineCustomModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineCustomModal as default };
