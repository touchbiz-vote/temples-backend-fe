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
import { d as authButtonLoadData, e as authButtonEnable, f as authButtonDisable } from "./auth.api.js";
import { b as authButtonColumns, c as authButtonFixedList } from "./auth.data.js";
import { _ as _export_sfc } from "./index.js";
import { b as baseClone } from "./_baseClone.js";
import "/@/utils/http/axios";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
import "./_arrayPush.js";
import "./isArray.js";
var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
const _sfc_main = defineComponent({
  name: "AuthButtonConfig",
  components: { BasicTable },
  props: {
    headId: {
      type: String,
      default: "",
      required: true
    }
  },
  setup(props) {
    const cgformId = ref("");
    const pageType = ref(2);
    const pageControlList = ref(3);
    const pageControlForm = ref(5);
    const [registerTable, { reload }] = useTable({
      api: loadData,
      rowKey: "code",
      bordered: true,
      columns: authButtonColumns,
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
        let result = yield authButtonLoadData(cgformId.value, params);
        let { authList, buttonList } = result;
        let dataSource = [];
        for (let btn of cloneDeep(authButtonFixedList)) {
          let item = {
            status: 0,
            page: pageControlList.value
          };
          let auth = authList.find((auth2) => auth2.code == btn.code);
          Object.assign(btn, item, auth);
          dataSource.push(btn);
        }
        return concatCustomButton(authList, buttonList, dataSource);
      });
    }
    function concatCustomButton(authList, buttonList, dataSource) {
      for (let btn of buttonList) {
        let auth = authList.find((auth2) => auth2.code == btn.buttonCode);
        let item = {
          code: btn.buttonCode,
          title: btn.buttonName,
          status: 0,
          page: btn.buttonStyle == "form" ? pageControlForm.value : pageControlList.value
        };
        dataSource.push(Object.assign(item, auth));
      }
      return dataSource;
    }
    function onUpdateStatus(flag, record) {
      return __async(this, null, function* () {
        flag ? doEnableAuthButton(record) : doDisableAuthButton(record);
      });
    }
    function doEnableAuthButton(record) {
      return __async(this, null, function* () {
        let result = yield authButtonEnable({
          id: record.id,
          code: record.code,
          page: record.page,
          cgformId: cgformId.value,
          type: pageType.value,
          control: 5,
          status: 1
        });
        record.id = result.id;
        record.status = 1;
      });
    }
    function doDisableAuthButton(record) {
      return __async(this, null, function* () {
        yield authButtonDisable(record.id);
        record.status = 0;
      });
    }
    return { registerTable, onUpdateStatus };
  }
});
const _hoisted_1 = { class: "auth-field-config" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_switch = resolveComponent("a-switch");
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
      control: withCtx(() => [
        createTextVNode(" \u53EF\u89C1 ")
      ]),
      _: 1
    }, 8, ["onRegister"])
  ]);
}
var AuthButtonConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AuthButtonConfig as default };
