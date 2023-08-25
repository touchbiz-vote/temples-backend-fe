var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { ref, reactive, watch, toRaw, resolveComponent, openBlock, createElementBlock, Fragment, createElementVNode, createBlock, withCtx, createVNode, createTextVNode, Teleport, createCommentVNode, normalizeClass, withDirectives, vShow, renderList, toDisplayString, pushScopeId, popScopeId } from "vue";
import { useModalInner, BasicModal, useModal } from "/@/components/Modal";
import { randomString } from "/@/utils/common/compUtils";
import { useMessage } from "/@/hooks/web/useMessage";
import { Modal, Divider, Empty } from "ant-design-vue";
import { createLocalStorage } from "/@/utils/cache";
import { useRoute } from "vue-router";
import { u as useExtendComponent, F as FormSchemaFactory } from "./useExtendComponent.js";
import { _ as _sfc_main$1 } from "./SuperQueryValComponent.vue_vue_type_script_lang.js";
import { MinusCircleOutlined, PlusOutlined, FileTextOutlined, CloseCircleOutlined, AppstoreTwoTone } from "@ant-design/icons-vue";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "/@/components/Form/index";
import "/@/utils/http/axios";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "/@/utils/dict/JDictSelectUtil";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "/@/components/Form/src/utils/Area";
import "/@/components/Preview/index";
import "./LinkTableListPiece.js";
import "./OnlineSelectCascade.js";
import "/@/components/Loading";
import "/@/utils/auth";
import "./JModalTip.js";
import "@vueuse/core";
import "/@/utils/is";
import "./_baseSlice.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
const FORM_VIEW_TO_QUERY_VIEW = {
  "password": "text",
  "file": "text",
  "image": "text",
  "textarea": "text",
  "umeditor": "text",
  "markdown": "text",
  "checkbox": "list_multi",
  "radio": "list"
};
const SAVE_CODE_PRE = "JSuperQuerySaved_";
function useSuperQuery() {
  const { linkTableCard2Select } = useExtendComponent();
  const { createMessage: $message } = useMessage();
  const formRef = ref();
  const dynamicRowValues = reactive({
    values: []
  });
  const matchType = ref("and");
  const [registerModal, { setModalProps }] = useModalInner(() => {
    setModalProps({ confirmLoading: false });
  });
  const view2QueryViewMap = Object.assign({}, { "link_down": "text" }, FORM_VIEW_TO_QUERY_VIEW);
  function handleSubmit() {
    console.log("handleSubmit", dynamicRowValues.values);
  }
  function handleCancel() {
  }
  function setFormModel(key, value, item) {
    console.log("setFormModel", key, value);
    item["val"] = value;
  }
  const fieldProperties = ref({});
  const fieldTreeData = ref([]);
  function init(json) {
    console.log("=============");
    console.log("=============", json);
    console.log("=============");
    let { allFields, treeData } = getAllFields(json);
    fieldProperties.value = allFields;
    fieldTreeData.value = treeData;
  }
  function addOne(index) {
    let item = {
      field: void 0,
      rule: "eq",
      val: "",
      key: randomString(16)
    };
    if (index === false) {
      dynamicRowValues.values = [];
      dynamicRowValues.values.push(item);
    } else if (index === true) {
      if (dynamicRowValues.values.length == 0) {
        dynamicRowValues.values.push(item);
      }
    } else {
      dynamicRowValues.values.splice(++index, 0, item);
    }
  }
  function removeOne(item) {
    let arr = toRaw(dynamicRowValues.values);
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (item.key == arr[i].key) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      dynamicRowValues.values.splice(index, 1);
    }
  }
  const defaultInput = {
    field: "val",
    label: "\u6D4B\u8BD5",
    component: "Input"
  };
  function getSchema(item, index) {
    let map = fieldProperties.value;
    let prop = map[item.field];
    if (!prop) {
      return defaultInput;
    }
    if (view2QueryViewMap[prop.view]) {
      prop.view = view2QueryViewMap[prop.view];
    }
    let temp = FormSchemaFactory.createFormSchema(item.field, prop);
    temp.noChange();
    temp.asSearchForm();
    temp.updateField(item.field + index);
    const setFieldValue = (values) => {
      item["val"] = values[item.field];
    };
    temp.setFunctionForFieldValue(setFieldValue);
    let schema = temp.getFormItemSchema();
    if (["empty", "not_empty"].includes(item.rule)) {
      schema.componentProps = __spreadProps(__spreadValues({}, schema.componentProps), { disabled: true });
    }
    linkTableCard2Select(schema);
    return schema;
  }
  const saveTreeData = ref("");
  const $ls = createLocalStorage();
  const saveInfo = reactive({
    visible: false,
    title: "",
    content: "",
    saveCode: ""
  });
  const loading = ref(false);
  const route = useRoute();
  watch(() => route.fullPath, (val) => {
    console.log("fullpath", val);
    initSaveQueryInfoCode();
  });
  const currentPageSavedArray = ref([]);
  watch(() => currentPageSavedArray.value, (val) => {
    let temp = [];
    if (val && val.length > 0) {
      val.map((item) => {
        let key = randomString(16);
        temp.push({
          title: item.title,
          slots: { icon: "custom" },
          value: key
        });
      });
    }
    saveTreeData.value = temp;
  }, { immediate: true, deep: true });
  function initSaveQueryInfoCode() {
    let code = SAVE_CODE_PRE + route.fullPath;
    saveInfo.saveCode = code;
    let list = $ls.get(code);
    if (list && list instanceof Array) {
      currentPageSavedArray.value = list;
    }
  }
  initSaveQueryInfoCode();
  function handleSave() {
    let fieldArray = getQueryInfo();
    if (!fieldArray) {
      $message.warning("\u7A7A\u6761\u4EF6\u4E0D\u80FD\u4FDD\u5B58");
      return;
    }
    let content = JSON.stringify(fieldArray);
    openSaveInfoModal(content);
  }
  function openSaveInfoModal(content) {
    saveInfo.visible = true;
    saveInfo.title = "";
    saveInfo.content = content;
  }
  function doSaveQueryInfo() {
    let { title, content, saveCode } = saveInfo;
    let index = getTitleIndex(title);
    if (index >= 0) {
      Modal.confirm({
        title: "\u63D0\u793A",
        content: `${title} \u5DF2\u5B58\u5728\uFF0C\u662F\u5426\u8986\u76D6\uFF1F`,
        okText: "\u786E\u8BA4",
        cancelText: "\u53D6\u6D88",
        onOk: () => {
          currentPageSavedArray.value.splice(index, 1, {
            content,
            title,
            type: matchType.value
          });
          $ls.set(saveCode, currentPageSavedArray.value);
          saveInfo.visible = false;
          $message.success("\u4FDD\u5B58\u6210\u529F");
        }
      });
    } else {
      currentPageSavedArray.value.push({
        content,
        title,
        type: matchType.value
      });
      $ls.set(saveCode, currentPageSavedArray.value);
      saveInfo.visible = false;
      $message.success("\u4FDD\u5B58\u6210\u529F");
    }
  }
  function getTitleIndex(title) {
    let savedArray = currentPageSavedArray.value;
    let index = -1;
    for (let i = 0; i < savedArray.length; i++) {
      if (savedArray[i].title == title) {
        index = i;
        break;
      }
    }
    return index;
  }
  function getQueryInfo(isEmit = false) {
    var _a;
    let arr = dynamicRowValues.values;
    if (!arr || arr.length == 0) {
      return false;
    }
    let fieldArray = [];
    let fieldProps = fieldProperties.value;
    for (let item of arr) {
      let allowEmpty = ["empty", "not_empty"].includes(item.rule);
      if (item.field && (allowEmpty || item.val || item.val === 0) && item.rule) {
        let prop = fieldProps[item.field];
        let formatValue = (_a = prop == null ? void 0 : prop.formatValue) != null ? _a : (v) => v;
        let tempVal = toRaw(item.val);
        if (tempVal instanceof Array) {
          tempVal = tempVal.map((v) => formatValue(v)).join(",");
        } else {
          tempVal = formatValue(tempVal);
        }
        let fieldName = getRealFieldName(item);
        let obj = {
          field: fieldName,
          rule: item.rule,
          val: tempVal
        };
        if (isEmit === true) {
          let prop2 = fieldProps[item.field];
          if (prop2) {
            obj["type"] = prop2.view;
            obj["dbType"] = prop2.type;
          }
        }
        fieldArray.push(obj);
      }
    }
    if (fieldArray.length == 0) {
      return false;
    }
    return fieldArray;
  }
  function getRealFieldName(item) {
    let fieldName = item.field;
    if (fieldName.indexOf("@") > 0) {
      fieldName = fieldName.replace("@", ",");
    }
    return fieldName;
  }
  function handleTreeSelect(key, { node }) {
    console.log(key, node);
    let title = node.dataRef.title;
    let arr = currentPageSavedArray.value.filter((item) => item.title == title);
    if (arr && arr.length > 0) {
      let { content, type } = arr[0];
      let data = JSON.parse(content);
      let rowsValues = [];
      for (let item of data) {
        rowsValues.push(Object.assign({}, { key: randomString(16) }, item));
      }
      dynamicRowValues.values = rowsValues;
      matchType.value = type;
    }
  }
  function handleRemoveSaveInfo(title) {
    console.log(title);
    let index = getTitleIndex(title);
    if (index >= 0) {
      currentPageSavedArray.value.splice(index, 1);
      $ls.set(saveInfo.saveCode, currentPageSavedArray.value);
    }
  }
  function getAllFields(properties) {
    let allFields = {};
    let order = 1;
    let treeData = [];
    if (properties.properties) {
      properties = properties.properties;
    }
    Object.keys(properties).map((field) => {
      let item = properties[field];
      if (item.view == "table") {
        let subProps = item["properties"] || item["fields"];
        let subTableOrder = order * 100;
        let subNode = {
          title: item.title,
          value: field,
          disabled: true,
          children: [],
          order: subTableOrder
        };
        Object.keys(subProps).map((subField) => {
          let subItem = subProps[subField];
          subItem["order"] = subTableOrder + subItem["order"];
          let subFieldKey = field + "@" + subField;
          allFields[subFieldKey] = subItem;
          subNode.children.push({
            title: subItem.title,
            value: subFieldKey,
            isLeaf: true,
            order: subItem["order"]
          });
        });
        orderField(subNode);
        treeData.push(subNode);
        order++;
      } else {
        let fieldKey = field;
        allFields[fieldKey] = item;
        treeData.push({
          title: item.title,
          value: fieldKey,
          isLeaf: true,
          order: item.order
        });
      }
    });
    orderField(treeData);
    return { allFields, treeData };
  }
  function orderField(data) {
    let arr = data.children || data;
    arr.sort(function(a, b) {
      return a.order - b.order;
    });
  }
  function initDefaultValues(values) {
    const { params, matchType: matchType2 } = values;
    if (params) {
      let rowsValues = [];
      for (let item of params) {
        rowsValues.push(Object.assign({}, { key: randomString(16) }, item));
      }
      dynamicRowValues.values = rowsValues;
      matchType2.value = matchType2;
    }
  }
  return {
    formRef,
    init,
    dynamicRowValues,
    matchType,
    registerModal,
    handleSubmit,
    handleCancel,
    handleSave,
    doSaveQueryInfo,
    saveInfo,
    saveTreeData,
    handleRemoveSaveInfo,
    handleTreeSelect,
    fieldTreeData,
    addOne,
    removeOne,
    setFormModel,
    getSchema,
    loading,
    getQueryInfo,
    initDefaultValues
  };
}
var SuperQuery_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = {
  name: "OnlineSuperQuery",
  props: {
    config: {
      type: Object,
      default: []
    },
    status: {
      type: Boolean,
      default: false
    },
    online: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BasicModal,
    MinusCircleOutlined,
    PlusOutlined,
    OnlineSuperQueryValComponent: _sfc_main$1,
    FileTextOutlined,
    CloseCircleOutlined,
    AppstoreTwoTone,
    Divider
  },
  emits: ["search"],
  setup(props, { emit }) {
    const [registerFormModal, formModal] = useModal();
    const { createMessage: $message } = useMessage();
    const historyCollapsed = ref(true);
    function handleCancel() {
      formModal.closeModal();
    }
    function handleSubmit() {
      if (props.online === true) {
        let dataArray = getQueryInfo(true);
        if (dataArray && dataArray.length > 0) {
          emit("search", dataArray, matchType.value);
        } else {
          $message.warning("\u7A7A\u6761\u4EF6\u65E0\u6CD5\u67E5\u8BE2\uFF01");
        }
      } else {
        let dataArray = getQueryInfo(true);
        if (dataArray && dataArray.length > 0) {
          let result = getSuperQueryParams(dataArray);
          emit("search", result);
        } else {
          $message.warning("\u7A7A\u6761\u4EF6\u65E0\u6CD5\u67E5\u8BE2\uFF01");
        }
      }
    }
    function getSuperQueryParams(dataArray) {
      let arr = [];
      for (let item of dataArray) {
        let field = item.field;
        let val = item.val;
        if (val instanceof Array) {
          val = val.join(",");
        }
        arr.push(__spreadProps(__spreadValues({}, item), {
          field,
          val
        }));
      }
      if (arr.length > 0) {
        superQueryFlag.value = true;
      } else {
        superQueryFlag.value = false;
      }
      let result = {
        superQueryMatchType: matchType.value,
        superQueryParams: encodeURI(JSON.stringify(arr))
      };
      return result;
    }
    function handleReset() {
      dynamicRowValues.values = [];
      addOne(false);
      let result = getSuperQueryParams([]);
      emit("search", result);
    }
    const {
      formRef,
      init,
      dynamicRowValues,
      matchType,
      registerModal,
      handleSave,
      doSaveQueryInfo,
      saveInfo,
      saveTreeData,
      handleTreeSelect,
      handleRemoveSaveInfo,
      fieldTreeData,
      addOne,
      removeOne,
      setFormModel,
      getSchema,
      loading,
      getQueryInfo,
      initDefaultValues
    } = useSuperQuery();
    const superQueryFlag = ref(false);
    watch(() => props.status, (val) => {
      superQueryFlag.value = val;
    }, { immediate: true });
    function handleOpen() {
      formModal.openModal();
      addOne(true);
    }
    function getPopupContainer() {
      return document.getElementsByClassName("jee-super-query-form")[0];
    }
    function onFinish(a) {
      console.log("onfinish", a);
    }
    function handleChangeField(item) {
      item["val"] = "";
    }
    watch(() => props.config, (val) => {
      if (val) {
        init(val);
      }
    }, { immediate: true });
    return {
      formRef,
      registerFormModal,
      init,
      handleChangeField,
      dynamicRowValues,
      matchType,
      historyCollapsed,
      registerModal,
      handleSubmit,
      handleCancel,
      handleSave,
      handleReset,
      doSaveQueryInfo,
      saveInfo,
      saveTreeData,
      handleTreeSelect,
      handleRemoveSaveInfo,
      fieldTreeData,
      addOne,
      removeOne,
      setFormModel,
      getSchema,
      loading,
      onFinish,
      getPopupContainer,
      superQueryFlag,
      handleOpen,
      initDefaultValues,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    };
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-31ffc821"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "j-super-query-button" };
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", null, "\u5DF2\u6709\u9AD8\u7EA7\u67E5\u8BE2\u6761\u4EF6\u751F\u6548", -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", null, "\u9AD8\u7EA7\u67E5\u8BE2", -1));
const _hoisted_4 = { style: { "float": "left" } };
const _hoisted_5 = { slot: "description" };
const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", null, "\u6CA1\u6709\u4EFB\u4F55\u67E5\u8BE2\u6761\u4EF6", -1));
const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", null, "\u4FDD\u5B58\u7684\u67E5\u8BE2", -1));
const _hoisted_8 = ["title"];
const _hoisted_9 = { class: "icon-cancle" };
const _hoisted_10 = { style: { "height": "80px", "line-height": "75px", "width": "100%", "text-align": "center" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_divider = resolveComponent("divider");
  const _component_AppstoreTwoTone = resolveComponent("AppstoreTwoTone");
  const _component_a_button = resolveComponent("a-button");
  const _component_a_button_group = resolveComponent("a-button-group");
  const _component_a_tooltip = resolveComponent("a-tooltip");
  const _component_a_divider = resolveComponent("a-divider");
  const _component_a_empty = resolveComponent("a-empty");
  const _component_a_select_option = resolveComponent("a-select-option");
  const _component_a_select = resolveComponent("a-select");
  const _component_a_form_item = resolveComponent("a-form-item");
  const _component_a_col = resolveComponent("a-col");
  const _component_a_row = resolveComponent("a-row");
  const _component_a_tree_select = resolveComponent("a-tree-select");
  const _component_online_super_query_val_component = resolveComponent("online-super-query-val-component");
  const _component_PlusOutlined = resolveComponent("PlusOutlined");
  const _component_MinusCircleOutlined = resolveComponent("MinusCircleOutlined");
  const _component_a_space = resolveComponent("a-space");
  const _component_a_form = resolveComponent("a-form");
  const _component_close_circle_outlined = resolveComponent("close-circle-outlined");
  const _component_file_text_outlined = resolveComponent("file-text-outlined");
  const _component_a_tree = resolveComponent("a-tree");
  const _component_Icon = resolveComponent("Icon");
  const _component_a_card = resolveComponent("a-card");
  const _component_BasicModal = resolveComponent("BasicModal");
  const _component_a_input = resolveComponent("a-input");
  const _component_a_modal = resolveComponent("a-modal");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", _hoisted_1, [
      $setup.superQueryFlag ? (openBlock(), createBlock(_component_a_tooltip, {
        key: 0,
        mouseLeaveDelay: 0.2
      }, {
        title: withCtx(() => [
          _hoisted_2,
          createVNode(_component_divider, {
            type: "vertical",
            style: { "background-color": "#fff" }
          }),
          createElementVNode("a", {
            onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleReset && $setup.handleReset(...args))
          }, "\u6E05\u7A7A")
        ]),
        default: withCtx(() => [
          createVNode(_component_a_button_group, null, {
            default: withCtx(() => [
              createVNode(_component_a_button, {
                type: "primary",
                onClick: $setup.handleOpen
              }, {
                default: withCtx(() => [
                  createVNode(_component_AppstoreTwoTone, { spin: true }),
                  _hoisted_3
                ]),
                _: 1
              }, 8, ["onClick"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["mouseLeaveDelay"])) : (openBlock(), createBlock(_component_a_button, {
        key: 1,
        type: "primary",
        preIcon: "ant-design:filter-outlined",
        onClick: $setup.handleOpen
      }, {
        default: withCtx(() => [
          createTextVNode(" \u9AD8\u7EA7\u67E5\u8BE2 ")
        ]),
        _: 1
      }, 8, ["onClick"]))
    ]),
    (openBlock(), createBlock(Teleport, { to: "body" }, [
      createVNode(_component_BasicModal, {
        title: "\u9AD8\u7EA7\u67E5\u8BE2\u6784\u9020\u5668",
        canFullscreen: false,
        width: 750,
        onRegister: $setup.registerFormModal,
        onOk: $setup.handleSubmit
      }, {
        footer: withCtx(() => [
          createElementVNode("div", _hoisted_4, [
            createVNode(_component_a_button, {
              loading: $setup.loading,
              onClick: $setup.handleReset
            }, {
              default: withCtx(() => [
                createTextVNode("\u91CD\u7F6E")
              ]),
              _: 1
            }, 8, ["loading", "onClick"]),
            createVNode(_component_a_button, {
              loading: $setup.loading,
              onClick: $setup.handleSave
            }, {
              default: withCtx(() => [
                createTextVNode("\u4FDD\u5B58\u67E5\u8BE2")
              ]),
              _: 1
            }, 8, ["loading", "onClick"])
          ]),
          createVNode(_component_a_button, {
            key: "submit",
            type: "primary",
            onClick: $setup.handleSubmit
          }, {
            default: withCtx(() => [
              createTextVNode("\u786E\u5B9A")
            ]),
            _: 1
          }, 8, ["onClick"]),
          createVNode(_component_a_button, {
            key: "back",
            onClick: $setup.handleCancel
          }, {
            default: withCtx(() => [
              createTextVNode("\u5173\u95ED")
            ]),
            _: 1
          }, 8, ["onClick"])
        ]),
        default: withCtx(() => [
          $setup.dynamicRowValues.values.length == 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_5, [
                _hoisted_6,
                createVNode(_component_a_divider, { type: "vertical" }),
                createElementVNode("a", {
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.addOne(-1))
                }, "\u70B9\u51FB\u65B0\u589E")
              ])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(_component_a_row, {
            class: normalizeClass("j-super-query-modal-content")
          }, {
            default: withCtx(() => [
              createVNode(_component_a_col, {
                sm: 24,
                md: 24
              }, {
                default: withCtx(() => [
                  withDirectives(createVNode(_component_a_row, null, {
                    default: withCtx(() => [
                      createVNode(_component_a_col, {
                        md: 12,
                        xs: 24
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_form_item, {
                            label: "\u5339\u914D\u6A21\u5F0F",
                            labelCol: { md: 6, xs: 24 },
                            wrapperCol: { md: 18, xs: 24 },
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: $setup.matchType,
                                "onUpdate:value": _cache[2] || (_cache[2] = ($event) => $setup.matchType = $event),
                                getPopupContainer: (node) => node.parentNode,
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "and" }, {
                                    default: withCtx(() => [
                                      createTextVNode("AND\uFF08\u6240\u6709\u6761\u4EF6\u5339\u914D\uFF09")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "or" }, {
                                    default: withCtx(() => [
                                      createTextVNode("OR\uFF08\u4EFB\u610F\u4E00\u4E2A\u5339\u914D\uFF09")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "getPopupContainer"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 512), [
                    [vShow, $setup.dynamicRowValues.values.length > 0]
                  ]),
                  withDirectives(createVNode(_component_a_form, {
                    ref: "formRef",
                    class: normalizeClass("jee-super-query-form"),
                    model: $setup.dynamicRowValues,
                    onFinish: $setup.onFinish
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList($setup.dynamicRowValues.values, (item, index) => {
                        return openBlock(), createBlock(_component_a_space, {
                          key: item.key,
                          style: { "display": "flex", "margin-bottom": "8px" },
                          align: "baseline"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form_item, {
                              name: ["values", index, "field"],
                              style: { "width": "150px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_tree_select, {
                                  style: { "width": "100%" },
                                  placeholder: "\u8BF7\u9009\u62E9\u5B57\u6BB5",
                                  value: item.field,
                                  "onUpdate:value": ($event) => item.field = $event,
                                  "show-search": "",
                                  "tree-node-filter-prop": "title",
                                  "allow-clear": "",
                                  "tree-default-expand-all": "",
                                  "dropdown-style": { maxHeight: "180px", overflow: "auto" },
                                  onChange: ($event) => $setup.handleChangeField(item),
                                  "tree-data": $setup.fieldTreeData
                                }, null, 8, ["value", "onUpdate:value", "onChange", "tree-data"])
                              ]),
                              _: 2
                            }, 1032, ["name"]),
                            createVNode(_component_a_form_item, {
                              name: ["values", index, "rule"],
                              style: { "width": "100px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select, {
                                  style: { "width": "100%" },
                                  placeholder: "\u8BF7\u9009\u62E9\u5339\u914D\u89C4\u5219",
                                  value: item.rule,
                                  "onUpdate:value": ($event) => item.rule = $event
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select_option, { value: "eq" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u7B49\u4E8E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "like" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u6A21\u7CCA")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "right_like" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u4EE5..\u5F00\u59CB")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "left_like" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u4EE5..\u7ED3\u5C3E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "in" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u5728...\u4E2D")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "ne" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u4E0D\u7B49\u4E8E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "gt" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u5927\u4E8E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "ge" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u5927\u4E8E\u7B49\u4E8E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "lt" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u5C0F\u4E8E")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "le" }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u5C0F\u4E8E\u7B49\u4E8E")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onUpdate:value"])
                              ]),
                              _: 2
                            }, 1032, ["name"]),
                            createVNode(_component_a_form_item, {
                              name: ["values", index, "val"],
                              style: { "width": "300px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_online_super_query_val_component, {
                                  style: { "width": "100%" },
                                  schema: $setup.getSchema(item, index),
                                  formModel: item,
                                  setFormModel: (key, value) => {
                                    $setup.setFormModel(key, value, item);
                                  },
                                  onSubmit: $setup.handleSubmit
                                }, null, 8, ["schema", "formModel", "setFormModel", "onSubmit"])
                              ]),
                              _: 2
                            }, 1032, ["name"]),
                            createVNode(_component_a_form_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  onClick: ($event) => $setup.addOne(index),
                                  style: { "margin-right": "6px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_PlusOutlined)
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"]),
                                createVNode(_component_a_button, {
                                  onClick: ($event) => $setup.removeOne(item)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_MinusCircleOutlined)
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["model", "onFinish"]), [
                    [vShow, $setup.dynamicRowValues.values.length > 0]
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_a_card, {
            class: normalizeClass(["j-super-query-history-card", { "collapsed": $setup.historyCollapsed }]),
            bordered: false
          }, {
            title: withCtx(() => [
              _hoisted_7
            ]),
            default: withCtx(() => [
              $setup.saveTreeData.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                key: 0,
                class: "j-super-query-history-empty",
                image: $setup.simpleImage,
                description: "\u6CA1\u6709\u4FDD\u5B58\u7684\u67E5\u8BE2"
              }, null, 8, ["image"])) : (openBlock(), createBlock(_component_a_tree, {
                key: 1,
                class: "j-super-query-history-tree",
                treeData: $setup.saveTreeData,
                selectedKeys: [],
                "show-icon": true,
                onSelect: $setup.handleTreeSelect
              }, {
                title: withCtx(({ title }) => [
                  createElementVNode("div", null, [
                    createElementVNode("span", { title }, toDisplayString(title.length > 10 ? title.substring(0, 10) + "..." : title), 9, _hoisted_8),
                    createElementVNode("span", _hoisted_9, [
                      createVNode(_component_close_circle_outlined, {
                        onClick: ($event) => $setup.handleRemoveSaveInfo(title)
                      }, null, 8, ["onClick"])
                    ])
                  ])
                ]),
                custom: withCtx(() => [
                  createVNode(_component_file_text_outlined)
                ]),
                _: 1
              }, 8, ["treeData", "onSelect"])),
              createElementVNode("div", {
                class: "collapse-box",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.historyCollapsed = !$setup.historyCollapsed)
              }, [
                $setup.historyCollapsed ? (openBlock(), createBlock(_component_Icon, {
                  key: 0,
                  icon: "ant-design:caret-left"
                })) : (openBlock(), createBlock(_component_Icon, {
                  key: 1,
                  icon: "ant-design:caret-right"
                }))
              ])
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _: 1
      }, 8, ["onRegister", "onOk"])
    ])),
    createVNode(_component_a_modal, {
      title: "\u8BF7\u8F93\u5165\u4FDD\u5B58\u7684\u540D\u79F0",
      visible: $setup.saveInfo.visible,
      onCancel: _cache[5] || (_cache[5] = ($event) => $setup.saveInfo.visible = false),
      onOk: $setup.doSaveQueryInfo
    }, {
      default: withCtx(() => [
        createElementVNode("div", _hoisted_10, [
          createVNode(_component_a_input, {
            value: $setup.saveInfo.title,
            "onUpdate:value": _cache[4] || (_cache[4] = ($event) => $setup.saveInfo.title = $event),
            style: { "width": "90%" },
            placeholder: "\u8BF7\u8F93\u5165\u4FDD\u5B58\u7684\u540D\u79F0"
          }, null, 8, ["value"])
        ])
      ]),
      _: 1
    }, 8, ["visible", "onOk"])
  ], 64);
}
var OnlineSuperQuery = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-31ffc821"]]);
export { OnlineSuperQuery as default };
