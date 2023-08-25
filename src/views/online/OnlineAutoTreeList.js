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
import { BasicTable, TableAction } from "/@/components/Table";
import { useMessage } from "/@/hooks/web/useMessage";
import OnlineAutoModal from "./OnlineAutoModal.js";
import OnlineDetailModal from "./OnlineDetailModal.js";
import OnlineCustomModal from "./OnlineCustomModal.js";
import { ref, watch, resolveComponent, openBlock, createElementBlock, createVNode, createBlock, normalizeClass, withCtx, createTextVNode, createCommentVNode, Fragment, renderList, toDisplayString, withDirectives, vShow, createElementVNode, mergeProps, toHandlers, resolveDynamicComponent, normalizeProps, guardReactiveProps } from "vue";
import JImportModal from "/@/components/Form/src/jeecg/components/JImportModal.vue";
import { u as useOnlineTableContext, a as useListButton } from "./useListButton.js";
import { d as useEnhance, o as useTableColumns, g as getRefPromise } from "./useExtendComponent.js";
import { defHttp } from "/@/utils/http/axios";
import OnlineQueryForm from "./OnlineQueryForm.js";
import OnlineSuperQuery from "./SuperQuery.js";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Modal";
import "./OnlineForm.js";
import "/@/components/Form/index";
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
import "/@/components/jeecg/comment/CommentPanel.vue";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "/@/utils/dict/JDictSelectUtil";
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
import "./OnlineFormDetail.js";
import "./DetailForm.js";
import "/@/utils/dict";
import "/@/utils/dict/index";
import "/@/api/common/api";
import "./OnlineSubFormDetail.js";
import "/@/router";
import "/@/hooks/core/onMountedOrActivated";
import "/@/hooks/system/useMethods";
import "./SuperQueryValComponent.vue_vue_type_script_lang.js";
import "/@/utils/is";
var OnlineAutoTreeList_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  name: "DefaultOnlineList",
  components: {
    BasicTable,
    TableAction,
    OnlineAutoModal,
    JImportModal,
    OnlineQueryForm,
    OnlineSuperQuery,
    OnlineCustomModal,
    OnlineDetailModal
  },
  setup() {
    const { createMessage: $message } = useMessage();
    const onlineTreeTableRef = ref();
    const {
      ID,
      onlineTableContext,
      onlineQueryFormOuter,
      loading,
      reload,
      dataSource,
      pagination,
      handleSpecialConfig,
      getColumnList,
      handleChangeInTable,
      loadData,
      superQueryButtonRef,
      superQueryStatus,
      handleSuperQuery,
      registerCustomModal,
      getTreeDataByResult,
      expandedRowKeys,
      handleExpandedRowsChange,
      tableReloading,
      onlineExtConfigJson,
      handleFormConfig
    } = useOnlineTableContext();
    if (!ID.value) {
      $message.warning("\u5730\u5740\u9519\u8BEF, \u914D\u7F6EID\u4E0D\u5B58\u5728!");
      return;
    }
    onlineTableContext.isTree(true);
    let { initCgEnhanceJs } = useEnhance(onlineTableContext);
    const {
      buttonSwitch,
      cgLinkButtonList,
      cgTopButtonList,
      importUrl,
      registerModal,
      handleAdd,
      handleEdit,
      handleBatchDelete,
      registerImportModal,
      onImportExcel,
      onExportExcel,
      cgButtonJsHandler,
      cgButtonActionHandler,
      cgButtonLinkHandler,
      handleSubmitFlow,
      getDropDownActions,
      getActions,
      initButtonList,
      initButtonSwitch,
      registerDetailModal
    } = useListButton(onlineTableContext, onlineExtConfigJson);
    const {
      columns,
      actionColumn,
      selectedKeys,
      rowSelection,
      enableScrollBar,
      tableScroll,
      downloadRowFile,
      getImgView,
      getPcaText,
      getFormatDate,
      handleColumnResult,
      hrefComponent,
      viewOnlineCellImage
    } = useTableColumns(onlineTableContext, onlineExtConfigJson);
    watch(
      ID,
      () => {
        initAutoList();
      },
      { immediate: true }
    );
    function initAutoList() {
      return __async(this, null, function* () {
        loading.value = true;
        let columnResult = yield getColumnList();
        handleTableConfig(columnResult);
        yield loadData();
        loading.value = false;
        onlineTableContext.execButtonEnhance("setup");
      });
    }
    function handleTableConfig(result) {
      let EnhanceJS = initCgEnhanceJs(result.enhanceJs);
      onlineTableContext["EnhanceJS"] = EnhanceJS;
      initButtonList(result.cgButtonList);
      initButtonSwitch(result.hideColumns);
      handleColumnResult(result);
      handleSpecialConfig(result);
      onlineTableContext["hasChildrenField"] = result.hasChildrenField;
      onlineTableContext["pidField"] = result.pidField;
    }
    function queryWithCondition(data, status) {
      onlineTableContext["queryParam"] = data;
      if (status === true) {
        reload();
      } else {
        searchReset();
      }
    }
    function onQueryFormLoaded(json) {
      return __async(this, null, function* () {
        yield getRefPromise(superQueryButtonRef);
        superQueryButtonRef.value.init(json);
      });
    }
    function handleExpand(expanded, record) {
      let expandedRowKeysValue = expandedRowKeys.value;
      if (expanded) {
        addExpandedRowKey(record.id);
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          let hasChildrenField = onlineTableContext.hasChildrenField;
          const { sortField, sortType } = onlineTableContext;
          let params = Object.assign({}, { column: sortField, order: sortType });
          params[onlineTableContext["pidField"]] = record.id;
          params[hasChildrenField] = record[hasChildrenField];
          let url = `${onlineTableContext.onlineUrl.getTreeData}${onlineTableContext.ID}`;
          defHttp.get({ url, params }, { isTransformResponse: false }).then((res) => {
            console.log("handleExpand", res.result);
            if (res.success) {
              if (Number(res.result.total) > 0) {
                record.children = getTreeDataByResult(res.result.records);
              } else {
                record.children = "";
                record.hasChildrenField = "0";
              }
            } else {
              $message.warning(res.message);
            }
          }).catch(() => {
            $message.warning("\u52A0\u8F7D\u5B50\u8282\u70B9\u5931\u8D25!");
          });
        }
      } else {
        let keyIndex = expandedRowKeysValue.indexOf(record.id);
        if (keyIndex >= 0) {
          expandedRowKeys.value = expandedRowKeysValue.splice(keyIndex, 1);
        }
      }
    }
    function addExpandedRowKey(key) {
      let arr = expandedRowKeys.value;
      if (arr && arr.indexOf(key) < 0) {
        arr.push(key);
      }
      expandedRowKeys.value = arr;
    }
    function searchReset() {
      return __async(this, null, function* () {
        if (onlineTableContext.isTree() === true) {
          expandedRowKeys.value = [];
          onlineTreeTableRef.value.collapseAll();
        }
        reload();
      });
    }
    function handlerFormSuccess(formData) {
      console.log("expandedRowKeys.value", expandedRowKeys.value);
      if (loadParent.value === true) {
        let pid = formData[onlineTableContext.pidField];
        if (pid) {
          let arr = expandedRowKeys.value;
          if (arr.indexOf(pid) < 0) {
            arr.push(pid);
          }
          expandedRowKeys.value = arr;
        }
      }
      reload();
    }
    const addChildButton = (record) => {
      return {
        label: "\u6DFB\u52A0\u4E0B\u7EA7",
        onClick: handleAddChild.bind(null, record)
      };
    };
    const loadParent = ref(false);
    function handleAddChild(record) {
      loadParent.value = true;
      let param = {
        [onlineTableContext.pidField]: record["id"]
      };
      handleAdd(param);
    }
    function getTreeDropDownActions(record) {
      let arr = getDropDownActions(record);
      arr.unshift(addChildButton(record));
      return arr;
    }
    const that = {
      ID,
      onlineQueryFormOuter,
      queryWithCondition,
      onQueryFormLoaded,
      reload,
      superQueryButtonRef,
      superQueryStatus,
      handleSuperQuery,
      loading,
      columns,
      actionColumn,
      dataSource,
      pagination,
      rowSelection,
      selectedKeys,
      tableScroll,
      enableScrollBar,
      handleChangeInTable,
      buttonSwitch,
      handleAdd,
      handleEdit,
      onImportExcel,
      onExportExcel,
      cgTopButtonList,
      cgLinkButtonList,
      cgButtonJsHandler,
      cgButtonActionHandler,
      cgButtonLinkHandler,
      handleBatchDelete,
      downloadRowFile,
      getImgView,
      getPcaText,
      getFormatDate,
      getActions,
      getTreeDropDownActions,
      registerModal,
      registerCustomModal,
      registerImportModal,
      importUrl,
      handleFormConfig,
      tableReloading,
      handleSubmitFlow,
      hrefComponent,
      viewOnlineCellImage,
      onlineTreeTableRef,
      handlerFormSuccess,
      searchReset,
      handleExpand,
      expandedRowKeys,
      handleExpandedRowsChange,
      registerDetailModal
    };
    return that;
  }
};
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = {
  key: 0,
  style: { "font-size": "12px", "font-style": "italic" }
};
const _hoisted_3 = {
  key: 0,
  style: { "font-size": "12px", "font-style": "italic" }
};
const _hoisted_4 = ["src", "onClick"];
const _hoisted_5 = ["innerHTML"];
const _hoisted_6 = ["title"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_online_query_form = resolveComponent("online-query-form");
  const _component_a_button = resolveComponent("a-button");
  const _component_online_super_query = resolveComponent("online-super-query");
  const _component_TableAction = resolveComponent("TableAction");
  const _component_BasicTable = resolveComponent("BasicTable");
  const _component_OnlineAutoModal = resolveComponent("OnlineAutoModal");
  const _component_JImportModal = resolveComponent("JImportModal");
  const _component_a_modal = resolveComponent("a-modal");
  const _component_online_custom_modal = resolveComponent("online-custom-modal");
  const _component_online_detail_modal = resolveComponent("online-detail-modal");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_online_query_form, {
      ref: "onlineQueryFormOuter",
      id: _ctx.ID,
      onSearch: _ctx.queryWithCondition,
      onLoaded: _ctx.onQueryFormLoaded
    }, null, 8, ["id", "onSearch", "onLoaded"]),
    !_ctx.tableReloading ? (openBlock(), createBlock(_component_BasicTable, {
      key: 0,
      ref: "onlineTreeTableRef",
      isTreeTable: true,
      expandedRowKeys: _ctx.expandedRowKeys,
      onExpandedRowsChange: _ctx.handleExpandedRowsChange,
      onExpand: _ctx.handleExpand,
      rowKey: "jeecg_row_key",
      canResize: true,
      bordered: true,
      showIndexColumn: false,
      loading: _ctx.loading,
      columns: _ctx.columns,
      dataSource: _ctx.dataSource,
      pagination: _ctx.pagination,
      rowSelection: _ctx.rowSelection,
      actionColumn: _ctx.actionColumn,
      showTableSetting: true,
      clickToRowSelect: false,
      scroll: _ctx.tableScroll,
      onTableRedo: _ctx.reload,
      class: normalizeClass({ "j-table-force-nowrap": _ctx.enableScrollBar }),
      onChange: _ctx.handleChangeInTable
    }, {
      tableTitle: withCtx(() => [
        _ctx.buttonSwitch.add ? (openBlock(), createBlock(_component_a_button, {
          key: 0,
          preIcon: "ant-design:plus-outlined",
          type: "primary",
          onClick: _ctx.handleAdd
        }, {
          default: withCtx(() => [
            createTextVNode("\u65B0\u589E")
          ]),
          _: 1
        }, 8, ["onClick"])) : createCommentVNode("", true),
        _ctx.buttonSwitch.import ? (openBlock(), createBlock(_component_a_button, {
          key: 1,
          preIcon: "ant-design:import-outlined",
          type: "primary",
          onClick: _ctx.onImportExcel
        }, {
          default: withCtx(() => [
            createTextVNode("\u5BFC\u5165")
          ]),
          _: 1
        }, 8, ["onClick"])) : createCommentVNode("", true),
        _ctx.buttonSwitch.export ? (openBlock(), createBlock(_component_a_button, {
          key: 2,
          preIcon: "ant-design:export-outlined",
          type: "primary",
          onClick: _ctx.onExportExcel
        }, {
          default: withCtx(() => [
            createTextVNode(" \u5BFC\u51FA")
          ]),
          _: 1
        }, 8, ["onClick"])) : createCommentVNode("", true),
        _ctx.cgTopButtonList && _ctx.cgTopButtonList.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 3 }, renderList(_ctx.cgTopButtonList, (item, index) => {
          return openBlock(), createElementBlock(Fragment, null, [
            item.optType == "js" ? (openBlock(), createBlock(_component_a_button, {
              key: "cgbtn" + index,
              onClick: ($event) => _ctx.cgButtonJsHandler(item.buttonCode),
              type: "primary",
              preIcon: item.buttonIcon ? "ant-design:" + item.buttonIcon : ""
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(item.buttonName), 1)
              ]),
              _: 2
            }, 1032, ["onClick", "preIcon"])) : item.optType == "action" ? (openBlock(), createBlock(_component_a_button, {
              key: "cgbtn" + index,
              onClick: ($event) => _ctx.cgButtonActionHandler(item.buttonCode),
              type: "primary",
              preIcon: item.buttonIcon ? "ant-design:" + item.buttonIcon : ""
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(item.buttonName), 1)
              ]),
              _: 2
            }, 1032, ["onClick", "preIcon"])) : createCommentVNode("", true)
          ], 64);
        }), 256)) : createCommentVNode("", true),
        _ctx.buttonSwitch.batch_delete ? withDirectives((openBlock(), createBlock(_component_a_button, {
          key: 4,
          preIcon: "ant-design:delete-outlined",
          onClick: _ctx.handleBatchDelete
        }, {
          default: withCtx(() => [
            createTextVNode(" \u6279\u91CF\u5220\u9664")
          ]),
          _: 1
        }, 8, ["onClick"])), [
          [vShow, _ctx.selectedKeys.length > 0]
        ]) : createCommentVNode("", true),
        _ctx.buttonSwitch.super_query ? (openBlock(), createBlock(_component_online_super_query, {
          key: 5,
          ref: "superQueryButtonRef",
          online: "",
          status: _ctx.superQueryStatus,
          onSearch: _ctx.handleSuperQuery
        }, null, 8, ["status", "onSearch"])) : createCommentVNode("", true)
      ]),
      fileSlot: withCtx(({ text }) => [
        !text ? (openBlock(), createElementBlock("span", _hoisted_2, "\u65E0\u6587\u4EF6")) : (openBlock(), createBlock(_component_a_button, {
          key: 1,
          ghost: true,
          type: "primary",
          preIcon: "ant-design:download",
          size: "small",
          onClick: ($event) => _ctx.downloadRowFile(text)
        }, {
          default: withCtx(() => [
            createTextVNode(" \u4E0B\u8F7D ")
          ]),
          _: 2
        }, 1032, ["onClick"]))
      ]),
      imgSlot: withCtx(({ text }) => [
        !text ? (openBlock(), createElementBlock("span", _hoisted_3, "\u65E0\u56FE\u7247")) : (openBlock(), createElementBlock("img", {
          key: 1,
          src: _ctx.getImgView(text),
          alt: "\u56FE\u7247\u4E0D\u5B58\u5728",
          class: "online-cell-image",
          onClick: ($event) => _ctx.viewOnlineCellImage(text)
        }, null, 8, _hoisted_4))
      ]),
      htmlSlot: withCtx(({ text }) => [
        createElementVNode("div", { innerHTML: text }, null, 8, _hoisted_5)
      ]),
      pcaSlot: withCtx(({ text }) => [
        createElementVNode("div", {
          title: _ctx.getPcaText(text)
        }, toDisplayString(_ctx.getPcaText(text)), 9, _hoisted_6)
      ]),
      dateSlot: withCtx(({ text }) => [
        createElementVNode("span", null, toDisplayString(_ctx.getFormatDate(text)), 1)
      ]),
      action: withCtx(({ record }) => [
        createVNode(_component_TableAction, {
          actions: _ctx.getActions(record),
          dropDownActions: _ctx.getTreeDropDownActions(record)
        }, null, 8, ["actions", "dropDownActions"])
      ]),
      _: 1
    }, 8, ["expandedRowKeys", "onExpandedRowsChange", "onExpand", "loading", "columns", "dataSource", "pagination", "rowSelection", "actionColumn", "scroll", "onTableRedo", "class", "onChange"])) : createCommentVNode("", true),
    createVNode(_component_OnlineAutoModal, {
      id: _ctx.ID,
      onRegister: _ctx.registerModal,
      onSuccess: _ctx.handlerFormSuccess,
      onFormConfig: _ctx.handleFormConfig
    }, null, 8, ["id", "onRegister", "onSuccess", "onFormConfig"]),
    createVNode(_component_JImportModal, {
      onRegister: _ctx.registerImportModal,
      url: _ctx.importUrl(),
      onOk: _ctx.reload,
      online: ""
    }, null, 8, ["onRegister", "url", "onOk"]),
    createVNode(_component_a_modal, mergeProps(_ctx.hrefComponent.model, toHandlers(_ctx.hrefComponent.on)), {
      default: withCtx(() => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.hrefComponent.is), normalizeProps(guardReactiveProps(_ctx.hrefComponent.params)), null, 16))
      ]),
      _: 1
    }, 16),
    createVNode(_component_online_custom_modal, {
      onRegister: _ctx.registerCustomModal,
      onSuccess: _ctx.reload
    }, null, 8, ["onRegister", "onSuccess"]),
    createVNode(_component_online_detail_modal, {
      id: _ctx.ID,
      onRegister: _ctx.registerDetailModal
    }, null, 8, ["id", "onRegister"])
  ]);
}
var OnlineAutoTreeList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineAutoTreeList as default };
