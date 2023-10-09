var __defProp = Object.defineProperty;
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
    var step = (x) => (x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected));
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import {
  defineComponent,
  ref,
  reactive,
  computed,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createVNode,
  createTextVNode,
  createElementBlock,
  createCommentVNode,
  normalizeProps,
  guardReactiveProps,
  nextTick,
} from 'vue';
import { u as useOnlineTest } from './useOnlineTest.js';
import { useListPage } from '/@/hooks/system/useListPage';
import { BasicTable, TableAction } from '/@/components/Table';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form';
import { defHttp } from '/@/utils/http/axios';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
const list = (code, params) => defHttp.get({ url: '/online/cgform/button/list/' + code, params });
function doBatchDelete(idList) {
  return defHttp.delete(
    {
      url: '/online/cgform/button/deleteBatch',
      params: {
        ids: idList.join(','),
      },
    },
    { joinParamsToUrl: true }
  );
}
const saveOrUpdate = (params, isUpdate) => {
  if (isUpdate) {
    return defHttp.put({ url: '/online/cgform/button/edit', params });
  } else {
    return defHttp.post({ url: '/online/cgform/button/add', params });
  }
};
const columns = [
  { title: '\u6309\u94AE\u7F16\u7801', align: 'center', dataIndex: 'buttonCode' },
  { title: '\u6309\u94AE\u540D\u79F0', align: 'center', dataIndex: 'buttonName' },
  {
    title: '\u6309\u94AE\u6837\u5F0F',
    align: 'center',
    dataIndex: 'buttonStyle',
    customRender({ text, record }) {
      if (text === 'form') {
        let p = record.optPosition;
        return text + '(' + (p == '2' ? '\u5E95\u90E8' : '\u4FA7\u9762') + ')';
      } else {
        return text;
      }
    },
  },
  { title: '\u6309\u94AE\u7C7B\u578B', align: 'center', dataIndex: 'optType' },
  { title: '\u6392\u5E8F', align: 'center', dataIndex: 'orderNum' },
  { title: '\u6309\u94AE\u56FE\u6807', align: 'center', dataIndex: 'buttonIcon' },
  { title: '\u8868\u8FBE\u5F0F', align: 'center', dataIndex: 'exp' },
  {
    title: '\u6309\u94AE\u72B6\u6001',
    align: 'center',
    dataIndex: 'buttonStatus',
    customRender({ text }) {
      if (text == 1) {
        return '\u6FC0\u6D3B';
      } else {
        return '\u672A\u6FC0\u6D3B';
      }
    },
  },
];
const formSchemas = [
  {
    label: '\u6309\u94AE\u7F16\u7801',
    field: 'buttonCode',
    component: 'Input',
    required: true,
  },
  {
    label: '\u6309\u94AE\u540D\u79F0',
    field: 'buttonName',
    component: 'Input',
    required: true,
  },
  {
    label: '\u6309\u94AE\u6837\u5F0F',
    field: 'buttonStyle',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Link', value: 'link' },
        { label: 'Button', value: 'button' },
        { label: 'Form', value: 'form' },
      ],
    },
    defaultValue: 'link',
  },
  {
    label: '\u6309\u94AE\u4F4D\u7F6E',
    field: 'optPosition',
    component: 'Select',
    componentProps: {
      options: [
        { label: '\u4FA7\u9762', value: '1' },
        { label: '\u5E95\u90E8', value: '2' },
      ],
    },
    defaultValue: '2',
    show: ({ model }) => model.buttonStyle === 'form',
  },
  {
    label: '\u6309\u94AE\u7C7B\u578B',
    field: 'optType',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Js', value: 'js' },
        { label: 'Action', value: 'action' },
      ],
    },
    defaultValue: 'js',
  },
  {
    label: '\u6392\u5E8F',
    field: 'orderNum',
    component: 'InputNumber',
    componentProps: {
      style: 'width: 100%',
    },
  },
  {
    label: '\u6309\u94AE\u56FE\u6807',
    field: 'buttonIcon',
    component: 'Input',
    helpMessage: 'a-icon type',
  },
  {
    label: '\u8868\u8FBE\u5F0F',
    field: 'exp',
    component: 'Input',
  },
  {
    label: '\u6309\u94AE\u72B6\u6001',
    field: 'buttonStatus',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '\u6FC0\u6D3B', value: '1' },
        { label: '\u672A\u6FC0\u6D3B', value: '0' },
      ],
    },
    defaultValue: '1',
  },
];
const _sfc_main = defineComponent({
  name: 'CustomButtonList',
  components: { BasicModal, BasicTable, TableAction, BasicForm },
  emits: ['register'],
  setup() {
    const code = ref('');
    const { doRequest, doDeleteRecord, tableContext } = useListPage({
      tableProps: {
        api: (params) => list(code.value, params),
        columns,
        canResize: false,
        useSearchForm: false,
        beforeFetch(params) {
          return Object.assign(params, { column: 'orderNum', order: 'asc' });
        },
      },
    });
    const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
    const [registerModal, { closeModal }] = useModalInner((data) =>
      __async(this, null, function* () {
        code.value = data.row.id;
        reload();
      })
    );
    const { aiTestMode, genButtons } = useOnlineTest();
    const [registerFormModal, formModal] = useModal();
    const isUpdate = ref(false);
    const formModalProps = reactive({
      onRegister: registerFormModal,
      title: computed(() => ((isUpdate.value == null ? void 0 : isUpdate.value) ? '\u4FEE\u6539' : '\u65B0\u589E')),
      width: 800,
      confirmLoading: false,
      onOk: onSubmit,
      onCancel: formModal.closeModal,
    });
    let formRecord = {};
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
    });
    function openFormModal(data) {
      return __async(this, null, function* () {
        var _a;
        isUpdate.value = data.isUpdate;
        formRecord = __spreadValues({}, (_a = data.record) != null ? _a : {});
        formModal.openModal();
        yield nextTick();
        yield resetFields();
        setFieldsValue(formRecord);
      });
    }
    function onAdd() {
      openFormModal({ isUpdate: false });
    }
    function onEdit(record) {
      openFormModal({ isUpdate: true, record });
    }
    function onCancel() {
      closeModal();
    }
    function onGenButtons() {
      genButtons(code.value);
    }
    function onBatchDelete() {
      return __async(this, null, function* () {
        doRequest(() => doBatchDelete(selectedRowKeys.value));
      });
    }
    function onSubmit() {
      return __async(this, null, function* () {
        try {
          formModalProps.confirmLoading = true;
          let values = yield validate();
          values = Object.assign({ cgformHeadId: code.value }, formRecord, values);
          yield saveOrUpdate(values, isUpdate.value);
          reload();
          formModal.closeModal();
        } finally {
          formModalProps.confirmLoading = false;
        }
      });
    }
    function getTableAction(record) {
      return [
        {
          label: '\u7F16\u8F91',
          onClick: () => onEdit(record),
        },
      ];
    }
    function getDropDownAction(record) {
      return [
        {
          label: '\u5220\u9664',
          popConfirm: {
            title: '\u786E\u5B9A\u5220\u9664\u5417\uFF1F',
            placement: 'left',
            confirm: () => doDeleteRecord(() => doBatchDelete([record.id])),
          },
        },
      ];
    }
    return {
      onAdd,
      onBatchDelete,
      aiTestMode,
      onGenButtons,
      registerModal,
      registerTable,
      selectedRowKeys,
      rowSelection,
      onCancel,
      getTableAction,
      getDropDownAction,
      registerForm,
      formModalProps,
    };
  },
});
const _hoisted_1 = {
  key: 0,
  style: { float: 'left' },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent('a-button');
  const _component_a_icon = resolveComponent('a-icon');
  const _component_a_menu_item = resolveComponent('a-menu-item');
  const _component_a_menu = resolveComponent('a-menu');
  const _component_a_dropdown = resolveComponent('a-dropdown');
  const _component_TableAction = resolveComponent('TableAction');
  const _component_BasicTable = resolveComponent('BasicTable');
  const _component_BasicForm = resolveComponent('BasicForm');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      {
        onRegister: _ctx.registerModal,
        title: '\u81EA\u5B9A\u4E49\u6309\u94AE',
        width: 1200,
        defaultFullscreen: '',
        onCancel: _ctx.onCancel,
      },
      {
        footer: withCtx(() => [
          createVNode(
            _component_a_button,
            { onClick: _ctx.onCancel },
            {
              default: withCtx(() => [createTextVNode('\u5173\u95ED')]),
              _: 1,
            },
            8,
            ['onClick']
          ),
          _ctx.aiTestMode
            ? (openBlock(),
              createElementBlock('div', _hoisted_1, [
                createVNode(
                  _component_a_button,
                  { onClick: _ctx.onGenButtons },
                  {
                    default: withCtx(() => [createTextVNode('\u751F\u6210\u6D4B\u8BD5\u6570\u636E')]),
                    _: 1,
                  },
                  8,
                  ['onClick']
                ),
              ]))
            : createCommentVNode('', true),
        ]),
        default: withCtx(() => [
          createVNode(
            _component_BasicTable,
            {
              onRegister: _ctx.registerTable,
              rowSelection: _ctx.rowSelection,
            },
            {
              tableTitle: withCtx(() => [
                createVNode(
                  _component_a_button,
                  {
                    onClick: _ctx.onAdd,
                    type: 'primary',
                    preIcon: 'ant-design:plus',
                  },
                  {
                    default: withCtx(() => [createTextVNode('\u65B0\u589E')]),
                    _: 1,
                  },
                  8,
                  ['onClick']
                ),
                _ctx.selectedRowKeys.length > 0
                  ? (openBlock(),
                    createBlock(
                      _component_a_dropdown,
                      { key: 0 },
                      {
                        overlay: withCtx(() => [
                          createVNode(_component_a_menu, null, {
                            default: withCtx(() => [
                              createVNode(
                                _component_a_menu_item,
                                {
                                  key: '1',
                                  onClick: _ctx.onBatchDelete,
                                },
                                {
                                  default: withCtx(() => [createVNode(_component_a_icon, { type: 'delete' }), createTextVNode(' \u5220\u9664 ')]),
                                  _: 1,
                                },
                                8,
                                ['onClick']
                              ),
                            ]),
                            _: 1,
                          }),
                        ]),
                        default: withCtx(() => [
                          createVNode(
                            _component_a_button,
                            { style: { 'margin-left': '8px' } },
                            {
                              default: withCtx(() => [
                                createTextVNode(' \u6279\u91CF\u64CD\u4F5C '),
                                createVNode(_component_a_icon, { type: 'down' }),
                              ]),
                              _: 1,
                            }
                          ),
                        ]),
                        _: 1,
                      }
                    ))
                  : createCommentVNode('', true),
              ]),
              action: withCtx(({ record }) => [
                createVNode(
                  _component_TableAction,
                  {
                    actions: _ctx.getTableAction(record),
                    dropDownActions: _ctx.getDropDownAction(record),
                  },
                  null,
                  8,
                  ['actions', 'dropDownActions']
                ),
              ]),
              _: 1,
            },
            8,
            ['onRegister', 'rowSelection']
          ),
          createVNode(
            _component_BasicModal,
            normalizeProps(guardReactiveProps(_ctx.formModalProps)),
            {
              default: withCtx(() => [
                createVNode(
                  _component_a_spin,
                  {
                    spinning: _ctx.formModalProps.confirmLoading,
                  },
                  {
                    default: withCtx(() => [createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ['onRegister'])]),
                    _: 1,
                  },
                  8,
                  ['spinning']
                ),
              ]),
              _: 1,
            },
            16
          ),
        ]),
        _: 1,
      },
      8,
      ['onRegister', 'onCancel']
    )
  );
}
var CustomButtonList = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { CustomButtonList as default };
