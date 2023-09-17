import { FormSchema } from '/@/components/Form';

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
