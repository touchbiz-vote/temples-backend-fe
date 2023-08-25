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
import { defineComponent, ref, watch, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, createTextVNode } from "vue";
import { BasicModal } from "/@/components/Modal";
import OnlineFormDetail from "./OnlineFormDetail.js";
import { p as useAutoModal } from "./useExtendComponent.js";
import CommentPanel from "/@/components/jeecg/comment/CommentPanel.vue";
import { _ as _export_sfc } from "./index.js";
import "/@/hooks/web/useMessage";
import "/@/components/Loading";
import "/@/utils/auth";
import "/@/utils";
import "@ant-design/icons-vue";
import "./DetailForm.js";
import "/@/utils/propTypes";
import "/@/utils/dict";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/dict/index";
import "/@/api/common/api";
import "/@/utils/http/axios";
import "/@/components/Form/src/utils/Area";
import "/@/utils/common/compUtils";
import "/@/components/Preview/index";
import "/@/components/Form/src/componentMap";
import "/@/components/Form/index";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "vue-router";
import "./LinkTableListPiece.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "./OnlineSelectCascade.js";
import "./JModalTip.js";
import "ant-design-vue";
import "@vueuse/core";
import "./OnlineSubFormDetail.js";
const _sfc_main = defineComponent({
  name: "OnlineDetailModal",
  props: {
    id: {
      type: String,
      required: false,
      default: ""
    }
  },
  components: {
    BasicModal,
    OnlineFormDetail,
    CommentPanel
  },
  emits: ["success", "register"],
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
      showSub,
      tableName,
      formDataId,
      enableComment
    } = useAutoModal(false, { emit }, reloadComment);
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
      handleCancel,
      modalWidth,
      formTemplate,
      disableSubmit,
      cgButtonList,
      handleCgButtonClick,
      isTreeForm,
      pidFieldName,
      submitLoading,
      showSub,
      tableName,
      formDataId,
      enableComment,
      commentPanelRef
    };
    return that;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent("a-button");
  const _component_online_form_detail = resolveComponent("online-form-detail");
  const _component_comment_panel = resolveComponent("comment-panel");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, mergeProps({
    title: _ctx.title,
    width: _ctx.modalWidth,
    height: 600,
    enableComment: _ctx.enableComment,
    defaultFullscreen: false
  }, _ctx.$attrs, {
    onRegister: _ctx.registerModal,
    wrapClassName: "jeecg-online-detail-modal"
  }), {
    footer: withCtx(() => [
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
      createVNode(_component_online_form_detail, {
        ref: "onlineFormCompRef",
        id: _ctx.id,
        "form-template": _ctx.formTemplate,
        "show-sub": _ctx.showSub,
        onRendered: _ctx.renderSuccess
      }, null, 8, ["id", "form-template", "show-sub", "onRendered"])
    ]),
    _: 1
  }, 16, ["title", "width", "enableComment", "onRegister"]);
}
var OnlineDetailModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineDetailModal as default };
