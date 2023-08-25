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
import { BasicModal, useModalInner } from "/@/components/Modal";
import { ref, computed, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode } from "vue";
import { BasicForm, useForm } from "/@/components/Form/index";
import { defHttp } from "/@/utils/http/axios";
import { _ as _export_sfc } from "./index.js";
import { o as omit } from "./omit.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
import "./toString.js";
import "./isArray.js";
import "./_baseClone.js";
import "./_arrayPush.js";
import "./_flatRest.js";
import "./_baseSlice.js";
const _sfc_main = {
  name: "LinkTableConfigModal",
  emits: ["success", "register"],
  components: {
    BasicModal,
    BasicForm
  },
  setup(_p, { emit }) {
    const spinningLoading = ref(false);
    const fieldName = ref("");
    let oldValue = {};
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      console.log("data", data);
      oldValue = __spreadValues({}, data.record);
      yield setFieldsValue({ dictTable: data.record.dictTable });
      setTimeout(() => __async(this, null, function* () {
        let otherValue = omit(data.record, "dictTable");
        yield setFieldsValue(otherValue);
        yield clearValidate();
      }), 200);
      fieldName.value = data.fieldName;
    }));
    const titleFieldName = ref("");
    const imageFieldName = ref("");
    const fieldOptions = ref([]);
    const imageFieldOptions = ref([]);
    function getFieldOptions(tableName) {
      return __async(this, null, function* () {
        if (tableName) {
          const url = "/online/cgform/field/listByHeadCode";
          const dataList = yield defHttp.get({ url, params: { headCode: tableName } });
          if (dataList && dataList.length > 0) {
            let arr1 = dataList.filter((item) => item.dbFieldName != "id" && item.dbIsPersist == 1);
            console.log("\u5B57\u6BB5\u5B57\u5178", arr1);
            if (arr1.length > 0) {
              fieldOptions.value = arr1.map((item) => {
                return {
                  text: item.dbFieldTxt,
                  value: item.dbFieldName
                };
              });
            } else {
              fieldOptions.value = [];
            }
            let arr2 = dataList.filter((item) => item.dbFieldName != "id" && item.fieldShowType == "image" && item.dbIsPersist == 1);
            console.log("\u56FE\u7247\u5B57\u6BB5", arr2);
            if (arr2.length > 0) {
              imageFieldOptions.value = arr2.map((item) => {
                return {
                  text: item.dbFieldTxt,
                  value: item.dbFieldName
                };
              });
            } else {
              imageFieldOptions.value = [{ text: "\u65E0\u56FE\u7247\u5B57\u6BB5\u53EF\u4EE5\u9009\u62E9", value: "", key: "", disabled: true }];
            }
          } else {
            fieldOptions.value = [];
            imageFieldOptions.value = [{ text: "\u65E0\u56FE\u7247\u5B57\u6BB5\u53EF\u4EE5\u9009\u62E9", value: "", key: "", disabled: true }];
          }
        }
      });
    }
    function handleTableChange(tableName) {
      return __async(this, null, function* () {
        titleFieldName.value = "";
        imageFieldName.value = "";
        yield getFieldOptions(tableName);
      });
    }
    const otherFieldOptions = computed(() => {
      let arr = fieldOptions.value;
      let titleField = titleFieldName.value;
      let imageField = imageFieldName.value;
      return arr.filter((item) => item.value != titleField && item.value != imageField);
    });
    const formSchemas = [
      {
        label: "rowKey",
        field: "rowKey",
        component: "Input",
        show: false
      },
      {
        label: "dictField",
        field: "dictField",
        component: "Input",
        defaultValue: "id",
        show: false
      },
      {
        label: "\u5B57\u6BB5\u63CF\u8FF0",
        field: "dbFieldTxt",
        component: "Input",
        required: true
      },
      {
        label: "\u5173\u8054\u8868",
        field: "dictTable",
        component: "JSearchSelect",
        required: true,
        componentProps: ({ formActionType }) => {
          return {
            dict: "onl_cgform_head where copy_type = 0,table_txt,table_name",
            pageSize: 10,
            async: true,
            immediateChange: true,
            popContainer: ".link-table-config-modal",
            params: { order: "desc", column: "create_time" },
            onChange: (name) => __async(this, null, function* () {
              if (oldValue.titleField || oldValue.otherFields) {
                yield formActionType.setFieldsValue({
                  titleField: "",
                  otherFields: "",
                  imageField: ""
                });
                yield formActionType.clearValidate();
              }
              yield handleTableChange(name);
            })
          };
        }
      },
      {
        label: "\u6807\u9898\u5B57\u6BB5",
        field: "titleField",
        component: "JSearchSelect",
        required: true,
        componentProps: {
          async: false,
          popContainer: ".link-table-config-modal",
          dictOptions: fieldOptions,
          immediateChange: true,
          onChange: (str) => {
            titleFieldName.value = str;
            oldValue["titleField"] = str;
          }
        }
      },
      {
        label: "\u5C01\u9762\u56FE\u7247",
        field: "imageField",
        component: "JSearchSelect",
        componentProps: {
          async: false,
          popContainer: ".link-table-config-modal",
          dictOptions: imageFieldOptions,
          immediateChange: true,
          onChange: (str) => {
            imageFieldName.value = str;
            oldValue["imageFieldName"] = str;
          }
        }
      },
      {
        label: "\u5176\u4ED6\u5B57\u6BB5",
        field: "otherFields",
        component: "JSelectMultiple",
        componentProps: {
          popContainer: ".link-table-config-modal",
          options: otherFieldOptions,
          onChange: (str) => {
            oldValue["otherFields"] = str;
            console.error("oldValue", oldValue);
          }
        }
      },
      {
        label: "\u663E\u793A\u65B9\u5F0F",
        field: "showType",
        component: "Select",
        defaultValue: "card",
        componentProps: {
          options: [
            { label: "\u5361\u7247", value: "card" },
            { label: "\u4E0B\u62C9\u6846", value: "select" }
          ]
        }
      },
      {
        label: "\u662F\u5426\u591A\u9009",
        field: "multiSelect",
        component: "RadioGroup",
        defaultValue: false,
        componentProps: {
          options: [
            { label: "\u5426", value: false },
            { label: "\u662F", value: true }
          ]
        }
      }
    ];
    const [registerForm, { validate, setFieldsValue, clearValidate, resetFields }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: "right"
    });
    function handleSubmit() {
      return __async(this, null, function* () {
        let data = yield validate();
        data["fieldName"] = fieldName.value;
        emit("success", data);
        closeModal();
      });
    }
    return {
      registerModal,
      spinningLoading,
      registerForm,
      handleSubmit
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent("BasicForm");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createBlock(_component_BasicModal, mergeProps({ wrapClassName: "link-table-config-modal" }, _ctx.$attrs, {
    title: "\u5173\u8054\u8BB0\u5F55\u914D\u7F6E",
    onRegister: $setup.registerModal,
    keyboard: "",
    canFullscreen: false,
    cancelText: "\u5173\u95ED",
    onOk: $setup.handleSubmit
  }), {
    default: withCtx(() => [
      createVNode(_component_a_spin, { spinning: $setup.spinningLoading }, {
        default: withCtx(() => [
          createVNode(_component_BasicForm, { onRegister: $setup.registerForm }, null, 8, ["onRegister"])
        ]),
        _: 1
      }, 8, ["spinning"])
    ]),
    _: 1
  }, 16, ["onRegister", "onOk"]);
}
var LinkTableConfigModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LinkTableConfigModal as default };
