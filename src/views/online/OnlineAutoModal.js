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
import { defineComponent, ref, watch, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createElementBlock, Fragment, renderList, createTextVNode, toDisplayString, createCommentVNode, createVNode } from "vue";
import { BasicModal } from "/@/components/Modal";
import { O as OnlineForm } from "./OnlineForm.js";
import { p as useAutoModal } from "./useExtendComponent.js";
import CommentPanel from "/@/components/jeecg/comment/CommentPanel.vue";
import { _ as _export_sfc } from "./index.js";
import "/@/hooks/web/useMessage";
import "/@/components/Form/index";
import "/@/utils/http/axios";
import "/@/utils";
import "/@/components/Loading";
import "/@/components/jeecg/JVxeTable/types";
import "/@/utils/auth";
import "@ant-design/icons-vue";
import "/@/hooks/core/useContext";
import "/@/utils/mitt";
import "/@/utils/cache";
import "/@/utils/common/compUtils";
import "/@/store/modules/user";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "./omit.js";
import "./_baseClone.js";
import "./_baseSlice.js";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "/@/utils/dict/JDictSelectUtil";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "vue-router";
import "/@/components/Form/src/utils/Area";
import "/@/components/Preview/index";
import "./LinkTableListPiece.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "./OnlineSelectCascade.js";
import "./JModalTip.js";
import "ant-design-vue";
import "@vueuse/core";
const _sfc_main = defineComponent({
  name: "OnlineModal",
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    BasicModal,
    OnlineForm,
    CommentPanel
  },
  emits: ["success", "register", "formConfig"],
  setup(props, { emit }) {
    console.log("\u8FDB\u5165\u8868\u5355\u5F39\u6846\u300B\u300B\u300B\u300Bmodal");
    const commentPanelRef = ref();
    function reloadComment() {
      if (commentPanelRef.value)
        commentPanelRef.value.reload();
    }
    const {
      title,
      modalWidth,
      registerModal,
      closeModal,
      cgButtonList,
      handleCgButtonClick,
      disableSubmit,
      handleSubmit,
      submitLoading,
      handleCancel,
      handleFormConfig,
      onlineFormCompRef,
      formTemplate,
      isTreeForm,
      pidFieldName,
      renderSuccess,
      formRendered,
      tableName,
      formDataId,
      enableComment,
      onCloseEvent
    } = useAutoModal(false, { emit }, reloadComment);
    function handleSuccess(formData) {
      emit("success", formData);
      closeModal();
      onCloseEvent();
    }
    watch(() => props.id, renderFormItems, { immediate: true });
    function renderFormItems() {
      return __async(this, null, function* () {
        formRendered.value = false;
        if (!props.id) {
          return;
        }
        console.log("\u91CD\u65B0\u6E32\u67D3\u8868\u5355\u300B\u300B\u300B\u300Bmodal");
        yield handleFormConfig(props.id, {});
      });
    }
    const that = {
      title,
      onlineFormCompRef,
      renderSuccess,
      registerModal,
      handleSubmit,
      handleSuccess,
      handleCancel,
      modalWidth,
      formTemplate,
      disableSubmit,
      cgButtonList,
      handleCgButtonClick,
      isTreeForm,
      pidFieldName,
      submitLoading,
      tableName,
      formDataId,
      enableComment,
      commentPanelRef,
      onCloseEvent
    };
    return that;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent("a-button");
  const _component_online_form = resolveComponent("online-form");
  const _component_comment_panel = resolveComponent("comment-panel");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, mergeProps({
    title: _ctx.title,
    onCancel: _ctx.onCloseEvent,
    enableComment: _ctx.enableComment,
    width: _ctx.modalWidth
  }, _ctx.$attrs, {
    height: 600,
    onRegister: _ctx.registerModal,
    wrapClassName: "jeecg-online-modal",
    onOk: _ctx.handleSubmit
  }), {
    footer: withCtx(() => [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.cgButtonList, (btn) => {
        return openBlock(), createBlock(_component_a_button, {
          key: btn.id,
          type: "primary",
          onClick: ($event) => _ctx.handleCgButtonClick(btn.optType, btn.buttonCode),
          preIcon: btn.buttonIcon ? "ant-design:" + btn.buttonIcon : ""
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(btn.buttonName), 1)
          ]),
          _: 2
        }, 1032, ["onClick", "preIcon"]);
      }), 128)),
      !_ctx.disableSubmit ? (openBlock(), createBlock(_component_a_button, {
        key: "submit",
        type: "primary",
        onClick: _ctx.handleSubmit,
        loading: _ctx.submitLoading
      }, {
        default: withCtx(() => [
          createTextVNode("\u786E\u5B9A")
        ]),
        _: 1
      }, 8, ["onClick", "loading"])) : createCommentVNode("", true),
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
    comment: withCtx(() => [
      createVNode(_component_comment_panel, {
        ref: "commentPanelRef",
        tableName: _ctx.tableName,
        dataId: _ctx.formDataId
      }, null, 8, ["tableName", "dataId"])
    ]),
    default: withCtx(() => [
      createVNode(_component_online_form, {
        ref: "onlineFormCompRef",
        id: _ctx.id,
        disabled: _ctx.disableSubmit,
        "form-template": _ctx.formTemplate,
        isTree: _ctx.isTreeForm,
        pidField: _ctx.pidFieldName,
        onRendered: _ctx.renderSuccess,
        onSuccess: _ctx.handleSuccess
      }, null, 8, ["id", "disabled", "form-template", "isTree", "pidField", "onRendered", "onSuccess"])
    ]),
    _: 1
  }, 16, ["title", "onCancel", "enableComment", "width", "onRegister", "onOk"]);
}
var OnlineAutoModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineAutoModal as default };
