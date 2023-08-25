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
import { defineComponent, ref, watch, resolveComponent, openBlock, createBlock, normalizeClass, withCtx, createElementVNode, toDisplayString, createElementBlock, Fragment, createVNode, renderList, createTextVNode, mergeProps, useCssVars, pushScopeId, popScopeId } from "vue";
import { JDictSelectTag, JTreeSelect, JCategorySelect, JSelectUser, JSelectUserByDept, JSelectDept, JPopup, JAreaLinkage, JAreaSelect, JSelectMultiple } from "/@/components/Form";
import JOnlineSearchSelect from "./JOnlineSearchSelect.js";
import { _ as _export_sfc } from "./index.js";
import "@vueuse/core";
import "/@/utils/http/axios";
import "/@/hooks/web/useMessage";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
var OnlineSearchFormItem_vue_vue_type_style_index_0_scoped_true_lang = "";
const __default__ = defineComponent({
  name: "OnlineSearchFormItem",
  components: {
    JOnlineSearchSelect,
    JDictSelectTag,
    JTreeSelect,
    JCategorySelect,
    JSelectUser,
    JSelectUserByDept,
    JSelectDept,
    JPopup,
    JAreaLinkage,
    JAreaSelect,
    JSelectMultiple
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default: () => {
      },
      required: true
    },
    dictOptions: {
      type: Object,
      default: () => {
      },
      required: false
    },
    onlineForm: {
      type: Object,
      default: () => {
      },
      required: false
    }
  },
  emits: ["update:value", "change"],
  setup(props, { emit }) {
    const labelTextMaxWidth = "120px";
    const labelCol = {
      style: {
        "max-width": labelTextMaxWidth
      }
    };
    const single_mode = "single";
    let innerValue = ref("");
    let beginValue = ref("");
    let endValue = ref("");
    watch(
      () => props.value,
      () => {
        if (isEasySelect()) {
          innerValue.value = !!props.value ? props.value : void 0;
        } else {
          innerValue.value = props.value;
        }
        if (!props.value) {
          beginValue.value = "";
          endValue.value = "";
        }
      },
      { deep: true, immediate: true }
    );
    watch(
      innerValue,
      (newVal) => {
        console.log("innerValue-change", newVal);
        emit("update:value", newVal);
      },
      { immediate: true }
    );
    watch(beginValue, (newVal) => {
      emit("change", props.item.field + "_begin", newVal);
      emit("update:value", "1");
    });
    watch(endValue, (newVal) => {
      emit("change", props.item.field + "_end", newVal);
      emit("update:value", "1");
    });
    function getDictOptionKey(item) {
      console.log("ddictOptions", props.dictOptions);
      if (item.dbField) {
        return item.dbField;
      } else {
        return item.field;
      }
    }
    function isEasySelect() {
      let item = props.item;
      if (!item) {
        return false;
      }
      return item.view == "list" || item.view == "radio" || item.view == "switch";
    }
    function getDictCode() {
      let item = props.item;
      if (item.dictTable && item.dictTable.length > 0) {
        return item.dictTable + "," + item.dictText + "," + item.dictCode;
      } else {
        return item.dictCode;
      }
    }
    function getSqlByDictCode() {
      let item = props.item;
      let { dictTable, dictCode, dictText } = item;
      let temp = dictTable.toLowerCase();
      let arr = temp.split("where");
      let condition = "";
      if (arr.length > 1) {
        condition = " where" + arr[1];
      }
      let sql = "select " + dictCode + " as 'value', " + dictText + " as 'text' from " + arr[0] + condition;
      console.log("sql", sql);
      return sql;
    }
    function getPopupFieldConfig(item) {
      let { dictText: destFields, dictCode: orgFields } = item;
      if (!destFields || destFields.length == 0) {
        return [];
      }
      let arr1 = destFields.split(",");
      let arr2 = orgFields.split(",");
      let config = [];
      for (let i = 0; i < arr1.length; i++) {
        config.push({
          target: arr1[i],
          source: arr2[i]
        });
      }
      return config;
    }
    function setFieldsValue(values) {
      let { dictText: destFields } = props.item;
      let arr1 = destFields.split(",");
      let field = arr1[0];
      emit("change", field, values[field]);
    }
    function handleCategoryTreeChange(value) {
      emit("update:value", value);
    }
    function getComponentProps(item, labelKey, rowKey) {
      let props2 = {
        labelKey,
        rowKey
      };
      let fieldExtendJson = item.fieldExtendJson;
      if (fieldExtendJson) {
        if (typeof fieldExtendJson == "string") {
          let json = JSON.parse(fieldExtendJson);
          let extend = __spreadValues({}, json);
          if (extend.text) {
            props2["labelKey"] = extend.text;
          }
          if (extend.store) {
            props2["rowKey"] = extend.store;
          }
        }
      }
      return props2;
    }
    let userSelectProp = getComponentProps(props.item, "realname", "username");
    console.log("userSelectProp", userSelectProp);
    let depSelectProp = getComponentProps(props.item, "departName", "id");
    function handleSelectChange(array) {
      if (array && array.length > 0) {
        emit("update:value", array.join(","));
      } else {
        emit("update:value", "");
      }
    }
    return {
      getPopupFieldConfig,
      userSelectProp,
      depSelectProp,
      handleSelectChange,
      setFieldsValue,
      innerValue,
      beginValue,
      endValue,
      isEasySelect,
      getDictOptionKey,
      getDictCode,
      labelTextMaxWidth,
      labelCol,
      single_mode,
      getSqlByDictCode,
      handleCategoryTreeChange
    };
  }
});
const __injectCSSVars__ = () => {
  useCssVars((_ctx) => ({
    "1e41a56d": _ctx.labelTextMaxWidth
  }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
const _sfc_main = __default__;
const _withScopeId = (n) => (pushScopeId("data-v-76dfb908"), n = n(), popScopeId(), n);
const _hoisted_1 = ["title"];
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { class: "group-query-strig" }, "~", -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { class: "group-query-strig" }, "~", -1));
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { class: "group-query-strig" }, "~", -1));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_date_picker = resolveComponent("a-date-picker");
  const _component_JDictSelectTag = resolveComponent("JDictSelectTag");
  const _component_a_select_option = resolveComponent("a-select-option");
  const _component_a_select = resolveComponent("a-select");
  const _component_JTreeSelect = resolveComponent("JTreeSelect");
  const _component_JCategorySelect = resolveComponent("JCategorySelect");
  const _component_JOnlineSearchSelect = resolveComponent("JOnlineSearchSelect");
  const _component_JSelectUser = resolveComponent("JSelectUser");
  const _component_JSelectDept = resolveComponent("JSelectDept");
  const _component_JPopup = resolveComponent("JPopup");
  const _component_JAreaSelect = resolveComponent("JAreaSelect");
  const _component_JSelectMultiple = resolveComponent("JSelectMultiple");
  const _component_a_input = resolveComponent("a-input");
  const _component_a_form_item = resolveComponent("a-form-item");
  return openBlock(), createBlock(_component_a_form_item, {
    labelCol: _ctx.labelCol,
    class: normalizeClass("jeecg-online-search")
  }, {
    label: withCtx(() => [
      createElementVNode("span", {
        title: _ctx.item.label,
        class: "label-text"
      }, toDisplayString(_ctx.item.label), 9, _hoisted_1)
    ]),
    default: withCtx(() => [
      _ctx.item.view == "date" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.single_mode === _ctx.item.mode ? (openBlock(), createBlock(_component_a_date_picker, {
          key: 0,
          style: { "width": "100%" },
          showTime: false,
          valueFormat: "YYYY-MM-DD",
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[0] || (_cache[0] = ($event) => _ctx.innerValue = $event)
        }, null, 8, ["placeholder", "value"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createVNode(_component_a_date_picker, {
            showTime: false,
            valueFormat: "YYYY-MM-DD",
            placeholder: "\u5F00\u59CB\u65E5\u671F",
            value: _ctx.beginValue,
            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => _ctx.beginValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"]),
          _hoisted_2,
          createVNode(_component_a_date_picker, {
            showTime: false,
            valueFormat: "YYYY-MM-DD",
            placeholder: "\u7ED3\u675F\u65E5\u671F",
            value: _ctx.endValue,
            "onUpdate:value": _cache[2] || (_cache[2] = ($event) => _ctx.endValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"])
        ], 64))
      ], 64)) : _ctx.item.view == "datetime" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        _ctx.single_mode === _ctx.item.mode ? (openBlock(), createBlock(_component_a_date_picker, {
          key: 0,
          style: { "width": "100%" },
          showTime: true,
          valueFormat: "YYYY-MM-DD hh:mm:ss",
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[3] || (_cache[3] = ($event) => _ctx.innerValue = $event)
        }, null, 8, ["placeholder", "value"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createVNode(_component_a_date_picker, {
            showTime: true,
            valueFormat: "YYYY-MM-DD hh:mm:ss",
            placeholder: "\u5F00\u59CB\u65F6\u95F4",
            value: _ctx.beginValue,
            "onUpdate:value": _cache[4] || (_cache[4] = ($event) => _ctx.beginValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"]),
          _hoisted_3,
          createVNode(_component_a_date_picker, {
            showTime: true,
            valueFormat: "YYYY-MM-DD hh:mm:ss",
            placeholder: "\u7ED3\u675F\u65F6\u95F4",
            value: _ctx.endValue,
            "onUpdate:value": _cache[5] || (_cache[5] = ($event) => _ctx.endValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"])
        ], 64))
      ], 64)) : _ctx.isEasySelect() ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
        _ctx.item.config === "1" ? (openBlock(), createBlock(_component_JDictSelectTag, {
          key: 0,
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[6] || (_cache[6] = ($event) => _ctx.innerValue = $event),
          dictCode: _ctx.getDictCode()
        }, null, 8, ["placeholder", "value", "dictCode"])) : (openBlock(), createBlock(_component_a_select, {
          key: 1,
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[7] || (_cache[7] = ($event) => _ctx.innerValue = $event)
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.dictOptions[_ctx.getDictOptionKey(_ctx.item)], (obj, index) => {
              return openBlock(), createBlock(_component_a_select_option, {
                key: index,
                value: obj.value
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(obj.text), 1)
                ]),
                _: 2
              }, 1032, ["value"]);
            }), 128))
          ]),
          _: 1
        }, 8, ["placeholder", "value"]))
      ], 64)) : _ctx.item.view === "sel_tree" ? (openBlock(), createBlock(_component_JTreeSelect, {
        key: 3,
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
        value: _ctx.innerValue,
        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => _ctx.innerValue = $event),
        dict: _ctx.item.dict,
        pidField: _ctx.item.pidField,
        pidValue: _ctx.item.pidValue,
        hasChildField: _ctx.item.hasChildField,
        "load-triggle-change": ""
      }, null, 8, ["placeholder", "value", "dict", "pidField", "pidValue", "hasChildField"])) : _ctx.item.view === "cat_tree" ? (openBlock(), createBlock(_component_JCategorySelect, {
        key: 4,
        onChange: _ctx.handleCategoryTreeChange,
        loadTriggleChange: true,
        pcode: _ctx.item.pcode,
        value: _ctx.innerValue,
        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => _ctx.innerValue = $event),
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label
      }, null, 8, ["onChange", "pcode", "value", "placeholder"])) : _ctx.item.view === "sel_search" ? (openBlock(), createElementBlock(Fragment, { key: 5 }, [
        _ctx.item.config === "1" ? (openBlock(), createBlock(_component_JDictSelectTag, {
          key: 0,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[10] || (_cache[10] = ($event) => _ctx.innerValue = $event),
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          dict: _ctx.getDictCode()
        }, null, 8, ["value", "placeholder", "dict"])) : (openBlock(), createBlock(_component_JOnlineSearchSelect, {
          key: 1,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[11] || (_cache[11] = ($event) => _ctx.innerValue = $event),
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          sql: _ctx.getSqlByDictCode()
        }, null, 8, ["value", "placeholder", "sql"]))
      ], 64)) : _ctx.item.view == "sel_user" ? (openBlock(), createBlock(_component_JSelectUser, mergeProps({ key: 6 }, _ctx.userSelectProp, {
        value: _ctx.innerValue,
        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => _ctx.innerValue = $event),
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label
      }), null, 16, ["value", "placeholder"])) : _ctx.item.view == "sel_depart" ? (openBlock(), createBlock(_component_JSelectDept, mergeProps({
        key: 7,
        showButton: false
      }, _ctx.depSelectProp, {
        value: _ctx.innerValue,
        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => _ctx.innerValue = $event),
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label
      }), null, 16, ["value", "placeholder"])) : _ctx.item.view == "popup" ? (openBlock(), createBlock(_component_JPopup, {
        key: 8,
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
        value: _ctx.innerValue,
        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => _ctx.innerValue = $event),
        code: _ctx.item.dictTable,
        setFieldsValue: _ctx.setFieldsValue,
        "field-config": _ctx.getPopupFieldConfig(_ctx.item),
        multi: true
      }, null, 8, ["placeholder", "value", "code", "setFieldsValue", "field-config"])) : _ctx.item.view == "pca" ? (openBlock(), createBlock(_component_JAreaSelect, {
        key: 9,
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
        value: _ctx.innerValue,
        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => _ctx.innerValue = $event)
      }, null, 8, ["placeholder", "value"])) : _ctx.item.view == "checkbox" || _ctx.item.view == "list_multi" ? (openBlock(), createBlock(_component_JSelectMultiple, {
        key: 10,
        dictCode: _ctx.getDictCode(),
        placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
        value: _ctx.innerValue,
        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => _ctx.innerValue = $event)
      }, null, 8, ["dictCode", "placeholder", "value"])) : (openBlock(), createElementBlock(Fragment, { key: 11 }, [
        _ctx.single_mode === _ctx.item.mode ? (openBlock(), createBlock(_component_a_input, {
          key: 0,
          placeholder: "\u8BF7\u9009\u62E9" + _ctx.item.label,
          value: _ctx.innerValue,
          "onUpdate:value": _cache[17] || (_cache[17] = ($event) => _ctx.innerValue = $event)
        }, null, 8, ["placeholder", "value"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createVNode(_component_a_input, {
            placeholder: "\u5F00\u59CB\u503C",
            value: _ctx.beginValue,
            "onUpdate:value": _cache[18] || (_cache[18] = ($event) => _ctx.beginValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"]),
          _hoisted_4,
          createVNode(_component_a_input, {
            placeholder: "\u7ED3\u675F\u503C",
            value: _ctx.endValue,
            "onUpdate:value": _cache[19] || (_cache[19] = ($event) => _ctx.endValue = $event),
            style: { "width": "calc(50% - 15px)" }
          }, null, 8, ["value"])
        ], 64))
      ], 64))
    ]),
    _: 1
  }, 8, ["labelCol"]);
}
var OnlineSearchFormItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76dfb908"]]);
export { OnlineSearchFormItem as default };
