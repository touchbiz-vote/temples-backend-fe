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
import { E as ENHANCEJS, q as SETUP } from './useExtendComponent.js';
import { useRoute } from 'vue-router';
import { router } from '/@/router';
import { ref, onBeforeUnmount, toRaw, nextTick, reactive } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { filterObj } from '/@/utils/common/compUtils';
import { u as useCustomHook, G as GET_FUN_BODY_REG } from './OnlineForm.js';
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
import { useModal } from '/@/components/Modal';
import { Modal } from 'ant-design-vue';
import { useMethods } from '/@/hooks/system/useMethods';
import { getToken } from '/@/utils/auth';
import { goJmReportViewPage } from '/@/utils';
import { p as pick } from './pick.js';
const CONTEXT_PROP_DESCRIPTION = {
  acceptHrefParams: '<p> \u8DF3\u8F6C\u65F6\u83B7\u53D6\u7684\u53C2\u6570\u4FE1\u606F',
  currentPage: '<p> \u5F53\u524D\u9875\u6570',
  currentTableName: '<p> \u5F53\u524D\u8868\u540D',
  description: '<p> \u5F53\u524D\u8868\u63CF\u8FF0',
  hasChildrenField: '<p> \u662F\u5426\u6709\u5B50\u8282\u70B9\u7684\u5B57\u6BB5\u540D\uFF0C\u4EC5\u6811\u5F62\u8868\u5355\u4E0B\u6709\u6548',
  isDesForm: '<p> xx',
  isTree: '<m> \u662F\u5426\u662F\u6811\u5F62\u8868\u5355 ',
  loadData: '<m> \u52A0\u8F7D\u5217\u8868\u6570\u636E',
  pageSize: '<p> \u6BCF\u4E00\u9875\u663E\u793A\u6761\u6570',
  queryParam: '<p> \u67E5\u8BE2\u6761\u4EF6\u5BF9\u8C61\uFF0C\u6BCF\u6B21\u70B9\u51FB\u67E5\u8BE2\u540E\u624D\u4F1A\u66F4\u65B0\u6B64\u6570\u636E',
  selectedRowKeys: '<p> \u9009\u4E2D\u7684\u884C\u7684id\u6570\u7EC4',
  sortField: '<p> \u6392\u5E8F\u5B57\u6BB5',
  sortType: '<p> \u6392\u5E8F\u89C4\u5219',
  total: '<p> \u603B\u9875\u6570',
};
const onlineUrl = {
  getColumns: '/online/cgform/api/getColumns/',
  getQueryInfo: '/online/cgform/api/getQueryInfo/',
  getData: '/online/cgform/api/getData/',
  getTreeData: '/online/cgform/api/getTreeData/',
  optPre: '/online/cgform/api/form/',
  buttonAction: '/online/cgform/api/doButton',
  exportXls: '/online/cgform/api/exportXlsOld/',
  importXls: '/online/cgform/api/importXls/',
  startProcess: '/act/process/extActProcess/startMutilProcess',
};
let config = {
  sortField: 'id',
  sortType: 'asc',
  currentPage: 1,
  pageSize: 50,
  total: 0,
  selectedRowKeys: [],
  queryParam: {},
  acceptHrefParams: {},
  description: '',
  currentTableName: '',
  isDesForm: false,
  desFormCode: '',
  cache: false,
  isTree: false,
  hasChildrenField: '',
};
const metaPagination = {
  current: 1,
  pageSize: 50,
  pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' \u5171' + total + '\u6761';
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
};
const { createMessage: $message, createErrorModal } = useMessage();
function useOnlineTableContext() {
  console.log('-------------------------useOnlineTableContext----------------------->');
  const ID = ref('');
  const route = useRoute();
  const onlineQueryFormOuter = ref();
  const superQueryButtonRef = ref();
  const pagination = ref(false);
  const dataSource = ref([]);
  const tableReloading = ref(true);
  const onlineExtConfigJson = ref();
  let specialConfigMap = {};
  const methods = {
    execButtonEnhance: function (code, record) {
      if (onlineTableContext[ENHANCEJS][code]) {
        if (SETUP === code) {
          executeEnhanceJsHook(code);
        } else {
          let row = toRaw(record);
          return onlineTableContext[ENHANCEJS][code].call(onlineTableContext, onlineTableContext, row);
        }
      } else if (onlineTableContext[ENHANCEJS][code + '_hook']) {
        if (record) {
          let row = toRaw(record);
          executeEnhanceJsHook(code + '_hook', row);
        } else {
          executeEnhanceJsHook(code + '_hook');
        }
      } else {
        console.log('\u589E\u5F3A\u6CA1\u627E\u5230!', code);
      }
    },
    isTree: function (status) {
      if (typeof status === 'boolean') {
        onlineTableContext['isTreeTable'] = status;
        return status;
      } else {
        return onlineTableContext['isTreeTable'];
      }
    },
  };
  function executeEnhanceJsHook(code, row) {
    let str = onlineTableContext[ENHANCEJS][code].toLocaleString();
    let arr = str.match(GET_FUN_BODY_REG);
    if (arr.length > 1) {
      let temp = arr[1];
      executeJsEnhanced(temp, row);
    }
  }
  const onlineTableContext = new Proxy(CONTEXT_PROP_DESCRIPTION, {
    get(_target, prop) {
      if (typeof methods[prop] === 'function') {
        return methods[prop];
      } else {
        let temp = specialConfigMap[ID.value];
        return Reflect.get(temp, prop);
      }
    },
    set(_target, prop, value) {
      let temp = getCurrentPageSpecialConfigMap();
      if (typeof value === 'function') {
        return Reflect.set(methods, prop, value);
      } else {
        return Reflect.set(temp, prop, value);
      }
    },
    deleteProperty(_target, key) {
      if (key === ID.value) {
        delete specialConfigMap[key];
        return true;
      } else {
        return false;
      }
    },
  });
  const { executeJsEnhanced } = useCustomHook({}, onlineTableContext);
  function getTableId() {
    let idValue = route.params.id;
    if (!idValue) {
      idValue = '';
    }
    return idValue;
  }
  onMountedOrActivated(() => {
    console.log('-------------------onMountedOrActivated-------------------');
    handlePageChange();
  });
  onBeforeUnmount(() => {
    console.log('-------------------onBeforeUnmount-------------------');
    delete specialConfigMap[ID.value];
  });
  function getCurrentPageSpecialConfigMap() {
    let temp = specialConfigMap[ID.value];
    if (!temp) {
      let obj = Object.assign({}, config, { onlineUrl });
      temp = JSON.parse(JSON.stringify(obj));
      specialConfigMap[ID.value] = temp;
    }
    return temp;
  }
  function handleAcceptHrefParams() {
    let acceptHrefParams = {};
    let hrefParam = route.query;
    if (hrefParam) {
      Object.keys(hrefParam).map((key) => {
        acceptHrefParams[key] = hrefParam[key];
      });
      onlineTableContext['acceptHrefParams'] = acceptHrefParams;
    }
  }
  function getColumnList() {
    return new Promise((resolve, reject) => {
      defHttp
        .get(
          {
            url: `${onlineTableContext.onlineUrl.getColumns}${ID.value}`,
          },
          { isTransformResponse: false }
        )
        .then((res) => {
          if (res.success) {
            resolve(res.result);
          } else {
            $message.warning(res.message);
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    });
  }
  function loadData() {
    return new Promise((resolve, reject) => {
      let url = `${onlineTableContext.onlineUrl.getData}${ID.value}`;
      if (onlineTableContext.isTree() === true) {
        url = `${onlineTableContext.onlineUrl.getTreeData}${ID.value}`;
      }
      let params = getLoadDataParams();
      console.log('------\u67E5\u8BE2\u53C2\u6570-----', params);
      defHttp
        .get({ url, params }, { isTransformResponse: false })
        .then((res) => {
          console.log('--onlineList-\u67E5\u8BE2\u5217\u8868\u6570\u636E', res);
          if (res.success) {
            handleDataResult(res.result);
            resolve(true);
          } else {
            if (res.message === 'NO_DB_SYNC') {
              createErrorModal({
                title: '\u6570\u636E\u5E93\u672A\u540C\u6B65',
                content: '\u8BF7\u5148\u540C\u6B65\u6570\u636E\u5E93\u518D\u67E5\u770B\u6B64\u9875\u9762\uFF01',
                onOk: () => router.back(),
              });
            } else {
              $message.warning(res.message);
            }
            reject(false);
          }
        })
        .catch(() => {
          let error = '\u8BF7\u6C42\u5217\u8868\u6570\u636E\u5F02\u5E38!';
          $message.warning(error);
          reject(false);
        });
    });
  }
  function getLoadDataParams() {
    const { sortField, sortType, acceptHrefParams, queryParam } = onlineTableContext;
    let treeParam = {};
    if (onlineTableContext.isTree() === true) {
      treeParam['hasQuery'] = 'false';
    } else {
      treeParam['hasQuery'] = 'true';
    }
    let params = Object.assign({}, treeParam, acceptHrefParams, queryParam, { column: sortField, order: sortType });
    if (pagination.value) {
      params.pageNo = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
    } else {
      params['pageSize'] = -521;
    }
    let superQueryData = getSuperQueryData();
    params.superQueryMatchType = superQueryData.matchType || '';
    params.superQueryParams = superQueryData.params || '';
    return filterObj(params);
  }
  function handleDataResult(result) {
    let total = 0;
    if (Number(result.total) > 0) {
      if (onlineTableContext.isTree() === true) {
        dataSource.value = getTreeDataByResult(result.records);
        nextTick(() => {
          loadDataByExpandedRows(dataSource.value);
        });
      } else {
        dataSource.value = result.records;
      }
      total = Number(result.total);
    } else {
      dataSource.value = [];
    }
    if (pagination.value) {
      pagination.value = __spreadProps(__spreadValues({}, pagination.value), { total });
    }
  }
  function handleChangeInTable($pagination, _filters, sorter) {
    if (sorter && sorter.order) {
      onlineTableContext['sortField'] = sorter.field;
      onlineTableContext['sortType'] = 'ascend' == sorter.order ? 'asc' : 'desc';
    } else {
      onlineTableContext['sortField'] = 'id';
      onlineTableContext['sortType'] = 'asc';
    }
    if (pagination.value) {
      pagination.value = $pagination;
    }
    loadData();
  }
  function handleSpecialConfig(result) {
    onlineTableContext['description'] = result.description;
    onlineTableContext['currentTableName'] = result.currentTableName;
    onlineTableContext['isDesForm'] = result.isDesForm;
    onlineTableContext['desFormCode'] = result.desFormCode;
    onlineTableContext['ID'] = ID.value;
    let { acceptHrefParams, queryParam, superQuery, currentPage, pageSize } = onlineTableContext;
    handleAcceptHrefParams();
    if (!queryParam) {
      onlineTableContext['queryParam'] = {};
    } else {
      onlineQueryFormOuter.value.initDefaultValues(queryParam, acceptHrefParams);
    }
    if (!superQuery) {
      onlineTableContext['superQuery'] = { params: '', matchType: '' };
    } else {
      superQueryButtonRef.value.initDefaultValues(superQuery);
    }
    if (result.paginationFlag == 'Y') {
      pagination.value = __spreadValues(__spreadValues({}, metaPagination), { current: currentPage, pageSize });
    } else {
      pagination.value = false;
    }
  }
  function reloadTable() {
    return __async(this, null, function* () {
      tableReloading.value = true;
      yield nextTick();
      tableReloading.value = false;
    });
  }
  const add2Context = {
    loadData,
    getLoadDataParams,
    reloadTable,
  };
  Object.keys(add2Context).map((key) => {
    onlineTableContext[key] = add2Context[key];
  });
  let loading = ref(false);
  function reload() {
    return __async(this, null, function* () {
      if (pagination.value) {
        pagination.value = __spreadProps(__spreadValues({}, pagination.value), { current: 1 });
      }
      onlineTableContext.clearSelectedRow();
      yield loadData();
    });
  }
  function getTreeDataByResult(result) {
    if (result) {
      return result.map((item) => {
        let hasChildrenField = onlineTableContext['hasChildrenField'];
        if (item[hasChildrenField] == '1') {
          let loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true };
          loadChild['jeecg_row_key'] = loadChild.id;
          item.children = [loadChild];
        }
        return item;
      });
    }
  }
  const expandedRowKeys = ref([]);
  function handleExpandedRowsChange(expandedRowKeysValue) {
    expandedRowKeys.value = expandedRowKeysValue;
  }
  function loadDataByExpandedRows(dataList) {
    let expandedRowKeysValue = expandedRowKeys.value;
    if (expandedRowKeysValue.length > 0) {
      const { sortField, sortType, pidField } = onlineTableContext;
      let params = Object.assign({}, { column: sortField, order: sortType });
      params['hasQuery'] = 'in';
      let superParams = Object.assign({});
      superParams.rule = 'in';
      superParams.type = 'text';
      superParams.val = expandedRowKeysValue.join(',');
      superParams.field = pidField;
      superParams = [superParams];
      params['superQueryParams'] = encodeURI(JSON.stringify(superParams));
      params['superQueryMatchType'] = 'and';
      params['batchFlag'] = 'true';
      let url = `${onlineTableContext.onlineUrl.getTreeData}${ID.value}`;
      console.log('--onlineList-\u67E5\u8BE2\u5B50\u8282\u70B9\u53C2\u6570', superParams);
      defHttp
        .get({ url, params }, { isTransformResponse: false })
        .then((res) => {
          console.log('--onlineList-\u67E5\u8BE2\u5B50\u8282\u70B9\u5217\u8868\u6570\u636E', res);
          if (res.success && res.result.records && res.result.records.length > 0) {
            let records = res.result.records;
            const listMap = /* @__PURE__ */ new Map();
            for (let item of records) {
              let pid = item[pidField];
              if (expandedRowKeysValue.join(',').includes(pid)) {
                let mapList = listMap.get(pid);
                if (mapList == null) {
                  mapList = [];
                }
                mapList.push(item);
                listMap.set(pid, mapList);
              }
            }
            let childrenMap = listMap;
            let fn = (list) => {
              if (list) {
                list.forEach((data) => {
                  if (expandedRowKeysValue.includes(data.id)) {
                    data.children = getTreeDataByResult(childrenMap.get(data.id));
                    fn(data.children);
                  }
                });
              }
            };
            fn(dataList);
          }
        })
        .catch(() => {
          let error = 'loadDataByExpandedRows\u8BF7\u6C42\u5217\u8868\u6570\u636E\u5F02\u5E38!';
          $message.warning(error);
        });
    } else {
      return Promise.resolve();
    }
  }
  function getSuperQueryData() {
    if (!onlineTableContext.superQuery) {
      return {};
    }
    const {
      superQuery: { params, matchType },
      currentTableName,
    } = onlineTableContext;
    let pre = currentTableName + '@';
    let arr = [];
    if (params.length > 0) {
      for (let data of params) {
        let item = __spreadValues({}, data);
        let field = item.field;
        if (field.startsWith(pre)) {
          item.field = field.replace(pre, '');
        }
        arr.push(item);
      }
    }
    let str = arr.length > 0 ? JSON.stringify(arr) : '';
    console.log('\u9AD8\u7EA7\u67E5\u8BE2\u6761\u4EF6', arr, matchType);
    return {
      params: encodeURIComponent(str),
      matchType,
    };
  }
  const superQueryStatus = ref(false);
  function handleSuperQuery(params, matchType) {
    onlineTableContext['superQuery'] = {
      params,
      matchType,
    };
    if (params.length == 0) {
      superQueryStatus.value = false;
    } else {
      superQueryStatus.value = true;
    }
    loadData();
  }
  const [registerCustomModal, { openModal: doOpenCustomModal }] = useModal();
  function openCustomModal(param) {
    if (!param) {
      param = {};
    }
    if (!param.row) {
      let rows = onlineTableContext['selectedRows'];
      if (!rows || rows.length == 0 || rows.length > 1) {
        $message.warning('\u8BF7\u9009\u62E9\u4E00\u6761\u6570\u636E');
        return;
      }
      param.row = rows[0];
    }
    param['code'] = ID.value;
    doOpenCustomModal(true, param);
  }
  onlineTableContext['openCustomModal'] = openCustomModal;
  function handlePageChange() {
    let idValue = getTableId();
    ID.value = idValue;
  }
  handlePageChange();
  function handleFormConfig(formConfig) {
    let extConfigJson = formConfig.head.extConfigJson;
    if (extConfigJson) {
      onlineExtConfigJson.value = JSON.parse(extConfigJson);
    }
  }
  return __spreadValues(
    {
      ID,
      onlineQueryFormOuter,
      superQueryButtonRef,
      loading,
      reload,
      dataSource,
      pagination,
      tableReloading,
      handleSpecialConfig,
      onlineTableContext,
      handleChangeInTable,
      getColumnList,
      getTreeDataByResult,
      expandedRowKeys,
      handleExpandedRowsChange,
      onlineExtConfigJson,
      handleFormConfig,
      superQueryStatus,
      handleSuperQuery,
      registerCustomModal,
    },
    add2Context
  );
}
const FLOW_CODE_PRE = 'onl_';
function useListButton(onlineTableContext, extConfigJson) {
  const buttonStatus = {
    add: true,
    addSub: true,
    update: true,
    delete: true,
    batch_delete: true,
    import: true,
    export: true,
    detail: true,
    super_query: true,
    bpm: true,
  };
  const [registerModal, { openModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerBpmModal, { openModal: openBpmModal }] = useModal();
  const { createMessage: $message2 } = useMessage();
  const buttonSwitch = reactive(buttonStatus);
  const cgLinkButtonList = reactive([]);
  const cgTopButtonList = reactive([]);
  function initButtonList(btnList) {
    cgLinkButtonList.length = 0;
    cgTopButtonList.length = 0;
    if (btnList && btnList.length > 0) {
      for (let i = 0; i < btnList.length; i++) {
        let temp = pick(btnList[i], 'buttonCode', 'buttonName', 'buttonStyle', 'optType', 'exp', 'buttonIcon');
        if (temp.buttonStyle == 'button') {
          cgTopButtonList.push(temp);
        } else if (temp.buttonStyle == 'link') {
          cgLinkButtonList.push(temp);
        }
      }
    }
  }
  function initButtonSwitch(hideColumns) {
    Object.keys(buttonSwitch).forEach((key) => {
      buttonSwitch[key] = true;
    });
    if (hideColumns && hideColumns.length > 0) {
      Object.keys(buttonSwitch).forEach((key) => {
        if (hideColumns.indexOf(key) >= 0) {
          buttonSwitch[key] = false;
        }
      });
    }
  }
  function handleAdd(param) {
    let data = { isUpdate: false };
    if (param) {
      data['param'] = param;
    }
    openModal(true, data);
  }
  function handleEdit(record) {
    onlineTableContext
      .beforeEdit(record)
      .then(() => {
        openModal(true, {
          isUpdate: true,
          record,
        });
      })
      .catch((msg) => {
        $message2.warning(msg);
      });
  }
  const getDeleteButton = (record) => {
    return {
      label: '\u5220\u9664',
      popConfirm: {
        title: '\u662F\u5426\u5220\u9664\uFF1F',
        confirm: handleDeleteOne.bind(null, record),
      },
    };
  };
  function handleDeleteOne(record) {
    onlineTableContext
      .beforeDelete(record)
      .then(() => {
        handleDelete(record.id);
      })
      .catch((msg) => {
        $message2.warning(msg);
      });
  }
  function getActions(record) {
    let bpmStatusValue = getBpmStatusValue(record);
    let canEdit = (bpmStatusValue && (bpmStatusValue == '1' || bpmStatusValue == '3' || bpmStatusValue == '4')) || !bpmStatusValue;
    if (toRaw(buttonSwitch.update) === true && canEdit) {
      return [
        {
          label: '\u7F16\u8F91',
          onClick: handleEdit.bind(null, record),
        },
      ];
    }
    return [];
  }
  function getSubmitFlowButton(record) {
    return {
      label: '\u63D0\u4EA4\u6D41\u7A0B',
      popConfirm: {
        title: '\u786E\u8BA4\u63D0\u4EA4\u6D41\u7A0B\u5417\uFF1F',
        confirm: handleSubmitFlow.bind(null, record),
      },
    };
  }
  function getViewBpmGraphicButton(record) {
    return {
      label: '\u5BA1\u6279\u8FDB\u5EA6',
      onClick: handleViewGraphic.bind(null, record),
    };
  }
  function handleViewGraphic(record) {
    const { currentTableName } = onlineTableContext;
    let flowCode = FLOW_CODE_PRE + currentTableName;
    let dataId = record.id;
    openBpmModal(true, {
      flowCode,
      dataId,
    });
  }
  function getDropDownActions(record) {
    let arr = [];
    if (toRaw(buttonSwitch.detail) === true) {
      arr.push({
        label: '\u8BE6\u60C5',
        onClick: handleDetail.bind(null, record),
      });
    }
    if (onlineTableContext['hasBpmStatus'] === true && toRaw(buttonSwitch.bpm) === true) {
      let bpmStatusValue2 = getBpmStatusValue(record);
      if (!bpmStatusValue2 || bpmStatusValue2 == '1') {
        arr.push(getSubmitFlowButton(record));
      } else {
        arr.push(getViewBpmGraphicButton(record));
      }
    }
    if (extConfigJson.value) {
      let { reportPrintShow, reportPrintUrl } = extConfigJson.value;
      if (reportPrintShow && reportPrintUrl) {
        arr.push({
          label: '\u6253\u5370',
          onClick() {
            let url = reportPrintUrl;
            let id = record.id;
            let token = getToken();
            goJmReportViewPage(url, id, token);
          },
        });
      }
    }
    let bpmStatusValue = getBpmStatusValue(record);
    let canDelete = (bpmStatusValue && bpmStatusValue == '1') || !bpmStatusValue;
    if (toRaw(buttonSwitch.delete) === true && canDelete) {
      arr.push(getDeleteButton(record));
    }
    let buttonList = cgLinkButtonList;
    if (buttonList && buttonList.length > 0) {
      for (let item of buttonList) {
        if (showLinkButtonOfExpression(item.exp || '', record) === true) {
          arr.push({
            label: item.buttonName,
            onClick: cgButtonLinkHandler.bind(null, record, item.buttonCode, item.optType),
          });
        }
      }
    }
    return arr;
  }
  function getBpmStatusValue(record) {
    const key = 'bpm_status';
    let value = record[key];
    if (!value) {
      value = record[key.toUpperCase()];
    }
    return value;
  }
  function handleDetail(record) {
    openDetailModal(true, {
      isUpdate: true,
      disableSubmit: true,
      record,
    });
  }
  function startProcess(record) {
    const {
      currentTableName,
      onlineUrl: { startProcess: startProcess2 },
    } = onlineTableContext;
    let postConfig = {
      url: startProcess2,
      params: {
        flowCode: FLOW_CODE_PRE + currentTableName,
        id: record.id,
        formUrl: 'modules/bpm/task/form/OnlineFormDetail',
        formUrlMobile: 'check/onlineForm/detail',
      },
    };
    let postOption = { isTransformResponse: false };
    return new Promise((resolve, reject) => {
      defHttp.post(postConfig, postOption).then((res) => {
        if (res.success) {
          resolve(res);
          $message2.success(res.message);
        } else {
          reject();
          $message2.warning(res.message);
        }
      });
    });
  }
  function handleSubmitFlow(record) {
    return __async(this, null, function* () {
      yield startProcess(record);
      onlineTableContext.loadData();
    });
  }
  function handleDelete(dataId) {
    console.log('\u5220\u9664\u6570\u636Eid\u503C', dataId);
    let url = `${onlineTableContext.onlineUrl.optPre}${onlineTableContext.ID}/${dataId}`;
    return new Promise((resolve, reject) => {
      defHttp
        .delete(
          {
            url,
          },
          { isTransformResponse: false }
        )
        .then((res) => {
          if (res.success) {
            $message2.success(res.message);
            onlineTableContext.loadData();
            resolve(true);
          } else {
            $message2.warning(res.message);
            reject();
          }
        });
    });
  }
  function handleBatchDelete() {
    let arr = onlineTableContext['selectedRowKeys'];
    if (arr.length <= 0) {
      $message2.warning('\u8BF7\u9009\u62E9\u4E00\u6761\u8BB0\u5F55\uFF01');
      return false;
    } else {
      let idSet = [];
      arr.forEach(function (val) {
        let temp = val;
        if (temp && temp.endsWith('_loadChild')) {
          temp = temp.replace('_loadChild', '');
        }
        if (idSet.indexOf(temp) < 0) {
          idSet.push(temp);
        }
      });
      let ids = idSet.join(',');
      Modal.confirm({
        title: '\u786E\u8BA4\u5220\u9664',
        content: '\u662F\u5426\u5220\u9664\u9009\u4E2D\u6570\u636E',
        okText: '\u786E\u8BA4',
        cancelText: '\u53D6\u6D88',
        onOk: () =>
          __async(this, null, function* () {
            yield handleDelete(ids);
            onlineTableContext.clearSelectedRow();
          }),
      });
    }
  }
  function cgButtonLinkHandler(record, buttonCode, optType) {
    if (optType == 'js') {
      onlineTableContext['execButtonEnhance'](buttonCode, record);
    } else if (optType == 'action') {
      let params = {
        formId: onlineTableContext['ID'],
        buttonCode,
        dataId: record.id,
      };
      let url = `${onlineTableContext.onlineUrl.buttonAction}`;
      defHttp
        .post(
          {
            url,
            params,
          },
          { isTransformResponse: false }
        )
        .then((res) => {
          if (res.success) {
            onlineTableContext.loadData();
            $message2.success('\u5904\u7406\u5B8C\u6210!');
          } else {
            $message2.warning(res.message);
          }
        });
    }
  }
  function cgButtonJsHandler(buttonCode) {
    onlineTableContext['execButtonEnhance'](buttonCode);
  }
  function cgButtonActionHandler(buttonCode) {
    let arr = onlineTableContext['selectedRowKeys'];
    if (!arr || arr.length == 0) {
      $message2.warning('\u8BF7\u5148\u9009\u4E2D\u4E00\u6761\u8BB0\u5F55');
      return false;
    }
    let dataId = arr.join(',');
    let params = {
      formId: onlineTableContext['ID'],
      buttonCode,
      dataId,
    };
    let url = `${onlineTableContext.onlineUrl.buttonAction}`;
    defHttp
      .post(
        {
          url,
          params,
        },
        { isTransformResponse: false }
      )
      .then((res) => {
        if (res.success) {
          onlineTableContext.loadData();
          onlineTableContext.clearSelectedRow();
          $message2.success('\u5904\u7406\u5B8C\u6210!');
        } else {
          $message2.warning(res.message);
        }
      });
  }
  function onImportExcel() {
    openImportModal(true);
  }
  const importUrl = () => {
    return `${onlineTableContext.onlineUrl.importXls}${onlineTableContext.ID}`;
  };
  const { handleExportXlsx } = useMethods();
  function onExportExcel() {
    let params = onlineTableContext.getLoadDataParams();
    let selections = onlineTableContext['selectedRowKeys'];
    if (selections && selections.length > 0) {
      params['selections'] = selections.join(',');
    }
    let paramsStr = JSON.stringify(filterObj(params));
    let url = `${onlineTableContext.onlineUrl.exportXls}${onlineTableContext.ID}`;
    const description = onlineTableContext.description;
    return handleExportXlsx(description, url, { paramsStr });
  }
  function showLinkButtonOfExpression(expression, row) {
    if (!expression || expression == '') {
      return true;
    }
    let arr = expression.split('#');
    let fieldValue = row[arr[0]];
    let exp = arr[1].toLowerCase();
    if (exp === 'eq') {
      return fieldValue == arr[2];
    } else if (exp === 'ne') {
      return !(fieldValue == arr[2]);
    } else if (exp === 'empty') {
      if (arr[2] === 'true') {
        return !fieldValue || fieldValue == '';
      } else {
        return fieldValue && fieldValue.length > 0;
      }
    } else if (exp === 'in') {
      let arr2 = arr[2].split(',');
      return arr2.indexOf(String(fieldValue)) >= 0;
    }
    return false;
  }
  return {
    buttonSwitch,
    cgLinkButtonList,
    cgTopButtonList,
    importUrl,
    registerModal,
    handleAdd,
    handleEdit,
    handleBatchDelete,
    registerImportModal,
    onImportExcel,
    onExportExcel,
    getDropDownActions,
    getActions,
    cgButtonJsHandler,
    cgButtonActionHandler,
    cgButtonLinkHandler,
    initButtonList,
    initButtonSwitch,
    getDeleteButton,
    handleSubmitFlow,
    getSubmitFlowButton,
    registerDetailModal,
    registerBpmModal,
  };
}
export { useListButton as a, useOnlineTableContext as u };
