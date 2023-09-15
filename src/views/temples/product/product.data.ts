import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
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
    title: '库存数/可预约数',
    dataIndex: 'content',
    width: 120,
    resizable: true,
  },
  {
    title: '实销数',
    dataIndex: 'reserve_number',
    width: 60,
    resizable: true,
    customRender: ({ record }) => {
      return render.renderHref({ text: record.reserve_number, url: 'www.baidu.com' });
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
    field: 'createBy',
    label: 'createBy',
    component: 'Input',
    show: false,
  },
  {
    field: 'createTime',
    label: 'createTime',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '名字',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入名字',
    },
  },
  {
    field: 'keyWord',
    label: '关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词',
    },
  },
  {
    field: 'punchTime',
    label: '打卡时间',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择打卡时间',
    },
  },
  {
    field: 'salaryMoney',
    label: '工资',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工资',
    },
  },
  {
    field: 'sex',
    label: '性别',
    component: 'JDictSelectTag',
    defaultValue: '1',
    componentProps: {
      type: 'radio',
      dictCode: 'sex',
      placeholder: '请选择性别',
    },
  },
  {
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: {
      placeholder: '请输入年龄',
    },
  },
  {
    field: 'birthday',
    label: '生日',
    component: 'DatePicker',
    defaultValue: '',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择生日',
    },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    rules: [{ required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
    componentProps: {
      placeholder: '请输入邮箱',
    },
  },
  {
    field: 'content',
    label: '个人简介 - To introduce myself',
    component: 'InputTextArea',
    labelLength: 4,
    componentProps: {
      placeholder: '请输入个人简介',
    },
  },
  {
    field: 'updateCount',
    label: '乐观锁',
    show: false,
    component: 'Input',
  },
];
