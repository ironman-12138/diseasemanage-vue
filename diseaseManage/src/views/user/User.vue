<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" style="margin-bottom: 10px">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>        

        <!-- 用户列表卡片 -->
        <el-card class="box-card">
            <el-form :inline="true" :model="userVo" label-width="70px" class="demo-form-inline">
                <el-form-item label="部门">
                    <el-select v-model="userVo.departmentId" placeholder="请选择">
                        <el-option>
                            <span style="float: left">全部</span>
                        </el-option>
                        <el-option
                        v-for="item in deptList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deptCount }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input clearable v-model="userVo.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input clearable v-model="userVo.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="userVo.sex" :label="0">男</el-radio>
                    <el-radio v-model="userVo.sex" :label="1">女</el-radio>
                    <el-radio v-model="userVo.sex" label="">全部</el-radio>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input clearable v-model="userVo.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: 30px">
                    <el-button icon="el-icon-refresh" @click="resetUserVo">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="getUserList">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="show">添加</el-button>
                    <el-button type="warning" icon="el-icon-download">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="userList" border max-height="420px" style="width: 100%;">
                <el-table-column
                prop="id"
                label="#"
                width="50">
                </el-table-column>
                <el-table-column
                prop="username"
                label="用户名"
                width="110">
                </el-table-column>
                <el-table-column
                prop="sex"
                label="性别"
                width="110">
                    <template slot-scope="scope">
                        {{scope.row.sex == 0 ? '男' : (scope.row.sex == 1 ? '女' : '保密')}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="所属部门"
                sortable
                width="180">
                </el-table-column>
                <el-table-column
                prop="birth"
                label="生日"
                sortable
                width="180">
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱"
                sortable
                width="180">
                </el-table-column>
                <el-table-column
                prop="phoneNumber"
                label="电话"
                width="150">
                </el-table-column>
                <el-table-column
                prop="enable"
                label="是否禁用"
                width="100">
                    <template slot-scope="scope">
                        <el-switch
                        v-model="scope.row.enable" 
                        :active-value=0
                        :inactive-value=1
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="success" size="mini" icon="el-icon-delete">删除</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-setting">设置</el-button>
                </el-table-column>
            </el-table>
            <div class="user-pagination">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[3, 6, 10, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>

            <UserAdd :addOrUpdateVisible="addOrUpdateVisible" 
                    :deptList="deptList" 
                    @changeShow="showAddOrUpdate" 
                    @getUserList="getUserList" 
                    @getDeptList="getDeptList"
                    ref="addOrUpdateRef">
            </UserAdd>
        </el-card>
    </div>
</template>

<script>
    import {selectUserList} from '@/api/users'
    import {selectDeptAndCount} from '@/api/dept'
    import UserAdd from '@/views/user/UserAdd'

    export default {
        name: 'User',
        components:{UserAdd},
        data() {
            return {
                userVo: {
                    departmentId: '',
                    username: '',
                    email: '',
                    sex: '',
                    nickname: ''
                },
                //用户集合
                userList: [],
                //部门集合
                deptList: [],
                currentPage: 1,
                pageSize: 6,
                total: 100,
                //是否展示用户添加弹窗
                addOrUpdateVisible: false
            };
        },
        methods: {
            //当每页条数改变时调用此方法
            handleSizeChange(val) {
                this.pageSize = val;
                this.getUserList();
            },
            //当前页码改变时执行此方法
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getUserList();
            },
            //获取用户列表
            getUserList(){
                selectUserList(this.currentPage,this.pageSize,this.userVo).then(res => {
                    this.userList = res.data.data.users;
                    this.total = res.data.data.total;
                });
            },
            //获取部门列表
            getDeptList(){
                selectDeptAndCount().then(res => {
                    this.deptList = res.data.data.dept;
                })
            },
            //重置所有查询条件
            resetUserVo(){
                this.userVo.departmentId = '',
                this.userVo.username = '',
                this.userVo.nickname = '',
                this.userVo.email = '',
                this.userVo.sex = '',
                this.getUserList();
            },
            //展示添加编辑用户弹窗
            show(){
                this.addOrUpdateVisible = true;
            },
            //监听子组件弹窗关闭后触发，由子组件调用
            showAddOrUpdate(data){
                if (data == false) {
                    this.addOrUpdateVisible = false;
                }else{
                    this.addOrUpdateVisible = true;
                }
            }
        },
        created() {
            this.getUserList();
            this.getDeptList();
        }
    };
</script>

<style>
    .user-pagination{
        padding: 15px;
    }
</style>