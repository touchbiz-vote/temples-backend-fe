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
    title: '法会名称',
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
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    resizable: true,
  },
];
