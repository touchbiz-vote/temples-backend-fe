var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
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
  computed,
  provide,
  reactive,
  nextTick,
  resolveComponent,
  openBlock,
  createBlock,
  mergeProps,
  withCtx,
  createVNode,
  createTextVNode,
  createElementBlock,
  Fragment,
  renderList,
  toDisplayString,
  createCommentVNode,
  createElementVNode,
  toRaw,
} from 'vue';
import { Icon } from '/@/components/Icon';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { useMessage } from '/@/hooks/web/useMessage';
import { u as useFormSchemas } from './useSchemas.js';
import DBAttributeTable from './DBAttributeTable.js';
import PageAttributeTable from './PageAttributeTable.js';
import CheckDictTable from './CheckDictTable.js';
import ForeignKeyTable from './ForeignKeyTable.js';
import IndexTable from './IndexTable.js';
import QueryTable from './QueryTable.js';
import ExtendConfigModal from './ExtendConfigModal.js';
import { u as useInitialData, E as ExtConfigDefaultJson, a as useTreeNeedFields, V as VALIDATE_FAILED } from './cgform.data.js';
import { defHttp } from '/@/utils/http/axios';
import { simpleDebounce } from '/@/utils/common/compUtils';
import { u as useOnlineTest } from './useOnlineTest.js';
import { buildUUID } from '/@/utils/uuid';
import { sleep } from '/@/utils';
import { g as getRefPromise } from './useExtendComponent.js';
import { _ as _export_sfc } from './index.js';
const list = (params) => defHttp.get({ url: '/online/cgform/head/list', params });
const doBatchRemove = (idList) => doRemove(idList, 0);
const doSingleRemove = (pid) => defHttp.delete({ url: '/online/cgform/head/removeRecord', params: { id: pid } }, { joinParamsToUrl: true });
const doBatchDelete = (idList) => doRemove(idList, 1);
const doSingleDelete = (pid) => defHttp.delete({ url: '/online/cgform/head/delete', params: { id: pid } }, { joinParamsToUrl: true });
function doRemove(idList, flag) {
  return defHttp.delete(
    {
      url: '/online/cgform/head/deleteBatch',
      params: {
        ids: idList.join(','),
        flag,
      },
    },
    { joinParamsToUrl: true }
  );
}
const doDatabaseSync = (id, method) =>
  defHttp.post({
    url: `${'/online/cgform/api/doDbSynch'}/${id}/${method}`,
    timeout: 12e3,
    timeoutErrorMessage: '\u540C\u6B65\u6570\u636E\u5E93\u8D85\u65F6\uFF0C\u5DF2\u81EA\u52A8\u5237\u65B0',
  });
const doCopyOnlineView = (id) => defHttp.post({ url: `${'/online/cgform/head/copyOnline'}?code=${id}` });
const doCopyTable = (id, tableName, params) =>
  defHttp.get({ url: `${'/online/cgform/head/copyOnlineTable'}/${id}`, params: __spreadValues({ tableName }, params) });
