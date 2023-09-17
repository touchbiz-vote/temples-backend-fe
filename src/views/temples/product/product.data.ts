import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rules } from '/@/utils/helper/validator';

import { ajaxGetDictItems } from './product.api';

export const columns: BasicColumn[] = [
  {
    title: '封面',
    dataIndex: 'cover',
    width: 80,
    resizable: true,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 140,
    resizable: true,
    sorter: {
      multiple: 1,
    },
    customRender: ({ record }) => {
      return record.name + (record.sub_title ? '<br/>' + record.sub_title : '');
    },
  },
  {
    title: '售价(元)',
    dataIndex: 'sale_price',
    width: 80,
    resizable: true,
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
    title: '推荐位',
    dataIndex: 'recommend',
    width: 80,
    resizable: true,
    sorter: {
      multiple: 1,
    },
    customRender: ({ text }) => {
      const color = text == '1' ? 'green' : 'red';
      return render.renderTag(text == '1' ? '推荐' : '', color);
    },
  },
  {
    title: '预约时间',
    dataIndex: 'content',
    width: 120,
    resizable: true,
    customRender: ({ record }) => {
      return record.start_date + '~' + record.end_date;
    },
  },
  {
    title: '可预约数',
    dataIndex: 'inventory',
    width: 80,
    resizable: true,
  },
  {
    title: '实销数',
    dataIndex: 'reserve_number',
    width: 60,
    resizable: true,
    sorter: {
      multiple: 1,
    },
    customRender: ({ record }) => {
      return render.renderHref({ text: record.reserve_number, url: '/order/list?productId=' + record.jeecg_row_key });
    },
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 60,
    resizable: true,
    customRender: ({ text }) => {
      const color = text == 1 ? 'green' : 'silver';
      return render.renderTag(text == '1' ? '上架' : '下架', color);
    },
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 120,
    resizable: true,
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
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
      labelField: 'value',
      valueField: 'text',
    },
    colProps: { span: 3 },
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
    colProps: { span: 3 },
  },
  {
    field: 'name',
    label: '活动关键字',
    component: 'JInput',
    colProps: { span: 4 },
  },
  {
    field: 'enabled',
    label: '是否上架',
    colProps: { span: 3 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
      ],
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
    field: 'name',
    label: '商品名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入商品名称',
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_product', 'name', model, schema, true),
  },
  {
    field: 'sub_title',
    label: '子标题',
    component: 'Input',
  },
  {
    field: 'biz_type_id',
    label: '业务类型',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: ajaxGetDictItems,
      params: { code: 't_biz_type,id,biz_name' },
      labelField: 'value',
      valueField: 'text',
    },
  },
  {
    field: 'category_id',
    label: '商品分类',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: ajaxGetDictItems,
      params: { code: 't_product_category,id,category_name' },
      labelField: 'value',
      valueField: 'text',
    },
  },
  {
    field: 'cover',
    label: '封面',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    field: 'carousel',
    label: '轮播图',
    component: 'JImageUpload',
    helpMessage: '最多上传6张',
    componentProps: {
      fileMax: 6,
    },
  },
  {
    field: 'code',
    label: '商品编码',
    component: 'Input',
    required: true,
    // show: false,
    componentProps: {
      placeholder: '请输入商品编码',
      // readonly: true,
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_product', 'code', model, schema, true),
  },
  {
    field: 'sale_price',
    label: '售价(元)',
    component: 'InputNumber',
    required: true,
    componentProps: {
      min: 1,
      max: 9999999,
      placeholder: '请输入售价',
    },
  },
  {
    field: 'recommend',
    label: '推荐位',
    component: 'JSwitch',
    componentProps: {
      options: [1, 2],
    },
    defaultValue: 2,
  },
  {
    field: 'avaliabDate',
    label: '预约时间段',
    component: 'RangeDate',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'inventory',
    label: '可售卖数',
    component: 'InputNumber',
    defaultValue: 999999,
    required: true,
    componentProps: {
      min: 1,
      max: 9999999,
      placeholder: '请输入可售卖数',
    },
  },
  {
    label: '商品介绍',
    field: 'content',
    component: 'JEditor',
  },
];
