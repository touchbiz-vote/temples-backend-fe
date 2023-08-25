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
import { defineComponent, resolveComponent, openBlock, createBlock, withCtx, createElementVNode } from "vue";
import { defHttp } from "/@/utils/http/axios";
import { BasicTable } from "/@/components/Table";
import { useListPage } from "/@/hooks/system/useListPage";
import { _ as _export_sfc } from "./index.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "LeftUser",
  components: { BasicTable },
  emits: ["select"],
  setup(_, { emit }) {
    const { tableContext, createMessage: $message } = useListPage({
      tableProps: {
        api: loadData,
        rowKey: "id",
        size: "small",
        bordered: true,
        columns: [
          { title: "\u8D26\u53F7", dataIndex: "username", width: 200 },
          { title: "\u59D3\u540D", dataIndex: "realname", width: 200 }
        ],
        rowSelection: {
          type: "radio",
          onChange(selectedRowKeys) {
            if (selectedRowKeys.length > 0) {
              emit("select", selectedRowKeys[0]);
            }
          }
        },
        formConfig: {
          schemas: [
            {
              label: "\u8D26\u53F7",
              field: "username",
              component: "JInput",
              componentProps: {
                placeholder: "\u8F93\u5165\u8D26\u53F7\u6A21\u7CCA\u67E5\u8BE2"
              }
            },
            {
              label: "\u59D3\u540D",
              field: "realname",
              component: "JInput",
              componentProps: {
                placeholder: "\u8F93\u5165\u59D3\u540D\u6A21\u7CCA\u67E5\u8BE2"
              }
            }
          ]
        },
        canResize: false,
        clickToRowSelect: true,
        showActionColumn: false,
        showTableSetting: false
      }
    });
    const [registerTable, { clearSelectedRowKeys }, { rowSelection }] = tableContext;
    function loadData(params) {
      return __async(this, null, function* () {
        let { code, success, result, message } = yield defHttp.get(
          {
            url: "/sys/user/list",
            params
          },
          { isTransformResponse: false }
        );
        if (success) {
          return result;
        }
        if (code === 510) {
          $message.warning(message);
        }
        return {};
      });
    }
    function clearSelected() {
      clearSelectedRowKeys();
    }
    return { rowSelection, registerTable, clearSelected };
  }
});
const _hoisted_1 = /* @__PURE__ */ createElementVNode("span", null, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicTable = resolveComponent("BasicTable");
  return openBlock(), createBlock(_component_BasicTable, {
    onRegister: _ctx.registerTable,
    rowSelection: _ctx.rowSelection
  }, {
    tableTop: withCtx(() => [
      _hoisted_1
    ]),
    _: 1
  }, 8, ["onRegister", "rowSelection"]);
}
var LeftUser = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LeftUser as default };
