<template>
    <div>
      <h2>page1</h2>
      <el-button @click="getInfoFromServer">GET</el-button>
      <div v-if="responseData">{{ responseData }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import cmRequest from '../service/index.js';
  
  const responseData = ref(null);
  
  const getInfoFromServer = () => {
    cmRequest.request({
      url: '/test/1',
      method: 'GET'
    }).then((res) => {
      responseData.value = res;
    });
  }
  </script>
  
  <style scoped>
  </style>