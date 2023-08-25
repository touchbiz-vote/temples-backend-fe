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
import { defineComponent, computed, createVNode, unref } from "vue";
import { componentMap } from "/@/components/Form/src/componentMap";
import { isFunction } from "/@/utils/is";
import { b as baseSlice } from "./_baseSlice.js";
import { t as toString } from "./toString.js";
function castSlice(array, start, end) {
  var length = array.length;
  end = end === void 0 ? length : end;
  return !start && end >= length ? array : baseSlice(array, start, end);
}
var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1, rsVarRange$1 = "\\ufe0e\\ufe0f";
var rsZWJ$1 = "\\u200d";
var reHasUnicode = RegExp("[" + rsZWJ$1 + rsAstralRange$1 + rsComboRange$1 + rsVarRange$1 + "]");
function hasUnicode(string) {
  return reHasUnicode.test(string);
}
function asciiToArray(string) {
  return string.split("");
}
var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}
function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);
    var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
    var chr = strSymbols ? strSymbols[0] : string.charAt(0);
    var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
    return chr[methodName]() + trailing;
  };
}
var upperFirst = createCaseFirst("toUpperCase");
var upperFirst$1 = upperFirst;
var _sfc_main = defineComponent({
  name: "OnlineSuperQueryValComponent",
  inheritAttrs: false,
  props: {
    schema: {
      type: Object,
      default: () => ({})
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    setFormModel: {
      type: Function,
      default: null
    }
  },
  emits: ["submit"],
  setup(props, {
    emit
  }) {
    const getComponentsProps = computed(() => {
      var _a;
      const {
        schema,
        formModel
      } = props;
      let {
        componentProps = {}
      } = schema;
      if (isFunction(componentProps)) {
        componentProps = (_a = componentProps({
          schema,
          formModel
        })) != null ? _a : {};
      }
      return componentProps;
    });
    const getValues = computed(() => {
      const {
        formModel,
        schema
      } = props;
      let obj = {
        field: schema.field,
        model: formModel,
        values: __spreadValues({}, formModel),
        schema
      };
      return obj;
    });
    function renderComponent() {
      var _a;
      const {
        component,
        changeEvent = "change",
        valueField
      } = props.schema;
      const field = "val";
      const isCheck = component && ["Switch", "Checkbox"].includes(component);
      const eventKey = `on${upperFirst$1(changeEvent)}`;
      const on = {
        [eventKey]: (...args) => {
          const [e] = args;
          if (propsData[eventKey]) {
            propsData[eventKey](...args);
          }
          const target = e ? e.target : null;
          const value = target ? isCheck ? target.checked : target.value : e;
          props.setFormModel(field, value);
        }
      };
      const Comp = componentMap.get(component);
      const propsData = __spreadValues({
        allowClear: true,
        getPopupContainer: (trigger) => trigger.parentNode
      }, unref(getComponentsProps));
      const isCreatePlaceholder = !propsData.disabled;
      if (isCreatePlaceholder && component !== "RangePicker" && component) {
        propsData.placeholder = ((_a = unref(getComponentsProps)) == null ? void 0 : _a.placeholder) || createPlaceholderMessage(component) + props.schema.label;
      }
      propsData.codeField = field;
      propsData.formValues = unref(getValues);
      const bindValue = {
        [valueField || (isCheck ? "checked" : "value")]: props.formModel[field]
      };
      const compAttr = __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, propsData), on), bindValue), {
        allowClear: true,
        onPressEnter() {
          emit("submit");
        }
      });
      return createVNode(Comp, compAttr, null);
    }
    return () => {
      return createVNode("div", {
        "style": "width:100%"
      }, [renderComponent()]);
    };
    function createPlaceholderMessage(component) {
      if (component.includes("Input") || component.includes("Complete")) {
        return "\u8BF7\u8F93\u5165";
      } else {
        return "\u8BF7\u9009\u62E9";
      }
    }
  }
});
export { _sfc_main as _ };
