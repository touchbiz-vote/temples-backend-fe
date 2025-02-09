// 用于配置某些组件的常规配置，而无需修改组件

import type { SorterResult } from '../components/Table';

export default {
  // 表格配置
  table: {
    // 表格接口请求通用配置，可在组件prop覆盖
    // 支持 xxx.xxx.xxx格式
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'pageNo',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'records',
      // 接口返回表格总数的字段
      totalField: 'total',
    },
    // 可选的分页选项
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    // 表格默认尺寸
    defaultSize: 'small',
    //默认每页显示多少条
    defaultPageSize: 20,
    // 默认排序方法
    defaultSortFn: (sortInfo: SorterResult) => {
      if (sortInfo instanceof Array) {
        const sortInfoArray: any[] = [];
        for (const item of sortInfo) {
          const info = getSort(item);
          if (info) {
            sortInfoArray.push(info);
          }
        }
        return {
          sortInfoString: JSON.stringify(sortInfoArray),
        };
      } else {
        const info = getSort(sortInfo);
        return info || {};
      }
      //update-end-author:taoyan date:2022-10-21 for: VUEN-2199【表单设计器】多字段排序
    },
    // 自定义过滤方法
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  // 滚动组件配置
  scrollbar: {
    // 是否使用原生滚动样式
    // 开启后，菜单，弹窗，抽屉会使用原生滚动条组件
    native: false,
  },
  //表单配置
  form: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
    //表单默认冒号
    colon: true,
  },
};

/**
 * 获取排序信息
 * @param item
 */
function getSort(item) {
  const { field, order } = item;
  if (field && order) {
    const sortType = 'ascend' == order ? 'asc' : 'desc';
    return {
      // 排序字段
      column: field,
      // 排序方式 asc/desc
      order: sortType,
    };
  }
  return '';
}
