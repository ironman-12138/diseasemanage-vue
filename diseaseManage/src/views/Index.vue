<template>
  <div class="index-all">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="index-title">疫情物资管理系统</div>
        <div><LoginMessage></LoginMessage></div>
      </el-header>

      <el-container>
        <!-- 左边导航区 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 
              展开收起按钮 
              @select="menuClick"  菜单激活回调	index: 选中菜单项的 index
              :collapse-transition="false"  不开启折叠动画
              :collapse="isCollapse"  根据isCollapse决定是否水平折叠收起菜单
              :unique-opened="true"  只保持一个子菜单的展开
            -->
          <div class="toggle-box" @click="toggleCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            @select="menuClick"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :collapse-transition="false"
            :unique-opened="true">
            <MenuTree :menuList="MenuList"></MenuTree>
          </el-menu>
        </el-aside>

        <!-- 右边内容展示区 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LoginMessage from "../components/LoginMessage.vue";
import MenuTree from "../components/MenuTree.vue";
export default {
  components: { LoginMessage, MenuTree },
  name: "Index",
  data() {
    return {
      isCollapse: false,
      MenuList: [
        {
          id: 1,
          parentId: 0,
          menuName: "系统管理",
          url: "",
          icon: "el-icon-setting",
          orderNum: 1,
          open: 1,
          disabled: false,
          perms: null,
          type: 0,
          children: [
            {
              id: 253,
              parentId: 1,
              menuName: "欢迎页面",
              url: "/welcome",
              icon: "el-icon-star-off",
              orderNum: 1,
              open: 0,
              disabled: false,
              perms: "welcome:view",
              type: 0,
              children: [],
            },
            {
              id: 226,
              parentId: 1,
              menuName: "用户管理",
              url: "/users",
              icon: "el-icon-user",
              orderNum: 2,
              open: 0,
              disabled: false,
              perms: "users",
              type: 0,
              children: [],
            },
            {
              id: 321,
              parentId: 1,
              menuName: "附件管理",
              url: "/attachments",
              icon: "el-icon-picture-outline",
              orderNum: 2,
              open: 1,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
            {
              id: 4,
              parentId: 1,
              menuName: "菜单权限",
              url: "/menus",
              icon: "el-icon-help",
              orderNum: 3,
              open: 0,
              disabled: false,
              perms: null,
              type: 0,
              children: [],
            },
            {
              id: 235,
              parentId: 1,
              menuName: "角色管理",
              url: "/roles",
              icon: "el-icon-postcard",
              orderNum: 3,
              open: 0,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
            {
              id: 261,
              parentId: 1,
              menuName: "部门管理",
              url: "/departments",
              icon: "el-icon-s-home",
              orderNum: 3,
              open: 0,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
            {
              id: 319,
              parentId: 1,
              menuName: "公告管理",
              url: "/notices",
              icon: "el-icon-s-flag",
              orderNum: 4,
              open: 0,
              disabled: true,
              perms: "",
              type: 0,
              children: [],
            },
          ],
        },
        {
          id: 312,
          parentId: 0,
          menuName: "业务管理",
          url: null,
          icon: "el-icon-s-goods",
          orderNum: 2,
          open: 0,
          disabled: false,
          perms: null,
          type: 0,
          children: [
            {
              id: 229,
              parentId: 312,
              menuName: "物资管理",
              url: "",
              icon: "el-icon-date",
              orderNum: 1,
              open: 1,
              disabled: false,
              perms: "el-icon-date",
              type: 0,
              children: [
                {
                  id: 230,
                  parentId: 229,
                  menuName: "物资入库",
                  url: "/inStocks",
                  icon: "el-icon-date",
                  orderNum: 1,
                  open: 1,
                  disabled: false,
                  perms: "el-icon-date",
                  type: 0,
                  children: [],
                },
                {
                  id: 267,
                  parentId: 229,
                  menuName: "物资资料",
                  url: "/products",
                  icon: "el-icon-goods",
                  orderNum: 2,
                  open: 0,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
                {
                  id: 268,
                  parentId: 229,
                  menuName: "物资类别",
                  url: "/productCategorys",
                  icon: "el-icon-star-off",
                  orderNum: 2,
                  open: 0,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
                {
                  id: 270,
                  parentId: 229,
                  menuName: "物资发放",
                  url: "/outStocks",
                  icon: "el-icon-goods",
                  orderNum: 5,
                  open: 1,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
                {
                  id: 316,
                  parentId: 229,
                  menuName: "物资库存",
                  url: "/stocks",
                  icon: "el-icon-tickets",
                  orderNum: 5,
                  open: 0,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
              ],
            },
            {
              id: 311,
              parentId: 312,
              menuName: "物资流向",
              url: null,
              icon: "el-icon-edit",
              orderNum: 3,
              open: 0,
              disabled: false,
              perms: null,
              type: 0,
              children: [
                {
                  id: 310,
                  parentId: 311,
                  menuName: "物资去处",
                  url: "/consumers",
                  icon: "el-icon-edit",
                  orderNum: 1,
                  open: 0,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
                {
                  id: 269,
                  parentId: 311,
                  menuName: "物资来源",
                  url: "/suppliers",
                  icon: "el-icon-coordinate",
                  orderNum: 5,
                  open: 0,
                  disabled: false,
                  perms: "",
                  type: 0,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 303,
          parentId: 0,
          menuName: "健康报备",
          url: "",
          icon: "el-icon-platform-eleme",
          orderNum: 3,
          open: 0,
          disabled: false,
          perms: "",
          type: 0,
          children: [
            {
              id: 273,
              parentId: 303,
              menuName: "全国疫情",
              url: "/map",
              icon: "el-icon-s-opportunity",
              orderNum: 1,
              open: 1,
              disabled: false,
              perms: "map:view",
              type: 0,
              children: [],
            },
            {
              id: 304,
              parentId: 303,
              menuName: "健康打卡",
              url: "/health",
              icon: "el-icon-s-cooperation",
              orderNum: 1,
              open: 0,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
            {
              id: 305,
              parentId: 303,
              menuName: "查看情况",
              url: null,
              icon: "el-icon-c-scale-to-original",
              orderNum: 2,
              open: 1,
              disabled: false,
              perms: null,
              type: 0,
              children: [],
            },
            {
              id: 272,
              parentId: 303,
              menuName: "疫情辟谣",
              url: "/rumors",
              icon: "el-icon-help",
              orderNum: 5,
              open: 0,
              disabled: false,
              perms: null,
              type: 0,
              children: [],
            },
          ],
        },
        {
          id: 295,
          parentId: 0,
          menuName: "其他管理",
          url: "",
          icon: "el-icon-s-marketing",
          orderNum: 5,
          open: 0,
          disabled: false,
          perms: "",
          type: 0,
          children: [
            {
              id: 297,
              parentId: 295,
              menuName: "监控管理",
              url: "",
              icon: "el-icon-warning",
              orderNum: 1,
              open: 0,
              disabled: false,
              perms: "",
              type: 0,
              children: [
                {
                  id: 298,
                  parentId: 297,
                  menuName: "SQL监控",
                  url: "/druid",
                  icon: "el-icon-view",
                  orderNum: 1,
                  open: 0,
                  disabled: false,
                  perms: null,
                  type: 0,
                  children: [],
                },
              ],
            },
            {
              id: 341,
              parentId: 295,
              menuName: "个人博客",
              url: "/blog",
              icon: "el-icon-view",
              orderNum: 1,
              open: 0,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
            {
              id: 296,
              parentId: 295,
              menuName: "swagger文档",
              url: "/swagger",
              icon: "el-icon-document",
              orderNum: 2,
              open: 0,
              disabled: false,
              perms: null,
              type: 0,
              children: [],
            },
            {
              id: 318,
              parentId: 295,
              menuName: "图标管理",
              url: "/icons",
              icon: "el-icon-star-off",
              orderNum: 2,
              open: 1,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
          ],
        },
        {
          id: 5,
          parentId: 0,
          menuName: "日志管理",
          url: "/logs",
          icon: "el-icon-camera",
          orderNum: 6,
          open: 0,
          disabled: false,
          perms: null,
          type: 0,
          children: [
            {
              id: 271,
              parentId: 5,
              menuName: "登入日志",
              url: "/loginLog",
              icon: "el-icon-date",
              orderNum: 1,
              open: 0,
              disabled: false,
              perms: "login:log",
              type: 0,
              children: [],
            },
            {
              id: 307,
              parentId: 5,
              menuName: "操作日志",
              url: "/logs",
              icon: "el-icon-edit",
              orderNum: 1,
              open: 1,
              disabled: false,
              perms: "",
              type: 0,
              children: [],
            },
          ],
        },
      ],
    };
  },
  methods: {
    menuClick(index) {
      this.$router.push(index);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style>
.index-all {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  /* 横向排列 */
  display: flex;
  /* 两端对齐 */
  justify-content: space-between;
  line-height: 60px;
}

/* 导航区样式 */
.el-aside {
  background-color: #545c64;
  color: #333;
}

/* 菜单边框去除 */
.el-menu {
  border-right: none;
}

.el-main {
  color: #333;
}

/* 标题样式 */
.index-title {
  font-size: 20px;
  font-weight: 600;
}

/* 展开收起按键样式 */
.toggle-box {
  text-align: right;
  cursor: pointer;
  color: white;
  margin-right: 5px;
  border-bottom: 1px solid rgb(76, 219, 238);
  padding: 2px;
}
</style>