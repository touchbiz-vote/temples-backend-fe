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
import {
  defineComponent,
  ref,
  computed,
  resolveComponent,
  openBlock,
  createBlock,
  mergeProps,
  withCtx,
  createVNode,
  normalizeClass,
  withDirectives,
  createElementVNode,
  vShow,
} from 'vue';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
import { u as useTableSync } from './useTableSync.js';
import { useMessage } from '/@/hooks/web/useMessage';
import { useJPrompt } from '/@/components/jeecg/JPrompt';
import { useDesign } from '/@/hooks/web/useDesign';
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
import 'vue-router';
var CheckDictTable_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = defineComponent({
  name: 'CheckDictTable',
  components: {
    VNodes: (_, { attrs }) => attrs.vnodes,
  },
  setup() {
    const { prefixCls } = useDesign('cgform-check-dict-table');
    const { createMessage: $message } = useMessage();
    const columns = ref([
      { title: '\u5B57\u6BB5\u540D\u79F0', key: 'dbFieldName', width: 100 },
      { title: '\u5B57\u6BB5\u5907\u6CE8', key: 'dbFieldTxt', width: 100 },
      {
        title: '\u5B57\u6BB5Href',
        key: 'fieldHref',
        width: 130,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u9A8C\u8BC1\u89C4\u5219',
        key: 'fieldValidType',
        width: 170,
        type: JVxeTypes.slot,
        slotName: 'fieldValidType',
        allowInput: true,
        defaultValue: '',
        placeholder: '\u7A7A',
      },
      {
        title: '\u6821\u9A8C\u5FC5\u586B',
        key: 'fieldMustInput',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: false,
      },
      {
        title: '\u5B57\u5178Table',
        key: 'dictTable',
        width: 280,
        type: JVxeTypes.textarea,
        defaultValue: '',
      },
      {
        title: '\u5B57\u5178Code',
        key: 'dictField',
        width: 280,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u5B57\u5178Text',
        key: 'dictText',
        width: 280,
        type: JVxeTypes.input,
        defaultValue: '',
      },
    ]);
    const setup = useTableSync(columns);
    const validTypeOptions = ref([
      { label: '\u7A7A', value: '' },
      { label: '\u552F\u4E00\u6821\u9A8C', value: 'only' },
      { label: '6\u523016\u4F4D\u6570\u5B57', value: 'n6-16' },
      { label: '6\u523018\u4F4D\u5B57\u6BCD', value: 's6-18' },
      { label: '6\u523016\u4F4D\u4EFB\u610F\u5B57\u7B26', value: '*6-16' },
      { label: '\u7F51\u5740', value: 'url' },
      { label: '\u7535\u5B50\u90AE\u4EF6', value: 'e' },
      { label: '\u624B\u673A\u53F7\u7801', value: 'm' },
      { label: '\u90AE\u653F\u7F16\u7801', value: 'p' },
      { label: '\u5B57\u6BCD', value: 's' },
      { label: '\u6570\u5B57', value: 'n' },
      { label: '\u6574\u6570', value: 'z' },
      { label: '\u975E\u7A7A', value: '*' },
      { label: '\u91D1\u989D', value: 'money' },
    ]);
    const validTypeValues = computed(() => {
      return validTypeOptions.value.map((opt) => opt.value);
    });
    const { createJPrompt } = useJPrompt();
    function isCustomRegexp(value) {
      return value != null && !validTypeValues.value.includes(value);
    }
    function onAddCustomRegexp(props) {
      createJPrompt({
        title: '\u81EA\u5B9A\u4E49\u6B63\u5219\u8868\u8FBE\u5F0F',
        placeholder: '\u8BF7\u8F93\u5165\u6B63\u5219\u8868\u8FBE\u5F0F',
        rules: [{ required: true, message: '\u6B63\u5219\u8868\u8FBE\u5F0F\u4E0D\u80FD\u4E3A\u7A7A\uFF01' }, { validator: validatorCustomRegexp }],
        onOk: (value) => {
          props.triggerChange(value);
          $message.success('\u6DFB\u52A0\u6210\u529F');
        },
      });
    }
    function onChangeCustomRegexp(props) {
      createJPrompt({
        title: '\u4FEE\u6539\u81EA\u5B9A\u4E49\u6B63\u5219\u8868\u8FBE\u5F0F',
        defaultValue: props.value,
        placeholder: '\u8BF7\u8F93\u5165\u6B63\u5219\u8868\u8FBE\u5F0F',
        rules: [{ required: true, message: '\u6B63\u5219\u8868\u8FBE\u5F0F\u4E0D\u80FD\u4E3A\u7A7A\uFF01' }, { validator: validatorCustomRegexp }],
        onOk: (value) => {
          props.triggerChange(value);
          if (value !== props.value) {
            $message.success('\u4FEE\u6539\u6210\u529F');
          }
        },
      });
    }
    function validatorCustomRegexp(_, value) {
      if (isCustomRegexp(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('\u5F53\u524D\u6821\u9A8C\u5DF2\u5B58\u5728');
      }
    }
    return __spreadProps(__spreadValues({}, setup), {
      prefixCls,
      columns,
      isCustomRegexp,
      validTypeOptions,
      validTypeValues,
      onAddCustomRegexp,
      onChangeCustomRegexp,
    });
  },
});
const _hoisted_1 = {
  class: 'custom-option-list rc-virtual-list-holder-inner',
  style: { 'border-top': '1px solid #dfdfdf' },
};
const _hoisted_2 = ['onClick'];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VNodes = resolveComponent('VNodes');
  const _component_a_select = resolveComponent('a-select');
  const _component_a_col = resolveComponent('a-col');
  const _component_a_button = resolveComponent('a-button');
  const _component_a_row = resolveComponent('a-row');
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
          class: [_ctx.prefixCls],
          maxHeight: _ctx.tableHeight.noToolbar,
          loading: _ctx.loading,
          columns: _ctx.columns,
          dataSource: _ctx.dataSource,
          disabledRows: { dbFieldName: ['id', 'has_child'] },
        },
        _ctx.tableProps
      ),
      {
        fieldValidType: withCtx((props) => [
          createVNode(
            _component_a_row,
            {
              type: 'flex',
              class: normalizeClass(['row-valid-type', { full: !_ctx.isCustomRegexp(props.value) }]),
            },
            {
              default: withCtx(() => [
                createVNode(
                  _component_a_col,
                  {
                    class: normalizeClass(['left']),
                  },
                  {
                    default: withCtx(() => [
                      createVNode(
                        _component_a_select,
                        {
                          value: props.value,
                          options: _ctx.validTypeOptions,
                          placeholder: '\u7A7A',
                          style: { width: '100%' },
                          onChange: props.triggerChange,
                        },
                        {
                          dropdownRender: withCtx(({ menuNode }) => [
                            createVNode(_component_VNodes, { vnodes: menuNode }, null, 8, ['vnodes']),
                            withDirectives(
                              createElementVNode(
                                'div',
                                _hoisted_1,
                                [
                                  createElementVNode(
                                    'div',
                                    {
                                      class: 'ant-select-item ant-select-item-option',
                                      title: '\u4F7F\u7528\u81EA\u5B9A\u4E49\u6B63\u5219\u8868\u8FBE\u5F0F\u4F5C\u4E3A\u6821\u9A8C\u89C4\u5219',
                                      onClick: ($event) => _ctx.onAddCustomRegexp(props),
                                    },
                                    ' \u6B63\u5219\u8868\u8FBE\u5F0F ',
                                    8,
                                    _hoisted_2
                                  ),
                                ],
                                512
                              ),
                              [[vShow, !_ctx.isCustomRegexp(props.value)]]
                            ),
                          ]),
                          _: 2,
                        },
                        1032,
                        ['value', 'options', 'onChange']
                      ),
                    ]),
                    _: 2,
                  },
                  1024
                ),
                createVNode(
                  _component_a_col,
                  {
                    class: 'right',
                    title: '\u4FEE\u6539\u81EA\u5B9A\u4E49\u6B63\u5219\u8868\u8FBE\u5F0F',
                  },
                  {
                    default: withCtx(() => [
                      createVNode(
                        _component_a_button,
                        {
                          preIcon: 'ant-design:edit',
                          onClick: () => _ctx.onChangeCustomRegexp(props),
                        },
                        null,
                        8,
                        ['onClick']
                      ),
                    ]),
                    _: 2,
                  },
                  1024
                ),
              ]),
              _: 2,
            },
            1032,
            ['class']
          ),
        ]),
        _: 1,
      },
      16,
      ['class', 'maxHeight', 'loading', 'columns', 'dataSource']
    )
  );
}
var CheckDictTable = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-68f6d466'],
]);
export { CheckDictTable as default };
