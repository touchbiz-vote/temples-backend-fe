import { defineComponent, ref, resolveComponent, openBlock, createBlock, mergeProps } from "vue";
import { JVxeTypes } from "/@/components/jeecg/JVxeTable/types";
import { u as useTableSync } from "./useTableSync.js";
import { _ as _export_sfc } from "./index.js";
import "./cgform.data.js";
import "/@/utils/dict";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/uuid";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "/@/hooks/web/useMessage";
import "vue-router";
const _sfc_main = defineComponent({
  name: "IndexTable",
  components: {},
  props: {
    actionButton: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  setup() {
    const columns = ref([
      {
        title: "\u7D22\u5F15\u540D\u79F0",
        key: "indexName",
        width: 330,
        type: JVxeTypes.input,
        defaultValue: "",
        placeholder: "\u8BF7\u8F93\u5165${title}",
        validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }]
      },
      {
        title: "\u7D22\u5F15\u680F\u4F4D",
        key: "indexField",
        width: 330,
        type: JVxeTypes.selectMultiple,
        options: [],
        defaultValue: "",
        placeholder: "\u8BF7\u9009\u62E9${title}",
        validateRules: [{ required: true, message: "\u8BF7\u9009\u62E9${title}" }]
      },
      {
        title: "\u7D22\u5F15\u7C7B\u578B",
        key: "indexType",
        width: 330,
        type: JVxeTypes.select,
        options: [
          { title: "normal", value: "normal" },
          { title: "unique", value: "unique" }
        ],
        defaultValue: "normal",
        placeholder: "\u8BF7\u9009\u62E9${title}",
        validateRules: [{ required: true, message: "\u8BF7\u9009\u62E9${title}" }]
      }
    ]);
    const setup = useTableSync(columns);
    const { tableRef, loading, dataSource, tableHeight, tableProps, setDataSource, validateData } = setup;
    function syncTable(dbTable) {
      let options = [];
      let data = dbTable.value.tableRef.getTableData();
      data.forEach((value) => {
        if (value.dbFieldName) {
          options.push({
            title: value.dbFieldName,
            value: value.dbFieldName
          });
        }
      });
      columns.value[1].options = options;
    }
    return { tableRef, loading, dataSource, columns, tableHeight, tableProps, syncTable, setDataSource, validateData };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JVxeTable = resolveComponent("JVxeTable");
  return openBlock(), createBlock(_component_JVxeTable, mergeProps({
    ref: "tableRef",
    rowNumber: "",
    rowSelection: "",
    dragSort: "",
    keyboardEdit: "",
    sortKey: "orderNum",
    maxHeight: _ctx.tableHeight.normal,
    loading: _ctx.loading,
    columns: _ctx.columns,
    dataSource: _ctx.dataSource,
    toolbar: _ctx.actionButton
  }, _ctx.tableProps), null, 16, ["maxHeight", "loading", "columns", "dataSource", "toolbar"]);
}
var IndexTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { IndexTable as default };
