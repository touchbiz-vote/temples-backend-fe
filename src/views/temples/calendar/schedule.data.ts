import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rules } from '/@/utils/helper/validator';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'order_code',
    width: 140,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '佛事名称',
    dataIndex: 'product_name',
    width: 130,
    resizable: true,
  },
  {
    title: '联系人',
    dataIndex: 'contact_man',
    width: 130,
    resizable: true,
  },
  {
    title: '联系电话',
    dataIndex: 'contact_tel',
    width: 130,
    resizable: true,
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: 60,
  //   resizable: true,
  //   customRender: ({ text }) => {
  //     const color = text == 1 ? 'green' : 'silver';
  //     return render.renderTag(text == '1' ? '已分配' : '未使用', color);
  //   },
  //   sorter: {
  //     multiple: 1,
  //   },
  // },
];

export const pujaColumns: BasicColumn[] = [
  {
    title: '联系人',
    dataIndex: 'contactMan',
    width: 130,
    resizable: true,
  },
  {
    title: '联系电话',
    dataIndex: 'contactTel',
    width: 130,
    resizable: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 60,
    resizable: true,
    // customRender: ({ text }) => {
    //   const color = text == 1 ? 'green' : 'silver';
    //   return render.renderTag(text == '1' ? '已分配' : '未使用', color);
    // },
    // sorter: {
    //   multiple: 1,
    // },
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
    label: 'location_id',
    field: 'location_id',
    component: 'Input',
    show: false,
  },
  {
    field: 'title',
    label: '所在位置',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'code',
    label: '牌位编号',
    component: 'Input',
    required: true,
    componentProps: {
      require: true,
      placeholder: '请输入牌位编号',
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_tables', 'code', model, schema, true),
  },
];

export const formPujaSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '法会名称',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'title',
    label: '计划数',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'code',
    label: '实际预约数',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_tables', 'code', model, schema, true),
  },
];
