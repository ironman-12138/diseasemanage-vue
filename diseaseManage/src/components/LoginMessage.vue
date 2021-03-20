<template>
    <div class="loginMessage">
        <el-dropdown>
        <el-avatar :size="35" :src="avatar" class="avatar"></el-avatar>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-house">系统首页</el-dropdown-item>
            <el-dropdown-item icon="el-icon-ship">交流讨论</el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>
        <span v-if="hasLogin"><el-link type="success">{{username}}</el-link></span>
        <span v-if="hasLogin"><el-link @click="logout" type="danger">退出</el-link></span>
        <span v-else><el-link href="/login" type="primary">登录</el-link></span>
    </div>
</template>

<script>
    import {request1} from '@/network/request'

    export default {
        name: 'LoginMessage',
        data() {
            return {
                username: '未登录',
                avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                hasLogin: false
            };
        },
        methods: {
            logout(){
                const _this = this;
                request1({
                    url: "/logout",
                    method: "post"
                }).then(res => {
                    _this.$store.commit("removeTokenAndInfo");
                    _this.$router.push("/login");
                })
            },
            getInfo(){
                const _this = this;
                //获取登录用户的信息
                request1({
                    url: '/user/info',
                    method: 'get',
                }).then(res => {
                    console.log(res);
                    this.username = res.username;
                    this.avatar = res.avatar;
                    this.hasLogin = true;
                    _this.$store.commit("setUserInfo",res);
                })
            }
        },
        created() {
            this.getInfo();
            if (this.$store.state.userInfo.username) {
                this.username = this.$store.state.userInfo.username;
                this.avatar = this.$store.state.userInfo.avatar;
                this.hasLogin = true;
            }
        }
    };
</script>

<style>
    /* 整体样式 */
    .loginMessage{
        height: 60px;
        margin: auto;
    }

    /* 头像样式 */
    .avatar{
        position: relative;
        top: 12px;
        margin-right: 5px;
    }
</style>