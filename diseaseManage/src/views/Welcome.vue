<template>
    <div id="welcome">
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>欢迎</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="15">
            <el-row>
                <el-col :span="12">
                    <!-- 用户信息表格 -->
                    <el-card class="box-card" style="width: 700px">
                        <div slot="header" class="clearfix">
                            <span class="title">用户信息</span>
                            <el-button style="float: right;" size="mini" plain type="primary" @click="goUser">用户中心</el-button>
                            <el-button style="float: right;margin-right: 10px;" size="mini" plain type="primary" @click="goCard">打卡</el-button>
                        </div>
                        <el-tooltip class="item" effect="dark" content="换头像功能还未实现" placement="top-start">
                            <el-avatar
                                shape="square"
                                :size="80"
                                :src="userInfo.avatar"
                                style="float:left;"
                                :key="1">
                            </el-avatar>
                        </el-tooltip>
                        <div class="right" style="float:right;width:520px;">
                            <el-table :data="tableInfo" border height="100">
                                <el-table-column prop="username" label="用户账号"></el-table-column>
                                <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                                <el-table-column prop="birth" label="生日"></el-table-column>
                                <el-table-column prop="email" label="邮箱"></el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="height: 180px">
                        <div class="title">消息区</div>
                        <div class="message">
                            <el-alert v-show="reported" show-icon title="今日未打卡" type="warning" style="height: 40px; margin-bottom: 5px"></el-alert>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
                
                <!-- 功能列表 -->
                <el-row style="margin: 40px 0px 0px 0px;" :gutter="15">
                    <el-card style="height:500px;">
                        <el-col :span="6">
                            <div class="grid-content">
                                <div id="productNum" style="width: 500px;height: 450px;"></div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div id="material" style="width: 500px;height: 450px;"></div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div id="inStock" style="width: 500px;height: 450px;"></div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div id="outStock" style="width: 500px;height: 450px;"></div>
                            </div>
                        </el-col>
                    </el-card>
                </el-row>
            
        </el-row>

        <!-- <el-card class="box-card">
               <el-calendar v-model="value"></el-calendar>
        </el-card>-->
    </div>
