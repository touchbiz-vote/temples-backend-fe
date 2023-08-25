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
import { defineComponent, ref, watch, reactive, resolveComponent, openBlock, createElementBlock, createVNode, withCtx, createTextVNode, normalizeProps, guardReactiveProps, nextTick } from "vue";
import { BasicTable, TableAction, useTable } from "/@/components/Table";
import { BasicModal, useModal } from "/@/components/Modal";
import { BasicForm, useForm } from "/@/components/Form";
import { g as authDataLoadData, h as authDataSaveOrUpdate, i as authDataUpdateStatus, j as authDataDelete } from "./auth.api.js";
import { d as authDataColumns, u as useAuthDataFormSchemas, U as USE_SQL_RULES } from "./auth.data.js";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/http/axios";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "AuthDataConfig",
  components: { BasicTable, TableAction, BasicModal, BasicForm },
  props: {
    cgformId: { type: String, required: true },
    authFields: { type: Array, required: true }
  },
  setup(props) {
    const loading = ref(false);
    const [registerTable, { reload, setLoading }] = useTable({
      api: (params) => authDataLoadData(props.cgformId, params),
      rowKey: "id",
      bordered: true,
      columns: authDataColumns,
      showIndexColumn: false,
      actionColumn: {
        width: 120,
        title: "\u64CD\u4F5C",
        fixed: false,
        dataIndex: "action",
        slots: { customRender: "action" }
      }
    });
    watch(loading, (l) => setLoading(l));
    const [registerModal, { openModal, closeModal }] = useModal();
    const formModalProps = reactive({
      title: "",
      width: 800,
      confirmLoading: false,
      onOk: onSubmit,
      onCancel: closeModal,
      onRegister: registerModal
    });
    let isUpdate = false;
    let formRecord = {};
    const { formSchemas } = useAuthDataFormSchemas(props, {
      onRuleOperatorChange
    });
    const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: "right"
    });
    watch(
      () => props.cgformId,
      () => {
        reload().catch(() => null);
      },
      { immediate: true }
    );
    function openFormModal(data) {
      return __async(this, null, function* () {
        var _a;
        isUpdate = (_a = data.isUpdate) != null ? _a : false;
        formModalProps.title = data.title;
        openModal();
        yield nextTick();
        yield resetFields();
        formRecord = Object.assign({}, data.record);
        yield setFieldsValue(formRecord);
      });
    }
    function onAdd() {
      openFormModal({ title: "\u65B0\u589E" });
    }
    function onEdit(record) {
      openFormModal({ title: "\u7F16\u8F91", record, isUpdate: true });
    }
    function onDelete(id) {
      loading.value = true;
      authDataDelete(id).then(reload).finally(() => loading.value = false);
    }
    function onSubmit() {
      return __async(this, null, function* () {
        try {
          formModalProps.confirmLoading = true;
          let formData = yield validate();
          formData = Object.assign({}, formRecord, formData);
          if (formData.ruleOperator == USE_SQL_RULES) {
            formData.ruleColumn = "";
          }
          formData.cgformId = props.cgformId;
          yield authDataSaveOrUpdate(formData, isUpdate);
          reload();
          closeModal();
        } finally {
          formModalProps.confirmLoading = false;
        }
      });
    }
    function onUpdateStatus(record) {
      loading.value = true;
      let status = Math.abs(record.status - 1);
      authDataUpdateStatus(__spreadProps(__spreadValues({}, record), { status })).then(() => {
        record.status = status;
      }).finally(() => {
        loading.value = false;
      });
    }
    function onRuleOperatorChange(val) {
      if (val == USE_SQL_RULES) {
        setFieldsValue({
          ruleColumn: ""
        });
      }
    }
    function getTableAction(record) {
      return [
        {
          label: "\u7F16\u8F91",
          onClick: () => onEdit(record)
        }
      ];
    }
    function getDropDownAction(record) {
      return [
        {
          label: "\u5220\u9664",
          popConfirm: {
            title: "\u786E\u5B9A\u5220\u9664\u5417\uFF1F",
            placement: "left",
            confirm: () => onDelete(record.id)
          }
        }
      ];
    }
    return {
      loading,
      formModalProps,
      onAdd,
      onUpdateStatus,
      getTableAction,
      getDropDownAction,
      registerTable,
      registerModal,
      registerForm
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent("a-button");
  const _component_a_switch = resolveComponent("a-switch");
  const _component_TableAction = resolveComponent("TableAction");
  const _component_BasicTable = resolveComponent("BasicTable");
  const _component_BasicForm = resolveComponent("BasicForm");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_BasicTable, {
      onRegister: _ctx.registerTable,
      loading: _ctx.loading
    }, {
      tableTitle: withCtx(() => [
        createVNode(_component_a_button, {
          onClick: _ctx.onAdd,
          type: "primary",
          preIcon: "ant-design:plus"
        }, {
          default: withCtx(() => [
            createTextVNode("\u65B0\u589E")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      switch: withCtx(({ text, record }) => [
        createVNode(_component_a_switch, {
          size: "small",
          checked: record.status === 1,
          onClick: () => _ctx.onUpdateStatus(record)
        }, null, 8, ["checked", "onClick"])
      ]),
      action: withCtx(({ record }) => [
        createVNode(_component_TableAction, {
          actions: _ctx.getTableAction(record),
          dropDownActions: _ctx.getDropDownAction(record)
        }, null, 8, ["actions", "dropDownActions"])
      ]),
      _: 1
    }, 8, ["onRegister", "loading"]),
    createVNode(_component_BasicModal, normalizeProps(guardReactiveProps(_ctx.formModalProps)), {
      default: withCtx(() => [
        createVNode(_component_a_spin, {
          spinning: _ctx.formModalProps.confirmLoading
        }, {
          default: withCtx(() => [
            createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ["onRegister"])
          ]),
          _: 1
        }, 8, ["spinning"])
      ]),
      _: 1
    }, 16)
  ]);
}
var AuthDataConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AuthDataConfig as default };
