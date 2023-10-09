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
import { inject, ref, computed, nextTick } from 'vue';
import { V as VALIDATE_FAILED } from './cgform.data.js';
import { p as pick } from './pick.js';
function useTableSync(columns) {
  const tables = inject('tables');
  const fullScreenRef = inject('fullScreenRef');
  const tableRef = ref();
  const loading = ref(false);
  const dataSource = ref([]);
  const tableHeight = computed(() => ({
    normal: (fullScreenRef == null ? void 0 : fullScreenRef.value) ? 430 : 260,
    noToolbar: (fullScreenRef == null ? void 0 : fullScreenRef.value) ? 480 : 320,
  }));
  const columnKeys = computed(() => ['id'].concat(columns.value.map((col) => col.key)));
  const tableProps = computed(() => {
    return {
      scrollY: {
        gt: 15,
      },
      scrollX: {
        gt: 20,
      },
    };
  });
  function validateData(activeKey) {
    return __async(this, null, function* () {
      let instance = tableRef.value;
      let errMap = yield instance.fullValidateTable();
      if (errMap) {
        throw { code: VALIDATE_FAILED, activeKey };
      }
      let tableData = instance.getTableData().map((data) => pick(data, columnKeys.value));
      let deleteIds = instance.getDeleteData().map((d) => d.id);
      return { tableData, deleteIds };
    });
  }
  function setDataSource(data, insert = false) {
    return __async(this, null, function* () {
      if (insert) {
        dataSource.value = [];
        yield nextTick();
        yield tableRef.value.addOrInsert(data, 0, null, { setActive: false });
        yield nextTick();
        tableRef.value.recalcDisableRows();
      } else {
        dataSource.value = data;
      }
    });
  }
  function syncTable(dbTable) {
    let targetTable = tableRef.value;
    let sourceTable = dbTable.value.tableRef;
    let removeIds = dbTable.value.getRemoveIds();
    let sourceData = sourceTable.getXTable().internalData.tableFullData;
    let targetData = targetTable.getXTable().internalData.tableFullData;
    sourceData.forEach((sourceValue) => {
      let flag = false;
      targetData.forEach((targetValue) => {
        if (sourceValue.id === targetValue.id) {
          let dbFieldName = targetValue['dbFieldName'];
          let dbFieldTxt = targetValue['dbFieldTxt'];
          if (sourceValue.dbFieldName !== dbFieldName || sourceValue.dbFieldTxt !== dbFieldTxt) {
            targetTable.setValues([
              {
                rowKey: targetValue.id,
                values: {
                  dbFieldName: sourceValue.dbFieldName,
                  dbFieldTxt: sourceValue.dbFieldTxt,
                },
              },
            ]);
          }
          flag = true;
        } else {
          removeIds.forEach((deletedId) => {
            if (deletedId === targetValue.id) {
              targetTable.removeRowsById(deletedId);
              flag = true;
            }
          });
        }
      });
      if (!flag) {
        let record = Object.assign({}, sourceValue);
        columns.value.forEach((column) => {
          if (column.key !== 'dbFieldName' && column.key !== 'dbFieldTxt') {
            record[column.key] = column.defaultValue;
          }
        });
        targetTable.addRows(record);
      }
    });
    return nextTick();
  }
  return { tables, tableRef, loading, dataSource, columnKeys, tableHeight, tableProps, syncTable, validateData, setDataSource };
}
export { useTableSync as u };
