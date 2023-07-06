<template>
  <el-container>
    <el-aside>
      <my-sl-nav />
    </el-aside>
    <el-main>
      <div class="content">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import mySlNav from '../components/sliderbar-nav.vue'
import axios from 'axios'

axios.get('/api/weatherforecast')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });


</script>

<style scoped></style>