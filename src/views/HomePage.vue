<template>
  <img :src="elink">
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
import {ref} from 'vue'
import mySlNav from '../components/sliderbar-nav.vue'
import axios from 'axios'

axios.get('api/switchstations')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });

axios.get('api/values/details',{
    params: {
      id: 12345,
      s:'happy'
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

axios.post('api/values',{
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
const elink=ref("https://img-home.csdnimg.cn/images/20201124032511.png")
  axios.post('api/values/img', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }, {
    responseType: 'blob'
  }).then(res => {
    if (res.status === 204) {
        this.$notify.error("无数据，无法生成文件！");
    } else if (res.status === 200) {
        // 通过下面的方法使界面弹出下载框
        const blob = new Blob([res.data]); //处理文档流
        // const fileName = "文件名";
        // const elink = document.createElement('a');
        // elink.download = fileName;
        // elink.style.display = 'none';
        elink.value = URL.createObjectURL(blob);
        // document.body.appendChild(elink);
        // elink.click();
        // URL.revokeObjectURL(elink.href); // 释放URL 对象
        // document.body.removeChild(elink);
    } else {
        this.$notify.error(res.data);
    }
});
</script>

<style scoped></style>