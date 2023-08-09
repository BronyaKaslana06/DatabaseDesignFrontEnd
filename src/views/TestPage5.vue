<template>
    <h2>page5</h2>
    <button @click="exit()">
        注销
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const exit = ()=>{
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    router.push('/login');
}

</script>

<style scoped>

</style>