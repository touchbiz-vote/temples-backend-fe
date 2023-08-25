var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
import { useMessage } from "/@/hooks/web/useMessage";
import { ref, reactive, resolveComponent, openBlock, createElementBlock, createVNode, createCommentVNode, createBlock, withCtx, Fragment, renderList, normalizeStyle, renderSlot } from "vue";
import { Loading } from "/@/components/Loading";
import { getToken } from "/@/utils/auth";
import { goJmReportViewPage } from "/@/utils";
import { PrinterOutlined } from "@ant-design/icons-vue";
import DetailForm from "./DetailForm.js";
import OnlineSubFormDetail from "./OnlineSubFormDetail.js";
import { h as getDetailFormSchemas } from "./useExtendComponent.js";
import { defHttp } from "/@/utils/http/axios";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/propTypes";
import "/@/utils/dict";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/dict/index";
import "/@/api/common/api";
import "/@/components/Form/src/utils/Area";
import "/@/utils/common/compUtils";
import "/@/components/Preview/index";
import "/@/components/Form/index";
import "/@/components/Form/src/componentMap";
import "/@/components/Modal";
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
const _sfc_main = {
  name: "OnlineFormDetail",
  components: {
    DetailForm,
    Loading,
    PrinterOutlined,
    OnlineSubFormDetail
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    formTemplate: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    pidField: {
      type: String,
      default: ""
    },
    submitTip: {
      type: Boolean,
      default: true
    },
    showSub: {
      type: Boolean,
      default: true
    }
  },
  emits: ["success", "rendered"],
  setup(props, { emit }) {
    console.log("onlineForm-setup\u300B\u300B");
    const { createMessage: $message } = useMessage();
    const tableName = ref("");
    const single = ref(true);
    const loading = ref(false);
    const tableType = ref(1);
    const formData = ref({});
    const subFormHeight = ref(300);
    const subTableHeight = ref(340);
    const onlineExtConfigJson = reactive({
      reportPrintShow: 0,
      reportPrintUrl: "",
      joinQuery: 0,
      modelFullscreen: 0,
      modalMinWidth: ""
    });
    const { detailFormSchemas, hasSubTable, subTabInfo, refMap, showStatus, subDataSource, createFormSchemas, formSpan } = getDetailFormSchemas(props);
    function handleExtConfigJson(jsonStr) {
      let extConfigJson = { reportPrintShow: 0, reportPrintUrl: "", joinQuery: 0, modelFullscreen: 1, modalMinWidth: "" };
      if (jsonStr) {
        extConfigJson = JSON.parse(jsonStr);
      }
      Object.keys(extConfigJson).map((k) => {
        onlineExtConfigJson[k] = extConfigJson[k];
      });
    }
    function createRootProperties(data) {
      return __async(this, null, function* () {
        tableType.value = data.head.tableType;
        tableName.value = data.head.tableName;
        single.value = data.head.tableType == 1;
        handleExtConfigJson(data.head.extConfigJson);
        createFormSchemas(data.schema.properties);
        emit("rendered", onlineExtConfigJson);
      });
    }
    function show(_status, record) {
      return __async(this, null, function* () {
        console.log("\u8FDB\u5165\u8868\u5355\u8BE6\u60C5\u300B\u300Bform", record);
        yield edit(record);
        changeShowStatus(true);
      });
    }
    function getFormData(dataId) {
      let url = `/online/cgform/api/detail/${props.id}/${dataId}`;
      return new Promise((resolve, reject) => {
        defHttp.get({ url }, { isTransformResponse: false }).then((res) => {
          if (res.success) {
            resolve(res.result);
          } else {
            reject();
            $message.warning(res.message);
          }
        }).catch(() => {
          reject();
        });
      });
    }
    function changeShowStatus(flag) {
      Object.keys(showStatus).map((k) => {
        showStatus[k] = flag;
      });
    }
    function onTabChange() {
      changeShowStatus(false);
      setTimeout(() => {
        changeShowStatus(true);
      }, 300);
    }
    function edit(record) {
      return __async(this, null, function* () {
        let temp = yield getFormData(record.id);
        formData.value = __spreadValues({}, temp);
        editSubVxeTableData(temp);
      });
    }
    function editSubVxeTableData(record) {
      if (!record) {
        record = {};
      }
      let keys = Object.keys(subDataSource.value);
      if (keys && keys.length > 0) {
        let obj = {};
        for (let key of keys) {
          obj[key] = record[key] || [];
        }
        subDataSource.value = obj;
      }
    }
    function getSubTableAuthPre(table) {
      return "online_" + table + ":";
    }
    function onOpenReportPrint() {
      let url = onlineExtConfigJson.reportPrintUrl;
      let temp = formData.value;
      if (temp) {
        let id = temp.id;
        let token = getToken();
        goJmReportViewPage(url, id, token);
      }
    }
    function getSubTableForeignKeyValue(key) {
      let temp = formData.value;
      console.log("getValueIgnoreCase(temp, key)", temp, key, getValueIgnoreCase(temp, key));
      return getValueIgnoreCase(temp, key);
    }
    function getValueIgnoreCase(data, key) {
      if (data) {
        let temp = data[key];
        if (!temp && temp !== 0) {
          temp = data[key.toLowerCase()];
          if (!temp && temp !== 0) {
            temp = data[key.toUpperCase()];
          }
        }
        return temp;
      }
      return "";
    }
    return {
      detailFormSchemas,
      formData,
      formSpan,
      tableName,
      loading,
      hasSubTable,
      subTabInfo,
      subFormHeight,
      subTableHeight,
      refMap,
      onTabChange,
      subDataSource,
      getSubTableAuthPre,
      show,
      createRootProperties,
      onOpenReportPrint,
      onlineExtConfigJson,
      getSubTableForeignKeyValue,
      showStatus
    };
  }
};
const _hoisted_1 = ["id"];
const _hoisted_2 = {
  key: 0,
  style: { "text-align": "right", "position": "absolute", "top": "15px", "right": "20px", "z-index": "999" }
};
const _hoisted_3 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PrinterOutlined = resolveComponent("PrinterOutlined");
  const _component_detail_form = resolveComponent("detail-form");
  const _component_online_sub_form_detail = resolveComponent("online-sub-form-detail");
  const _component_JVxeTable = resolveComponent("JVxeTable");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_a_tab_pane = resolveComponent("a-tab-pane");
  const _component_a_tabs = resolveComponent("a-tabs");
  const _component_Loading = resolveComponent("Loading");
  return openBlock(), createElementBlock("div", {
    id: $setup.tableName + "_form"
  }, [
    !!$setup.formData.id && !!$setup.onlineExtConfigJson.reportPrintShow ? (openBlock(), createElementBlock("div", _hoisted_2, [
      createVNode(_component_PrinterOutlined, {
        title: "\u6253\u5370",
        onClick: $setup.onOpenReportPrint,
        style: { "font-size": "16px" }
      }, null, 8, ["onClick"])
    ])) : createCommentVNode("", true),
    createVNode(_component_detail_form, {
      schemas: $setup.detailFormSchemas,
      data: $setup.formData,
      span: $setup.formSpan
    }, null, 8, ["schemas", "data", "span"]),
    $setup.hasSubTable && $props.showSub ? (openBlock(), createBlock(_component_a_tabs, {
      key: 1,
      onChange: $setup.onTabChange
    }, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.subTabInfo, (sub, index) => {
          return openBlock(), createBlock(_component_a_tab_pane, {
            tab: sub.describe,
            key: index + "",
            forceRender: true
          }, {
            default: withCtx(() => [
              sub.relationType == 1 ? (openBlock(), createElementBlock("div", {
                key: 0,
                style: normalizeStyle({ "overflow-y": "auto", "overflow-x": "hidden", "max-height": $setup.subFormHeight + "px" })
              }, [
                createVNode(_component_online_sub_form_detail, {
                  table: sub.key,
                  "form-template": $props.formTemplate,
                  "main-id": $setup.getSubTableForeignKeyValue(sub.foreignKey),
                  properties: sub.properties
                }, null, 8, ["table", "form-template", "main-id", "properties"])
              ], 4)) : (openBlock(), createElementBlock("div", _hoisted_3, [
                $setup.showStatus[sub.key] ? (openBlock(), createBlock(_component_JVxeTable, {
                  key: 0,
                  ref_for: true,
                  ref: $setup.refMap[sub.key],
                  toolbar: "",
                  "keep-source": "",
                  "row-number": "",
                  "row-selection": "",
                  height: $setup.subTableHeight,
                  disabled: true,
                  columns: sub.columns,
                  dataSource: $setup.subDataSource[sub.key],
                  authPre: $setup.getSubTableAuthPre(sub.key)
                }, null, 8, ["height", "columns", "dataSource", "authPre"])) : (openBlock(), createBlock(_component_a_spin, {
                  key: 1,
                  spinning: true
                }))
              ]))
            ]),
            _: 2
          }, 1032, ["tab"]);
        }), 128))
      ]),
      _: 1
    }, 8, ["onChange"])) : createCommentVNode("", true),
    createVNode(_component_Loading, {
      loading: $setup.loading,
      absolute: false
    }, null, 8, ["loading"]),
    renderSlot(_ctx.$slots, "bottom")
  ], 8, _hoisted_1);
}
var OnlineFormDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineFormDetail as default };
