import { defineComponent, resolveComponent, openBlock, createElementBlock, createVNode } from "vue";
import { BasicForm, useForm } from "/@/components/Form/index";
import { defHttp } from "/@/utils/http/axios";
import { _ as _export_sfc } from "./index.js";
import { p as pick } from "./pick.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
const getSchemas = () => {
  return [
    {
      field: "name",
      component: "Input",
      label: "\u540D\u79F0"
    },
    {
      field: "age",
      component: "InputNumber",
      label: "\u5E74\u9F84",
      componentProps: {
        style: {
          width: "100%"
        }
      }
    },
    {
      field: "sex",
      label: "\u6027\u522B",
      component: "JDictSelectTag",
      componentProps: {
        dictCode: "sex"
      }
    },
    {
      field: "birthday",
      component: "DatePicker",
      label: "\u751F\u65E5",
      componentProps: {
        valueFormat: "YYYY-MM-DD",
        style: {
          width: "100%"
        }
      }
    },
    {
      field: "email",
      component: "Input",
      label: "\u90AE\u7BB1"
    }
  ];
};
const _sfc_main = defineComponent({
  components: { BasicForm },
  props: ["id"],
  setup(props) {
    const [registerForm, { setFieldsValue }] = useForm({
      schemas: getSchemas(),
      showActionButtonGroup: false,
      baseColProps: { span: 24 }
    });
    let params = { id: props.id };
    defHttp.get({ url: "/test/jeecgDemo/queryById", params }, { isTransformResponse: false }).then((res) => {
      if (res.success) {
        let values = pick(res.result, "name", "age", "birthday", "sex", "email");
        setFieldsValue(values);
      }
    });
    return {
      registerForm
    };
  }
});
const _hoisted_1 = { style: { "margin": "50px auto", "width": "800px" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent("BasicForm");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ["onRegister"])
  ]);
}
var ModalFormDemo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ModalFormDemo as default };
