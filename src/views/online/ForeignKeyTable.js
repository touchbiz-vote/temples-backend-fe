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
  name: 'ForeignKeyTable',
  props: {
    actionButton: { type: Boolean, default: true },
  },
  setup() {
    const columns = ref([
      { title: '\u5B57\u6BB5\u540D\u79F0', key: 'dbFieldName', width: 160 },
      { title: '\u5B57\u6BB5\u5907\u6CE8', key: 'dbFieldTxt', width: 160 },
      {
        title: '\u4E3B\u8868\u540D',
        key: 'mainTable',
        width: 280,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u4E3B\u8868\u5B57\u6BB5',
        key: 'mainField',
        width: 280,
        type: JVxeTypes.input,
        defaultValue: '',
      },
    ]);
    const setup = useTableSync(columns);
    return __spreadProps(__spreadValues({}, setup), { columns });
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
          disabled: !_ctx.actionButton,
          disabledRows: { dbFieldName: ['id', 'has_child'] },
        },
        _ctx.tableProps
      ),
      null,
      16,
      ['maxHeight', 'loading', 'columns', 'dataSource', 'disabled']
    )
  );
}
var ForeignKeyTable = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { ForeignKeyTable as default };
