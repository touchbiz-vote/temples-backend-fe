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
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { u as useOnlineTest } from './useOnlineTest.js';
import { b as useSqlFormSchemas, c as useSqlColumns } from './enhance.data.js';
import { c as getEnhanceSqlByCode, e as saveEnhanceSql, f as doEnhanceSqlBatchDelete } from './enhance.api.js';
import { _ as _export_sfc } from './index.js';
import './cgform.data.js';
import '/@/utils/dict';
import '/@/utils/dict/JDictSelectUtil';
import '/@/utils/uuid';
import '/@/utils/http/axios';
import '/@/utils/is';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
const _sfc_main = defineComponent({
  name: 'EnhanceSqlModal',
  components: { BasicModal, BasicTable, BasicForm, TableAction },
  emits: ['register'],
  setup() {
    const code = ref('');
    const tableName = ref('');
    const btnList = ref([]);
    const { columns } = useSqlColumns(btnList);
    const { doRequest, doDeleteRecord, tableContext } = useListPage({
      tableProps: {
        api: (params) =>
          __async(this, null, function* () {
            let { dataSource, btnList: $btnList } = yield getEnhanceSqlByCode(code.value, params);
            btnList.value = $btnList;
            return dataSource;
          }),
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
        tableName.value = data.row.tableName;
        reload();
      })
    );
    const { aiTestMode, genEnhanceSqlData } = useOnlineTest();
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
    const { formSchemas } = useSqlFormSchemas(btnList);
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
    });
    function onCancel() {
      closeModal();
    }
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
    function onGenEnhanceSqlData() {
      genEnhanceSqlData(code.value, tableName.value);
    }
    function onBatchDelete() {
      return __async(this, null, function* () {
        doRequest(() => doEnhanceSqlBatchDelete(selectedRowKeys.value));
      });
    }
    function onSubmit() {
      return __async(this, null, function* () {
        try {
          formModalProps.confirmLoading = true;
          let values = yield validate();
          values = Object.assign({}, formRecord, values);
          yield saveEnhanceSql(code.value, values, isUpdate.value);
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
            confirm: () => doDeleteRecord(() => doEnhanceSqlBatchDelete([record.id])),
          },
        },
      ];
    }
    return {
      rowSelection,
      selectedRowKeys,
      aiTestMode,
      onCancel,
      onAdd,
      onGenEnhanceSqlData,
      onBatchDelete,
      getTableAction,
      getDropDownAction,
      formModalProps,
      registerModal,
      registerTable,
      registerForm,
    };
  },
  computed: {
    tableScroll() {
      let height = window.innerHeight;
      return {
        y: height - 320,
      };
    },
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
        title: 'SQL\u589E\u5F3A',
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
                  { onClick: _ctx.onGenEnhanceSqlData },
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
var EnhanceSqlModal = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { EnhanceSqlModal as default };
