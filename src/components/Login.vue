<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules"
      status-icon
      ref="ruleForm" 
      label-position="left" 
      label-width="0px" 
      class="demo-ruleForm login-page">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="username">
          <el-input type="text" 
              v-model="ruleForm.username" 
              auto-complete="off" 
              placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" 
              v-model="ruleForm.password" 
              auto-complete="off" 
              placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-checkbox 
            v-model="checked"
            class="rememberme"
        >记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'Login',
  data() {
    return {
      logining: false,
      ruleForm: {
          username: '',
          password: '',
      },
      rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ]
      },
      checked: false
    }
  },
  methods: {
    handleSubmit(){
      var that = this;
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          this.logining = true;

          //登录请求
          this.axios({
            method: 'post',
            url: this.$util.requestDomain+'/login',
            data: that.ruleForm
          }).then(function(response) {
            if (response.data.code == 0) {
              Message.success({
                message: "登录成功",
                duration: 1000
              });
              that.logining = false;
              if (that.checked) {
                //记住密码
                localStorage.setItem("username", that.ruleForm.username)
                localStorage.setItem("password", that.ruleForm.password)
              } else {
                localStorage.removeItem("username")
                localStorage.removeItem("password")
              }
              that.$router.push('/');

            } else {
              that.logining = false;
              Message.error({
                message: response.data.msg,
                duration: 1000
              });
            }
          });
        }else{
          console.log('error submit!');
          return false;
        }
      })
    }
  },
  created() {
    var username = localStorage.getItem("username")
    var password = localStorage.getItem("password")
    if ( username != null && password != null) {
      this.ruleForm.username = username
      this.ruleForm.password = password
      this.checked = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>
