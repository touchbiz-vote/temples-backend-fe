import { ref } from 'vue';
function useOnlineTest(data, methods, form) {
  const aiTestMode = ref(false);
  const aiTestTable = ref([]);
  const aiTableList = ref([]);
  function initVirtualData() {}
  function genButtons(code) {}
  function genEnhanceJavaData(code) {}
  function genEnhanceJsData(tableName, type, codeEditor) {}
  function genEnhanceSqlData(code, tableName) {}
  function setTaleConfig() {}
  function tableJsonGetHelper(pickAfter) {
    console.log('\u8868\u7684\u914D\u7F6E\u4FE1\u606F', JSON.stringify(pickAfter));
    console.log('---------------------------------------');
  }
  function fieldsJsonGetHelper(fields) {}
  function refreshCacheTableName(oldValue, newValue) {}
  function getCacheTableName(name) {}
  return {
    aiTestMode,
    aiTestTable,
    aiTableList,
    initVirtualData,
    genButtons,
    genEnhanceJavaData,
    genEnhanceJsData,
    genEnhanceSqlData,
    setTaleConfig,
    tableJsonGetHelper,
    fieldsJsonGetHelper,
    refreshCacheTableName,
    getCacheTableName,
  };
}
export { useOnlineTest as u };
