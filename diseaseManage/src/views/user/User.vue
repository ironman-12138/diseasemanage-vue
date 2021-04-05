<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" style="margin-bottom: 10px">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>        

        <!-- 用户列表卡片 -->
        <el-card class="box-card">
            <el-form :inline="true" :model="userVo" label-width="70px" class="demo-form-inline">
                <el-form-item label="部门">
                    <el-select v-model="userVo.departmentId" placeholder="请选择">
                        <el-option value="">
                            <span style="float: left">全部</span>
                        </el-option>
                        <el-option
                        v-for="item in deptList"
                        :key="item.id"
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
                    <el-button type="primary" icon="el-icon-search" @click="select">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="show">添加</el-button>
                    <!-- <el-button type="warning" icon="el-icon-download">导出</el-button> -->
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
                        @change="changUserStatus(scope.row)"
                        :active-value=0
                        :inactive-value=1
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button type="success" size="mini" icon="el-icon-delete" @click="deleteById(scope.row.id)">删除</el-button>
                    </template>
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

            <!-- 修改对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
                <span>
                <el-form
                        :model="editForm"
                        :label-position="labelPosition"
                        ref="editFormRef"
                        label-width="80px"
                >
                    <el-row>
                    <el-col :span="10">
                        <div class="grid-content bg-purple">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="editForm.username" :disabled="true"></el-input>
                            <el-input
                                    type="hidden"
                                    v-model="editForm.id"
                                    :disabled="true"
                                    style="display:none;"
                            ></el-input>
                        </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                        <el-form-item label="部门" prop="departmentId">
                            <el-select v-model="editForm.departmentId" placeholder="请选择所属部门">
                            <el-option
                                    v-for="department in deptList"
                                    :key="department.id"
                                    :label="department.name"
                                    :value="department.id"
                            ></el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                    </el-col>
                    </el-row>

                    <el-row>
                    <el-col :span="10">
                        <div class="grid-content bg-purple">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="editForm.nickname"></el-input>
                        </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="editForm.sex">
                            <el-radio :label="1">帅哥</el-radio>
                            <el-radio :label="0">美女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        </div>
                    </el-col>
                    </el-row>

                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phoneNumber">
                    <el-input v-model="editForm.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item prop="birth" label="生日">
                    <el-col :span="11">
                        <el-date-picker
                                type="date"
                                value-format="yyyy年MM月dd日"
                                placeholder="选择出生日期"
                                v-model="editForm.birth"
                                style="width: 100%;"
                        ></el-date-picker>
                    </el-col>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button
                        type="primary"
                        @click="updateUser"
                        :loading="btnLoading"
                        :disabled="btnDisabled"
                >确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {selectUserList,edit,deleteById,update,updateStatus} from '@/api/users'
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
                user: {
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
                addOrUpdateVisible: false,
                //修改对话框显示
                editDialogVisible: false,
                editForm: {}, //更新表单
                //控制按钮是否可用和旋转
                btnLoading: false,
                btnDisabled: false,
                labelPosition: "right", //lable对齐方式
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
            // 条件查询
            select(){
                this.currentPage = 1;
                this.user = this.userVo;
                this.getUserList();
            },
            //获取用户列表
            getUserList(){
                selectUserList(this.currentPage,this.pageSize,this.user).then(res => {
                    this.userList = res.data.users;
                    this.total = res.data.total;
                });
            },
            //获取部门列表
            getDeptList(){
                selectDeptAndCount().then(res => {
                    this.deptList = res.data.dept;
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
            },
            /**
             * 关闭编辑弹出框
             */
            editClose() {
                this.$refs.editFormRef.clearValidate();
                this.editForm = {};
            },
            //编辑用户
            edit(id) {
                edit(id).then(res => {
                    console.log(res);
                    if (res.success) {
                        this.editForm = res.data.user;
                        this.editForm.id = id;
                        this.editDialogVisible = true;
                    }
                })
            },
            //删除用户
            deleteById(id) {
                deleteById(id).then(res => {
                    if (res.success) {
                        this.getUserList();
                    }
                })
            },
            //更新用户
            updateUser() {
                console.log(this.editForm);
                update(this.editForm).then(res => {
                    console.log(res);
                    if (res.success) {
                        this.getUserList();
                        this.editClose();
                    }
                })
            },
            /**
             * 禁用启用用户
             */
            async changUserStatus(row) {
                console.log(row);
                updateStatus(row.id,row.enable).then(res => {
                    if(!res.success){
                        this.$message.error("更新用户状态失败:");
                        row.enable = !row.enable;
                    } else {
                        const message = row.enable ? '用户状态已禁用' : '用户状态已启用';
                        this.$notify.success({
                            title: '操作成功',
                            message: message,
                        });
                    }
                })
            },
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
    /* 让表格对齐 */
    body .el-table th.gutter {
        display: table-cell !important;
    }
</style>