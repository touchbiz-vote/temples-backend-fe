import { getDictItemsByCode } from '/@/utils/dict';
import { filterDictText } from '/@/utils/dict/JDictSelectUtil';
import { buildUUID } from '/@/utils/uuid';
const VALIDATE_FAILED = 'validate-failed';
const columns = [
  {
    title: '\u8868\u7C7B\u578B',
    align: 'center',
    sorter: true,
    dataIndex: 'tableType',
    width: 140,
    customRender({ text, record }) {
      let tableTypeDictOptions = getDictItemsByCode('cgform_table_type');
      let tbTypeText = filterDictText(tableTypeDictOptions, text);
      if (record.isTree === 'Y') {
        tbTypeText += '(\u6811)';
      }
      if (record.themeTemplate === 'innerTable') {
        tbTypeText += '(\u5185\u5D4C)';
      } else if (record.themeTemplate === 'erp') {
        tbTypeText += '(ERP)';
      } else if (record.themeTemplate === 'tab') {
        tbTypeText += '(TAB)';
      }
      return tbTypeText;
    },
  },
  {
    title: '\u8868\u540D',
    sorter: true,
    align: 'center',
    dataIndex: 'tableName',
    width: 240,
  },
  {
    title: '\u8868\u63CF\u8FF0',
    align: 'center',
    dataIndex: 'tableTxt',
    width: 220,
  },
  {
    title: '\u7248\u672C',
    align: 'center',
    dataIndex: 'tableVersion',
    width: 120,
  },
  {
    title: '\u540C\u6B65\u72B6\u6001',
    align: 'center',
    sorter: true,
    dataIndex: 'isDbSynch',
    slots: { customRender: 'dbSync' },
    width: 120,
  },
  {
    title: '\u521B\u5EFA\u65F6\u95F4',
    align: 'center',
    sorter: true,
    dataIndex: 'createTime',
    width: 240,
  },
];
const searchFormSchema = [
  {
    label: '\u8868\u540D',
    field: 'tableName',
    component: 'JInput',
  },
  {
    label: '\u8868\u7C7B\u578B',
    field: 'tableType_MultiString',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'cgform_table_type',
      mode: 'multiple',
    },
  },
  {
    label: '\u8868\u63CF\u8FF0',
    field: 'tableTxt',
    component: 'JInput',
  },
];
const ExtConfigDefaultJson = {
  reportPrintShow: 0,
  reportPrintUrl: '',
  joinQuery: 0,
  modelFullscreen: 0,
  modalMinWidth: '',
  commentStatus: 0,
  tableFixedAction: 1,
  tableFixedActionType: 'right',
};
function useInitialData() {
  let initialData = [
    {
      dbFieldName: 'id',
      dbFieldTxt: '\u4E3B\u952E',
      dbLength: 36,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '1',
      dbIsNull: '0',
      isShowForm: '0',
      isShowList: '0',
      isReadOnly: '1',
      fieldShowType: 'text',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'create_by',
      dbFieldTxt: '\u521B\u5EFA\u4EBA',
      dbLength: 50,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'text',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'create_time',
      dbFieldTxt: '\u521B\u5EFA\u65E5\u671F',
      dbLength: 0,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'Datetime',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'datetime',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'update_by',
      dbFieldTxt: '\u66F4\u65B0\u4EBA',
      dbLength: 50,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'text',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'update_time',
      dbFieldTxt: '\u66F4\u65B0\u65E5\u671F',
      dbLength: 0,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'Datetime',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'datetime',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'sys_org_code',
      dbFieldTxt: '\u6240\u5C5E\u90E8\u95E8',
      dbLength: 64,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'text',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
  ];
  let tempIds = [];
  initialData.forEach((record) => {
    record['id'] = buildUUID();
    tempIds.push(record['id']);
  });
  return { initialData, tempIds };
}
function useTreeNeedFields() {
  return [
    {
      dbFieldName: 'pid',
      dbFieldTxt: '\u7236\u7EA7\u8282\u70B9',
      dbLength: 32,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '1',
      isShowList: '0',
      fieldShowType: 'text',
      fieldLength: '200',
      queryMode: 'single',
      dbIsSync: '1',
    },
    {
      dbFieldName: 'has_child',
      dbFieldTxt: '\u662F\u5426\u6709\u5B50\u8282\u70B9',
      dbLength: 3,
      dbPointLength: 0,
      dbDefaultVal: '',
      dbType: 'string',
      dbIsKey: '0',
      dbIsNull: '1',
      isShowForm: '0',
      isShowList: '0',
      fieldShowType: 'list',
      fieldLength: '200',
      queryMode: 'single',
      dictField: 'yn',
      dbIsSync: '1',
    },
  ];
}
const onlineDefaultButton = [
  { code: 'add', title: '\u65B0\u589E', status: 0 },
  { code: 'edit', title: '\u7F16\u8F91', status: 0 },
  { code: 'delete', title: '\u5220\u9664', status: 0 },
  { code: 'export', title: '\u5BFC\u51FA', status: 0 },
  { code: 'import', title: '\u5BFC\u5165', status: 0 },
  { code: 'query', title: '\u67E5\u8BE2', status: 0 },
];
export {
  ExtConfigDefaultJson as E,
  VALIDATE_FAILED as V,
  useTreeNeedFields as a,
  columns as c,
  onlineDefaultButton as o,
  searchFormSchema as s,
  useInitialData as u,
};
