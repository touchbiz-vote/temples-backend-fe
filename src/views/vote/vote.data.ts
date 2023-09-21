import { BasicColumn } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const monitorColumns: BasicColumn[] = [
  {
    title: '评委姓名',
    dataIndex: 'name',
    align: 'center',
    sorter: false,
  },
  {
    title: '推荐数',
    dataIndex: 'recommand_count',
    align: 'center',
    sorter: false,
  },
  {
    title: '不推荐数',
    dataIndex: 'not_recommand_count',
    align: 'center',
    sorter: false,
  },
  {
    title: '可推荐数',
    dataIndex: 'un_recommand_count',
    align: 'center',
    sorter: false,
  },
  {
    title: '活动id',
    dataIndex: 'activity_id',
    align: 'center',
  },
  {
    title: '评委id',
    dataIndex: 'account_id',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
  },
];
