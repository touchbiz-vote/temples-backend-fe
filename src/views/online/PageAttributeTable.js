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
  resolveComponent,
  openBlock,
  createElementBlock,
  Fragment,
  createVNode,
  mergeProps,
  withCtx,
  createBlock,
  createTextVNode,
  createCommentVNode,
} from 'vue';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
import { u as useTableSync } from './useTableSync.js';
import LinkTableConfigModal from './LinkTableConfigModal.js';
import LinkTableFieldConfigModal from './LinkTableFieldConfigModal.js';
import FieldExtendJsonModal from './FieldExtendJsonModal.js';
import { useModal } from '/@/components/Modal';
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
import '/@/components/Form/index';
import '/@/utils/http/axios';
import './omit.js';
import './_baseClone.js';
import './_baseSlice.js';
import '/@/hooks/web/useMessage';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
var PageAttributeTable_vue_vue_type_style_index_0_scoped_true_lang = '';
const commonPageOptions = [
  { title: '\u6587\u672C\u6846', value: 'text' },
  { title: '\u5BC6\u7801', value: 'password' },
  { title: '\u4E0B\u62C9\u6846', value: 'list' },
  { title: '\u5355\u9009\u6846', value: 'radio' },
  { title: '\u591A\u9009\u6846', value: 'checkbox' },
  { title: '\u5F00\u5173', value: 'switch' },
  { title: '\u65E5\u671F(\u5E74\u6708\u65E5)', value: 'date' },
  { title: '\u65E5\u671F(\u5E74\u6708\u65E5\u65F6\u5206\u79D2)', value: 'datetime' },
  { title: '\u65F6\u95F4(HH:mm:ss)', value: 'time' },
  { title: '\u6587\u4EF6', value: 'file' },
  { title: '\u56FE\u7247', value: 'image' },
  { title: '\u591A\u884C\u6587\u672C', value: 'textarea' },
  { title: '\u5BCC\u6587\u672C', value: 'umeditor' },
  { title: 'MarkDown', value: 'markdown' },
  { title: '\u7528\u6237\u9009\u62E9', value: 'sel_user' },
  { title: '\u90E8\u95E8\u9009\u62E9', value: 'sel_depart' },
  { title: '\u5173\u8054\u8BB0\u5F55', value: 'link_table' },
  { title: '\u4ED6\u8868\u5B57\u6BB5', value: 'link_table_field' },
  { title: '\u7701\u5E02\u533A\u7EC4\u4EF6', value: 'pca' },
  { title: 'Popup\u5F39\u6846', value: 'popup' },
  { title: '\u4E0B\u62C9\u591A\u9009\u6846', value: 'list_multi' },
  { title: '\u4E0B\u62C9\u641C\u7D22\u6846', value: 'sel_search' },
  { title: '\u5206\u7C7B\u5B57\u5178\u6811', value: 'cat_tree' },
  { title: '\u81EA\u5B9A\u4E49\u6811\u63A7\u4EF6', value: 'sel_tree' },
  { title: '\u8054\u52A8\u7EC4\u4EF6', value: 'link_down' },
];
const subTablePageOptions = [
  { title: '\u6587\u672C\u6846', value: 'text' },
  { title: '\u5355\u9009\u6846', value: 'radio' },
  { title: '\u5F00\u5173', value: 'switch' },
  { title: '\u65E5\u671F(yyyy-MM-dd)', value: 'date' },
  { title: '\u65E5\u671F\uFF08yyyy-MM-dd HH:mm:ss\uFF09', value: 'datetime' },
  { title: '\u65F6\u95F4\uFF08HH:mm:ss\uFF09', value: 'time' },
  { title: '\u6587\u4EF6', value: 'file' },
  { title: '\u56FE\u7247', value: 'image' },
  { title: '\u4E0B\u62C9\u6846', value: 'list' },
  { title: '\u4E0B\u62C9\u591A\u9009\u6846', value: 'list_multi' },
  { title: '\u4E0B\u62C9\u641C\u7D22\u6846', value: 'sel_search' },
  { title: 'popup\u5F39\u51FA\u6846', value: 'popup' },
  { title: '\u90E8\u95E8\u9009\u62E9', value: 'sel_depart' },
  { title: '\u7528\u6237\u9009\u62E9', value: 'sel_user' },
  { title: '\u7701\u5E02\u533A\u7EC4\u4EF6', value: 'pca' },
  { title: '\u591A\u884C\u6587\u672C', value: 'textarea' },
];
const _sfc_main = defineComponent({
  name: 'PageAttributeTable',
  components: {
    LinkTableConfigModal,
    LinkTableFieldConfigModal,
    FieldExtendJsonModal,
  },
  setup() {
    const columns = ref([
      { title: '\u5B57\u6BB5\u540D\u79F0', key: 'dbFieldName', width: 100 },
      { title: '\u5B57\u6BB5\u5907\u6CE8', key: 'dbFieldTxt', width: 150 },
      {
        title: '\u8868\u5355\u663E\u793A',
        key: 'isShowForm',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: true,
      },
      {
        title: '\u5217\u8868\u663E\u793A',
        key: 'isShowList',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: true,
      },
      {
        title: '\u662F\u5426\u6392\u5E8F',
        key: 'sortFlag',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: false,
      },
      {
        title: '\u662F\u5426\u53EA\u8BFB',
        key: 'isReadOnly',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: false,
      },
      {
        title: '\u63A7\u4EF6\u7C7B\u578B',
        key: 'fieldShowType',
        width: 170,
        type: JVxeTypes.select,
        options: commonPageOptions,
        defaultValue: 'text',
        placeholder: '\u8BF7\u9009\u62E9${title}',
        validateRules: [{ required: true, message: '\u8BF7\u9009\u62E9${title}' }, { handler: validateFieldShowType }],
      },
      {
        title: '\u63A7\u4EF6\u957F\u5EA6',
        key: 'fieldLength',
        width: 120,
        titleHelp: { message: '\u6B64\u957F\u5EA6\u53EA\u5BF9\u5B50\u8868\u5217\u5B57\u6BB5\u5BBD\u5EA6\u6709\u6548\uFF01' },
        type: JVxeTypes.inputNumber,
        defaultValue: 200,
        placeholder: '\u8BF7\u8F93\u5165${title}',
        validateRules: [{ required: true, message: '${title}\u4E0D\u80FD\u4E3A\u7A7A' }],
      },
      {
        title: '\u662F\u5426\u67E5\u8BE2',
        key: 'isQuery',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: false,
      },
      {
        title: '\u67E5\u8BE2\u7C7B\u578B',
        key: 'queryMode',
        width: 110,
        type: JVxeTypes.select,
        options: [
          { title: '\u666E\u901A\u67E5\u8BE2', value: 'single' },
          { title: '\u8303\u56F4\u67E5\u8BE2', value: 'group' },
        ],
        defaultValue: 'single',
        placeholder: '\u8BF7\u9009\u62E9${title}',
        validateRules: [{ required: true, message: '\u8BF7\u9009\u62E9${title}' }],
      },
      {
        title: '\u63A7\u4EF6\u9ED8\u8BA4\u503C',
        key: 'fieldDefaultValue',
        width: 120,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u5B9A\u4E49\u8F6C\u6362\u5668',
        key: 'converter',
        width: 150,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u6269\u5C55\u53C2\u6570',
        key: 'fieldExtendJson',
        width: 120,
        type: JVxeTypes.input,
        defaultValue: '',
      },
      {
        title: '\u66F4\u591A\u914D\u7F6E',
        minWidth: 100,
        key: 'fieldConfig',
        type: JVxeTypes.slot,
        slotName: 'fieldConfig',
      },
    ]);
    const setup = useTableSync(columns);
    const { tableRef, tables } = setup;
    function validateFieldShowType({ cellValue, row }, callback) {
      let { dbTable } = tables;
      let dbType = dbTable.value.tableRef.getTableData({ rowIds: [row.id] })[0].dbType;
      if (cellValue === 'time' && dbType !== 'string') {
        callback(
          false,
          '\u5F53\u63A7\u4EF6\u7C7B\u578B\u4E3A\u65F6\u95F4\u65F6,\u6570\u636E\u5E93\u5C5E\u6027\u91CC\u7684\u5B57\u6BB5\u7C7B\u578B\u5FC5\u987B\u662FString\uFF01'
        );
      } else if (cellValue === 'date' && dbType !== 'Date' && dbType !== 'Datetime') {
        callback(
          false,
          '\u5F53\u63A7\u4EF6\u7C7B\u578B\u4E3A\u65E5\u671F\u65F6\uFF0C\u6570\u636E\u5E93\u5C5E\u6027\u91CC\u7684\u5B57\u6BB5\u7C7B\u578B\u5FC5\u987B\u662FDate\u6216Datetime\uFF01'
        );
      } else if (cellValue === 'datetime' && dbType !== 'Datetime') {
        callback(
          false,
          '\u5F53\u63A7\u4EF6\u7C7B\u578B\u4E3Adatetime\u65F6\uFF0C\u6570\u636E\u5E93\u5C5E\u6027\u91CC\u7684\u5B57\u6BB5\u7C7B\u578B\u5FC5\u987B\u662FDatetime\uFF01'
        );
      } else {
        callback(true);
      }
    }
    function syncFieldShowType(row) {
      let showType = 'date';
      if (row.dbType === 'Datetime') {
        showType = 'datetime';
      }
      tableRef.value.setValues([
        {
          rowKey: row.id,
          values: { fieldShowType: showType },
        },
      ]);
    }
    function changePageType(flag) {
      for (let col of columns.value) {
        if (col.key == 'fieldShowType') {
          col.options = !flag ? commonPageOptions : subTablePageOptions;
          break;
        }
      }
    }
    function enableQuery(id) {
      tableRef.value.setValues([
        {
          rowKey: id,
          values: { isQuery: '1' },
        },
      ]);
    }
    const [registerModal, { openModal }] = useModal();
    const [registerFieldModal, { openModal: openFieldModal }] = useModal();
    const [registerExtJsonModal, { openModal: openExtJsonModal }] = useModal();
    function showConfigButton(props) {
      if (props.row.dbFieldName == 'id') {
        return false;
      } else {
        return true;
      }
    }
    function openConfig(props) {
      if (props.row.fieldShowType.indexOf('link_table') >= 0) {
        showFieldConfig(props);
      } else {
        showExtJsonConfig(props);
      }
    }
    function showFieldConfig(props) {
      let { row } = props;
      let { checkTable } = tables;
      if (checkTable) {
        let checkTableValue = checkTable.value.tableRef.getTableData({ rowIds: [row.id] })[0];
        if (props.row.fieldShowType == 'link_table') {
          let record = getLinkTableModalData(row, checkTableValue);
          openModal(true, {
            record,
            fieldName: row.dbFieldName,
          });
        } else if (props.row.fieldShowType == 'link_table_field') {
          let data = getLinkTableFieldData(row, checkTableValue);
          openFieldModal(true, data);
        }
      }
    }
    function getLinkTableFieldData(row, checkTableValue) {
      let tableData = tableRef.value.getTableData();
      let pageTableData = tableData.filter((item) => item.fieldShowType == 'link_table');
      let tableAndFieldsMap = {};
      if (pageTableData && pageTableData.length > 0) {
        let checkTableData = tables.checkTable.value.tableRef.getTableData();
        for (let pageTable of pageTableData) {
          let tempArray = checkTableData.filter((i) => i.dbFieldName == pageTable.dbFieldName);
          if (tempArray && tempArray.length > 0) {
            let item = tempArray[0];
            tableAndFieldsMap[item.dbFieldName] = {
              title: pageTable.dbFieldTxt,
              table: item.dictTable,
              fields: item.dictText,
            };
          }
        }
      }
      const { dictTable, dictText } = checkTableValue;
      const { id, dbFieldTxt } = row;
      let record = {
        rowKey: id,
        dbFieldTxt,
        dictText,
        dictTable,
      };
      return {
        record,
        tableAndFieldsMap,
      };
    }
    function getLinkTableModalData(row, checkTableValue) {
      const { id, dbFieldTxt, fieldExtendJson } = row;
      const { dictTable, dictText } = checkTableValue;
      let result = {
        rowKey: id,
        dbFieldTxt,
        dictTable,
      };
      if (dictText) {
        let arr = dictText.split(',');
        result['titleField'] = arr[0];
        if (arr.length > 1) {
          result['otherFields'] = dictText.substring(dictText.indexOf(',') + 1);
        }
      } else {
        result['titleField'] = '';
        result['otherFields'] = '';
      }
      if (fieldExtendJson) {
        try {
          let json = JSON.parse(fieldExtendJson);
          if (json.multiSelect) {
            result['multiSelect'] = json.multiSelect;
          } else {
            result['multiSelect'] = false;
          }
          if (json.showType) {
            result['showType'] = json.showType;
          } else {
            result['showType'] = 'card';
          }
          if (json.imageField) {
            result['imageField'] = json.imageField;
          } else {
            result['imageField'] = '';
          }
        } catch (e) {
          console.error('\u89E3\u6790\u6269\u5C55\u53C2\u6570\u51FA\u9519', fieldExtendJson);
        }
      }
      return result;
    }
    function handleConfigData(record) {
      const { multiSelect, showType, imageField, fieldName } = record;
      let extJson = { showType, multiSelect, imageField };
      let values = [{ rowKey: record.rowKey, values: { fieldExtendJson: JSON.stringify(extJson), dbFieldTxt: record.dbFieldTxt } }];
      tableRef.value.setValues(values);
      let { checkTable, dbTable } = tables;
      if (dbTable) {
        let dbTableValues = [{ rowKey: record.rowKey, values: { dbFieldTxt: record.dbFieldTxt } }];
        dbTable.value.tableRef.setValues(dbTableValues);
      }
      if (checkTable) {
        let dictText = record.titleField;
        if (record.otherFields) {
          dictText += ',' + record.otherFields;
        }
        const { dictTable, dictField } = record;
        let temp = {
          dictTable,
          dictField,
          dictText,
          dbFieldName: fieldName,
        };
        let dbTableValues = [{ rowKey: record.rowKey, values: temp }];
        checkTable.value.tableRef.setValues(dbTableValues);
      }
    }
    function handleFieldConfigData(record) {
      const { dbFieldTxt, dictTable, dictText, rowKey } = record;
      let values = [{ rowKey, values: { dbFieldTxt } }];
      tableRef.value.setValues(values);
      let { checkTable, dbTable } = tables;
      if (dbTable) {
        let tableValues = [{ rowKey, values: { dbFieldTxt, dbIsPersist: '0' } }];
        dbTable.value.tableRef.setValues(tableValues);
      }
      if (checkTable) {
        let tableValues = [{ rowKey, values: { dictTable, dictText } }];
        checkTable.value.tableRef.setValues(tableValues);
      }
    }
    function showExtJsonConfig(props) {
      let jsonStr = props.row.fieldExtendJson || '';
      let id = props.rowId;
      let fieldShowType = props.row.fieldShowType || '';
      let sortFlag = props.row.sortFlag || '0';
      openExtJsonModal(true, {
        jsonStr,
        fieldShowType,
        sortFlag,
        id,
      });
    }
    function handleExtJson(data, rowKey) {
      let values;
      if (data && Object.keys(data).length > 0) {
        values = [{ rowKey, values: { fieldExtendJson: JSON.stringify(data) } }];
      } else {
        values = [{ rowKey, values: { fieldExtendJson: '' } }];
      }
      tableRef.value.setValues(values);
    }
    return __spreadProps(__spreadValues({}, setup), {
      columns,
      enableQuery,
      syncFieldShowType,
      changePageType,
      showConfigButton,
      showFieldConfig,
      registerExtJsonModal,
      handleExtJson,
      openConfig,
      registerModal,
      handleConfigData,
      registerFieldModal,
      handleFieldConfigData,
    });
  },
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent('a-button');
  const _component_JVxeTable = resolveComponent('JVxeTable');
  const _component_link_table_config_modal = resolveComponent('link-table-config-modal');
  const _component_link_table_field_config_modal = resolveComponent('link-table-field-config-modal');
  const _component_FieldExtendJsonModal = resolveComponent('FieldExtendJsonModal');
  return (
    openBlock(),
    createElementBlock(
      Fragment,
      null,
      [
        createVNode(
          _component_JVxeTable,
          mergeProps(
            {
              ref: 'tableRef',
              'row-class-name': 'online-config-page',
              rowNumber: '',
              keyboardEdit: '',
              maxHeight: _ctx.tableHeight.noToolbar,
              loading: _ctx.loading,
              columns: _ctx.columns,
              dataSource: _ctx.dataSource,
              disabledRows: { dbFieldName: [ 'has_child'] },
            },
            _ctx.tableProps
          ),
          {
            fieldConfig: withCtx((props) => [
              _ctx.showConfigButton(props)
                ? (openBlock(),
                  createBlock(
                    _component_a_button,
                    {
                      key: 0,
                      type: 'primary',
                      size: 'small',
                      ghost: '',
                      onClick: ($event) => _ctx.openConfig(props),
                    },
                    {
                      default: withCtx(() => [createTextVNode('\u9AD8\u7EA7\u914D\u7F6E')]),
                      _: 2,
                    },
                    1032,
                    ['onClick']
                  ))
                : createCommentVNode('', true),
            ]),
            _: 1,
          },
          16,
          ['maxHeight', 'loading', 'columns', 'dataSource']
        ),
        createVNode(
          _component_link_table_config_modal,
          {
            onRegister: _ctx.registerModal,
            onSuccess: _ctx.handleConfigData,
          },
          null,
          8,
          ['onRegister', 'onSuccess']
        ),
        createVNode(
          _component_link_table_field_config_modal,
          {
            onRegister: _ctx.registerFieldModal,
            onSuccess: _ctx.handleFieldConfigData,
          },
          null,
          8,
          ['onRegister', 'onSuccess']
        ),
        createVNode(
          _component_FieldExtendJsonModal,
          {
            onRegister: _ctx.registerExtJsonModal,
            onSuccess: _ctx.handleExtJson,
          },
          null,
          8,
          ['onRegister', 'onSuccess']
        ),
      ],
      64
    )
  );
}
var PageAttributeTable = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-5c39d0ca'],
]);
export { PageAttributeTable as default };