const formApi = {
  doQueryField: (headId, params) => defHttp.get({ url: '/api/online/cgform/field/listByHeadId', params: __spreadValues({ headId }, params) }),
  doQueryIndexes: (headId, params) => defHttp.get({ url: '/online/cgform/index/listByHeadId', params: __spreadValues({ headId }, params) }),
  doSaveOrUpdate: (params, isUpdate) => {
    if (isUpdate) {
      return defHttp.put({ url: '/api/online/cgform/api/editAll', params });
    } else {
      return defHttp.post({ url: '/api/online/cgform/api/addAll', params });
    }
  },
  editHead: (params) => {
    return defHttp.put({ url: '/online/cgform/head/edit', params });
  },
};
const _sfc_main = defineComponent({
  name: 'CgformModal',
  components: {
    BasicModal,
    BasicForm,
    DBAttributeTable,
    PageAttributeTable,
    CheckDictTable,
    ForeignKeyTable,
    IndexTable,
    QueryTable,
    ExtendConfigModal,
    Icon,
  },
  props: {
    actionButton: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  emits: ['success', 'register'],
  setup(props, { emit }) {
    const { createMessage: $message } = useMessage();
    const modalRef = ref();
    const isUpdate = ref(false);
    let model = {};
    const title = computed(() => (isUpdate.value ? '\u7F16\u8F91' : '\u65B0\u589E'));
    const confirmLoading = ref(true);
    const tableLoading = ref(false);
    const activeKey = ref('dbTable');
    const hideTabs = ref(true);
    const tables = {
      dbTable: ref(),
      pageTable: ref(),
      checkTable: ref(),
      fkTable: ref(),
      idxTable: ref(),
      queryTable: ref(),
    };
    const fullScreenRef = computed(() => {
      var _a, _b;
      return (_b = (_a = modalRef.value) == null ? void 0 : _a.fullScreenRef) != null ? _b : false;
    });
    provide('tables', tables);
    provide('fullScreenRef', fullScreenRef);
    const { formSchemas } = useFormSchemas(props, {
      onTableTypeChange,
      onIsTreeChange,
      ifShowOfSubTableStr: () => showSubTableStr,
    });
    const [registerForm, formAction] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: 'right',
    });
    const { resetFields, setFieldsValue, validate } = formAction;
    const [registerModal, { closeModal }] = useModalInner((data) => {
      var _a;
      isUpdate.value = (_a = data == null ? void 0 : data.isUpdate) != null ? _a : false;
      if (isUpdate.value) {
        edit(data == null ? void 0 : data.record);
      } else {
        add();
      }
    });
    const oldTableName = ref('');
    let extConfigJson = reactive({});
    const syncAllTableNowDebounce = simpleDebounce(() => syncAllTableNowPromise(), 150);
    let fieldTempIds = [];
    let showSubTableStr = false;
    let treeFieldAdded = false;
    let treeFieldIds = [];
    const { aiTestMode, aiTestTable, aiTableList, initVirtualData, tableJsonGetHelper, refreshCacheTableName } = useOnlineTest();
    function add() {
      edit({});
    }
    function edit(record) {
      return __async(this, null, function* () {
        var _a;
        confirmLoading.value = false;
        activeKey.value = 'dbTable';
        yield resetFields();
        model = Object.assign({}, record);
        initialAllShowItem(model);
        tableJsonGetHelper(model);
        initialExtConfigJson(model);
        setFieldsValue(model);
        oldTableName.value = model.tableName;
        sleep(1, () => (hideTabs.value = false));
        if (isUpdate.value) {
          (_a = tables.dbTable.value) == null ? void 0 : _a.setDataSource([]);
          yield loadFields(model.id);
          yield loadIndexes(model.id);
          getRefPromise(tables.pageTable).then(() => {
            tables.pageTable.value.changePageType(model.tableType == 3);
          });
        } else {
          let { initialData, tempIds } = useInitialData();
          yield setAllTableData(initialData, true);
          fieldTempIds = tempIds;
        }
      });
    }
    function loadFields(headId) {
      return __async(this, null, function* () {
        tableLoading.value = true;
        try {
          let fields = yield formApi.doQueryField(headId);
          tableLoading.value = false;
          yield setAllTableData(fields);
        } finally {
          tableLoading.value = false;
        }
      });
    }
    function loadIndexes(headId) {
      return __async(this, null, function* () {
        let indexes = yield formApi.doQueryIndexes(headId);
        tables.idxTable.value.setDataSource(indexes);
      });
    }
    function initialExtConfigJson(record) {
      let parseJSON = {};
      if (record.extConfigJson) {
        try {
          parseJSON = JSON.parse(record.extConfigJson);
        } catch (e) {
          console.error('online\u6269\u5C55JSON\u8F6C\u6362\u5931\u8D25\uFF1A', e);
        }
      }
      extConfigJson = Object.assign({}, ExtConfigDefaultJson, parseJSON, {
        isDesForm: record.isDesForm || 'N',
        desFormCode: record.desFormCode || '',
      });
    }
    function initialAllShowItem(model2) {
      treeFieldAdded = model2.isTree == 'Y';
      showSubTableStr = model2.tableType === 2;
    }
    function setAllTableData(data, insert) {
      return __async(this, null, function* () {
        const { dbTable, pageTable, checkTable, fkTable, queryTable } = tables;
        if (!dbTable.value) {
          yield nextTick();
          yield sleep(1);
        }
        dbTable.value.setDataSource(data, insert);
        setTimeout(() => {
          pageTable.value.setDataSource(data, insert);
          checkTable.value.setDataSource(data, insert);
          fkTable.value.setDataSource(data, insert);
          queryTable.value.setDataSource(data, insert);
        }, 10);
      });
    }
    function onTabsChange(activeKey2) {
      if (['pageTable', 'checkTable', 'fkTable', 'idxTable', 'queryTable'].indexOf(activeKey2) !== -1) {
        const dbTable = tables.dbTable;
        const table = tables[activeKey2];
        dbTable.value.tableRef.resetScrollTop();
        table.value.syncTable(dbTable);
      }
    }
    function onTableTypeChange(value) {
      if (value === 1) {
        setFieldsValue({ themeTemplate: 'normal' });
      }
      tables.pageTable.value.changePageType(value == 3);
    }
    function onIsTreeChange(value) {
      value === 'Y' ? addTreeNeedField() : deleteTreeNeedField();
    }
    function syncAllTableNow() {
      syncAllTableNowDebounce();
    }
    function syncAllTableNowPromise() {
      return __async(this, null, function* () {
        let { dbTable, pageTable, checkTable, fkTable, queryTable } = tables;
        yield pageTable.value.syncTable(dbTable);
        yield checkTable.value.syncTable(dbTable);
        yield fkTable.value.syncTable(dbTable);
        yield queryTable.value.syncTable(dbTable);
      });
    }
    function onTableAdded() {
      syncAllTableNow();
    }
    function onTableRemoved() {
      syncAllTableNow();
    }
    function onTableDragged(event) {
      let { oldIndex, newIndex } = event;
      syncAllOrderNumNow(oldIndex, newIndex);
    }
    function onTableInserted(event) {
      return __async(this, null, function* () {
        let { insertIndex, row } = event;
        let { pageTable, checkTable, fkTable, queryTable } = tables;
        pageTable.value.tableRef.insertRows(row, insertIndex);
        checkTable.value.tableRef.insertRows(row, insertIndex);
        fkTable.value.tableRef.insertRows(row, insertIndex);
        queryTable.value.tableRef.insertRows(row, insertIndex);
      });
    }
    function syncAllOrderNumNow(oldIndex, newIndex) {
      let { pageTable, checkTable, fkTable, queryTable } = tables;
      pageTable.value.tableRef.rowResort(oldIndex, newIndex);
      checkTable.value.tableRef.rowResort(oldIndex, newIndex);
      fkTable.value.tableRef.rowResort(oldIndex, newIndex);
      queryTable.value.tableRef.rowResort(oldIndex, newIndex);
    }
    function onTableSyncDbType(event) {
      tables.pageTable.value.syncFieldShowType(event.row);
    }
    function onTableQuery(id) {
      tables.pageTable.value.enableQuery(id);
    }
    function addTreeNeedField() {
      if (!treeFieldAdded) {
        let { dbTable, pageTable, checkTable } = tables;
        let treeFields = useTreeNeedFields();
        treeFields = treeFields.filter((item) => {
          let nameList = dbTable.value.tableRef.getTableData().map((o) => o.dbFieldName);
          return !nameList.includes(item.dbFieldName);
        });
        treeFieldIds = [];
        treeFields.forEach((newData) => {
          let uuidTemp = buildUUID() + '__tempId';
          treeFieldIds.push(uuidTemp);
          newData.id = uuidTemp;
        });
        dbTable.value.tableRef.addRows(treeFields, { setActive: false });
        pageTable.value.tableRef.addRows(treeFields, { setActive: false });
        checkTable.value.tableRef.addRows(treeFields, { setActive: false });
        nextTick(() => syncAllTableNow());
        treeFieldAdded = true;
      }
      nextTick(() => {
        formAction.setFieldsValue({
          treeIdField: 'has_child',
          treeParentIdField: 'pid',
        });
      });
    }
    function deleteTreeNeedField() {
      if (treeFieldIds && treeFieldIds.length > 0) {
        let { dbTable } = tables;
        dbTable.value.tableDeleteLines(treeFieldIds);
        treeFieldIds = [];
        treeFieldAdded = false;
      }
    }
    function validateAll() {
      let options = {};
      return new Promise((resolve, reject) => {
        validate().then(
          (values) => resolve({ values }),
          () => reject(VALIDATE_FAILED)
        );
      })
        .then((result) => {
          Object.assign(options, result);
          return validateTableFields();
        })
        .then((allTableData) => {
          Object.assign(options, allTableData);
          let formData = classifyIntoFormData(options);
          return validateForeignKey(formData);
        })
        .catch((e) => {
          if (e === VALIDATE_FAILED || (e == null ? void 0 : e.code) === VALIDATE_FAILED) {
            $message.warning('\u6821\u9A8C\u672A\u901A\u8FC7');
          } else {
            console.error(e);
          }
          return Promise.reject(null);
        });
    }
    function validateTableFields() {
      return new Promise((resolve, reject) =>
        __async(this, null, function* () {
          let tableKeys = Object.keys(tables);
          let allTableData = {};
          for (let i = 0; i < tableKeys.length; i++) {
            let key = tableKeys[i];
            let table = tables[key];
            try {
              allTableData[key] = yield table.value.validateData(key);
            } catch (e) {
              if (e.code === VALIDATE_FAILED) {
                activeKey.value = e.activeKey;
              } else {
                console.error(e);
              }
              reject(e);
              return;
            }
          }
          resolve(allTableData);
        })
      );
    }
    function classifyIntoFormData(options) {
      let formData = {
        head: {},
        fields: [],
        indexs: [],
        deleteFieldIds: [],
        deleteIndexIds: [],
      };
      formData.head = Object.assign(model, options.values);
      formData.head.isDesForm = extConfigJson.isDesForm;
      formData.head.desFormCode = extConfigJson.desFormCode;
      delete extConfigJson.isDesForm;
      delete extConfigJson.desFormCode;
      formData.head.extConfigJson = JSON.stringify(extConfigJson);
      options.dbTable.tableData.forEach((item, index) => {
        let rowId = item.id;
        let fields = Object.assign({}, item);
        let pageTable = options.pageTable.tableData[index];
        fields = Object.assign(pageTable, fields);
        let checkTable = options.checkTable.tableData[index];
        fields = Object.assign(checkTable, fields);
        let fkTable = options.fkTable.tableData[index];
        fields = Object.assign(fkTable, fields);
        let queryTable = options.queryTable.tableData[index];
        fields = Object.assign(queryTable, fields);
        if (rowId == null || rowId === '') {
          delete fields.id;
        } else {
          fields.id = rowId;
        }
        let tempIds = [].concat(fieldTempIds, treeFieldIds);
        if (tempIds.includes(fields.id)) {
          delete fields.id;
        }
        formData.fields.push(fields);
      });
      formData.deleteFieldIds = options.dbTable.deleteIds;
      formData.indexs = options.idxTable.tableData;
      formData.deleteIndexIds = options.idxTable.deleteIds;
      return formData;
    }
    function validateForeignKey(formData) {
      return new Promise((resolve, reject) => {
        let fields = formData.fields;
        let saved = true;
        if (fields && fields.length > 0) {
          let hasForeignKey = 0;
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].mainField || fields[i].mainTable) {
              hasForeignKey += 1;
            }
            if (hasForeignKey > 1) {
              saved = false;
              break;
            }
          }
        }
        if (saved) {
          resolve(formData);
        } else {
          reject({
            code: -1,
            msg: '\u5916\u952E\u53EA\u5141\u8BB8\u914D\u7F6E\u4E00\u4E2A!',
            error: VALIDATE_FAILED,
          });
        }
      });
    }
    function onSubmit() {
      confirmLoading.value = true;
      validateAll()
        .then(
          (formData) =>
            __async(this, null, function* () {
              var _a;
              if (formData.fields && formData.fields.length > 0) {
                for (let field of formData.fields) {
                  field.dbFieldName = field.dbFieldName.toLowerCase().trim();
                }
              }
              if ((_a = formData.head) == null ? void 0 : _a.tableName) {
                formData.head.tableName = formData.head.tableName.toLowerCase().trim();
              }
              yield formApi.doSaveOrUpdate(formData, isUpdate.value);
              refreshCacheTableName(oldTableName.value, formData.head['tableName']);
              emit('success');
              sleep(1, () => onCancel());
            }),
          (e) => {
            console.error(e);
          }
        )
        .finally(() => {
          confirmLoading.value = false;
        });
    }
    const [registerExtendConfigModal, extendConfigModal] = useModal();
    function onExtConfigOk(values) {
      return __async(this, null, function* () {
        extConfigJson = values;
        if (isUpdate.value == true) {
          let json = toRaw(extConfigJson);
          const params = {
            id: model.id,
            extConfigJson: JSON.stringify(json),
          };
          yield formApi.editHead(params);
          emit('success');
        }
      });
    }
    function onOpenExtConfig() {
      extendConfigModal.openModal(true, {
        extConfigJson,
      });
    }
    function onCancel() {
      hideTabs.value = true;
      sleep(1, () => closeModal());
    }
    return __spreadProps(__spreadValues({}, tables), {
      modalRef,
      title,
      confirmLoading,
      tableLoading,
      activeKey,
      onCancel,
      extConfigJson,
      formAction,
      hideTabs,
      onSubmit,
      onTabsChange,
      onTableAdded,
      onTableRemoved,
      onTableDragged,
      onTableInserted,
      onTableSyncDbType,
      onTableQuery,
      onOpenExtConfig,
      onExtConfigOk,
      registerForm,
      registerModal,
      registerExtendConfigModal,
      aiTestMode,
      aiTestTable,
      aiTableList,
      initVirtualData,
    });
  },
});
const _hoisted_1 = { style: { flex: '1', 'text-align': 'right' } };
const _hoisted_2 = {
  key: 0,
  style: { display: 'inline-block', 'text-align': 'left', position: 'absolute', left: '0' },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent('a-button');
  const _component_BasicForm = resolveComponent('BasicForm');
  const _component_DBAttributeTable = resolveComponent('DBAttributeTable');
  const _component_a_tab_pane = resolveComponent('a-tab-pane');
  const _component_PageAttributeTable = resolveComponent('PageAttributeTable');
  const _component_CheckDictTable = resolveComponent('CheckDictTable');
  const _component_ForeignKeyTable = resolveComponent('ForeignKeyTable');
  const _component_IndexTable = resolveComponent('IndexTable');
  const _component_Icon = resolveComponent('Icon');
  const _component_a_tooltip = resolveComponent('a-tooltip');
  const _component_QueryTable = resolveComponent('QueryTable');
  const _component_a_tabs = resolveComponent('a-tabs');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_a_select_option = resolveComponent('a-select-option');
  const _component_a_select = resolveComponent('a-select');
  const _component_ExtendConfigModal = resolveComponent('ExtendConfigModal');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      mergeProps(
        {
          ref: 'modalRef',
          title: _ctx.title,
          width: 1200,
          maskClosable: false,
          defaultFullscreen: true,
          confirmLoading: _ctx.confirmLoading,
        },
        _ctx.$attrs,
        {
          onCancel: _ctx.onCancel,
          onRegister: _ctx.registerModal,
        }
      ),
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
          createVNode(
            _component_a_button,
            {
              type: 'primary',
              loading: _ctx.confirmLoading,
              preIcon: 'ant-design:save',
              onClick: _ctx.onSubmit,
            },
            {
              default: withCtx(() => [createTextVNode('\u4FDD\u5B58')]),
              _: 1,
            },
            8,
            ['loading', 'onClick']
          ),
          _ctx.aiTestMode
            ? (openBlock(),
              createElementBlock('div', _hoisted_2, [
                createVNode(
                  _component_a_select,
                  {
                    value: _ctx.aiTestTable,
                    'onUpdate:value': _cache[1] || (_cache[1] = ($event) => (_ctx.aiTestTable = $event)),
                    placeholder: '\u8BF7\u9009\u62E9\u6D4B\u8BD5\u7684\u8868\u7C7B\u578B',
                    getPopupContainer: (n) => n.parentElement,
                    style: { width: '250px', margin: '0 10px 0 20px' },
                  },
                  {
                    default: withCtx(() => [
                      (openBlock(true),
                      createElementBlock(
                        Fragment,
                        null,
                        renderList(_ctx.aiTableList, (item, index) => {
                          return (
                            openBlock(),
                            createBlock(
                              _component_a_select_option,
                              {
                                key: index,
                                value: item.name,
                              },
                              {
                                default: withCtx(() => [createTextVNode(toDisplayString(item.title + '\uFF08' + item.name + '\uFF09'), 1)]),
                                _: 2,
                              },
                              1032,
                              ['value']
                            )
                          );
                        }),
                        128
                      )),
                    ]),
                    _: 1,
                  },
                  8,
                  ['value', 'getPopupContainer']
                ),
                createVNode(
                  _component_a_button,
                  {
                    type: 'primary',
                    ghost: '',
                    onClick: _ctx.initVirtualData,
                  },
                  {
                    default: withCtx(() => [createTextVNode('\u751F\u6210\u6570\u636E>>')]),
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
            _component_a_spin,
            {
              wrapperClassName: 'p-2',
              spinning: _ctx.confirmLoading,
            },
            {
              default: withCtx(() => [
                createVNode(
                  _component_BasicForm,
                  { onRegister: _ctx.registerForm },
                  {
                    extConfigButton: withCtx(() => [
                      createElementVNode('div', _hoisted_1, [
                        createVNode(
                          _component_a_button,
                          {
                            preIcon: 'ant-design:setting',
                            onClick: _ctx.onOpenExtConfig,
                          },
                          {
                            default: withCtx(() => [createTextVNode('\u6269\u5C55\u914D\u7F6E')]),
                            _: 1,
                          },
                          8,
                          ['onClick']
                        ),
                      ]),
                    ]),
                    _: 1,
                  },
                  8,
                  ['onRegister']
                ),
                createVNode(
                  _component_a_spin,
                  {
                    spinning: _ctx.tableLoading || _ctx.hideTabs,
                  },
                  {
                    default: withCtx(() => [
                      !_ctx.hideTabs
                        ? (openBlock(),
                          createBlock(
                            _component_a_tabs,
                            {
                              key: 0,
                              activeKey: _ctx.activeKey,
                              'onUpdate:activeKey': _cache[0] || (_cache[0] = ($event) => (_ctx.activeKey = $event)),
                              animated: '',
                              onChange: _ctx.onTabsChange,
                            },
                            {
                              default: withCtx(() => [
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u6570\u636E\u5E93\u5C5E\u6027',
                                    key: 'dbTable',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_DBAttributeTable,
                                        {
                                          ref: 'dbTable',
                                          actionButton: _ctx.actionButton,
                                          onAdded: _ctx.onTableAdded,
                                          onRemoved: _ctx.onTableRemoved,
                                          onDragged: _ctx.onTableDragged,
                                          onInserted: _ctx.onTableInserted,
                                          onSyncDbType: _ctx.onTableSyncDbType,
                                        },
                                        null,
                                        8,
                                        ['actionButton', 'onAdded', 'onRemoved', 'onDragged', 'onInserted', 'onSyncDbType']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u9875\u9762\u5C5E\u6027',
                                    key: 'pageTable',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [createVNode(_component_PageAttributeTable, { ref: 'pageTable' }, null, 512)]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u6821\u9A8C\u5B57\u6BB5',
                                    key: 'checkTable',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [createVNode(_component_CheckDictTable, { ref: 'checkTable' }, null, 512)]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u5916\u952E',
                                    key: 'fkTable',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_ForeignKeyTable,
                                        {
                                          ref: 'fkTable',
                                          actionButton: _ctx.actionButton,
                                        },
                                        null,
                                        8,
                                        ['actionButton']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u7D22\u5F15',
                                    key: 'idxTable',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_IndexTable,
                                        {
                                          ref: 'idxTable',
                                          actionButton: _ctx.actionButton,
                                        },
                                        null,
                                        8,
                                        ['actionButton']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    key: 'queryTable',
                                    forceRender: '',
                                  },
                                  {
                                    tab: withCtx(() => [
                                      createElementVNode('span', null, [
                                        createTextVNode(' \u4E2A\u6027\u67E5\u8BE2\u914D\u7F6E '),
                                        createVNode(_component_a_tooltip, null, {
                                          title: withCtx(() => [
                                            createTextVNode(
                                              '\u5141\u8BB8\u81EA\u5B9A\u4E49\uFF0C\u67E5\u8BE2\u8868\u5355\u5B57\u6BB5\u63A7\u4EF6\u7C7B\u578B\uFF01'
                                            ),
                                          ]),
                                          default: withCtx(() => [createVNode(_component_Icon, { icon: 'bx:help-circle' })]),
                                          _: 1,
                                        }),
                                      ]),
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_QueryTable,
                                        {
                                          ref: 'queryTable',
                                          onQuery: _ctx.onTableQuery,
                                        },
                                        null,
                                        8,
                                        ['onQuery']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ['activeKey', 'onChange']
                          ))
                        : createCommentVNode('', true),
                    ]),
                    _: 1,
                  },
                  8,
                  ['spinning']
                ),
              ]),
              _: 1,
            },
            8,
            ['spinning']
          ),
          createVNode(
            _component_ExtendConfigModal,
            {
              onRegister: _ctx.registerExtendConfigModal,
              parentForm: _ctx.formAction,
              onOk: _ctx.onExtConfigOk,
            },
            null,
            8,
            ['onRegister', 'parentForm', 'onOk']
          ),
        ]),
        _: 1,
      },
      16,
      ['title', 'confirmLoading', 'onCancel', 'onRegister']
    )
  );
}
var CgformModal = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
var CgformModal$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: CgformModal,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
export {
  CgformModal as C,
  doSingleDelete as a,
  doSingleRemove as b,
  doBatchRemove as c,
  doCopyOnlineView as d,
  doBatchDelete as e,
  doDatabaseSync as f,
  doCopyTable as g,
  CgformModal$1 as h,
  list as l,
};
