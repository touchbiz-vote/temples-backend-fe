import { defineComponent, provide, watch, resolveComponent, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, createVNode, withCtx, createTextVNode, createCommentVNode } from "vue";
import { BasicTable, TableAction } from "/@/components/Table";
import { C as CgformModal } from "./CgformModal.js";
import DbToOnlineModal from "./DbToOnlineModal.js";
import CustomButtonList from "./CustomButtonList.js";
import EnhanceJsModal from "./EnhanceJsModal.js";
import EnhanceJavaModal from "./EnhanceJavaModal.js";
import EnhanceSqlModal from "./EnhanceSqlModal.js";
import AuthManagerDrawer from "./AuthManagerDrawer.js";
import AuthSetterModal from "./AuthSetterModal.js";
import { C as CgformPageType, u as useCgformList } from "./useCgformList.js";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Icon";
import "/@/components/Modal";
import "/@/components/Form/index";
import "/@/hooks/web/useMessage";
import "./useSchemas.js";
import "ant-design-vue";
import "@ant-design/icons-vue";
import "/@/utils/common/compUtils";
import "/@/hooks/web/usePermission";
import "/@/utils/helper/validator";
import "./DBAttributeTable.js";
import "/@/components/jeecg/JVxeTable/types";
import "./useTableSync.js";
import "./cgform.data.js";
import "/@/utils/dict";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/uuid";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "./PageAttributeTable.js";
import "./LinkTableConfigModal.js";
import "/@/utils/http/axios";
import "./omit.js";
import "./_baseClone.js";
import "./_baseSlice.js";
import "./LinkTableFieldConfigModal.js";
import "./FieldExtendJsonModal.js";
import "./CheckDictTable.js";
import "/@/components/jeecg/JPrompt";
import "/@/hooks/web/useDesign";
import "./ForeignKeyTable.js";
import "./IndexTable.js";
import "./QueryTable.js";
import "./ExtendConfigModal.js";
import "/@/components/Form";
import "./useOnlineTest.js";
import "/@/utils";
import "./useExtendComponent.js";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
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
import "@vueuse/core";
import "./EnhanceJsHistory.js";
import "/@/utils/dateUtil";
import "/@/store";
import "pinia";
import "/@/utils/cache";
import "./enhance.api.js";
import "/@/utils/is";
import "./enhance.data.js";
import "/@/components/Drawer";
import "./AuthFieldConfig.js";
import "./auth.api.js";
import "./auth.data.js";
import "./AuthButtonConfig.js";
import "./AuthDataConfig.js";
import "./LeftRole.js";
import "./LeftDepart.js";
import "/@/api/common/api";
import "./LeftUser.js";
import "./AuthFieldTree.js";
import "./AuthButtonTree.js";
import "./AuthDataTree.js";
import "./clipboard.js";
const _sfc_main = defineComponent({
  name: "CgformCopyList",
  components: {
    BasicTable,
    TableAction,
    CgformModal,
    DbToOnlineModal,
    CustomButtonList,
    EnhanceJsModal,
    EnhanceJavaModal,
    EnhanceSqlModal,
    AuthManagerDrawer,
    AuthSetterModal
  },
  setup() {
    const pageType = CgformPageType.copy;
    provide("cgformPageType", pageType);
    const {
      router,
      pageContext,
      getTableAction,
      getDropDownAction,
      onShowCustomButton,
      onShowEnhanceJs,
      onShowEnhanceSql,
      onShowEnhanceJava,
      registerCustomButtonModal,
      registerEnhanceJsModal,
      registerEnhanceSqlModal,
      registerEnhanceJavaModal,
      registerAuthManagerDrawer,
      registerAuthSetterModal,
      registerCgformModal,
      registerDbToOnlineModal
    } = useCgformList({
      pageType,
      designScope: "online-cgform-list",
      columns: [
        { title: "\u89C6\u56FE\u8868\u540D", dataIndex: "tableName" },
        { title: "\u89C6\u56FE\u8868\u63CF\u8FF0", dataIndex: "tableTxt" },
        { title: "\u539F\u8868\u7248\u672C", dataIndex: "copyVersion" },
        { title: "\u89C6\u56FE\u7248\u672C", dataIndex: "tableVersion" }
      ],
      formSchemas: [{ label: "\u8868\u540D", field: "tableName", component: "JInput" }]
    });
    const { prefixCls, tableContext } = pageContext;
    const [registerTable, { reload }, { rowSelection }] = tableContext;
    watch(router.currentRoute, () => reload());
    return {
      prefixCls,
      reload,
      rowSelection,
      getTableAction,
      getDropDownAction,
      onShowCustomButton,
      onShowEnhanceJs,
      onShowEnhanceSql,
      onShowEnhanceJava,
      registerCustomButtonModal,
      registerEnhanceJsModal,
      registerEnhanceSqlModal,
      registerEnhanceJavaModal,
      registerAuthManagerDrawer,
      registerAuthSetterModal,
      registerTable,
      registerCgformModal,
      registerDbToOnlineModal
    };
  }
});
const _hoisted_1 = {
  key: 0,
  style: { "color": "limegreen" }
};
const _hoisted_2 = {
  key: 1,
  style: { "color": "red" }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent("a-button");
  const _component_TableAction = resolveComponent("TableAction");
  const _component_BasicTable = resolveComponent("BasicTable");
  const _component_CgformModal = resolveComponent("CgformModal");
  const _component_EnhanceJsModal = resolveComponent("EnhanceJsModal");
  const _component_EnhanceJavaModal = resolveComponent("EnhanceJavaModal");
  const _component_EnhanceSqlModal = resolveComponent("EnhanceSqlModal");
  const _component_DbToOnlineModal = resolveComponent("DbToOnlineModal");
  const _component_CustomButtonList = resolveComponent("CustomButtonList");
  const _component_AuthManagerDrawer = resolveComponent("AuthManagerDrawer");
  const _component_AuthSetterModal = resolveComponent("AuthSetterModal");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.prefixCls)
    }, [
      createVNode(_component_BasicTable, {
        onRegister: _ctx.registerTable,
        rowSelection: _ctx.rowSelection
      }, {
        tableTitle: withCtx(() => [
          createVNode(_component_a_button, {
            onClick: _ctx.onShowCustomButton,
            type: "primary",
            preIcon: "ant-design:highlight"
          }, {
            default: withCtx(() => [
              createTextVNode("\u81EA\u5B9A\u4E49\u6309\u94AE")
            ]),
            _: 1
          }, 8, ["onClick"]),
          createVNode(_component_a_button, {
            onClick: _ctx.onShowEnhanceJs,
            type: "primary",
            preIcon: "ant-design:strikethrough"
          }, {
            default: withCtx(() => [
              createTextVNode("JS\u589E\u5F3A")
            ]),
            _: 1
          }, 8, ["onClick"]),
          createVNode(_component_a_button, {
            onClick: _ctx.onShowEnhanceSql,
            type: "primary",
            preIcon: "ant-design:filter"
          }, {
            default: withCtx(() => [
              createTextVNode("SQL\u589E\u5F3A")
            ]),
            _: 1
          }, 8, ["onClick"]),
          createVNode(_component_a_button, {
            onClick: _ctx.onShowEnhanceJava,
            type: "primary",
            preIcon: "ant-design:tool"
          }, {
            default: withCtx(() => [
              createTextVNode("Java\u589E\u5F3A")
            ]),
            _: 1
          }, 8, ["onClick"])
        ]),
        dbSync: withCtx(({ text }) => [
          text === "Y" ? (openBlock(), createElementBlock("span", _hoisted_1, "\u5DF2\u540C\u6B65")) : createCommentVNode("", true),
          text === "N" ? (openBlock(), createElementBlock("span", _hoisted_2, "\u672A\u540C\u6B65")) : createCommentVNode("", true)
        ]),
        action: withCtx(({ record }) => [
          createVNode(_component_TableAction, {
            actions: _ctx.getTableAction(record),
            dropDownActions: _ctx.getDropDownAction(record)
          }, null, 8, ["actions", "dropDownActions"])
        ]),
        _: 1
      }, 8, ["onRegister", "rowSelection"])
    ], 2),
    createVNode(_component_CgformModal, {
      onRegister: _ctx.registerCgformModal,
      actionButton: false,
      onSuccess: _ctx.reload
    }, null, 8, ["onRegister", "onSuccess"]),
    createVNode(_component_EnhanceJsModal, { onRegister: _ctx.registerEnhanceJsModal }, null, 8, ["onRegister"]),
    createVNode(_component_EnhanceJavaModal, { onRegister: _ctx.registerEnhanceJavaModal }, null, 8, ["onRegister"]),
    createVNode(_component_EnhanceSqlModal, { onRegister: _ctx.registerEnhanceSqlModal }, null, 8, ["onRegister"]),
    createVNode(_component_DbToOnlineModal, {
      onRegister: _ctx.registerDbToOnlineModal,
      onSuccess: _ctx.reload
    }, null, 8, ["onRegister", "onSuccess"]),
    createVNode(_component_CustomButtonList, { onRegister: _ctx.registerCustomButtonModal }, null, 8, ["onRegister"]),
    createVNode(_component_AuthManagerDrawer, { onRegister: _ctx.registerAuthManagerDrawer }, null, 8, ["onRegister"]),
    createVNode(_component_AuthSetterModal, { onRegister: _ctx.registerAuthSetterModal }, null, 8, ["onRegister"])
  ], 64);
}
var CgformCopyList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CgformCopyList as default };
