<template>
  <div>
    <el-dialog v-bind="$attrs" :visible.sync="showDialog" v-on="$listeners" @open="onOpen" @close="onClose" title="用户添加">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="user" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="用户头像">
              <!-- 头像缩略图 -->
              <PanThumb :image="image"/>
              <!-- 文件上传按钮 -->
              <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
              <!-- 
                v-show: 是否显示上传组件
                :key: 类似id
                :url: 后台上传的url地址
                @close: 关闭上传组件
                @crop-upload-success: 上传成功后的回调
               -->
              <ImageCropper 
                v-show="imagecropperShow"
                :width="300"
                :height="300"
                :key="imagecropperKey"
                :url="'/aliOss/uploadImgFile'"
                field="file"
                @close="closeImage"
                @crop-upload-success="cropSuccess"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username" placeholder="请输入用户名" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="user.departmentId" placeholder="请选择部门" clearable
                :style="{width: '100%'}">
                <el-option
                  v-for="item in deptList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="user.nickname" placeholder="请输入昵称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="user.sex" size="medium">
                <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="user.password" placeholder="请输入密码" clearable show-password
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email" placeholder="请输入邮箱" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="user.phoneNumber" placeholder="请输入手机号" clearable
                :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birth">
              <el-date-picker v-model="user.birth" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{width: '100%'}" placeholder="请选择生日" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import {deleteImgFile,saveUser} from '@/api/users'

  export default {
    inheritAttrs: false,
    components: {ImageCropper,PanThumb},
    props: {
      addOrUpdateVisible: {
        type: Boolean,
        default: false
      },
      //部门集合
      deptList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        user: {
          avatar: null,
          username: undefined,
          departmentId: undefined,
          nickname: undefined,
          sex: undefined,
          password: undefined,
          email: undefined,
          phoneNumber: undefined,
          birth: null,
        },
        //控制弹出框显示和隐藏
        showDialog: false,
        imagecropperShow: false,  //是否显示上传组件
        imagecropperKey: 0,  //上传组件id
        image: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1401165311,3624236690&fm=11&gp=0.jpg',
        oldImg: '',  //用来保存修改之前的头像
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          departmentId: [{
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }],
          nickname: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }],
          sex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }],
          phoneNumber: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          birth: [{
            required: true,
            message: '请选择生日',
            trigger: 'change'
          }],
        },
        field101Action: 'https://jsonplaceholder.typicode.com/posts/',
        field101fileList: [],
        departmentIdOptions: [{
          "label": "选项一",
          "value": 1
        }, {
          "label": "选项二",
          "value": 2
        }],
        sexOptions: [{
          "label": "男",
          "value": 0
        }, {
          "label": "女",
          "value": 1
        }],
      }
    },
    computed: {},
    watch: {
      //监听addOrUpdateVisible的变化
      addOrUpdateVisible(oldVal,newVal){
        this.showDialog = this.addOrUpdateVisible;
      }
    },
    created() {},
    mounted() {},
    methods: {
      onOpen() {},
      onClose() {
        this.$refs['elForm'].resetFields();
        //子组件调用父组件的方法并传递参数
        this.$emit('changeShow',false);
      },
      close() {
        this.$emit('update:visible', false);
        //子组件调用父组件的方法并传递参数
        this.$emit('changeShow',false);
      },
      handelConfirm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid){
            return;
          }
          this.addUser();
        })
      },
      field101BeforeUpload(file) {
        let isRightSize = file.size / 1024 / 1024 < 2
        if (!isRightSize) {
          this.$message.error('文件大小超过 2MB')
        }
        return isRightSize
      },
      //头像上传成功后的回调函数
      cropSuccess(data) {
        console.log(data);
        //使用该属性保存上传之前的头像
        var oldImg = this.image;
        this.imagecropperShow = false;
        this.image = data.data.url;
        this.user.avatar = data.data.url;
        //上传成功后，重新打开上传组件时初始化，否则显示上一次的结果
        this.imagecropperKey = this.imagecropperKey + 1;
        //上传成功后删除原来的图片
        this.deleteAvatar(oldImg);
      },
      //关闭上传组件
      closeImage() {
        this.imagecropperShow = false;
        //上传成功后，重新打开上传组件时初始化，否则显示上一次的结果
        this.imagecropperKey = this.imagecropperKey + 1;
      },
      //删除上传之前的图片 
      deleteAvatar(oldImage){
         deleteImgFile(oldImage).then(res => {
          console.log(res); 
         })
      },
      //添加用户
      addUser(){
        saveUser(this.user).then(res => {
          if (res.code == 200) {
            this.$notify.success({
              title: "操作成功",
              message: "用户添加成功"
            })
            //关闭弹窗
            this.$emit('changeShow', false);
            this.user = {};
            //重新刷新用户列表
            this.$emit('getUserList');
            this.$emit('getDeptList');
          }else{
            return this.$message.error('用户添加失败');
          }
        })
      }
    }
  }
</script>
<style>
  .el-upload__tip {
    line-height: 1.2;
  }

</style>
