<template>
  <div class="page">
    <div class="content">
      <!-- 页面内容放在这里 -->
      <div class="search">
        <span>打印模版:</span>
        <a-select style="width: 400px" placeholder="请选择打印模版" @change="templateChange">
          <a-select-option :value="null">请选择打印模版…</a-select-option>
          <template v-for="item in dictOptions" :key="`${item.value}`">
            <a-select-option :value="item.id">
              <span style="display: inline-block; width: 100%" :title="item.template_name">
                {{ item.template_name }}
              </span>
            </a-select-option>
          </template>
        </a-select>
        <a-button key="1" type="primary" :ghost="ghost" size="small" preIcon="ant-design:download" @click="download">下载导入模版</a-button>
      </div>
      <!--自定义查询区域-->
      <BasicTable @register="registerTable" :columns="columns" :dataSource="tableData" :rowSelection="rowSelection">
        <template #tableTitle>
          <a-upload name="file" :showUploadList="false" :customRequest="(file) => onImportXls(file)">
            <a-button type="primary" preIcon="ant-design:import-outlined">导入用于打印的批量数据</a-button>
          </a-upload>
          <span style="margin-left: 10px; display: flex; align-items: center; justify-content: center; height: 30px; font-weight: bold">
            共导入数据{{ tableData.length }}条
          </span>
        </template>
      </BasicTable>
    </div>

    <div class="footer">
      <a-button :disabled="tableData.length == 0 || currentTemplate == null" type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint"
        >打印</a-button
      >
    </div>
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
  const tableData = ref<any>([]);
  const columns = ref([]);
  const dictOptions = ref([]);
  const currentTemplate = ref<any>(null);
  import { getList } from './print.api';
  const ghost = ref(true);

  function onImportXls(e) {
    readExcelFile(e.file, 0);
  }

  getList({ pageSize: 100, enabled: 1 }).then((res) => {
    dictOptions.value = res.records;
  });

  const download = () => {
    if (currentTemplate.value) {
      window.open(currentTemplate.value.file_url);
    }
  };

  const templateChange = (e) => {
    if (!e) {
      currentTemplate.value = null;
      return;
    }
    console.log(e);
    currentTemplate.value = dictOptions.value.find((x) => x.id == e);
    console.log(currentTemplate.value);
  };

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
      showIndexColumn: true,
      pagination: false,
      showActionColumn: false,
      tableSetting: { fullScreen: true },
      rowKey: '',
    },
  });

  const [registerTable, {}, { rowSelection, selectedRows }] = tableContext;

  /**
   * 新增事件
   */
  function handlePrint() {
    const printData = selectedRows.value.length > 0 ? selectedRows.value : tableData.value;
    openModal(true, {
      printData: printData,
      template: currentTemplate.value,
    });
  }
</script>

<style lang="less" scoped>
  .page {
    margin: 0;
    padding: 0;
    height: 100vh; /* 设置 body 的高度占据整个视口高度 */
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1; /* 使内容部分占据剩余的空间，将其推至底部 */
    overflow: auto; /* 添加 overflow 属性，当内容超出时出现滚动条 */
    margin-bottom: 70px; /* 设置底部 margin 避免与 footer 重叠 */
  }

  .search {
    margin-bottom: 10px;
    height: 60px;
    background-color: #ffffff;
    display: flex;
    align-items: center; /* 内容垂直居中 */
  }

  .search > * {
    margin: 0 10px; /* 子元素之间的水平间距为20px（左右各10px） */
  }

  .footer {
    margin-top: 10px;
    height: 60px;
    background-color: #ffffff;
    color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 30px 10px 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center; /* 内容垂直居中 */
    text-align: right;
  }
</style>
