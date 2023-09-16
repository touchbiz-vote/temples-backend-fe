import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'order_code',
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
    title: '封面',
    dataIndex: 'cover',
    width: 80,
    resizable: true,
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
    title: '预约时间',
    dataIndex: 'content',
    width: 120,
    resizable: true,
    customRender: ({ record }) => {
      return record.start_date + '~' + record.end_date;
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
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'biz_type_id',
    label: '业务类型',
    component: 'JDictSelectTag',
    colProps: { span: 8 },
  },
  {
    field: 'category_id',
    label: '商品分类',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    },
    colProps: { span: 8 },
  },
  {
    field: 'keyword',
    label: '活动关键字',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'enabled',
    label: '是否上架',
    colProps: { span: 8 },
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sex',
      placeholder: '请选择性别',
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
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    field: 'cover',
    label: '轮播图',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 6,
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
    label: '推荐位',
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
