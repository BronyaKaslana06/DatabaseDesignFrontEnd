<template>
    <div class="box" v-loading = 'loginLoading'>
        <div class="word-box">
            <div class="title">欢迎</div>
            <div class="content">体验蔚来的汽车换电服务</div>
        </div>
        <div class="login-form">
            <el-form :model="formData">
                <el-form-item prop="user_id" label="用户ID" class="label">
                    <el-input v-model="formData.user_id" ></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" class="label">
                    <el-input v-model="formData.password"  type="password" show-password />
                </el-form-item>
            </el-form>
            <div>
                <el-button @click="submitForm()" class="button-style">登录</el-button>
            </div>
            <div style="font-size: small;text-align: center;margin-top: 20px;">
                <div style="display: inline;color: grey">
                    还没有账号？
                </div>
                <div style="display: inline;color:#4fd1c5; font-weight: bold;z-index: 100; cursor:pointer" @click="signup">
                    点击注册
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import cmrequest from '../service';
import { ElMessage } from 'element-plus';

const formData = reactive({
    user_id: '',
    password: ''
})
const router = useRouter();
const loginLoading = ref(false);

const submitForm = () => {
    // localStorage.setItem('user_type', parseInt(formData.user_id));
    // localStorage.setItem('user_id',formData.user_id+'000001');
    // const user_type = localStorage.getItem('user_type');
    // if(user_type == 0)
    //     router.push('/reservation');
    // else if(user_type == 1){
    //     router.push('/employee-dashboard-page');
    //     localStorage.setItem('staff_type','换电站管理员');
    // }

    // else if(user_type == 2)
    //     router.push('/admin-dashboard-page');
    loginLoading.value = false;
    if (!formData)
        return;
    if (formData.user_id === '' || formData.password === '') {
        ElMessage({
            type: 'error',
            message: "请输入用户ID和密码"
        })
        return;
    }
    cmrequest.request({
        url: 'api/login',
        method: "POST",
        data: {
            user_id: formData.user_id,
            password: formData.password
        }
    }).then((msg) => {
        if (!msg.code) {
            var identity;
            identity = msg.data.user_type;
            localStorage.setItem('user_type', identity);
            localStorage.setItem('user_id', msg.data.user_id);
            localStorage.setItem('username', msg.data.username);
            localStorage.setItem('token', msg.token);
            loginLoading.value = true;
            if (identity == 0)
                router.push('/owner-dashboard');
            else if (identity == 1) {
                router.push('/staff-dashboard');
                localStorage.setItem('staff_type', msg.data.position);
                localStorage.setItem('station_id', msg.data.station_id);
            }
            else if (identity == 2){
                localStorage.setItem('username', '管理员' + msg.data.user_id);
                router.push('/admin-dashboard')
            }
        }
    })
}
const signup = () => {
    router.push('/sign-up')
}

</script>


<style scoped>
.login-form {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 20%;
    position: relative;
    border-radius: 15px;
    background: var(--black-amp-white-white, #FFF);
    box-shadow: 0px 7px 23px 0px rgba(0, 0, 0, 0.05);
    overflow: auto;
    padding: 20px 51.5px;
}

.button-style {
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    background-color: #4fd1c5;
    color: white;
    width: 50%;
    border: solid 1px #4fd1c5;
    border-radius: 10px;
    margin-top: 20px;
}

.label {
    display: block;
}

.content {
    text-align: center;
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.854);
}

.title {
    color: white;
    font-size: 40px;
    display: blcok;
    text-align: center;
}

.word-box {
    position: absolute;
    left: 50%;
    top: 15%;
    transform: translateX(-50%);
    width: 30vw;
}

:deep(.el-input__inner:focus){
    border-color: #4fd1c5 !important;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px rgb(71, 210, 196) inset !important;
}
</style>


// name: 登录页,
// author: 前端：束赫
//         后端：俞春先
// date: 2023-8-10
