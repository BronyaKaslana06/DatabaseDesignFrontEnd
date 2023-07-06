<template>
    <h2>page1</h2>
    <el-button @click="getInfoFromServer">GET</el-button>
</template>

<script setup>
import cmRequest from '../service/index.js'
const getInfoFromServer = () => {
    cmRequest.request({
        url: '/test/1',
        method: 'GET'
    })

}
</script>

<style scoped></style>