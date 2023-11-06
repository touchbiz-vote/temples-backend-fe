import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';

export const columns: BasicColumn[] = [
  {
    title: '模版名称',
    dataIndex: 'template_name',
    width: 150,
  },
  {
    title: '导入模版',
    dataIndex: 'file_url',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 60,
    resizable: true,
    customRender: ({ text }) => {
      const color = text == 1 ? 'green' : 'silver';
      return render.renderTag(text == '1' ? '启用' : '停用', color);
    },
    sorter: {
      multiple: 1,
    },
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
    label: '导入模版',
    field: 'file_url',
    component: 'JUpload',
    componentProps: {
      maxCount: 1,
      helpMessage: '单个文件大小不能超过200KB',
      accept: '.xlsx',
      fileType: UploadTypeEnum.file,
    },
  },
  // {
  //   field: 'template_code',
  //   label: '模版编码',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     placeholder: '请输入模版编码',
  //   },
  //   dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_print_template', 'template_code', model, schema, true),
  // },
  {
    field: 'template',
    label: '打印模版',
    slot: 'template',
    component: 'Input',
  },
];
