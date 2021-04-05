<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>物资来源</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-row :gutter="0" style="margin-bottom: 10px">
            <el-form ref="elForm" :model="supplierVo" :rules="rules" size="medium" label-width="80px">
                <el-col :span="24">
                <el-row>
                    <el-col :span="6">
                    <el-form-item label="省市区县">
                        <el-input v-model="supplierVo.address" placeholder="请输入省市区县" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="具体地点">
                        <el-input v-model="supplierVo.name" placeholder="请输入具体地点" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="联系人">
                        <el-input v-model="supplierVo.contact" placeholder="请输入联系人" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                </el-col>
                <el-col :span="13">
                <el-row>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="select"> 查询 </el-button>
                    <el-button type="success" icon="el-icon-plus" size="medium" @click="openAdd"> 添加 </el-button>
                </el-row>
                </el-col>
            </el-form>
        </el-row>

        <!-- 表格数据 -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column
            prop="id"
            sortable
            label="id"
            width="150">
            </el-table-column>
            <el-table-column label="物资去向地址">
                <el-table-column
                    label="省份"
                    width="120">
                    <template slot-scope="scope">
                        <span v-text="scope.row.address.split('/')[0]"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="市"
                    width="120">
                    <template slot-scope="scope">
                        <span v-text="scope.row.address.split('/')[1]"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="县区"
                    width="120">
                    <template slot-scope="scope">
                        <span v-text="scope.row.address.split('/')[2]"></span>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="name"
                    label="地址"
                    width="160">
                </el-table-column>
            </el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="160"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
            <el-table-column prop="contact" label="联系人" width="120"></el-table-column>
            <el-table-column prop="phone" label="电话" width="120"></el-table-column>
            <el-table-column prop="sort" sortable label="排序" width="50"></el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[3, 6, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>

        <!-- 添加弹出框start -->
        <el-dialog
            title="添加物资来源"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="closeAddDialog"
        >
            <span>
            <el-form
                :model="addRuleForm"
                :rules="addRules"
                ref="addRuleFormRef"
                label-width="100px"
                class="demo-ruleForm">
                <el-row>
                    <el-col :span="20">
                        <!-- 省市区三级地址选择联动 -->
                        <el-form-item label="省市区">
                            <el-cascader
                            size="large"
                            :options="options"
                            v-model="selectedOptions"
                            @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="联系人" prop="contact">
                <el-input v-model="addRuleForm.contact"></el-input>
                </el-form-item>

                <el-form-item label="详细来源" prop="name">
                <el-input type="textarea" v-model="addRuleForm.name"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                <el-input v-model="addRuleForm.email"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="phone">
                <el-input v-model="addRuleForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                </el-form-item>
            </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="add('addRuleFormRef')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框end -->

        <!-- 编辑弹出框start -->
        <el-dialog
            title="更新物资来源"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="closeEditDialog"
        >
            <span>
            <el-form
                :model="editRuleForm"
                :rules="addRules"
                ref="editRuleFormRef"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="省市区县" prop="address">
                <el-input v-model="editRuleForm.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="详细来源" prop="name">
                <el-input type="textarea" v-model="editRuleForm.name"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="email">
                <el-input v-model="editRuleForm.email"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="phone">
                <el-input v-model="editRuleForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="联系人" prop="contact">
                <el-input v-model="editRuleForm.contact"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                <el-input-number v-model="editRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                </el-form-item>
            </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框end -->

    </el-card>
  </div>
</template>

<script>
    import {getSupplierList, addSupplier, delSupplier, selectSupplier, updateSupplier} from '@/api/supplier'
    import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'

    export default {
        name: 'Suppliers',
        data() {
            return {
                // 查询条件表单
                supplierVo: {
                    address: '',
                    contact: '',
                    name: '',
                },
                supplier: {
                    address: '',
                    contact: '',
                    name: '',
                },
                rules: {
                    address: [],
                    contact: [],
                    name: [],
                },
                tableData: [
                ],
                pageNum: 1,
                pageSize: 6,
                total: 0,
                addDialogVisible: false, //添加弹框是否显示
                editDialogVisible: false, //编辑弹窗是否显示
                addRuleForm: {}, //添加表单数据
                editRuleForm: {}, //修改表单数据
                addRules: {
                    name: [
                        { required: true, message: "请输入物资去处名称", trigger: "blur" },
                        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
                    ],
                    address: [
                        { required: true, message: "请输入地址信息", trigger: "blur" },
                        { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
                    ],
                    sort: [
                        { required: true, message: "请输入排序号", trigger: "blur" }
                    ],
                    email: [
                        { required: true, message: "请输入邮箱", trigger: "blur" }
                    ],
                    contact: [
                        { required: true, message: "请输入联系人", trigger: "blur" }
                    ],
                    phone: [
                        {
                            required: true,
                            message: "请输入联系方式",
                            trigger: "blur"
                        }
                    ]
                },
                // 选择省市区需要的属性
                options: regionDataPlus ,
                selectedOptions: []
            }
        },
        methods: {
            // 条件查询
            select(){
                this.pageNum = 1;
                this.supplier = this.supplierVo;
                this.getSupplierList();
            },
            // 打开编辑弹窗
            edit(id){
                console.log(id);
                this.editDialogVisible = true;
                // 获取要修改的物资去向信息
                selectSupplier(id).then(res => {
                    console.log(res);
                    this.editRuleForm = res.data.supplier;
                })
            },
            // 删除物资去向信息
            del(id){
                console.log(id);
                delSupplier(id).then(res => {
                    this.getSupplierList();
                })
            },
            // 获取物资去向列表数据
            getSupplierList(){
                console.log(this.supplierVo);
                getSupplierList(this.pageNum,this.pageSize,this.supplier).then(res => {
                    console.log(res);
                    this.tableData = res.data.supplierPage.dataList;
                    this.total = res.data.supplierPage.total;
                });
            },
            // 当每页条数改变时调用此方法
            handleSizeChange(val) {
                this.pageSize = val;
                this.getSupplierList();
            },
            // 当前页码改变时执行此方法
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getSupplierList();
            },
            // 打开添加弹出窗
            openAdd() {
                this.addDialogVisible = true;
            },
            // 添加
            add(formName) {
                if (this.addRuleForm.address == null) {
                    this.$message({
                        message: '请选择地址',
                        type: 'warning'
                    });
                }else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log(this.addRuleForm);
                            addSupplier(this.addRuleForm).then(res => {
                                console.log(res);
                                this.closeAddDialog()
                                this.getSupplierList();
                            })
                        } else {
                            this.$message({
                                message: '请选择填写完整',
                                type: 'warning'
                            });
                            return false;
                        }
                    });
                }
            },
            // 关闭弹出框
            closeAddDialog() {
                this.$refs.addRuleFormRef.clearValidate();
                this.addRuleForm = {};
            },
            // 选择省市区
            handleChange () {
                var loc = "";
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    if (i < this.selectedOptions.length - 1) {
                        loc += CodeToText[this.selectedOptions[i]] + '/';
                    }else {
                        loc += CodeToText[this.selectedOptions[i]];
                    }
                }
                this.addRuleForm.address = loc;
                console.log(loc)// 打印区域码所对应的属性值即中文地址
            },
            // 关闭编辑弹出框
            closeEditDialog() {
                this.$refs.editRuleFormRef.clearValidate();
                this.editRuleForm = {};
            },
            // 修改物资去处信息
            update() {
                updateSupplier(this.editRuleForm).then(res => {
                    this.editDialogVisible = false;
                    this.getSupplierList();
                })
            }
        },
        created() {
            this.getSupplierList();
        }
    };
</script>

<style>
    body .el-table th.gutter {
        display: table-cell !important;
    }
</style>