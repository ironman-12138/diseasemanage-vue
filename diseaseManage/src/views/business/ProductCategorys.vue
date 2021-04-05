<template>
    <div id="category">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>物资分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col :span="12">

            <el-card class="box-card">
                <!-- 树形结构部分 -->
                <el-tree
                class="cate-tree"
                :data="categorys"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => append(data)">
                            添加
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            删除
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => edit(node, data)">
                            修改
                        </el-button>
                    </span>
                </span>
                </el-tree>
                
                <!-- 添加弹出框 -->
                <el-dialog title="添加分类" :visible.sync="addDialogVisible" @close="addCloseDialog" width="50%">
                    <span>
                        <el-form  :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="100px">
                            <el-form-item label="分类名称" prop="name">
                                <el-input v-model="addRuleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="父分类" prop="pid">
                                <el-input :disabled="true" v-model="addRuleForm.pid"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" v-model="addRuleForm.remark"></el-input>
                            </el-form-item>
                        </el-form>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="add" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 编辑弹出框 -->
                <el-dialog title="编辑分类" :visible.sync="editDialogVisible" @close="editCloseDialog" width="50%">
                    <span>
                        <el-form :model="editRuleForm" :rules="addRules" ref="editRuleFormRef" label-width="100px">
                            <el-form-item label="分类名称" prop="label">
                                <el-input v-model="editRuleForm.label"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" v-model="editRuleForm.remark"></el-input>
                            </el-form-item>
                        </el-form>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="update" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>
                    </span>
                </el-dialog>
            </el-card>

        </el-col>
        <el-col :span="12">
            <el-card style="margin-bottom: 15px;margin-left: 15px;">
                <div id="main1" style="width: 600px;height:350px;"></div>
            </el-card>
            <el-card style="margin-bottom: 15px;margin-left: 15px;">
                <div id="main2" style="width: 600px;height:350px;"></div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import {getproductCategoryList,addCate,deleteCateById,updateCate} from '@/api/product'
    export default {
        data() {
            return {
                btnLoading: false,
                btnDisabled: false,
                loading:true,
                pKeys: [],
                addDialogVisible: false,
                editDialogVisible: false,
                editRuleForm: {},
                addRuleForm: { pid: "0", name: "", remark: "", sort: "1" }, //添加表单
                addRules: {
                    name: [
                        { required: true, message: "请输入分类名", trigger: "blur" },
                        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
                    ],
                    remark: [
                        { required: true, message: "请输入备注信息", trigger: "blur" }
                    ],
                    label: [
                        { required: true, message: "请输入分类名", trigger: "blur" },
                        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
                    ],
                },
                categorys: [],
                parentCategorys: [],
                selectProps: {
                    expandTrigger: "hover",
                    value: "id",
                    label: "name",
                    children: "children"
                }, //级联选择器配置项
            };
        },
        methods: {
            update() {
                var that = this;
                this.$refs.editRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnLoading = true;
                        this.btnDisabled = true;
                        this.editRuleForm.name = this.editRuleForm.label;
                        
                        updateCate(this.editRuleForm).then(res => {
                            console.log(res);
                            this.getCategoryList();
                        })
                        
                        this.btnLoading = false;
                        this.btnDisabled = false;
                        this.editDialogVisible = false;
                    }
                });
            },
            //弹出修改框填充数据
            edit(node,data) {
                // const { data: res } = await this.$http.get("business/productCategory/edit/" + id);
                // if (res.success) {
                //     this.editRuleForm = res.data;
                // } else {
                //     return this.$message.error("分类信息编辑失败"+res.data.errorMsg);
                // }
                console.log(data);
                this.editRuleForm = data;
                this.editDialogVisible = true;
            },
            //加载分类数据
            async getCategoryList() {
                getproductCategoryList().then(res => {
                    console.log(res);
                    //将列表中属性名name改为label
                    this.categorys = JSON.parse(JSON.stringify(res).replace(/"name"/g,'"label"'));
                })
            },
            //加载父级分类数据
            async getParentCategoryList(data) {
                //console.log(data);
                this.addRuleForm.pid = data.id;
            },
            //添加分类
            async add() {
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.btnLoading=true;
                        this.btnDisabled=true;
                        if(this.addRuleForm.pid == null){
                            this.addRuleForm.pid=0;
                        }
                        console.log(this.addRuleForm);
                        addCate(this.addRuleForm).then(res => {
                            console.log(res);  
                            this.getCategoryList();
                            this.drawChart();
                        })
                        this.addDialogVisible = false;
                        this.btnLoading=false;
                        this.btnDisabled=false;
                    }
                });
            },
            //打开添加
            openAdd(data) {
                this.addDialogVisible = true;
                this.getParentCategoryList(data);
            },
            //关闭弹出框
            addCloseDialog() {
                this.$refs.addRuleFormRef.clearValidate();
                this.addRuleForm = {};
                this.pKeys = [];
            },
            editCloseDialog(){
                this.$refs.editRuleFormRef.clearValidate();
                this.editRuleForm = {};

            },
            clearParent(){
                this.addRuleForm.pid='';
            },
            //弹出添加分类框
            append(data) {
                this.openAdd(data);
                // const newChild = { id: 100, label: 'testtest', children: [] };
                // if (!data.children) {
                //     this.$set(data, 'children', []);
                // }
                // data.children.push(newChild);
            },
            //删除分类
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        console.log(data.id);
                        deleteCateById(data.id).then(res => {
                            console.log(res);
                            this.getCategoryList();
                            this.drawChart();
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
            },
            //echarts图表绘制
            drawChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById("main1"));
                let myChart2 = this.$echarts.init(document.getElementById("main2"));
                let cateList = [];
                getproductCategoryList().then(res => {
                    cateList = res;
                    let xdate = [];
                    let sdate = [];
                    let xdate2 = [];
                    let sdate2 = [];
                    for (let i = 0; i < cateList.length; i++) {
                        const element = cateList[i];
                        console.log(element);
                        xdate.push(element.name);
                        sdate.push(element.children.length);
                        var children = element.children;
                        for (let j = 0; j < children.length; j++) {
                            const element2 = children[j];
                            xdate2.push(element2.name);
                            sdate2.push(element2.children.length);
                        }
                    }
                    // 指定图表的配置项和数据
                    let option = {
                        title: {
                            text: "一级菜单"
                        },
                        tooltip: {},
                        color: '#5470c6',
                        legend: {
                            data: ["子菜单数"]
                        },
                        toolbox: {
                            feature: {
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            data: xdate
                        },
                        yAxis: {},
                        series: [
                            {
                                name: "子菜单数",
                                type: "bar",
                                data: sdate,
                                showBackground: true,
                                backgroundStyle: {
                                    color: 'rgba(180, 180, 180, 0.2)'
                                },
                                itemStyle: {
                                    normal: {
                                        //以下为是否显示，显示位置和显示格式的设置了
                                        label: {
                                            show: true,
                                            position: 'top',
                                            // formatter: '{c}'
                                            formatter: '{b}\n{c}'
                                            
                                        }
                                    }
                                },
                            }
                            
                        ]
                    };
                    let option2 = {
                        title: {
                            text: "二级菜单"
                        },
                        tooltip: {},
                        color: '#5470c6',
                        legend: {
                            data: ["子菜单数"]
                        },
                        toolbox: {
                            feature: {
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            data: xdate2,
                            axisLabel: {
                                interval:0,
                                rotate:45, //代表逆时针旋转45度
                            }
                        },
                        yAxis: {},
                        series: [
                            {
                                name: "子菜单数",
                                type: "bar",
                                data: sdate2,
                                showBackground: true,
                                backgroundStyle: {
                                    color: 'rgba(180, 180, 180, 0.2)'
                                },
                                itemStyle: {
                                    normal: {
                                        //以下为是否显示，显示位置和显示格式的设置了
                                        label: {
                                            show: true,
                                            position: 'top',
                                            // formatter: '{c}'
                                            formatter: '{b}\n{c}'
                                            
                                        }
                                    }
                                },
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);
                })
                
            }
        },
        created() {
            this.getCategoryList();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        mounted() {
            this.drawChart();
        }
    };
</script>
<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .cate-tree{
        width: 95%;
    }
</style>
