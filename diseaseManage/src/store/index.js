import Vue from "vue"
import Vuex from "vuex"

//1.安装插件
Vue.use(Vuex)

const moduleA = {
    state:{},
    getters:{}
} 

//2.创建对象
const store = new Vuex.Store({
    state:{
        token: '',
        userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
    },
    //修改state中的数据必须经过mutations
    mutations:{
        //给token赋值
        setToken(state,token){
            state.token = token;
            //localStorage 用于本地永久保存数据
            localStorage.setItem("token",token);
        },
        //给userInfo赋值
        setUserInfo(state,userInfo){
            state.userInfo = userInfo;
            //sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
            //JSON.stringify()将对象转换为字符串
            sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
        },
        //删除token和userInfo
        removeTokenAndInfo(state){
            state.token = '';
            state.userInfo = {};
            localStorage.setItem("token",'');
            sessionStorage.setItem("userInfo",JSON.stringify(''));
        }
    },
    //计算属性
    getters:{
        getUser(state){
            return state.userInfo;
        }
    },
    //执行异步操作
    actions:{
    },
    modules:{
    }
})

//3.导出
export default store