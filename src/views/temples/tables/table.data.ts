import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rules } from '/@/utils/helper/validator';

export const columns: BasicColumn[] = [
  {
    title: '牌位编号',
    dataIndex: 'code',
    width: 140,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '关联用户',
    dataIndex: 'user_id',
    width: 80,
    resizable: true,
  },
  {
    title: '关联订单',
    dataIndex: 'order_id',
    width: 130,
    resizable: true,
  },

  {
    title: '状态',
    dataIndex: 'status',
    width: 60,
    resizable: true,
    customRender: ({ text }) => {
      const color = text == 1 ? 'green' : 'silver';
      return render.renderTag(text == '1' ? '已分配' : '未使用', color);
    },
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 150,
    resizable: true,
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    width: 150,
    resizable: true,
  },
];

// 部门基础表单
export function useBasicFormSchema() {
  const basicFormSchema: FormSchema[] = [
    {
      field: 'departName',
      label: '位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入位置名称',
      },
      rules: [{ required: true, message: '机构名称不能为空' }],
    },
    {
      field: 'pid',
      label: '上级',
      component: 'TreeSelect',
      componentProps: {
        treeData: [],
        placeholder: '无',
        dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
      },
    },
  ];
  return { basicFormSchema };
}

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
