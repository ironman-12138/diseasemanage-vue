<template>
    <div>
        <div v-for="(menu,i) in menuList" :key="i">
            <el-submenu :disabled="menu.disable" :index="menu.id + ''" v-if="menu.children.length > 0">
                <template slot="title">
                    <i :class="menu.icon"></i>
                    <span>{{menu.menuName}}</span>
                </template>
                <MenuTree :menuList="menu.children"></MenuTree>
            </el-submenu>
            <el-menu-item v-else :index="menu.url + ''">
                <i :class="menu.icon"></i>
                <span>{{menu.menuName}}</span>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MenuTree',
        //接收父组件传递的参数
        props: ["menuList"],
        data() {
            return {
                
            };
        },
        methods: {
            
        },
    };
</script>

<style>
    /* 菜单溢出处理 */
    .el-menu--collapse span, .el-menu--collapse i.el-submenu__icon-arrow {
        height: 0; 
        width: 0;
        overflow: hidden;
        visibility: hidden; 
        display: inline-block;
    }
</style>