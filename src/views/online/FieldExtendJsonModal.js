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
import { defineComponent, ref, reactive, toRaw, toRefs, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode } from "vue";
import { BasicModal, useModalInner } from "/@/components/Modal";
import { BasicForm, useForm } from "/@/components/Form/index";
import { _ as _export_sfc } from "./index.js";
import { p as pick } from "./pick.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
const _sfc_main = defineComponent({
  name: "FieldExtendJsonModal",
  components: {
    BasicModal,
    BasicForm
  },
  emits: ["success", "register"],
  setup(_p, { emit }) {
    const spinningLoading = ref(false);
    function initExtendConfig() {
      extendConfig.uploadnum = 0;
      extendConfig.showLength = "";
      extendConfig.popupMulti = true;
      extendConfig.multiSelect = true;
      extendConfig.store = "";
      extendConfig.text = "";
      extendConfig.orderRule = "";
      extendConfig.validateError = "";
      extendConfig.labelLength = 4;
    }
    const extendConfig = reactive({
      uploadnum: 0,
      showLength: "",
      popupMulti: true,
      store: "",
      text: "",
      multiSelect: true,
      orderRule: "",
      validateError: "",
      labelLength: 4
    });
    const fieldShowType = ref("");
    const rowKey = ref("");
    const sortFlag = ref("0");
    const formSchemas = [
      {
        label: "rowKey",
        field: "rowKey",
        component: "Input",
        show: false
      },
      {
        label: "\u6587\u4EF6\u4E0A\u4F20\u6570\u91CF",
        field: "uploadnum",
        component: "InputNumber",
        componentProps: {
          style: {
            width: "100%"
          }
        },
        ifShow: () => {
          return fieldShowType.value === "file" || fieldShowType.value === "image";
        }
      },
      {
        label: "\u662F\u5426\u591A\u9009",
        field: "popupMulti",
        component: "RadioGroup",
        defaultValue: true,
        componentProps: {
          options: [
            { label: "\u5426", value: false },
            { label: "\u662F", value: true }
          ]
        },
        ifShow: () => {
          return fieldShowType.value === "popup";
        }
      },
      {
        label: "\u662F\u5426\u591A\u9009",
        field: "multiSelect",
        component: "RadioGroup",
        defaultValue: true,
        componentProps: {
          options: [
            { label: "\u5426", value: false },
            { label: "\u662F", value: true }
          ]
        },
        ifShow: () => {
          return fieldShowType.value === "sel_user" || fieldShowType.value === "sel_depart";
        }
      },
      {
        label: "\u5B58\u50A8\u5B57\u6BB5",
        field: "store",
        component: "Input",
        ifShow: () => {
          return fieldShowType.value === "sel_user" || fieldShowType.value === "sel_depart";
        }
      },
      {
        label: "\u5C55\u793A\u5B57\u6BB5",
        field: "text",
        component: "Input",
        ifShow: () => {
          return fieldShowType.value === "sel_user" || fieldShowType.value === "sel_depart";
        }
      },
      {
        label: "\u9ED8\u8BA4\u6392\u5E8F",
        field: "orderRule",
        component: "RadioGroup",
        defaultValue: "",
        componentProps: {
          options: [
            { label: "\u964D\u5E8F", value: "desc" },
            { label: "\u5347\u5E8F", value: "asc" },
            { label: "\u4E0D\u9ED8\u8BA4\u6392\u5E8F", value: "" }
          ]
        },
        ifShow: () => {
          return sortFlag.value === "1";
        }
      },
      {
        label: "\u6821\u9A8C\u63D0\u793A",
        field: "validateError",
        component: "Input",
        componentProps: {
          placeholder: "\u8BF7\u8F93\u5165\u6821\u9A8C\u63D0\u793A\u6587\u672C"
        }
      },
      {
        label: "label\u957F\u5EA6",
        field: "labelLength",
        component: "InputNumber",
        componentProps: {
          placeholder: "\u8BF7\u8F93\u5165label\u957F\u5EA6"
        }
      }
    ];
    const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: "right",
      labelWidth: 100
    });
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      console.log("extend json", data);
      initExtendConfig();
      if (data.jsonStr) {
        let json = JSON.parse(data.jsonStr);
        Object.keys(json).map((k) => {
          console.log("\u6269\u5C55\u53C2\u6570:" + k + "=" + json[k]);
          extendConfig[k] = json[k];
        });
      }
      fieldShowType.value = data.fieldShowType;
      rowKey.value = data.id;
      sortFlag.value = data.sortFlag;
      let temp = toRaw(extendConfig);
      yield resetFields();
      yield setFieldsValue(__spreadProps(__spreadValues({}, temp), {
        rowKey: data.id
      }));
    }));
    function handleSubmit() {
      return __async(this, null, function* () {
        let data = yield validate();
        console.log("datga", data);
        let type = fieldShowType.value;
        let obj = {};
        if (type === "file" || type === "image") {
          if (data.uploadnum && data.uploadnum > 0) {
            obj.uploadnum = data.uploadnum;
          }
        } else if (type === "textarea" || type === "text") {
          if (data.showLength && data.showLength > 0) {
            obj.showLength = data.showLength;
          }
        } else if (type === "sel_user" || type === "sel_depart") {
          obj = pick(data, "store", "text", "multiSelect");
        } else if (type === "popup") {
          obj.popupMulti = data.popupMulti;
        }
        if (sortFlag.value === "1" && data.orderRule) {
          obj.orderRule = data.orderRule;
        }
        if (data.validateError) {
          obj.validateError = data.validateError;
        }
        if (data.labelLength) {
          obj.labelLength = data.labelLength;
        }
        console.log("obj....", obj);
        for (let key in obj) {
          if (obj[key] === "") {
            delete obj[key];
          }
        }
        console.log(obj);
        emit("success", obj, data.rowKey);
        closeModal();
      });
    }
    return __spreadValues({
      spinningLoading,
      registerModal,
      registerForm,
      fieldShowType,
      rowKey,
      handleSubmit
    }, toRefs(extendConfig));
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent("BasicForm");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, mergeProps({ wrapClassName: "field-extend-config-modal" }, _ctx.$attrs, {
    title: "\u6269\u5C55\u53C2\u6570\u914D\u7F6E",
    onRegister: _ctx.registerModal,
    keyboard: "",
    canFullscreen: false,
    cancelText: "\u5173\u95ED",
    onOk: _ctx.handleSubmit
  }), {
    default: withCtx(() => [
      createVNode(_component_a_spin, { spinning: _ctx.spinningLoading }, {
        default: withCtx(() => [
          createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ["onRegister"])
        ]),
        _: 1
      }, 8, ["spinning"])
    ]),
    _: 1
  }, 16, ["onRegister", "onOk"]);
}
var FieldExtendJsonModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FieldExtendJsonModal as default };
