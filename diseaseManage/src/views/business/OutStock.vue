<template>
    <div class="outStocks">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>物资管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库记录</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片部分-->
        <el-card>
        <!--搜索部分-->
            <el-form size="mini" :inline="true" :model="queryMap" class="demo-form-inline">
                <el-form-item label="发放单号">
                    <el-input v-model="queryMap.outNum" placeholder="发放单号"></el-input>
                </el-form-item>
                <el-form-item label="发放类型">
                    <el-select v-model="queryMap.type" placeholder="发放类型">
                        <el-option label="全部类型" value=""></el-option>
                        <el-option label="政府领取" value="0"></el-option>
                        <el-option label="医院领取" value="1"></el-option>
                        <el-option label="小区领取" value="2"></el-option>
                        <el-option label="个人领取" value="3"></el-option>
                        <el-option label="其他领取" value="4"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-select    v-model="queryMap.status" placeholder="请选择状态">
                        <el-option label="已发放" :value="0"></el-option>
                        <el-option label="回收站" :value="1"></el-option>
                        <el-option label="待审核" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button  @click="reset">重置</el-button>
                </el-form-item>

                <el-form-item>
                    <router-link to="pushstock">
                        <el-button type="success" >
                            发放
                        </el-button>
                    </router-link>
                </el-form-item>
            </el-form>
                <!--数据表格-->
                <el-table
                        size="mini"
                        border
                        :data="tableData"
                        style="width: 100%;height: 500px;">
                    <el-table-column label="#" prop="id" width="50"></el-table-column>
                    <el-table-column  prop="outNum" :show-overflow-tooltip='true' label="发放单号" width="180"></el-table-column>
                    <el-table-column prop="type" label="发放类型" width="100">
                        <template slot-scope="scope">
                            <el-tag  effect="plain" size="mini"  type="success" v-if="scope.row.type===0">政府领取</el-tag>
                            <el-tag  effect="plain" size="mini" type="danger"  v-else-if="scope.row.type===1">医院领取</el-tag>
                            <el-tag  effect="plain" size="mini"  type="warning"  v-else-if="scope.row.type===2">小区领取</el-tag>
                            <el-tag  effect="plain" size="mini"  type="info"  v-else-if="scope.row.type===3">个人领取</el-tag>
                            <el-tag  effect="plain" size="mini"   v-else-if="scope.row.type===4">其他领取</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="priority" label="紧急程度" width="180">
                        <template slot-scope="scope">
                            <el-rate
                                    :disabled="true"
                                    v-model="scope.row.priority"
                                    show-text
                                    :texts="['不急','常规','紧急','特急','超急']"
                            >
                            </el-rate>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="发放地点" width="150"></el-table-column>
                    <el-table-column prop="productNumber" label="总数" width="80"></el-table-column>
                    <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==1">回收</el-tag>
                            <el-tag size="mini" effect="plain" v-if="scope.row.status==0">已放</el-tag>
                            <el-tag size="mini" effect="plain" type="warning" v-if="scope.row.status==2">审核中</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="operator" label="操作员" width="100"></el-table-column>

                    <el-table-column prop="createTime" label="发放时间" width="150px;"></el-table-column>
                    <el-table-column label="操作" width="310">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-view"  @click="detail(scope.row.id)" type="text" size="small">明细</el-button>
                            <el-popconfirm
                                @confirm="remove(scope.row.id)"
                                style="margin-left: 20px;"
                                confirmButtonText='好的'
                                cancelButtonText='不用了'
                                icon="el-icon-info"
                                iconColor="red"
                                title="这是一段内容确定移入回收站吗？">
                                <el-button type="text" slot="reference" size="mini" icon="el-icon-s-operation">回收站</el-button>
                            </el-popconfirm>
                            <el-popconfirm
                                style="margin-left:20px;"
                                @confirm="del(scope.row.id)"
                                title="这是一段内容确定删除吗？">
                                <el-button type="text" slot="reference" size="small" icon="el-icon-delete">删除</el-button>
                            </el-popconfirm>
                            <el-popconfirm
                                style="margin-left:20px;"
                                @confirm="publish(scope.row.id)"
                                title="审核通过后库存将更新,是否通过">
                                <el-button type="text" slot="reference" size="small" icon="el-icon-refresh">审核</el-button>
                        </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <!--表格分页-->
                <el-pagination
                        style="margin-top:20px;"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryMap.pageNum"
                        :page-sizes="[6, 10, 20, 30]"
                        :page-size="queryMap.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                ></el-pagination>
            <!-- 发放明细 -->
            <el-dialog title="发放明细" :visible.sync="dialogVisible" @close="closeDetail" width="60%">
                <!--                来源信息-->
                <el-card class="box-card" style="margin-bottom: 10px;">
                    <div  class="text item">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <div class="grid-content bg-purple">
                                    <span style="font-size: 11px;color: #303030;">省区市:</span> &nbsp;<el-tag size="mini" >{{consumer.address}}</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">
                                    <span style="font-size: 11px;color: #303030;">具体位置:</span> &nbsp;<el-tag size="mini" >{{consumer.name}}</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">
                                    <span style="font-size: 11px;color: #303030;">联系人 :</span> &nbsp;<el-tag size="mini"  >{{consumer.contact}}</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">
                                    <span style="font-size: 11px;color: #303030;">电话 : </span>&nbsp;<el-tag size="mini" >{{consumer.phone}}</el-tag>
                                </div>
                            </el-col>

                        </el-row>
                    </div>
                </el-card>
                <!--                步骤条-->
                <el-steps simple v-if="pStatus==0"  style="margin-left: 10px;margin-bottom: 5px;" :space="200" :active="3" finish-status="success">
                    <el-step title="提交发放单" ></el-step>
                    <el-step title="审核发放单"></el-step>
                    <el-step title="成功发放"></el-step>
                </el-steps>
                <el-steps simple v-if="pStatus==2"  style="margin-left: 10px;margin-bottom: 5px;" :space="200" :active="2" finish-status="success">
                    <el-step title="提交发放单" ></el-step>
                    <el-step title="审核发放单"></el-step>
                    <el-step title="成功发放"></el-step>
                </el-steps>
                <span>
          <template>
            <el-table height="260" max-height="350" border :data="detailTable" style="width: 100%">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="pnum" label="商品编号"></el-table-column>
               <el-table-column prop="model" label="规格"></el-table-column>
              <el-table-column
                      prop="imageUrl"
                      label="图片"
                      align="center"
                      width="150px"
                      padding="0px"
              >
                <template slot-scope="scope">
                    <img
                        :src="scope.row.imageUrl"
                        alt
                        style="width: 30px;height:30px"/>
                </template>
              </el-table-column>
               <el-table-column prop="count" label="数量"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
            </el-table>
              <!--              明细分页-->
        <el-pagination
                style="margin-top:20px;"
                background
                @current-change="handleDetailSizeChange"
                :current-page="this.pageNum"
                :page-size="3"
                layout="prev, pager, next,total"
                :total="this.detailTotal">
        </el-pagination>
          </template>

        </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    import {findOutStockList,findOutStockInfo,deleteById,update} from '@/api/outstock'
    export default {
        data() {
            return {
                consumer:{},
                detailTotal:0,
                detailTable:[],
                dialogVisible:false,
                pageNum:1,
                total:0,
                queryMap:{pageNum:1,pageSize:6, status: 0,},
                tableData:[],
                pStatus:'',//步骤flag
                detailQueryMap: {pageNum: 1, pageSize: 3, id: 0},
            }
        },
        methods:{
            /**
             *物资发放审核
             */
            async publish(id){
                update(id,0).then(res => {
                    console.log(res);
                    this.loadTableData();
                })
            },

            /**
             * 关闭明细
             */
            closeDetail(){
                this.pageNum=1;
            },
            /**
             *  改变页码
             */
            handleDetailSizeChange(newSize) {
                 this.detailQueryMap.pageNum = newSize;
                this.detail(this.detailQueryMap.id);
                this.detailQueryMap.pageNum = 1;
            },

            /**
             * 查看发放单明细
             */
            async detail(id) {
                this.detailQueryMap.id = id;
                findOutStockInfo(this.detailQueryMap).then(res => {
                    console.log(res);
                    this.detailTable = res.data.list.dataList;
                    this.detailTotal = res.data.list.total;
                    this.pStatus = res.data.list.dataList[0].status;
                    this.consumer.address = res.data.list.dataList[0].address;
                    this.consumer.name = res.data.list.dataList[0].name;
                    this.consumer.contact = res.data.list.dataList[0].contact;
                    this.consumer.phone = res.data.list.dataList[0].phone;
                })
                
                this.dialogVisible = true;

            },

            /**
             * 移除回收站
             */
            async remove(id) {
                update(id,1).then(res => {
                    console.log(res);
                    this.loadTableData();
                })
            },

            /**
             * 重置查询表单
             */
            reset(){
                this.queryMap={pageNum:1,pageSize:10 ,status: 0,};
            },
            /**
             * 加载表格数据
             */
            async loadTableData() {
                findOutStockList(this.queryMap).then(res => {
                    console.log(res);
                    this.total = res.data.list.total;
                    this.tableData = res.data.list.dataList;
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
            //搜索
            search() {
                this.queryMap.pageNum = 1;
                this.loadTableData();
            },

            /**删除
             */
            async del(id) {
                deleteById(id).then(res => {
                    console.log(res);
                    this.loadTableData();
                })
            },

        },
        created() {
            this.loadTableData();
        }
    }
</script>
<style>
    /* 让表格对齐 */
    body .el-table th.gutter {
        display: table-cell !important;
    }
</style>