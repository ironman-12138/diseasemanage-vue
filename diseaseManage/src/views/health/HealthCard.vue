<template>
    <div class="health">
        <!--面包屑导航-->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>健康报备</el-breadcrumb-item>
            <el-breadcrumb-item>每日打卡</el-breadcrumb-item>
        </el-breadcrumb>
        <!--打卡部分-->
        <el-card style="height: 590px;">
            <el-alert
                    :closable="false"
                    style="margin-bottom: 20px;"
                    v-if="reported"
                    show-icon
                    :title="'今日已成功打卡,勤洗手,戴口罩,不群聚,打卡时间:['+ruleForm.createTime+']'"
                    type="success">
            </el-alert>
            <h5 style="margin: 0px;padding: 0px;">基本信息  <div style="float: right;margin-bottom: 10px;vertical-align: center;">
            <el-button @click="OpenHistory"   size="small" type="warning">签到记录</el-button>
                <el-button style="margin-top: 5px;" type="primary"   size="small" @click="onSubmit" v-if="!reported">立即打卡</el-button>
                <el-button @click="reset"  size="small" v-if="!reported">重置</el-button>
            </div></h5>

            <!--抽屉-->
            <el-drawer
                    :with-header="false"
                    :visible.sync="drawer"
                    :direction="direction"
                    >
                <span>
                    <el-card class="box-card"  v-for="item in this.historyTable" :key="item.id" style="margin-bottom: 10px;">
                      <div class="text item">
                         <ul>
                             <li>打卡人:{{userInfo.username}}</li>
                             <li>打卡位置:{{item.address}}</li>
                             <li>打卡时间:{{item.createTime}}</li>
                             <li>健康状况:
                                 <div style="float: right">
                                       <el-tag v-if="item.situation===0" size="small" effect="dark" type="success">健康</el-tag>
                                <el-tag v-else-if="item.situation===1" size="small" effect="dark" type="danger">发热</el-tag>
                                <el-tag v-else-if="item.situation===2"  size="small" effect="dark"  type="warning">其他情况</el-tag>
                                 </div>
                             </li>
                         </ul>
                      </div>
                    </el-card>
                    <!--分页-->
                     <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="queryMap.pageNum"
                            :page-size="queryMap.pageSize"
                            style="margin-top: 20px;"
                            background
                            small
                            layout="prev, pager, next"
                            :total="historyTotal">
                    </el-pagination>
                </span>
            </el-drawer>

            <el-divider></el-divider>
            <el-form size="small" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <el-form-item label="打卡人">
                                <el-input v-model="userInfo.username" disabled></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="grid-content bg-purple">
                                <el-form-item label="打卡时间">
                                    <el-date-picker
                                            disabled
                                            v-model="nowTime"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                    </el-date-picker>

                                </el-form-item>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="grid-content bg-purple">
                                <el-form-item label="所属部门">
                                    <el-select v-model="departmentId" placeholder="请选择">
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
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

            <h5 style="margin: 0px;padding: 0px;">健康打卡</h5>

            <el-divider></el-divider>
            <el-form  size="small" :inline="true" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <!-- 省市区三级地址选择联动 -->
                            <el-form-item label="省市区">
                                <el-cascader
                                class="cascaderAddress"
                                size="large"
                                :options="options"
                                v-model="selectedOptions"
                                @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                    <el-form-item v-if="reported" label="打卡位置" prop="valueOrigin">
                        <el-tag size="small">
                            {{ruleForm.address}}
                        </el-tag>
                    </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="目前健康状况" prop="situation">
                                <el-radio-group :disabled="reported" v-model="ruleForm.situation">
                                    <el-radio :label="0">健康</el-radio>
                                    <el-radio :label="1">有咳嗽发热症状</el-radio>
                                    <el-radio :label="2">其他情况</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="接触的人是否有疑似症状?  (冠状病毒检测结果为阳性或尚在等待检测结构)" prop="touch">
                                <el-radio-group :disabled="reported" v-model="ruleForm.touch">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="自2020年1月1日起,是否在湖北省停留过 (保存转车路过)" prop="passby">
                                <el-radio-group :disabled="reported" v-model="ruleForm.passby">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="自2020年1月1日起,是否有接待过来自湖北的客户,亲戚或朋友)" prop="reception">
                                <el-radio-group :disabled="reported" v-model="ruleForm.reception">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

            </el-form>

        </el-card>
    </div>
