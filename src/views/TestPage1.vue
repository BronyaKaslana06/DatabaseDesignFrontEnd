<template>
  <h2>page1</h2>
  <el-button @click="getInfoFromServer">GET</el-button>
  <div>{{ content }}</div>
</template>

<script setup>
import cmRequest from '../service/index.js'
import { ref } from 'vue'

const content = ref(null)
// 前端接口测试
const getInfoFromServer = () => {
  cmRequest.request({
    url: 'api/switchstations',
    method: 'GET'
  }).then((res) => {
    content.value = res
  });
}

cmRequest.request({
  url: 'api/switchstations',
  method: 'GET'
}).then((res) => {
  console.log("hhhh", res);
});

cmRequest.request({
  url: 'api/values/details',
  params: {
    id: 12345,
    s: 'happy'
  },
  method: 'GET'
}).then((res) => {
  console.log("hhhh", res);
});

cmRequest.request({
  url: 'api/values',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  },
  method: 'POST'
}).then((res) => {
  console.log("hhhh", res);
});

// const elink = ref("")
// cmRequest.request({
//   url: 'api/values/img',
//   data: {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   },
//   method: 'POST',
//   responseType: 'blob'
// }).then((res) => {
//   if (res.status === 204) {
//     this.$notify.error("无数据，无法生成文件！");
//   } else if (res.status === 200) {
//     // 通过下面的方法使界面弹出下载框
//     const blob = new Blob([res.data]); //处理文档流
//     elink.value = URL.createObjectURL(blob);
//   } else {
//     this.$notify.error(res.data);
//   }
// });

</script>

<style scoped></style>