</template>
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
<script>
    import echarts from "echarts";
    import {request1} from '@/network/request'
    import {isReport} from '@/api/health'
    import {getProductAll,getOutProductCharts,getInProductCharts,getInStockSeven,getOutStockSeven} from '@/api/welcome'
    export default {
        name: 'Welcome',
        data() {
            return {
                xData: [],
                yData: [],
                myData: [],
                value: new Date(),
                userInfo: {},
                tableInfo: [],
                productNumData: [],  //饼图数据
                radarIndicator: [],  //雷达图数据
                data1: [],  //雷达图数据
                data2: [],  //雷达图数据
                barData1: [],  //柱状数据
                barXData1: [],  //柱状数据
                barData2: [],  //折线数据
                barXData2: [],  //折线数据
                cityname: '海南',  //当前登录城市
                ip: '',  //当前登录ip
                reported: false
            }
        },
        methods: {
            getUserInfo() {
                const that = this;
                //获取登录用户的信息
                request1({
                    url: '/user/info',
                    method: 'get',
                }).then(res => {
                    console.log(res);
                    that.userInfo = res;
                    that.tableInfo.push({
                        username: res.username,
                        nickname: res.nickname,
                        birth: res.birth,
                        email: res.email,
                    });
                    that.isReport();
                })
            },
            
            // 绘制物资库存饼图
            drawRound() {

                var myChart = echarts.init(document.getElementById("productNum"));
                var option = {
                    title: {
                        text: '物资库存',
                        top: 0,
                        left: 'center',
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        bottom: -40,
                        //图例形状
                        icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        //图例文字过长处理
                        formatter: function (name) {
                            var data = option.series[0].data;
                            var total = 0;
                            var tarValue;
                            for (var i = 0, l = data.length; i < l; i++) {
                                total += data[i].value;
                                if (data[i].name == name) {
                                    tarValue = data[i].value;
                                }
                            }
                            if (!name) return '';
                            //超过5个字符...
                            if (name.length > 5) {
                                name = name.slice(0, 5) + '...';
                            }
                            var p = (tarValue / total * 100).toFixed(2);
                            return name;
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: true},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        },
                        right:'25'  //工具类向左移动位置
                    },
                    series: [
                        {
                            name: '面积模式',
                            type: 'pie',
                            radius: [10, 120],
                            center: ['50%', '50%'],
                            roseType: 'area',
                            itemStyle: {
                                borderRadius: 5
                            },
                            data: this.productNumData
                        }
                    ]
                };
                myChart.setOption(option);

            },

            //绘制物资资料雷达图
            drawradar() {
                var myChart = echarts.init(document.getElementById("material"));
                var option = {
                    title: {
                        text: '物资资料',
                        top: 0,
                        left: 'center',
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        },
                        right:'25'  //工具类向左移动位置
                    },
                    tooltip: {},  //鼠标移过展示数据
                    legend: {
                        data: ['出库', '入库'],
                        top: 'bottom'
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: this.radarIndicator,
                        center: ['50%', '50%'],
                        shape: 'circle',
                        radius: 100
                    },
                    series: [{
                        name: '出库 vs 入库',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: [
                            {
                                value: this.data1,
                                name: '出库'
                            },
                            {
                                value: this.data2,
                                name: '入库'
                            }
                        ]
                    }]
                };
                myChart.setOption(option);

            },

            //绘制物资入库柱状图
            drawBar() {

                var myChart = echarts.init(document.getElementById("inStock"));
                var option = {
                    title: {
                        text: '最近一周入库统计',
                        top: 0,
                        left: 'center',
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        },
                        right:'25'  //工具类向左移动位置
                    },
                    xAxis: {
                        type: 'category',
                        data: this.barXData1
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.barData1,
                        type: 'bar',
                        barWidth :12,//柱图宽度
				            itemStyle: {
				                normal: {
				                	barBorderRadius: 12,
				                    color: {
									    type: 'linear',
									    x: 0,
									    y: 0,
									    x2: 0,
									    y2: 1,
									    colorStops: [{
									        offset: 0, color: '#f45c3d' // 0% 处的颜色
									    }, {
									        offset: 1, color: '#f9bf6b' // 100% 处的颜色
									    }],
									    globalCoord: true // 缺省为 false
									},
									label: {
										show: true,
										position: 'top',
										textStyle: {
										color: '#222222'
										},
										formatter:function(params){
											if(params.value==0){
												return '';
											}else{
												return params.value;
											}
										}
									},
								}, 
				            },
                    }]
                };
                myChart.setOption(option);

            },

            //绘制物资出库折线图
            drawBar2() {

                var myChart = echarts.init(document.getElementById("outStock"));
                var option = {
                    title: {
                        text: '最近一周出库统计',
                        top: 0,
                        left: 'center',
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        },
                        right:'25'  //工具类向左移动位置
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: "#194296"  //刻度线标签颜色
                        },
                        boundaryGap : false,
                        data: this.barXData2
                    },
                    yAxis: {
                        type : 'value',
                        splitLine:false,
                        axisLabel: {
                            color: "#194296"  //刻度线标签颜色
                        },
                    },
                    series: [{
                        data: this.barData2,
                        type: 'line',
                        areaStyle: {
                            normal: {
                                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(80,141,255,0.39)'
                                },{
                                    offset: .34,
                                    color: 'rgba(56,155,255,0.25)'
                                },{
                                    offset: 1,
                                    color: 'rgba(38,197,254,0.00)'
                                }])
                            }
                        }
                    }]
                };
                myChart.setOption(option);

            },

            //获取饼图所需数据
            getProNumData() {
                var that = this;
                getProductAll().then(res => {
                    that.productNumData = res.data.product;
                    console.log(this.productNumData);
                    //重新绘制饼图
                    that.drawRound();
                })
            },

            //获取雷达图所需数据
            getInOutProNumData() {
                const that = this;
                getOutProductCharts().then(res => {
                    console.log(res);
                    //构建雷达图的数据对象
                    res.data.product.forEach(function(e) {
                        that.radarIndicator.push({name: e.name, max: 100});
                        that.data1.push(e.value);
                    });
                })
                getInProductCharts().then(res => {
                    console.log(res);
                    //构建雷达图的数据对象
                    res.data.product.forEach(function(e) {
                        that.data2.push(e.value);
                    });
                })
                that.timer = setTimeout(()=>{   //设置延迟执行
                    //重新绘制雷达图
                    that.drawradar();
                },500);               
            },

            //获取柱状图所需数据
            getDrawBar() {
                const that = this;
                getInStockSeven().then(res => {
                    res.data.product.forEach(function(e) {
                        that.barData1.push(e.count);
                        that.barXData1.push(e.days.substr(0,10));
                    });
                    that.drawBar();
                })
            },

            //获取折线图所需数据
            getDrawBar2() {
                const that = this;
                getOutStockSeven().then(res => {
                    res.data.product.forEach(function(e) {
                        that.barData2.push(e.count);
                        that.barXData2.push(e.days.substr(0,10));
                    });
                    that.drawBar2();
                })
            },

            //今日是否已签到
            isReport(){
                isReport(this.userInfo.id).then(res => {
                    console.log(res);
                    if(res.code == 20000){
                        this.reported=false;
                    }else {
                        this.reported=true;
                        
                    }
                })
            },

            //前往打卡界面
            goCard() {
                this.$router.replace("/health/getCard");
            },

            //前往用户管理界面
            goUser() {
                this.$router.replace("/system/users");
            }

        },
        created() {
            this.getUserInfo();
            this.getProNumData();
            this.getInOutProNumData();
            this.getDrawBar();
            this.getDrawBar2();
        },
        mounted: function() {
            this.drawBar();
            this.drawBar2();
            this.drawRound();
            this.drawradar();
        }
    };
</script>

<style>
    .title{
        font-size: 20px;
    }
    .grid-content{
        margin: 0 auto;
        text-align: center;
    }
    .message{
        border: 1px solid rgb(207, 207, 207);
        height: 100px;
        padding: 10px;
    }
</style>