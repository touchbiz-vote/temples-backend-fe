import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rules } from '/@/utils/helper/validator';

import { ajaxGetDictItems } from './product.api';
import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';

export const columns: BasicColumn[] = [
  {
    title: '封面',
    dataIndex: 'cover',
    width: 60,
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
  // {
  //   title: '售价(元)',
  //   dataIndex: 'sale_price',
  //   width: 80,
  //   resizable: true,
  // },
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
    width: 90,
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
    title: '顺序',
    dataIndex: 'sequence',
    width: 80,
    resizable: true,
    sorter: {
      multiple: 1,
    },
  },
  {
    title: '预约时间段',
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
      params: {
        code: "t_biz_type,id,biz_name, biz_code !='volunteer' and biz_code != 'monks' and biz_code != 'album' and biz_code != 'todayTips' and biz_code != 'navigator' ",
      },
      labelField: 'value',
      valueField: 'text',
    },
    colProps: { style: 'width:220px' },
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
    colProps: { style: 'width:220px' },
  },
  {
    field: 'name',
    label: '活动关键字',
    component: 'JInput',
    colProps: { style: 'width:220px' },
  },
  {
    field: 'enabled',
    label: '是否上架',
    colProps: { style: 'width:220px' },
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
    // dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_product', 'name', model, schema, true),
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
    componentProps: ({ formActionType, formModel }) => {
      return {
        api: ajaxGetDictItems,
        params: {
          code: "t_biz_type,id,biz_name, biz_code !='volunteer' and biz_code != 'monks' and biz_code != 'album' and biz_code != 'todayTips' and biz_code != 'navigator' ",
        },
        labelField: 'value',
        valueField: 'text',
        onChange: (options, values) => {
          const { updateSchema } = formActionType;
          console.log(values);
          formModel.category_id = undefined;
          updateSchema([
            {
              field: 'category_id',
              componentProps: {
                api: ajaxGetDictItems,
                params: { code: 't_product_category,id,category_name' + ',biz_type_id=' + values.value },
                labelField: 'value',
                valueField: 'text',
              },
            },
          ]);
        },
        onSelect: (values) => {
          const { updateSchema } = formActionType;
          console.log(values);
          formModel.category_id = undefined;
          updateSchema([
            {
              field: 'category_id',
              componentProps: {
                api: ajaxGetDictItems,
                params: { code: 't_product_category,id,category_name' + ',biz_type_id=' + values },
                labelField: 'value',
                valueField: 'text',
              },
            },
          ]);
        },
      };
    },
  },
  {
    field: 'category_id',
    label: '商品分类',
    required: true,
    component: 'ApiSelect',
    componentProps: ({ formModel }) => {
      return {
        api: ajaxGetDictItems,
        params: { code: 't_product_category,id,category_name' + (formModel.biz_type_id ? ',biz_type_id=' + formModel.biz_type_id : '') },
        labelField: 'value',
        valueField: 'text',
      };
    },
  },
  {
    field: 'cover',
    label: '封面',
    component: 'JUpload',
    componentProps: {
      maxCount: 1,
      sizeLimit: 30,
      helpMessage: '单个文件大小不能超过40KB, 宽度和高度保持 180px*200px的比例',
      fileType: UploadTypeEnum.image,
    },
  },
  {
    field: 'carousel',
    label: '轮播图',
    helpMessage: '最多上传6张',
    component: 'JUpload',
    componentProps: {
      maxCount: 6,
      sizeLimit: 200,
      helpMessage: '单个文件大小不能超过200KB, 高度不要超过150px',
      fileType: UploadTypeEnum.image,
    },
  },
  // {
  //   field: 'code',
  //   label: '商品编码',
  //   component: 'Input',
  //   required: false,
  //   // show: false,
  //   componentProps: {
  //     // placeholder: '请输入商品编码',
  //     // readonly: true,
  //   },
  //   dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('t_product', 'code', model, schema, true),
  // },
  // {
  //   field: 'sale_price',
  //   label: '售价(元)',
  //   component: 'InputNumber',
  //   required: true,
  //   componentProps: {
  //     min: 1,
  //     max: 9999999,
  //     placeholder: '请输入售价',
  //   },
  // },
  {
    field: 'recommend',
    label: '首页推荐',
    component: 'JSwitch',
    componentProps: {
      options: [1, 2],
    },
    defaultValue: 2,
  },
  {
    field: 'sequence',
    label: '显示顺序',
    component: 'InputNumber',
    required: true,
    componentProps: {
      min: 0,
      max: 9999999,
      placeholder: '数字越小越靠前',
    },
    defaultValue: 100,
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
    field: 'details',
    component: 'JEditor',
  },
];
