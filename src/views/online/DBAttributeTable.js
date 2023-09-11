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
import { defineComponent, getCurrentInstance, ref, resolveComponent, openBlock, createBlock, mergeProps } from 'vue';
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
const MySQLKeywords = [
  'ADD',
  'ALL',
  'ALTER',
  'ANALYZE',
  'AND',
  'AS',
  'ASC',
  'ASENSITIVE',
  'BEFORE',
  'BETWEEN',
  'BIGINT',
  'BINARY',
  'BLOB',
  'BOTH',
  'BY',
  'CALL',
  'CASCADE',
  'CASE',
  'CHANGE',
  'CHAR',
  'CHARACTER',
  'CHECK',
  'COLLATE',
  'COLUMN',
  'CONDITION',
  'CONNECTION',
  'CONSTRAINT',
  'CONTINUE',
  'CONVERT',
  'CREATE',
  'CROSS',
  'CURRENT_DATE',
  'CURRENT_TIME',
  'CURRENT_TIMESTAMP',
  'CURRENT_USER',
  'CURSOR',
  'DATABASE',
  'DATABASES',
  'DAY_HOUR',
  'DAY_MICROSECOND',
  'DAY_MINUTE',
  'DAY_SECOND',
  'DEC',
  'DECIMAL',
  'DECLARE',
  'DEFAULT',
  'DELAYED',
  'DELETE',
  'DESC',
  'DESCRIBE',
  'DETERMINISTIC',
  'DISTINCT',
  'DISTINCTROW',
  'DIV',
  'DOUBLE',
  'DROP',
  'DUAL',
  'EACH',
  'ELSE',
  'ELSEIF',
  'ENCLOSED',
  'ESCAPED',
  'EXISTS',
  'EXIT',
  'EXPLAIN',
  'FALSE',
  'FETCH',
  'FLOAT',
  'FLOAT4',
  'FLOAT8',
  'FOR',
  'FORCE',
  'FOREIGN',
  'FROM',
  'FULLTEXT',
  'GOTO',
  'GRANT',
  'GROUP',
  'HAVING',
  'HIGH_PRIORITY',
  'HOUR_MICROSECOND',
  'HOUR_MINUTE',
  'HOUR_SECOND',
  'IF',
  'IGNORE',
  'IN',
  'INDEX',
  'INFILE',
  'INNER',
  'INOUT',
  'INSENSITIVE',
  'INSERT',
  'INT',
  'INT1',
  'INT2',
  'INT3',
  'INT4',
  'INT8',
  'INTEGER',
  'INTERVAL',
  'INTO',
  'IS',
  'ITERATE',
  'JOIN',
  'KEY',
  'KEYS',
  'KILL',
  'LABEL',
  'LEADING',
  'LEAVE',
  'LEFT',
  'LIKE',
  'LIMIT',
  'LINEAR',
  'LINES',
  'LOAD',
  'LOCALTIME',
  'LOCALTIMESTAMP',
  'LOCK',
  'LONG',
  'LONGBLOB',
  'LONGTEXT',
  'LOOP',
  'LOW_PRIORITY',
  'MATCH',
  'MEDIUMBLOB',
  'MEDIUMINT',
  'MEDIUMTEXT',
  'MIDDLEINT',
  'MINUTE_MICROSECOND',
  'MINUTE_SECOND',
  'MOD',
  'MODIFIES',
  'NATURAL',
  'NOT',
  'NO_WRITE_TO_BINLOG',
  'NULL',
  'NUMERIC',
  'ON',
  'OPTIMIZE',
  'OPTION',
  'OPTIONALLY',
  'OR',
  'ORDER',
  'OUT',
  'OUTER',
  'OUTFILE',
  'PRECISION',
  'PRIMARY',
  'PROCEDURE',
  'PURGE',
  'RAID0',
  'RANGE',
  'READ',
  'READS',
  'REAL',
  'REFERENCES',
  'REGEXP',
  'RELEASE',
  'RENAME',
  'REPEAT',
  'REPLACE',
  'REQUIRE',
  'RESTRICT',
  'RETURN',
  'REVOKE',
  'RIGHT',
  'RLIKE',
  'SCHEMA',
  'SCHEMAS',
  'SECOND_MICROSECOND',
  'SELECT',
  'SENSITIVE',
  'SEPARATOR',
  'SET',
  'SHOW',
  'SMALLINT',
  'SPATIAL',
  'SPECIFIC',
  'SQL',
  'SQLEXCEPTION',
  'SQLSTATE',
  'SQLWARNING',
  'SQL_BIG_RESULT',
  'SQL_CALC_FOUND_ROWS',
  'SQL_SMALL_RESULT',
  'SSL',
  'STARTING',
  'STRAIGHT_JOIN',
  'TABLE',
  'TERMINATED',
  'THEN',
  'TINYBLOB',
  'TINYINT',
  'TINYTEXT',
  'TO',
  'TRAILING',
  'TRIGGER',
  'TRUE',
  'UNDO',
  'UNION',
  'UNIQUE',
  'UNLOCK',
  'UNSIGNED',
  'UPDATE',
  'USAGE',
  'USE',
  'USING',
  'UTC_DATE',
  'UTC_TIME',
  'UTC_TIMESTAMP',
  'VALUES',
  'VARBINARY',
  'VARCHAR',
  'VARCHARACTER',
  'VARYING',
  'WHEN',
  'WHERE',
  'WHILE',
  'WITH',
  'WRITE',
  'X509',
  'XOR',
  'YEAR_MONTH',
  'ZEROFILL',
];
const _sfc_main = defineComponent({
  name: 'DBAttributeTable',
  props: {
    actionButton: { type: Boolean, default: true },
  },
  emits: ['added', 'removed', 'inserted', 'dragged', 'syncDbType'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const addBatching = ref(false);
    const columns = ref([
      {
        title: '\u5B57\u6BB5\u540D\u79F0',
        key: 'dbFieldName',
        width: 140,
        type: JVxeTypes.input,
        defaultValue: '',
        placeholder: '\u8BF7\u8F93\u5165${title}',
        validateRules: [
          { required: true, message: '${title}\u4E0D\u80FD\u4E3A\u7A7A' },
          {
            pattern: /^[a-zA-Z]{1}(?!_)[a-zA-Z0-9_\\$]+$/,
            message:
              '\u547D\u540D\u89C4\u5219\uFF1A\u53EA\u80FD\u7531\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001$\u7B26\u53F7\u7EC4\u6210\uFF1B\u5FC5\u987B\u4EE5\u5B57\u6BCD\u5F00\u5934\uFF1B\u4E0D\u80FD\u4EE5\u5355\u4E2A\u5B57\u6BCD\u52A0\u4E0B\u6ED1\u7EBF\u5F00\u5934',
          },
          { unique: true, message: '${title}\u4E0D\u80FD\u91CD\u590D' },
          {
            handler({ cellValue }, callback) {
              if (MySQLKeywords.includes(cellValue.toUpperCase())) {
                callback(false, cellValue + '\u662F\u5173\u952E\u5B57\uFF0C\u4E0D\u80FD\u4F5C\u4E3A\u5B57\u6BB5\u540D\u79F0\u4F7F\u7528\uFF01');
              } else {
                callback(true);
              }
            },
          },
          { handler: validateExistIndex },
        ],
        disabled: !props.actionButton,
      },
      {
        title: '\u5B57\u6BB5\u5907\u6CE8',
        key: 'dbFieldTxt',
        width: 140,
        type: JVxeTypes.input,
        defaultValue: '',
        placeholder: '\u8BF7\u8F93\u5165${title}',
        validateRules: [{ required: true, message: '${title}\u4E0D\u80FD\u4E3A\u7A7A' }],
      },
      {
        title: '\u5B57\u6BB5\u957F\u5EA6',
        key: 'dbLength',
        width: 120,
        type: JVxeTypes.inputNumber,
        defaultValue: 32,
        placeholder: '\u8BF7\u8F93\u5165${title}',
        validateRules: [{ required: true, message: '${title}\u4E0D\u80FD\u4E3A\u7A7A' }],
        disabled: !props.actionButton,
      },
      {
        title: '\u5C0F\u6570\u70B9',
        key: 'dbPointLength',
        width: 100,
        type: JVxeTypes.inputNumber,
        defaultValue: 0,
        placeholder: '\u8BF7\u8F93\u5165${title}',
        validateRules: [{ required: true, message: '${title}\u4E0D\u80FD\u4E3A\u7A7A' }],
        disabled: !props.actionButton,
      },
      {
        title: '\u9ED8\u8BA4\u503C',
        key: 'dbDefaultVal',
        width: 140,
        type: JVxeTypes.input,
        defaultValue: '',
        disabled: !props.actionButton,
      },
      {
        title: '\u5B57\u6BB5\u7C7B\u578B',
        key: 'dbType',
        width: 140,
        type: JVxeTypes.select,
        options: [
          { title: 'String', value: 'string' },
          { title: 'Integer', value: 'int' },
          { title: 'Bigint', value: 'bigint' },
          { title: 'Double', value: 'double' },
          { title: 'Date', value: 'Date' },
          { title: 'Timestamp', value: 'timestamp' },
          { title: 'Datetime', value: 'Datetime' },
          { title: 'BigDecimal', value: 'BigDecimal' },
          { title: 'Text', value: 'Text' },
          { title: 'Blob', value: 'Blob' },
        ],
        defaultValue: 'string',
        placeholder: '\u8BF7\u9009\u62E9${title}',
        disabled: !props.actionButton,
        validateRules: [{ required: true, message: '\u8BF7\u9009\u62E9${title}' }],
      },
      {
        title: '\u4E3B\u952E',
        key: 'dbIsKey',
        width: 80,
        type: JVxeTypes.checkbox,
        align: 'center',
        customValue: ['1', '0'],
        defaultChecked: false,
        disabled: !props.actionButton,
      },
      {
        title: '\u5141\u8BB8\u7A7A\u503C',
        key: 'dbIsNull',
        width: 80,
        type: JVxeTypes.checkbox,
        customValue: ['1', '0'],
        defaultChecked: true,
        disabled: !props.actionButton,
      },
      {
        title: '\u540C\u6B65\u6570\u636E\u5E93',
        key: 'dbIsPersist',
        minWidth: 80,
        type: JVxeTypes.checkbox,
        customValue: ['1', '0'],
        defaultChecked: true,
        disabled: !props.actionButton,
      },
      { title: 'orderNum', key: 'orderNum', type: JVxeTypes.hidden },
    ]);
    let removeIds = [];
    const setup = useTableSync(columns);
    const { tableRef, loading, dataSource, tableHeight, tableProps, setDataSource, validateData } = setup;
    function handleAdded() {
      emit('added', instance);
    }
    function handleRemoved(event) {
      removeIds = removeIds.concat(event.deleteRows.map((r) => r.id));
      emit('removed', __spreadProps(__spreadValues({}, event), { removeIds, target: instance }));
    }
    function handleDragged(event) {
      emit('dragged', {
        oldIndex: event.oldIndex,
        newIndex: event.newIndex,
        target: instance,
      });
    }
    function handleInserted(event) {
      emit('inserted', __spreadProps(__spreadValues({}, event), { target: instance }));
    }
    function getRemoveIds() {
      return removeIds;
    }
    function handleValueChange(event) {
      let { type, row, col, value, target } = event;
      if (type === JVxeTypes.select && col.key === 'dbType') {
        if (value === 'Date' || value === 'Datetime') {
          emit('syncDbType', { row, value, target: instance });
        }
        if (value === 'Blob' || value === 'Text' || value === 'Date') {
          target.setValues([{ rowKey: row.id, values: { dbLength: '0' } }]);
        } else if (value === 'int' || value === 'double' || value === 'BigDecimal') {
          target.setValues([{ rowKey: row.id, values: { dbLength: '10' } }]);
        } else if (row['dbLength'] === '0') {
          target.setValues([{ rowKey: row.id, values: { dbLength: '32' } }]);
        }
      }
    }
    function handleDisabledDbFieldName(value, _row, rowIndex) {
      if (value === 'has_child') {
        return true;
      }
      if (value === 'id') {
        if (rowIndex === 0) {
          return true;
        }
      }
      return false;
    }
    function tableAddLine(newLine) {
      tableRef.value.pushRows(newLine);
      if (!addBatching.value) {
        emit('added', instance);
      }
    }
    function tableDeleteLines(ids) {
      return tableRef.value.removeRowsById(ids);
    }
    function addBatchBegin() {
      addBatching.value = true;
      loading.value = true;
    }
    function addBatchEnd() {
      addBatching.value = false;
      loading.value = false;
      emit('added', instance);
    }
    function validateExistIndex({ cellValue, row }, callback) {
      const { tables } = setup;
      if (tables) {
        let dataSource2 = tables.dbTable.value.tableRef.dataSource;
        let temp = dataSource2.filter((item) => item.id === row.id);
        if (!temp || temp.length <= 0) {
          callback(true);
        }
        let dbFieldName = temp[0]['dbFieldName'];
        if (dbFieldName == cellValue) {
          callback(true);
        }
        let arr = tables.idxTable.value.tableRef.getTableData();
        for (let item of arr) {
          let indexField = item.indexField;
          let indexFieldArray = indexField.split(',');
          if (indexFieldArray.indexOf(dbFieldName) >= 0) {
            callback(
              false,
              '\u5F53\u524D\u5B57\u6BB5\u5B58\u5728\u7D22\u5F15\u914D\u7F6E\uFF0C\u8BF7\u5148\u5220\u9664\u7D22\u5F15\u518D\u4FEE\u6539\u5B57\u6BB5'
            );
          }
        }
      }
      callback(true);
    }
    return {
      tableRef,
      loading,
      columns,
      dataSource,
      setDataSource,
      addBatchBegin,
      addBatchEnd,
      tableAddLine,
      tableHeight,
      tableProps,
      tableDeleteLines,
      handleAdded,
      handleRemoved,
      handleDragged,
      handleInserted,
      handleValueChange,
      handleDisabledDbFieldName,
      validateData,
      getRemoveIds,
      validateExistIndex,
    };
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
          rowSelection: '',
          dragSort: '',
          keyboardEdit: '',
          sortKey: 'orderNum',
          addButtonSettings: '',
          loading: _ctx.loading,
          columns: _ctx.columns,
          dataSource: _ctx.dataSource,
          toolbar: _ctx.actionButton,
          maxHeight: _ctx.tableHeight.normal,
          disabledRows: { dbFieldName: _ctx.handleDisabledDbFieldName },
        },
        _ctx.tableProps,
        {
          onAdded: _ctx.handleAdded,
          onRemoved: _ctx.handleRemoved,
          onDragged: _ctx.handleDragged,
          onInserted: _ctx.handleInserted,
          onValueChange: _ctx.handleValueChange,
        }
      ),
      null,
      16,
      ['loading', 'columns', 'dataSource', 'toolbar', 'maxHeight', 'disabledRows', 'onAdded', 'onRemoved', 'onDragged', 'onInserted', 'onValueChange']
    )
  );
}
var DBAttributeTable = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { DBAttributeTable as default };
