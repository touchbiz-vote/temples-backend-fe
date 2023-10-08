var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineComponent, ref, resolveComponent, openBlock, createBlock, mergeProps } from 'vue';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
import { u as useTableSync } from './useTableSync.js';
import { _ as _export_sfc } from './index.js';
import './cgform.data.js';
import '/@/utils/dict';
import '/@/utils/dict/JDictSelectUtil';
import '/@/utils/uuid';
import './pick.js';
import './_flatRest.js';
import './isArray.js';
import './toString.js';
import './_arrayPush.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
const _sfc_main = defineComponent({
  name: 'QueryTable',
  emits: ['query'],
  setup(_, { emit }) {
    const columns = ref([
      { title: '\u5B57\u6BB5\u540D\u79F0', key: 'dbFieldName', width: 130 },
      { title: '\u5B57\u6BB5\u5907\u6CE8', key: 'dbFieldTxt', width: 130 },
      {
        title: '\u63A7\u4EF6\u7C7B\u578B',
        key: 'queryShowType',
        width: 170,
        type: JVxeTypes.select,
        options: [
          { title: '\u6587\u672C\u6846', value: 'text' },
          { title: '\u65E5\u671F(yyyy-MM-dd)', value: 'date' },
          { title: '\u65E5\u671F\uFF08yyyy-MM-dd HH:mm:ss\uFF09', value: 'datetime' },
          { title: '\u65F6\u95F4\uFF08HH:mm:ss\uFF09', value: 'time' },
          { title: '\u4E0B\u62C9\u6846', value: 'list' },
          { title: '\u4E0B\u62C9\u591A\u9009\u6846', value: 'list_multi' },
          { title: '\u4E0B\u62C9\u641C\u7D22\u6846', value: 'sel_search' },
          { title: '\u5206\u7C7B\u5B57\u5178\u6811', value: 'cat_tree' },
          { title: 'Popup\u5F39\u6846', value: 'popup' },
          { title: '\u90E8\u95E8\u9009\u62E9', value: 'sel_depart' },
          { title: '\u7528\u6237\u9009\u62E9', value: 'sel_user' },
          { title: '\u7701\u5E02\u533A\u7EC4\u4EF6', value: 'pca' },
          { title: '\u81EA\u5B9A\u4E49\u6811\u63A7\u4EF6', value: 'sel_tree' },
        ],
        defaultValue: 'text',
        placeholder: '\u8BF7\u9009\u62E9${title}',
      },
      {
        title: '\u5B57\u5178Table',
        key: 'queryDictTable',
        width: 130,
        type: JVxeTypes.textarea,
        defaultValue: '',
      },
      {
        title: '\u5B57\u5178Code',
        key: 'queryDictField',
        width: 130,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u5B57\u5178Text',
        key: 'queryDictText',
        width: 130,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u9ED8\u8BA4\u503C',
        key: 'queryDefVal',
        width: 130,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u662F\u5426\u542F\u7528',
        key: 'queryConfigFlag',
        minWidth: 80,
        type: JVxeTypes.checkbox,
        customValue: ['1', '0'],
        defaultChecked: false,
      },
    ]);
    const setup = useTableSync(columns);
    function handleChange({ row, column, value }) {
      if (column.key === 'queryConfigFlag') {
        if (value === '1') {
          emit('query', row.id);
        }
      }
    }
    return __spreadProps(__spreadValues({}, setup), { columns, handleChange });
  },
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JVxeTable = resolveComponent('JVxeTable');
  return (
    openBlock(),
    createBlock(
      _component_JVxeTable,
      mergeProps(
        {
          ref: 'tableRef',
          rowNumber: '',
          keyboardEdit: '',
          maxHeight: _ctx.tableHeight.noToolbar,
          loading: _ctx.loading,
          columns: _ctx.columns,
          dataSource: _ctx.dataSource,
          disabledRows: { dbFieldName: ['id', 'has_child'] },
          onValueChange: _ctx.handleChange,
        },
        _ctx.tableProps
      ),
      null,
      16,
      ['maxHeight', 'loading', 'columns', 'dataSource', 'onValueChange']
    )
  );
}
var QueryTable = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { QueryTable as default };
