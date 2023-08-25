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
import { defineComponent, ref, watch, resolveComponent, openBlock, createElementBlock, createVNode, withCtx, createTextVNode } from "vue";
import { BasicTable, useTable } from "/@/components/Table";
import { a as authFieldLoadData, b as authFieldUpdateStatus, c as authFieldUpdateCheckbox } from "./auth.api.js";
import { a as authFieldColumns } from "./auth.data.js";
import { _ as _export_sfc } from "./index.js";
import "/@/utils/http/axios";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
var AuthFieldConfig_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = defineComponent({
  name: "AuthFieldConfig",
  components: { BasicTable },
  props: {
    headId: {
      type: String,
      default: "",
      required: true
    }
  },
  emits: ["update:authFields"],
  setup(props, { emit }) {
    const cgformId = ref("");
    const [registerTable, { reload }] = useTable({
      api: loadData,
      rowKey: "code",
      bordered: true,
      columns: authFieldColumns,
      showIndexColumn: false
    });
    watch(
      () => props.headId,
      (headId) => {
        cgformId.value = headId.split("?")[0];
        reload().catch(() => null);
      },
      { immediate: true }
    );
    function loadData(params) {
      return __async(this, null, function* () {
        const exclude = ["id"];
        let data = yield authFieldLoadData(cgformId.value, params);
        let fields = [];
        let filterData = [];
        data.forEach((item) => {
          if (exclude.indexOf(item.code) < 0) {
            if (item.isShowForm == 1 || item.isShowList == 1) {
              filterData.push(item);
            }
            if (item.dbIsPersist == 1) {
              fields.push({ text: item.title, value: item.code });
            }
          }
        });
        emit("update:authFields", fields);
        return filterData;
      });
    }
    function onUpdateStatus(flag, record) {
      return __async(this, null, function* () {
        yield authFieldUpdateStatus({
          cgformId: cgformId.value,
          code: record.code,
          status: flag ? 1 : 0
        });
        if (!(record.formEditable || record.formShow || record.listShow)) {
          record.formEditable = true;
          record.formShow = true;
          record.listShow = true;
        }
        record.status = Math.abs(record.status - 1);
      });
    }
    function onCheckboxChange(event, record, switchFlag) {
      return __async(this, null, function* () {
        let checked = event.target.checked;
        yield authFieldUpdateCheckbox({
          cgformId: cgformId.value,
          code: record.code,
          switchFlag,
          listShow: checked,
          formShow: checked,
          formEditable: checked
        });
        if (switchFlag == 1) {
          record.listShow = checked;
        } else if (switchFlag == 2) {
          record.formShow = checked;
        } else if (switchFlag == 3) {
          record.formEditable = checked;
        }
      });
    }
    return { registerTable, onUpdateStatus, onCheckboxChange };
  }
});
const _hoisted_1 = { class: "auth-field-config" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_switch = resolveComponent("a-switch");
  const _component_a_checkbox = resolveComponent("a-checkbox");
  const _component_BasicTable = resolveComponent("BasicTable");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_BasicTable, { onRegister: _ctx.registerTable }, {
      switch: withCtx(({ text, record }) => [
        createVNode(_component_a_switch, {
          size: "small",
          checked: record.status === 1,
          onChange: (flag) => _ctx.onUpdateStatus(flag, record)
        }, null, 8, ["checked", "onChange"])
      ]),
      list: withCtx(({ text, record }) => [
        createVNode(_component_a_checkbox, {
          checked: record.listShow,
          disabled: record.status === 0,
          onChange: (e) => _ctx.onCheckboxChange(e, record, 1)
        }, {
          default: withCtx(() => [
            createTextVNode(" \u53EF\u89C1 ")
          ]),
          _: 2
        }, 1032, ["checked", "disabled", "onChange"])
      ]),
      form: withCtx(({ text, record }) => [
        createVNode(_component_a_checkbox, {
          checked: record.formShow,
          disabled: record.status === 0,
          onChange: (e) => _ctx.onCheckboxChange(e, record, 2)
        }, {
          default: withCtx(() => [
            createTextVNode(" \u53EF\u89C1 ")
          ]),
          _: 2
        }, 1032, ["checked", "disabled", "onChange"]),
        createVNode(_component_a_checkbox, {
          checked: record.formEditable,
          disabled: record.status === 0,
          onChange: (e) => _ctx.onCheckboxChange(e, record, 3)
        }, {
          default: withCtx(() => [
            createTextVNode(" \u53EF\u7F16\u8F91 ")
          ]),
          _: 2
        }, 1032, ["checked", "disabled", "onChange"])
      ]),
      _: 1
    }, 8, ["onRegister"])
  ]);
}
var AuthFieldConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-63e05357"]]);
export { AuthFieldConfig as default };
