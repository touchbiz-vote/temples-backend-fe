<template>
  <a-card :bordered="false">
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleImportXls" type="primary" icon="upload">导入</a-button>
      <j-import-modal ref="importModal" :url="getImportUrl()" :online="true" @ok="importOk"></j-import-modal>

      <a-popconfirm title="是否要删除所有作品，删除后将无法进行恢复？" @confirm="handleClickClean">
        <a-button type="primary" icon="delete">清除所有记录</a-button>
      </a-popconfirm>
      <a-button type="primary" icon="download" @click="handleExportXls('活动作品列表')">导出</a-button>
       
    </div>
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a v-if="false" style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData()"><a-icon type="sync" />刷新</a>
          <a-divider type="vertical" />
          <a-popover title="自定义列" trigger="click" placement="leftBottom">
            <template slot="content">
              <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                <a-row style="width: 400px">
                  <template v-for="(item,index) in defColumns">
                    <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12"><a-checkbox :value="item.dataIndex"><j-ellipsis :value="item.title" :length="10"></j-ellipsis></a-checkbox></a-col>
                    </template>
                  </template>
                </a-row>
              </a-checkbox-group>
            </template>
            <a><a-icon type="setting" />设置</a>
          </a-popover>
        </span>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        size="middle"
        ref="table"
        bordered
        rowKey="id"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template v-for="col in ['account', 'password']" :slot="col" slot-scope="text">
          {{ text }}
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import Vue from 'vue'

export default {
  name: 'ActivityCaseModal',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      title: '操作',
      settingColumns: [],
      defColumns: [],
      // table
      columns: [
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'create_time' },
        },
      ],
      tableId: '768afa9fde41486cb24d852ea96893d8',
      data: [],
      url: {
        importExcel : 'api/biz/activity/case/import/',
        list: '/online/cgform/api/getData/',
        update: '/online/cgform/api/form/',
        columns: '/online/cgform/api/getColumns/',
        clean: '/api/biz/activity/case/clean/',
        exportXlsUrl: 'api/biz/activity/case/export/'
      },
    }
  },
  methods: {
    //省略部分代码......
    handleImportXls() {
      this.$refs.importModal.show()
    },
    getImportUrl() {
      return this.url.importExcel
    },
    importOk() {
      this.loadData(1)
    },
    init() {
      this.url.list = this.url.list + this.tableId
      this.url.update = this.url.update + this.tableId
      this.url.columns = this.url.columns + this.tableId
      this.url.importExcel = this.url.importExcel + this.$route.query.id
    },
    initColumns(){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

        var key = this.$route.name+":colsettings";
        let colSettings= Vue.ls.get(key);
        if(colSettings==null||colSettings==undefined){
          let allSettingColumns = [];
          console.log(this.defColumns)
          this.defColumns.forEach(function (item,i,array ) {
            allSettingColumns.push(item.dataIndex);
          })
          this.settingColumns = allSettingColumns;
          console.log(this.defColumns)
          this.columns = this.defColumns;
        }else{
          this.settingColumns = colSettings;
          const cols = this.defColumns.filter(item => {
            if(item.key =='rowIndex'|| item.dataIndex=='action'){
              return true;
            }
            if (colSettings.includes(item.dataIndex)) {
              return true;
            }
            return false;
          })
          this.columns =  cols;
        }
      },
    onColSettingsChange (checkedValues) {
        var key = this.$route.name+":colsettings";
        Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
        this.settingColumns = checkedValues;
        const cols = this.columns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true
          }
          if (this.settingColumns.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns =  cols;
      },
    loadColumn() {
      getAction(this.url.columns).then((res) => {
        if (res.success) {
          this.columns = res.result.columns
        
          this.columns.forEach((column) => {
            column.customRender = null
            column.scopedSlots = { customRender: column.dataIndex }
          })
          this.columns = this.columns.concat()
          this.settingColumns = this.columns
          this.defColumns = this.columns
          this.initColumns()
        } else {
          this.columns = null
        }
      })
    },
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      //update-begin--Author:kangxiaolin  Date:20190905 for：[442]主子表分开维护，生成的代码子表的分页改为真实的分页--------------------
      var params = this.getQueryParams()
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.data = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.data = null
        }
      })
      //update-end--Author:kangxiaolin  Date:20190905 for：[442]主子表分开维护，生成的代码子表的分页改为真实的分页--------------------
    },
    getQueryParams() {
      //高级查询器
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.activity_id = this.$route.query.id
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    handleClickClean() {
      deleteAction(this.url.clean + this.$route.query.id).then((res) => {
        if (res.success) {
          this.$message.success('清空成功')
          this.loadData(1)
        } else {
          this.$message.fail('清空成功')
        }
      })
    },
  },
}
</script>

<style scoped>
.ant-modal-body {
  padding: 8px !important;
}
</style>