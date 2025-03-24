<template>
  <div class="my-video">
    <a-table :columns="columns" :data-source="data" :row-selection="rowSelection">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span>
              <a @click="publishSet">发布设置</a>
            </span>
            <span class="delete">
              <a @click="publishSet">删除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const columns = [
  {
    title: '视频标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '发布记录',
    dataIndex: 'pulishRecord',
    key: 'pulishRecord',
    width: '12%'
  },
  {
    title: '同步记录',
    dataIndex: 'syncRecord',
    width: '12%',
    key: 'syncRecord'
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    width: '20%',
    key: 'created'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%'
  }
]
const data = [
  {
    key: 1,
    title: '10d1ecc7336330c1d9df6d17ed54d53a',
    pulishRecord: '-',
    syncRecord: '-',
    created: '2025-03-20 22:21:48'
  }
]
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
})
const publishSet = () => {}
</script>

<style scoped>
.delete {
  margin-left: 12px;
}
</style>
