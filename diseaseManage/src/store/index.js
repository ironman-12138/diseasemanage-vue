import Vue from "vue"
import Vuex from "vuex"

//1.安装插件
Vue.use(Vuex)

//2.创建对象
const store = new Vuex.Store({
    state:{
        tokenStr: window.sessionStorage.getItem('tokenStr'),
        userInfo: '',
        menus: []  //存放菜单列表
    },
    //修改state中的数据必须经过mutations
    mutations:{
        //给token赋值
        setToken(state,token){
            state.token = token;
            //localStorage 用于本地永久保存数据
            localStorage.setItem("tokenStr",token);
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
            sessionStorage.setItem("userInfo",JSON.stringify(''));
            sessionStorage.setItem('tokenStr','');
        },
        //保存菜单列表
        setMenusList(state,menus){
            state.menus = menus;
        }
    },
    //计算属性
    getters:{
        getUser(state){
            return state.userInfo;
        },
        getMenusList(state){
            return state.menus;
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