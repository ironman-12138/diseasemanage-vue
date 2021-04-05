<template>
    <div id="productCategroys">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>物资管理</el-breadcrumb-item>
            <el-breadcrumb-item>物资资料</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 右侧卡片区域 -->
        <el-card class="box-card">
            <el-container style="margin-bottom:20px;">
                <el-alert
                        show-icon
                        title="友情提示:  商品的分类只支持三级分类"
                        type="warning">
                </el-alert>
            </el-container>
            <el-row :gutter="6">
                <el-col :span="5">
                    <!-- 
                        级联选择器
                        expand-trigger="hover" 鼠标滑过显示下一级内容
                        change-on-select=true 允许用户选择任意一级选项
                     -->
                    <el-cascader
                            size="small"
                            placeholder="请选择分类查询"
                            expand-trigger="hover"
                            change-on-select=true
                            @change="selectChange"
                            v-model="categorykeys"
                            :props="selectProps"
                            :options="cateories"
                            clearable
                    ></el-cascader>
                </el-col>
                <el-col :span="6">
                    <el-input
                            clearable
                            size="small"
                            v-model="queryMap.name"
                            placeholder="请输入物资名称查询"
                            @clear="search"
                            class="input-with-select"
                    ></el-input>
                </el-col>
                <el-col :span="5">
                    <template>
                        <el-select size="small" v-model="queryMap.status" @click="search" placeholder="请选择状态">
                            <el-option label="正常" :value="0"></el-option>
                            <el-option label="回收站" :value="1"></el-option>
                            <el-option label="待审核" :value="2"></el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="8">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="search">查找</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" type="warning" @click="resetForm">重置</el-button>
                    <el-button size="small" type="success" icon="el-icon-circle-plus-outline" @click="openAdd">添加</el-button>
                    <el-button size="small" icon="el-icon-refresh" @click="getproductList">刷新</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <template>
                <el-table
                        size="mini"
                        v-loading="loading"
                        border
                        stripe
                        :data="productData"
                        style="width: 100%;margin-top:20px;"
                        height="400"
                >
                    <el-table-column prop="id" type="index" label="ID"></el-table-column>

                    <el-table-column prop="imageUrl" label="图片" align="center" width="150px" padding="0px">
                        <template slot-scope="scope">
                            <el-popover placement="right" trigger="hover">
                                <img :src="scope.row.imageUrl"
                                     style="height: 200px;width: 200px"/>
                                <img slot="reference" :src="scope.row.imageUrl"
                                     :alt="scope.row.imgUrl" style="height: 38px;width: 38px;cursor: pointer">
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" label="物资名称"></el-table-column>


                    <el-table-column prop="pnum" :show-overflow-tooltip='true' label="物资编号"></el-table-column>
                    <el-table-column label="物资规格" width="100">
                        <template slot-scope="scope">
                            <el-tag type="success" size="mini" closable v-text="scope.row.model"></el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" width="80"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==1">回收</el-tag>
                            <el-tag size="mini" effect="plain" v-if="scope.row.status==0">正常</el-tag>
                            <el-tag size="mini" effect="plain" type="warning" v-if="scope.row.status==2">审核中</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
                            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
                            <el-button type="text" size="mini" icon="el-icon-coordinate" @click="publish(scope.row.id)">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <!-- 分页 -->
            <el-pagination
                    style="margin-top:10px;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="this.queryMap.pageNum"
                    :page-sizes="[6, 10, 15, 20]"
                    :page-size="this.queryMap.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

            <!-- 物资添加弹出框 -->
            <el-dialog title="添加物资" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
                <span>
                <el-form
                        size="mini"
                        :model="addRuleForm"
                        :rules="addRules"
                        ref="addRuleFormRef"
                        label-width="100px"
                        class="demo-ruleForm"
                >
                    <el-form-item label="物资名称" prop="name">
                        <el-input v-model="addRuleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="物资图片" prop="name">
                        <!-- 图片上传部分 -->
                        <el-upload
                            class="upload-demo"
                            action="http://127.0.0.1:8081/aliOss/uploadImgFile"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :on-success="successUpload"
                            multiple
                            :limit="1"
                            :on-exceed="handleExceed"
                            :headers="token" 
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-row>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                        <el-form-item label="物资规格" prop="model">
                            <el-input v-model="addRuleForm.model"></el-input>
                        </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                        <el-form-item label="分类" prop="categoryKeys">
                            <el-cascader
                                    :options="cateories"
                                    clearable
                                    filterable
                                    :props="selectProps"
                                    v-model="addRuleForm.categoryKeys"
                            ></el-cascader>
                        </el-form-item>
                        </div>
                    </el-col>
                    </el-row>
                    <el-row>
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="addRuleForm.unit"></el-input>
                        </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                        </el-form-item>
                        </div>
                    </el-col>
                    </el-row>

                    <el-form-item label="备注信息" prop="remark">
                    <el-input type="textarea" v-model="addRuleForm.remark"></el-input>
                    </el-form-item>
                </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="add" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 物资编辑弹出框 -->
            <el-dialog
                    title="更新物资"
                    :visible.sync="editDialogVisible"
                    width="50%"
                    @close="closeEditDialog"
            >
                <span>
                    <el-form
                            size="mini"
                            :model="editRuleForm"
                            :rules="addRules"
                            ref="editRuleFormRef"
                            label-width="100px"
                            class="demo-ruleForm"
                    >
                        <el-form-item label="物资名称" prop="name">
                        <el-input v-model="editRuleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="物资图片" prop="name">
                        <!-- 图片上传部分 -->
                            <el-upload
                                class="upload-demo"
                                action="http://127.0.0.1:8081/aliOss/uploadImgFile"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                :on-success="editHandleSuccess"
                                multiple
                                :limit="1"
                                :on-exceed="handleExceed"
                                :headers="token" 
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        <el-row>
                        <el-col :span="12">
                            <el-form-item label="物资规格" prop="model">
                            <el-input v-model="editRuleForm.model"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <div class="grid-content bg-purple">
                            <el-form-item label="分类" prop="categoryKeys">
                                <el-cascader
                                        :options="cateories"
                                        clearable
                                        filterable
                                        :props="selectProps"
                                        v-model="editRuleForm.categoryKeys"
                                ></el-cascader>
                            </el-form-item>
                            </div>
                        </el-col>
                        </el-row>
                        <el-row>
                        <el-col :span="12">
                            <div class="grid-content bg-purple">
                            <el-form-item label="单位" prop="unit">
                                <el-input v-model="editRuleForm.unit"></el-input>
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                            <el-form-item label="排序" prop="sort">
                                <el-input-number v-model="editRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                            </el-form-item>
                            </div>
                        </el-col>
                        </el-row>
                    </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="update"
                        :disabled="btnDisabled"
                        :loading="btnLoading">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 图片预览 -->
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt/>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {getproductList,getproductCategoryList,add,select,update,deleteProduct,publishProduct} from '@/api/product'
    export default {
        name: 'Products',
        data() {
            return {
                token: {"Authorization":window.sessionStorage.getItem('tokenStr')},
                uploadApi: '',
                btnLoading: false,
                btnDisabled: false,
                loading: true,
                cateories: [], //类别选择
                selectProps: {
                    value: "id",
                    label: "name",
                    children: "children"
                }, //级联选择器配置项
                editDialogVisible: false,
                addDialogVisible: false, //添加弹框是否显示
                total: 0, //总共多少条数据
                productData: [], //表格数据
                queryMap: {
                    pageNum: 1,
                    pageSize: 6,
                    name: "",
                    categoryId: "",
                    status: 0,
                }, //查询对象
                addRuleForm: {}, //添加表单数据
                editRuleForm: {}, //修改表单数据
                uploadDisabled: false,
                limitCount: 1,
                dialogImageUrl: "",
                dialogVisible: false,
                addRules: {
                    name: [
                        {required: true, message: "请输入物资名称", trigger: "blur"},
                        {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    ],
                    unit: [
                        {required: true, message: "请输入物资单位", trigger: "blur"},
                        {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
                    ],
                    model: [
                        {required: true, message: "请输入物资规格", trigger: "blur"},
                        {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    ],
                    remark: [
                        {required: true, message: "请输入物资说明备注", trigger: "blur"},
                        {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
                    ],
                    categorys: [
                        {required: true, message: "请输入物资分类", trigger: "blur"}
                    ],
                    sort: [{required: true, message: "请输入地址信息", trigger: "blur"}],
                    categoryKeys: [
                        {required: true, message: "请选择物资分类", trigger: "blur"}
                    ]
                }, //添加验证
                fileList: [],
                categorykeys: [] //搜索类别
            };
        },
        methods: {
            //重置查询表单
            resetForm() {
                this.queryMap = {
                    pageNum: 1,
                    pageSize: 6,
                    name: "",
                    categoryId: "",
                    status: 0,
                };
            },
            /**
             * 打开添加物资弹框
             */
            openAdd() {
                this.addDialogVisible = true;
            },
            /**
             * 搜索物资
             */
            search() {
                this.queryMap.pageNum = 1;
                this.getproductList();
            },
            /**
             * 物资添加审核
             */
            async publish(id) {
                this.$confirm('是否过审?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                        publishProduct(id).then(res => {
                            console.log(res);
                            this.getproductList();
                        })
                    }).catch(() => {
                                  
                });
            },
            /**
             * 删除物资
             */
            async del(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        deleteProduct(id).then(res => {
                            console.log(res);
                            this.getproductList();
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
            },
            /**
             * 更新物资
             */
            async update() {
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        update(this.editRuleForm).then(res => {
                            console.log(res);
                            this.getproductList();
                        })
                        // const {data: res} = await this.$http.put(
                        //     "business/product/update/" + this.editRuleForm.id,
                        //     this.editRuleForm
                        // );
                        // if (res.success) {
                        //     this.$notify({
                        //         title: "成功",
                        //         message: "物资信息更新",
                        //         type: "success"
                        //     });
                        //     this.editRuleForm = {};
                        //     await this.getproductList();
                        // } else {
                        //     this.$message.error("物资信息更新失败:" + res.data.errorMsg);
                        // }
                        this.editDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },
            /**
             * 编辑物资
             */
            async edit(id) {
                select(id).then(res => {
                    console.log(res);
                    this.editRuleForm = res.data.product;
                    const item = res.data.product;
                    this.fileList.push({
                        url: item.imageUrl,
                        name: item.name,
                        id: item.id
                    });
                    const array = [];
                    array.push(item.oneCategoryId);
                    array.push(item.twoCategoryId);
                    array.push(item.threeCategoryId);
                    this.editRuleForm.categoryKeys = array;
                    this.editDialogVisible = true;
                })
                // const {data: res} = await this.$http.get("business/product/edit/" + id);
                // if (res.success) {
                //     this.editRuleForm = res.data;
                //     const item = res.data;
                //     this.fileList.push({
                //         url: "https://www.zykhome.club/" + item.imageUrl,
                //         name: item.name,
                //         id: item.id
                //     });
                // } else {
                //     return this.$message.error("物资信息编辑失败" + res.data.errorMsg);
                // }
            },
            /**
             * 添加物资
             */
            add() {
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnDisabled = true;
                        this.btnLoading = true;
                        console.log(this.addRuleForm);
                        add(this.addRuleForm).then(res => {
                            console.log(res);
                            this.getproductList();
                        })
                        this.addDialogVisible = false;
                        this.btnDisabled = false;
                        this.btnLoading = false;
                    }
                });
            },
            /**
             * 移除回收站
             */
            async remove(id) {
                const {data: res} = await this.$http.put("business/product/remove/" + id);
                if (!res.success) {
                    return this.$message.error("移入回收站失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    return this.$message.success("移入回收站成功");
                }
            },
            /**
             * 从回收站恢复
             */
            async back(id) {
                const {data: res} = await this.$http.put("product/back/" + id);
                if (!res.success) {
                    return this.$message.error("从回收站恢复失败:" + res.data.errorMsg);
                } else {
                    await this.getproductList();
                    return this.$message.success("从回收站中已恢复");
                }
            },
            /**
             * 加载物资列表
             */
            getproductList() {
                console.log(this.queryMap);
                getproductList(this.queryMap).then(res => {
                    this.productData = res.data.product.dataList;
                    this.total = res.data.product.total;
                })
            },
            /**
             * 加载物资类别
             */
            getCatetorys() {
                getproductCategoryList().then(res => {
                    this.cateories = res
                })
            },
            //文件上传的几个方法
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //新增上传图片成功后回调
            successUpload(response, file, fileList)	{
                console.log(response);
                this.addRuleForm.imageUrl = response.data.url;
            },
            //编辑上传图片成功后回调
            editHandleSuccess(response, file, fileList) {
                this.editRuleForm.imageUrl = response.data.url;
            },
            //改变页码
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.getproductList();
            },
            //翻页
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.getproductList();
            },
            //关闭弹出框
            closeAddDialog() {
                this.$refs.addRuleFormRef.clearValidate();
                this.addRuleForm = {};
                this.fileList = [];
            },
            //关闭弹出框
            closeEditDialog() {
                this.$refs.editRuleFormRef.clearValidate();
                this.editRuleForm = {};
                this.fileList = [];
            },
            /**
             * 分类搜索改变时
             */
            selectChange() {
                var str = "";
                for (var i = 0; i < this.categorykeys.length; i++) {
                    str += this.categorykeys[i] + ",";
                }
                str = str.substring(0, str.length - 1);
                this.queryMap.categorys = str;
            },
            
        },
        created() {
            this.getproductList();
            this.getCatetorys();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    };
</script>

<style>
    /* 让表格对齐 */
    body .el-table th.gutter {
        display: table-cell !important;
    }
</style>