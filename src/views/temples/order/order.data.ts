import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { ajaxGetDictItems } from './order.api';
import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'order_code',
    width: 80,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '商品名称',
    dataIndex: 'product_name',
    width: 140,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '封面',
    dataIndex: 'image',
    width: 80,
    resizable: true,
  },

  {
    title: '售价(元)',
    dataIndex: 'unit_price',
    width: 80,
    resizable: true,
    customRender: ({ record }) => {
      return record.unit_price / 100;
    },
  },
  {
    title: '业务类型',
    dataIndex: 'biz_type_id',
    width: 80,
    resizable: true,
    sorter: {
      multiple: 1,
    },

    customRender: ({ record }) => {
      return record.bizTypeName;
    },
  },
  {
    title: '联系电话',
    dataIndex: 'contact_tel',
    width: 130,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '联系人',
    dataIndex: 'contact_man',
    width: 130,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '分类',
    dataIndex: 'category_id',
    width: 130,
    resizable: true,
    sorter: {
      multiple: 1,
    },
    customRender: ({ record }) => {
      return record.category_name;
    },
  },

  {
    title: '预约时间',
    dataIndex: 'content',
    width: 120,
    resizable: true,
    customRender: ({ record }) => {
      return record.start_date ? record.start_date + '~' + record.end_date : '';
    },
  },
  {
    title: '状态',
    dataIndex: 'order_status',
    width: 60,
    resizable: true,
    customRender: ({ text }) => {
      const color = text == 1 ? 'green' : text == 100 ? 'red' : 'yellow';
      return render.renderTag(text == '1' ? '已确认' : text == '100' ? '已取消' : '待确认', color);
    },
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '创建时间',
    dataIndex: 'gmt_create',
    width: 120,
    resizable: true,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'biz_type_id',
    label: '业务类型',
    component: 'ApiSelect',
    componentProps: {
      api: ajaxGetDictItems,
      params: { code: 't_biz_type,id,biz_name' },
      code: 't_biz_type,id,biz_name',
      labelField: 'value',
      valueField: 'text',
    },
    colProps: { span: 4 },
  },
  {
    field: 'category_id',
    label: '商品分类',
    component: 'ApiSelect',
    componentProps: {
      api: ajaxGetDictItems,
      params: { code: 't_product_category,id,category_name' },
      labelField: 'value',
      valueField: 'text',
    },
    colProps: { span: 4 },
  },
  {
    field: 'product_name',
    label: '活动关键字',
    component: 'JInput',
    colProps: { span: 4 },
  },
  {
    field: 'order_status',
    label: '订单状态',
    colProps: { span: 3 },
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'order_status',
      placeholder: '请选择状态',
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'cover',
    label: '封面',
    component: 'JUpload',
    componentProps: {
      maxCount: 1,
      sizeLimit: 20,
      helpMessage: '单个文件大小不能超过20KB',
      fileType: UploadTypeEnum.image,
    },
  },
  {
    field: 'cover',
    label: '轮播图',
    component: 'JUpload',
    componentProps: {
      maxCount: 6,
      sizeLimit: 200,
      helpMessage: '单个文件大小不能超过20KB',
      fileType: UploadTypeEnum.image,
    },
  },
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入商品名称',
    },
  },
  {
    field: 'sub_title',
    label: '子标题',
    component: 'Input',
  },
  {
    field: 'code',
    label: '商品编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入商品编码',
    },
  },
  {
    field: 'sale_price',
    label: '售价(元)',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入售价',
    },
  },
  {
    field: 'keyWord',
    label: '业务类型',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词',
    },
  },
  {
    field: 'recommend',
    label: '首页推荐',
    component: 'JSwitch',
  },
  {
    field: 'salaryMoney',
    label: '预约时间段',
    component: 'RangeDate',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择代理开始时间',
    },
    dynamicDisabled: ({ values }) => {
      console.log(values);
      return !!values.id;
    },
  },
  {
    field: 'inventory',
    label: '库存数',
    component: 'RangeNumber',
    defaultValue: '99999',
    componentProps: {
      placeholder: '请输入库存数',
      beginValue: 1,
      endValue: 9999999,
    },
  },
  {
    label: '商品介绍',
    field: 'content',
    component: 'JEditor',
  },
];