</template>

<script>
    import {selectDeptAndCount} from '@/api/dept'
    import {getCard,isReport,historyCard} from '@/api/health'
    import {request1} from '@/network/request'
    import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
    export default {
        data() {
            return {
                drawer: false,
                direction: 'rtl',
                queryMap:{pageSize:4,pageNum:1},
                reported:false,
                historyTable:[],
                historyTotal:0,
                ruleForm: {},
                nowTime: new Date(),
                userInfo: {},
                rules: {
                    situation: [
                        {required: true, message: "请选择当前情况", trigger: "blur"},
                    ],
                    touch: [
                        {required: true, message: "请选择是否接触", trigger: "blur"},
                    ],
                    passby: [
                        {required: true, message: "请选择是否路过", trigger: "blur"},
                    ],
                    reception: [
                        {required: true, message: "请选择是否招待", trigger: "blur"},
                    ],
                },
                deptList: [],  //部门列表
                departmentId: '',  //记录选中的部门id
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
        methods: {
            OpenHistory(){
                this.drawer = true;
                this.reportHistory();
            },
            /**
             * 翻页
             */
            handleCurrentChange(current) {
                this.queryMap.pageNum = current;
                this.reportHistory();
            },

            //打卡历史记录
            async reportHistory(){
                this.queryMap.userId = this.userInfo.id;
                historyCard(this.queryMap).then(res => {
                    console.log(res);
                    if(!res.success){
                        return this.$message.error("历史记录获取失败:" + res.msg);
                    }else {
                        this.historyTable=res.data.list.dataList;
                        this.historyTotal=res.data.list.total;
                    }
                })
            },
            //今日是否已签到
            async isReport(){
                isReport(this.userInfo.id).then(res => {
                    console.log(res);
                    if(res.code == 20000){
                        this.reported=true;
                        this.ruleForm=res.data.health;
                    }else {
                        this.reported=false;
                        this.$notify.warning({
                            title: '温馨提示',
                            message: '您今日还未打卡,别忘记了哟~'
                        });
                    }
                })
            },
            //打卡
            onSubmit(){
                this.$refs.ruleFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        this.ruleForm.userId = this.userInfo.id;
                        getCard(this.ruleForm).then(res => {
                            console.log(res);
                        })
                        var success = true;
                        if (success) {
                            this.reported=true;
                            this.ruleForm.createTime=new Date();
                        } else {
                            return this.$message.error("健康报备失败:" + res.msg);
                        }
                    }
                });
            },

            //重置打卡表单
            reset(){
                this.$refs.ruleFormRef.clearValidate();
                this.ruleForm={};
            },
            currentTime() {
                setInterval(this.getDate, 500);
            },
            getDate() {
                this.nowTime = new Date();
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
                this.ruleForm.address = loc;
                console.log(loc)// 打印区域码所对应的属性值即中文地址
            },

            //获取部门列表
            getDeptList(){
                selectDeptAndCount().then(res => {
                    this.deptList = res.data.dept;
                })
            },

            getUserInfo() {
                const that = this;
                //获取登录用户的信息
                request1({
                    url: '/user/info',
                    method: 'get',
                }).then(res => {
                    console.log(res);
                    that.userInfo = res;
                    this.isReport();
                })
            },
        },
        created() {
            this.getUserInfo();
            this.getDeptList();
            this.userInfo = this.$store.state.userInfo;   
        },
        mounted() {
            this.currentTime();
        },
        // 销毁定时器
        beforeDestroy: function () {
            if (this.getDate) {
                clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
            }
        }

    }
</script>
<style>
    .cascaderAddress{
        width: 100px;
    }
</style>