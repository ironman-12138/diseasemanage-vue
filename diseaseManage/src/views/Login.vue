<template>
    <div>
        <el-container class="login-all">
            <el-header>
                <img class="logo" src="@/assets/img/logo.png"/>
            </el-header>

            <el-main>
                <el-card class="login-card">
                    <!-- 
                        :model为绑定的表单数据对象
                        添加rules属性绑定为之前配置的验证规则
                        添加status-icon属性可显示状态图标
                        ref为表单被引用时的名称
                    -->
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <h3>系统登录</h3>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="ruleForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="code">
                            <el-input style="float: left; width: 220px; margin-right: 5px;" type="text" v-model="ruleForm.code" placeholder="点击更换图片验证码"></el-input>
                            <img :src="captchaUrl" @click="updateCaptcha">
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>

                <div class="login-introduce">疫情物资管理系统</div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import {request1} from '@/network/request'
export default {
    name: 'Login',
    data() {
        return {
            ruleForm: {
                username: '',
                password: '',
                code: '',
            },
            /**与上文  '表单内容' 中 <el-form> 表单的 :rules 属性值相同 */
            rules: {
                /**el-form-item元素的prop属性绑定字段名username，表单验证时，
                 * 就会验证el-input元素绑定的变量ruleForm.username的值是否符合验证规则 */
                username: [
                    /**required: true必填，trigger: 'blur'失去焦点时验证，如果为空，提示信息为 '请输入用户名' */
                    { required: true, message: "请输入用户名", trigger: 'blur' },
                    /**最短2，最长15 */
                    { min: 2, max: 15, message: "长度在3到15之间", trigger: 'blur' }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: 'blur' }
                ],
                code: [
                    { required: true, message: "请输入验证码", trigger: 'blur' }
                ]
            },
            captchaUrl: 'http://localhost:8081/captcha?time=' + new Date()
        };
    },
    methods: {
        submitForm(formName) {
            /**
             * formName 就是传入的 'rulesForm'，
             * 与 <el-form> 表单的 ref 属性值一致，这样就指定好需要验证的表单了 
             * */
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const _this = this;
                request1({
                    url: '/login',
                    method: 'post',
                    data: _this.ruleForm
                }).then(res => {
                    console.log(res);
                    //获取响应头中的token数据并存储
                    const tokenStr = res.data.tokenMap.tokenHead+res.data.tokenMap.token
                    window.sessionStorage.setItem('tokenStr',tokenStr);
                    
                    //页面跳转
                    _this.$router.replace("/users");
                 });
            } else {
                console.log('error submit!!');
                this.$message.error('请输入所有字段');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        updateCaptcha() {
            this.captchaUrl = 'http://localhost:8081/captcha?time=' + new Date()
        },
    }
};
</script>

<style>
    .login-all{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    
    .el-main {
        background-color: rgb(218, 224, 224);
        color: #333;
        text-align: center;
    }
    
    body > .el-container {
        margin-bottom: 40px;
    }
    
    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }
    
    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    /* 设置logo样式 */
    .logo{
        height: 60%;
        margin-top: 10px;
    }

    /* 登录表单外框样式 */
    .login-card{
        max-width: 500px;
        margin: auto;
    }

    /* 登录区样式 */
    .demo-ruleForm{
        margin: 10px auto;
        width: 450px;
    }

    /* 介绍 */
    .login-introduce{
        margin-top: 10px;
    }
</style>