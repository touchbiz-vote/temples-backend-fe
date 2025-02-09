<template>
  <a-row>
    <a-col :span="12">
      <div :style="containerStyle">
        <a-tree
          v-if="treeData.length > 0"
          :load-data="loadChildren"
          showIcon
          autoExpandParent
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          v-model:expandedKeys="expandedKeys"
          @select="onSelect"
        />
      </div>
    </a-col>
    <a-col :span="12" style="padding-left: 10px">
      <div :style="containerStyle">
        <user-list
          :excludeUserIdList="excludeUserIdList"
          :dataList="userDataList"
          :selectedIdList="selectedIdList"
          @selected="onSelectUser"
          @unSelect="unSelectUser"
        />
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
  import { defHttp } from '/@/utils/http/axios';
  import { computed, ref, watch } from 'vue';
  import UserList from './UserList.vue';

  export default {
    name: 'DepartUserList',
    components: {
      UserList,
    },
    props: {
      searchText: {
        type: String,
        default: '',
      },
      selectedIdList: {
        type: Array,
        default: () => [],
      },
      excludeUserIdList: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['loaded', 'selected', 'unSelect'],
    setup(props, { emit }) {
      //export const queryById = (params) => defHttp.get({ url: Api.queryById, params }, { isTransformResponse: false });

      async function loadDepartTree(pid?) {
        const url = '/sys/sysDepart/queryDepartTreeSync';
        let params = {};
        if (pid) {
          params['pid'] = pid;
        }
        const data = await defHttp.get({ url, params }, { isTransformResponse: false });
        console.log('loadDepartTree', data);
        return data;
      }

      async function initRoot() {
        console.log('initRoot');
        const data = await loadDepartTree();
        if (data.success) {
          let arr = data.result;
          treeData.value = arr;
          emitDepartOptions(arr);
        } else {
          console.error(data.message);
        }
        clear();
      }

      function emitDepartOptions(arr) {
        let options = [];
        if (arr && arr.length > 0) {
          options = arr.map((k) => {
            return {
              value: k.id,
              label: k.departName,
            };
          });
        }
        emit('loaded', options);
      }

      initRoot();

      const treeData = ref<any[]>([]);
      const selectedKeys = ref<string[]>([]);
      const expandedKeys = ref<string[]>([]);
      const selectedDepartId = ref('');
      function onSelect(ids, e) {
        let record = e.node.dataRef;
        selectedKeys.value = [record.key];

        let id = ids[0];
        selectedDepartId.value = id;
        loadUserList();
      }

      function clear() {
        selectedDepartId.value = '';
      }
      async function loadChildren(treeNode) {
        console.log('loadChildren', treeNode);
        const data = await loadDepartTree(treeNode.eventKey);
        if (data.success) {
          let arr = data.result;
          treeNode.dataRef.children = [...arr];
          treeData.value = [...treeData.value];
        } else {
          console.error(data.message);
        }
      }

      const maxHeight = ref(300);
      maxHeight.value = window.innerHeight - 300;
      const containerStyle = computed(() => {
        return {
          'overflow-y': 'auto',
          'max-height': maxHeight.value + 'px',
        };
      });

      const userDataList = ref<any[]>([]);
      async function loadUserList() {
        const url = '/sys/user/selectUserList';
        let params = {
          pageNo: 1,
          pageSize: 10,
        };
        if (props.searchText) {
          params['keyword'] = props.searchText;
        }
        if (selectedDepartId.value) {
          params['departId'] = selectedDepartId.value;
        }
        const data = await defHttp.get({ url, params }, { isTransformResponse: false });
        if (data.success) {
          const { records } = data.result;
          userDataList.value = records;
        } else {
          console.error(data.message);
        }
        console.log('depart-loadUserList', data);
      }
      watch(
        () => props.searchText,
        () => {
          loadUserList();
        }
      );

      function onSelectUser(info) {
        emit('selected', info);
      }
      function unSelectUser(id) {
        emit('unSelect', id);
      }

      return {
        containerStyle,
        treeData,
        selectedKeys,
        expandedKeys,
        onSelect,
        loadChildren,
        onSelectUser,
        unSelectUser,
        userDataList,
      };
    },
  };
</script>

<style scoped></style>
