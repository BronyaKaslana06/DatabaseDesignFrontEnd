<template>
    <div class="box">
        <div class="word-box">
            <div class="title">注册</div>
            <div class="content">加入我们</div>
        </div>
        <div class="signup-form">
            <div class="select-group">
                <el-button class="id-btn" :class="{ active: selected === 'user' }" @click="selectButton('user')">
                    用户
                </el-button>
                <el-button class="id-btn" :class="{ active: selected === 'staff' }" @click="selectButton('staff')">
                    员工
                </el-button>
                <el-button class="id-btn" :class="{ active: selected === 'admin' }" @click="selectButton('admin')">
                    管理员
                </el-button>
            </div>
            <el-form label-width="70px" :rules="rules" :model="formData" ref="formInstance">
                <el-form-item v-if="selected === 'user' || selected === 'staff'" label="姓名" prop="username">
                    <el-input v-model="formData.username"> </el-input>
                </el-form-item>
                <el-form-item v-if="selected === 'user'" label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname"> </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password type="password" v-model="formData.password"> </el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="formData.gender">
                        <el-option label="男" value="男">
                        </el-option>
                        <el-option label="女" value="女">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="phone_number">
                    <el-input v-model="formData.phone_number"></el-input>
                </el-form-item>
                <el-form-item v-if="selected === 'user'" label="地址" prop="address">
                    <el-input v-model="formData.address"></el-input>
                </el-form-item>
                <el-form-item v-if="selected === 'user'" label="生日">
                    <el-date-picker v-model="formData.birthday" type="date" placeholder="选择您的生日" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="selected === 'user'" label="邮箱" prop="email">
                    <el-input v-model="formData.email"></el-input>
                </el-form-item>
                <el-form-item v-if="selected !== 'user'" label="邀请码" prop="invite_code">
                    <el-input v-model="formData.invite_code"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <el-button @click="submitForm()" class="button-style">注册</el-button>
            </div>
            <div style="font-size: small;text-align: center;margin-top: 20px;">
                <div style="display: inline;color: grey">
                    已有账号？
                </div>
                <div style="display: inline;color:#4fd1c5; font-weight: bold;z-index: 100; cursor:pointer" @click="login">
                    点击登录
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="js">
import { reactive } from 'vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import cmrequest from '../service';

const selected = ref("user");
const formInstance = ref(null);
const router = useRouter();
const selectButton = (option) => {
    selected.value = option;
    resetFormData();
};

const formData = reactive({
    user_type: "",
    username: "",
    password: "",
    nickname: "",
    gender: "",
    birthday: "",
    address: "",
    phone_number: "",
    email: "",
    invite_code: ""
});

const resetFormData = () => {
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = "";
        }
    }
}

resetFormData();

const rules = reactive({
    username: [{
        required: true,
        message: "此项为必填项",
        trigger: "blur"
    }],
    nickname: [{
        required: true,
        message: "此项为必填项",
        trigger: "blur"
    }],
    gender: [{
        required: true,
        message: "此项为必填项",
        trigger: "blur"
    }],
    password: [{
        required: true,
        message: "此项为必填项",
        trigger: "blur"
    }],
    address: [{
        required: true,
        message: "此项为必填项",
        trigger: "blur"
    }],
    phone_number: [{
        required: true,
        message: '此项为必填项',
        trigger: 'blur'
    },
    {
        pattern: /^1[3456789]\d{9}$/,
        message: "手机号格式不对",
        trigger: "blur"
    }],
    email: [
        {
            pattern: /^(?:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})?$/,
            message: "邮箱格式不对",
            trigger: "blur"
        }],
    invite_code: [
        {
            required: true,
            message: "此项为必填项",
            trigger: "blur"
        },
        {
            max: 6,
            min: 6,
            message: "请输入6位长度的邀请码",
            trigger: "blur"
        }
    ]
})

const login = () => {
    router.push('/login')
}

const submitForm = async () => {
    if (!formInstance.value)
        return;
    await formInstance.value.validate((valid, fields) => {
        if (!valid) {
            ElMessage({
                type: 'error',
                message: '请正确填写注册信息'
            })
            return;
        }
        else {
            let type = selected.value === 'user' ? 0 : (selected.value == 'staff' ? 1 : 2);
            let data = new Date();
            let dataReplaced = data.toLocaleDateString().replace(/\//g, '-');
            let obj = {
                user_type: type,
                username: formData.username,
                password: formData.password,
                nickname: formData.nickname === '' ? null : formData.nickname,
                gender: formData.gender,
                birthday: formData.birthday === '' ? null : formData.birthday,
                create_time: dataReplaced,
                address: formData.address === '' ? null : formData.address,
                phone_number: formData.phone_number === '' ? null : formData.phone_number,
                email: formData.email === '' ? null : formData.email,
                invite_code: formData.invite_code === '' ? null : formData.invite_code
            }
            console.log(obj);
            cmrequest.request({
                url: "api/sign-up",
                method: 'POST',
                data: {
                    user_type: type,
                    username: formData.username,
                    password: formData.password,
                    nickname: formData.nickname === '' ? null : formData.nickname,
                    gender: formData.gender,
                    birthday: formData.birthday === '' ? null : formData.birthday,
                    create_time: dataReplaced,
                    address: formData.address === '' ? null : formData.address,
                    phone_number: formData.phone_number === '' ? null : formData.phone_number,
                    email: formData.email === '' ? null : formData.email,
                    invite_code: formData.invite_code === '' ? null : formData.invite_code,
                }
            }).then((res) => {
                if (!res.code) {
                    ElMessage({
                        type: 'success',
                        message: '注册成功，您的ID为' + res.data.user_id
                    })
                    localStorage.setItem('user_type', selected.value);
                    localStorage.setItem('user_id', res.data.user_id);
                    localStorage.setItem('token', res.token);
                    if (selected.value == 0)
                        router.push('/owner-dashboard');
                    else if (selected.value == 1)
                        router.push('/staff-dashboard')
                    else if (selected.value == 2)
                        router.push('/admin-dashboard')
                }
                else {
                    ElMessage({
                        type: 'error',
                        message: '注册失败'
                    })
                }
            })
        }
    });


}
</script>


<style scoped>
.active {
    background-color: #00a0e9;
    color: #4fd1c5;
    text-decoration: underline;
    text-decoration-color: #4fd1c5;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 10px;
    text-decoration-skip-ink: auto;
    /* 控制下划线绘制方式，实现圆端 */
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

.signup-form {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 20%;
    position: relative;
    border-radius: 15px;
    background: var(--black-amp-white-white, #FFF);
    box-shadow: 0px 7px 23px 0px rgba(0, 0, 0, 0.05);
    overflow: auto;
    padding: 40px 51.5px;
}

.select-group {
    display: flex;
    align-items: center;
    justify-content: space-around;

}

.id-btn {
    width: 33%;
    margin-bottom: 20px;
    background-color: #ffffff00;
    border: none;
    cursor: pointer
}

.id-btn:hover {
    color: #4fd1c5;
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

.word-box {
    position: absolute;
    left: 50%;
    top: 3%;
    transform: translateX(-50%);
    width: 30vw;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px rgb(71, 210, 196) inset !important;
}
</style>



// name: 注册页,
// author: 前端：束赫
//         后端：俞春先
// date: 2023-8-10
