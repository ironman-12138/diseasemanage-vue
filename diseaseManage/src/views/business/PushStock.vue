<template>
    <div id="publishStocks">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/outstock' }">出库记录</el-breadcrumb-item>
            <el-breadcrumb-item>发放物资</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->

        <el-row :gutter="20">
            <!--右边出库表单-->
            <el-col :span="11">
                <el-card class="box-card">
                    <div class="grid-content bg-purple">
                        <!--出库步骤条-->
                        <el-steps style="margin-bottom: 20px;" :active="1" >
                            <el-step title="填写" icon="el-icon-edit"></el-step>
                            <el-step title="审核" icon="el-icon-postcard"></el-step>
                            <el-step title="发放" icon="el-icon-set-up"></el-step>
                        </el-steps>

                        <!--发放表单-->
                        <el-form
                                size="mini"
                                ref="addRuleFormRef"
                                :rules="addRules"
                                :model="addRuleForm"
                                label-width="80px">
                            <el-form-item label="添加方式" >
                                <el-col :span="24"><div class="grid-content bg-purple">
                                    <el-radio border size="mini"  @change="existenceChange(existence)" v-model="existence"  :label="0">新增去向</el-radio>
                                    <el-radio border size="mini" @change="existenceChange(existence)"  v-model="existence" :label="1">已知去向</el-radio>
                                </div></el-col>
                            </el-form-item>

                            <el-form-item v-if="existence==1" label="物资去向" prop="consumerId">

                                <el-col :span="12">
                                    <div class="grid-content bg-purple">
                                        <el-select
                                                v-if="existence==1"
                                                style="width:100%;"
                                                filterable
                                                @change="consumerSelectChange(addRuleForm.consumerId)"
                                                v-model="addRuleForm.consumerId"
                                                placeholder="选择已存在去向"
                                        >
                                            <el-option
                                                    v-for="item in consumers"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="优先级" prop="type">
                                <el-radio-group v-model="addRuleForm.priority">
                                    <el-radio  :size="'mini'" :label="1">不急</el-radio>
                                    <el-radio  :size="'mini'" :label="2">常规</el-radio>
                                    <el-radio  :size="'mini'" :label="3">紧急</el-radio>
                                    <el-radio  :size="'mini'" :label="4">特急</el-radio>
                                    <el-radio  :size="'mini'" :label="5">超急</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="领取类型" prop="type">
                                <el-radio-group v-model="addRuleForm.type">
                                    <el-radio  :size="'mini'" :label="0">政府</el-radio>
                                    <el-radio  :size="'mini'" :label="1">医院</el-radio>
                                    <el-radio  :size="'mini'" :label="2">小区</el-radio>
                                    <el-radio  :size="'mini'" :label="3">个人</el-radio>
                                    <el-radio  :size="'mini'" :label="4">其他</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <div v-if="existence==0">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="grid-content bg-purple"></div>
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
                                <el-form-item label="具体去向" prop="name">
                                    <el-input placeholder="请输入具体去向" v-model="addRuleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="联系人" prop="contact">
                                    <el-input placeholder="请输入联系人名称" v-model="addRuleForm.contact"></el-input>
                                </el-form-item>

                                <el-form-item label="电话" prop="phone">
                                    <el-input placeholder="请输入电话号码" v-model="addRuleForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="排序" prop="sort">
                                    <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                                </el-form-item>
                            </div>

                            <div v-if="existence==1">
                                <el-card class="box-card" style="margin-bottom: 30px;">
                                    <div  class="text item" style="font-size: 12px;padding: 5px;">
                                        物资名称: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{consumerInfo.name}}</el-tag>
                  </span>
                                    </div>
                                    <div  class="text item" style="font-size: 12px;padding: 5px;">
                                        物资地址: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{consumerInfo.address}}
                    </el-tag></span>
                                    </div>
                                    <div  class="text item" style="font-size: 12px;padding: 5px;">
                                        联系方式: <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{consumerInfo.phone}}
                    </el-tag></span>
                                    </div>

                                    <div  class="text item" style="font-size: 12px;padding: 5px;">
                                        联系人员:  <span style="margin-left: 200px;color: #999">
                    <el-tag size="mini" type="info">{{consumerInfo.contact}}
                    </el-tag></span>
                                    </div>
                                </el-card>
                            </div>
                            <el-row>
                                <el-col :span="12">
                                    <div class="grid-content bg-purple">
                                        <el-form-item label="物资明细">
                                            <el-button size="mini"  icon="el-icon-search" @click="drawer = true">发放明细</el-button>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="grid-content bg-purple"><el-form-item label="物资总类">
                                        <el-input-number v-model="itemNum" :disabled="true"></el-input-number>
                                    </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-form-item label="描述信息" prop="remark">
                                <el-input type="textarea" :rows="2" v-model="addRuleForm.remark"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="add">立即创建</el-button>

                                <el-button >重置</el-button>
                            </el-form-item>
                        </el-form>



                    </div>
                </el-card>
            </el-col>

            <!--物资库存表格-->
            <el-col :span="13">
                <div class="grid-content bg-purple-light">
                    <el-card>
                        <!-- 查询搜索 -->
                        <el-form  :inline="true" :model="queryMap" class="demo-form-inline">
                            <el-form-item label="分类">
                                <el-cascader
                                    size="small"
                                    placeholder="请选择分类查询"
                                    expand-trigger="hover"
                                    change-on-select=true
                                    @change="selectChange"
                                    v-model="categorykeys"
                                    :props="selectProps"
                                    :options="cateories"
                                    clearable>
                                </el-cascader>
                            </el-form-item>
                            <el-form-item>
                                <el-form-item label="名称">
                                    <el-input clearable v-model="queryMap.name" placeholder="名称"
                                              @clear="search"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click="search">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-alert
                                title="勾选先下方物资后,在左侧表单的明细中添加其发放数量"
                                type="warning"
                                show-icon style="margin-bottom:20px;">
                        </el-alert>
                        <!-- 发放预选表格 -->
                        <el-table
                                style="height:440px;"
                                :data="tableData"
                                border
                                :row-key="getRowKey"
                                ref="dataTable"
                                @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                            <el-table-column prop="imageUrl" label="图片" align="center" width="100px" padding="0px">
                                <template slot-scope="scope">
                                    <el-popover placement="right" trigger="hover">
                                        <img :src="scope.row.imageUrl"
                                            style="height: 200px;width: 200px"/>
                                        <img slot="reference" :src="scope.row.imageUrl"
                                            :alt="scope.row.imgUrl" style="height: 38px;width: 38px;cursor: pointer">
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" :show-overflow-tooltip='true' label="名称"></el-table-column>
                            <el-table-column prop="pnum" label="商品编号" :show-overflow-tooltip='true'></el-table-column>

                            <el-table-column prop="model" label="型号"></el-table-column>
                            <el-table-column prop="stock" label="库存">
                                <template slot-scope="scope">
                                <el-tag type="primary" effect="plain"  v-text="scope.row.stock">
                                </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="unit" label="单位">
                            </el-table-column>

                        </el-table>
                        <!-- 表格分页 -->
                        <el-pagination
                                background
                                style="margin-top:10px;"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="queryMap.pageNum"
                                :page-sizes="[6, 8, 16, 20]"
                                :page-size="queryMap.pageSize"
                                layout="total, sizes, prev, pager, next"
                                :total="total"
                        ></el-pagination>

                        <!-- 抽屉 -->
                        <el-drawer size="49%" title="发放明细" :visible.sync="drawer" :with-header="false">
                            <span>
                            <el-button size="mini" style="float: right;margin: 10px;"  type="primary" icon="el-icon-remove" :disabled="products.length==0" @click="removeAllItem" >清空</el-button>
                                <el-table height="650" :data="this.products" border>

                                    <el-table-column prop="name" label="名称" width="120px;"></el-table-column>
                                    <el-table-column
                                            prop="imageUrl"
                                            label="图片"
                                            align="center"
                                            width="150px"
                                            padding="0px">
                                        <template slot-scope="scope">
                                            <el-popover placement="right" trigger="hover">
                                                <img :src="scope.row.imageUrl"
                                                    style="height: 200px;width: 200px"/>
                                                <img slot="reference" :src="scope.row.imageUrl"
                                                    :alt="scope.row.imgUrl" style="height: 38px;width: 38px;cursor: pointer">
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="model" label="型号" width="100px;"></el-table-column>

                                    <el-table-column label="数量" width="160">
                                        <template slot-scope="scope">
                                        <el-input-number
                                                @change="outStockNumberChange(scope.row.number,scope.row.stock)"
                                                size="mini"
                                                v-model="scope.row.number"
                                                :min="1"
                                                :max="scope.row.stock"
                                                label="描述文字"
                                        ></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="unit" label="单位" width="80px;"></el-table-column>
                                    <el-table-column label="操作" width="100px;" fixed="right">
                                        <template slot-scope="scope">
                                        <el-button
                                                type="danger"
                                                size="mini"
                                                plain
                                                icon="el-icon-remove"
                                                @click="removeItem(scope.row.pnum)"
                                        >移除</el-button>
                                        </template>
                                    </el-table-column>

                                </el-table>

                            </span>
                        </el-drawer>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {getOutproductList,getproductCategoryList} from '@/api/product'
    import {findAll} from '@/api/consumer'
    import {add} from '@/api/outstock'
    import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
    export default {
        data() {
            var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[34578]\d{9}$$/;
                if (!value) {
                    return callback(new Error("电话号码不能为空"));
                }
                setTimeout(() => {
                    // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
                    // 所以在前面加了一个+实现隐式转换

                    if (!Number.isInteger(+value)) {
                        callback(new Error("请输入数字值"));
                    } else {
                        if (phoneReg.test(value)) {
                            callback();
                        } else {
                            callback(new Error("电话号码格式不正确"));
                        }
                    }
                }, 100);
            }

            return {

                products:[],//product of car
                consumers:[],
                itemNum: 0,
                consumerInfo:{name:"选择后显示具体信息",address:"选择后显示地址信息",contact:"选择后显示联系人信息",
                    phone:"选择后显示联系方式"},//卡片展示
                existence:0,
                total:0,
                drawer:false,
                tableData:[],
                queryMap: {
                    pageNum: 1,
                    pageSize: 6,

                },
                selectProps: {
                    expandTrigger: "hover",
                    value: "id",
                    label: "name",
                    children: "children"
                }, //级联选择器配置项
                addRuleForm: {priority:1},//出库表单
                addRules: {
                    consumerId: [
                        { required: true, message: "请选中物资去向", trigger: "blur" }
                    ],
                    type: [
                        { required: true, message: "请选中领取类型", trigger: "blur" }
                    ],
                    priority: [{ required: true, message: "请选中发放类型", trigger: "blur" }],
                    remark: [
                        { required: true, message: "请输入商品说明备注", trigger: "blur" },
                        { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
                    ],
                    name: [
                        { required: true, message: "请输入去向名称", trigger: "blur" },
                        { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
                    ],
                    address: [
                        { required: true, message: "请输入地址信息", trigger: "blur" },
                        { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
                    ],

                    valueProvince: [
                        { required: true, message: "请输入省份", trigger: "blur" }
                    ],
                    valueCity: [{ required: true, message: "请输入城市", trigger: "blur" }],
                    valueOrigin: [
                        { required: true, message: "请输入区县", trigger: "blur" }
                    ],
                    sort: [
                        { required: true, message: "请输入排序号", trigger: "blur" }
                    ],
                    contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
                    phone: [
                        {
                            required: true,
                            message: "请输入联系方式",
                            validator: checkPhone,
                            trigger: "blur"
                        }
                    ]
                }, //添加验证
                categorykeys: [],
                cateories: [], //类别选择
                // 选择省市区需要的属性
                options: regionDataPlus ,
                selectedOptions: [],
                selectProps: {
                    value: "id",
                    label: "name",
                    children: "children"
                }, //级联选择器配置项
            }
        },
        methods:{
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
            /**
             * 加载商品类别
             */
            async getCatetorys() {
                getproductCategoryList().then(res => {
                    this.cateories = res
                })
            },
            /**
             * 加载商品列表(可出库)
             */
            async loadTableData() {
                console.log(this.queryMap);
                getOutproductList(this.queryMap).then(res => {
                    this.tableData = res.data.product.dataList;
                    this.total = res.data.product.total;
                })
            },
            /**
             * 改变页码
             */
            handleSizeChange(newSize) {
                this.queryMap.pageSize = newSize;
                this.loadTableData();
            },
            /**
             * 点击分页
             */
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.loadTableData();
            },
            /**
             * 搜索
             */
            search() {
                this.queryMap.pageNum = 1;
                this.loadTableData();
            },

            // 指定一个key标识这一行的数据
            getRowKey (row) {
                return row.pnum
            },

            // val表示选中的表格行数据
            handleSelectionChange (val) {
                this.products = val;
                this.itemNum = val.length;
            },

            /**
             * 改变去向
             */
            existenceChange(existence){
                //选择已经存在的去向
                if(existence===1){
                }else if(existence===0){
                    this.addRuleForm.consumerId='';
                }
                this.$refs.addRuleFormRef.clearValidate();
                this.consumerInfo={name:"选择后显示具体信息",address:"选择后显示地址信息",contact:"选择后显示联系人信息",
                    phone:"选择后显示联系方式"};
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
            
            //改变来源选择
            consumerSelectChange(consumerId){
                var obj=this.consumers.find(function (x) {
                    return x.id === consumerId;
                });
                this.consumerInfo=obj;
            },

            /**加载去向数据
             */
            async getConsumers() {
                findAll().then(res => {
                    console.log(res);
                    this.consumers = res.data.consumers;
                })
            },
            /**
             * 移除item从抽屉中
             */
            removeItem(val) {
                this.products.forEach(row => {
                    if (row.pnum === val) {
                        this.$refs.dataTable.toggleRowSelection(row, false);
                    }
                });
                this.products = this.products.filter(item => item.pnum !== val);
            },
            /**
             * 清空所有
             */
            removeAllItem(){
                this.products.forEach(row => {
                        this.$refs.dataTable.toggleRowSelection(row, false);
                });
                this.products=[];
            },
            outStockNumberChange(currentValue, stock){
                if(currentValue===stock){
                    this.$message.warning("已达到可申请发放该物资数量的阈值");
                }
            },
            /**
             * 创建发放单
             */
            //添加
            add() {
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        
                        var car = [];
                        this.products.forEach(row => {
                            if (row.number !== undefined) {
                                var item = { productId: row.id, productNumber: row.number };
                                car.push(item);
                            }
                        });
                        if (car.length > 0) {
                            this.addRuleForm.products = car;
                        } else {
                            return this.$message.warning(
                                "发放商品的数量不能为空，请勾选物资后在明细中添加数量"
                            );
                        }
                        var res = await this.$confirm("此操作将提交发放单, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                        if (res === "confirm") {
                            console.log(this.addRuleForm);
                            add(this.addRuleForm).then(res => {
                                console.log(res);
                            })
                        }

                        this.addDialogVisible = false;
                    }
                });
            },

        },
        created() {
            this.getConsumers()
            this.getCatetorys();
            this.loadTableData();
            // this._getJsonData();
        }
    }
</script>


