<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable" :columns="columns" :dataSource="tableData">
      <template #tableTitle>
        <a-upload name="file" :showUploadList="false" :customRequest="(file) => onImportXls(file)">
          <a-button type="primary" preIcon="ant-design:import-outlined">导入用于打印的批量数据</a-button>
        </a-upload>
        <a-button :disabled="tableData.length == 0" type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint">打印</a-button>
        <span
          ><b>共导入数据{{ tableData.length }}条</b></span
        >
      </template>
    </BasicTable>
    <PrintModal :printData="tableData" @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicColumn } from '/@/components/Table';
  import { ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import PrintModal from './PrintModal.vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  import * as xlsx from 'xlsx';
  const [registerModal, { openModal }] = useModal();
  const tableData = ref([]);
  const columns = ref([]);

  function onImportXls(e) {
    console.log(e.file);
    readExcelFile(e.file, 0);
  }

  /**
   * 把文件按照二进制进行读取
   * @param file
   * @returns
   */
  const readFile = (file: File) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (ev) => {
        resolve(ev.target?.result);
      };
    });
  };
  /**
 * 根据sheet索引读取Excel文件中的数据
 /**@param file 文件
 /** @param sheetIndex excel文件中sheet表索引 默认是从0开始
 /**@returns  将表中的数据以json形式的数据返回
*/
  const readExcelFile = async (file: File, sheetIndex: number) => {
    let data = await readFile(file);
    let workbook = xlsx.read(data, { type: 'binary' });
    let worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
    data = xlsx.utils.sheet_to_json(worksheet);
    tableData.value = data;
    if (data && data != null && data.length > 0) {
      const fieldNames = Object.keys(data[0]);
      columns.value = fieldNames.map((fieldName) => {
        return {
          title: fieldName,
          dataIndex: fieldName,
          width: 150,
        } as BasicColumn;
      });
    }
    console.log(data);
    console.log(columns);
    return data;
  };
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '导入数据列表',
      columns: columns,
      size: 'default',
      formConfig: {
        autoSubmitOnEnter: false,
        showAdvancedButton: false,
        labelWidth: 80,
      },
      striped: true,
      useSearchForm: false,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      pagination: false,
      showActionColumn: false,
      tableSetting: { fullScreen: true },
      rowKey: 'id',
    },
  });

  const [registerTable] = tableContext;

  /**
   * 新增事件
   */
  function handlePrint() {
    openModal(true, {
      printData: tableData.value,
    });
  }
</script>
