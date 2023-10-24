import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';
import { rules } from '/@/utils/helper/validator';

export const columns: BasicColumn[] = [
  {
    title: '模版名称',
    dataIndex: 'template_name',
    width: 150,
  },
  {
    title: '模版编码',
    dataIndex: 'template_code',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
];
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'template_name',
    label: '模版名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入模版名称',
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_print_template', 'template_name', model, schema, true),
  },
  {
    field: 'template_code',
    label: '模版编码',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入模版编码',
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_print_template', 'template_code', model, schema, true),
  },
  {
    field: 'template',
    label: '打印模版',
    slot: 'template',
    component: 'Input',
  },
];
