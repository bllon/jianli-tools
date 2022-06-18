<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules"
      status-icon
      ref="ruleForm" 
      label-position="left" 
      label-width="0px" 
      class="demo-ruleForm login-page">
        <h3 class="title">系统注册</h3>
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
        <el-form-item prop="confirm_password">
          <el-input type="confirm_password" 
              v-model="ruleForm.confirm_password" 
              auto-complete="off" 
              placeholder="确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="registering">注册</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'Register',
  data() {
    var validateConfirmPwd = (rule, value, callback) => {
      // 这里每一种情况都要callback，不然表单验证会失效  
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      logining: false,
      registering: false,
      ruleForm: {
          username: '',
          password: '',
          confirm_password: '',
      },
      rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          confirm_password: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {validator: validateConfirmPwd, trigger: 'blur', required: true}
          ]
      }
    }
  },
  methods: {
    handleSubmit(event){
      var that = this;
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          // this.registering = true;

          //注册请求
          this.axios({
            method: 'post',
            url: this.$util.requestDomain+'/register',
            data: that.ruleForm
          }).then(function(response) {
            if (response.data.code == 0) {
              Message.success({
                message: '注册成功',
                duration: 1000
              });
              that.$router.push('/');
            } else {
              Message.error({
                message: response.data.msg,
                duration: 1000
              });
              // that.$alert('注册失败', 'error', {
              //   confirmButtonText: 'ok'
              // })
            }
          });

          // if(this.ruleForm.username === 'admin' && 
          //   this.ruleForm.password === '123456'){
          //   this.logining = false;
          //   sessionStorage.setItem('user', this.ruleForm.username);
          //   this.$router.push({path: '/'});
          // }else{
          //   this.logining = false;
          //   this.$alert('username or password wrong!', 'info', {
          //       confirmButtonText: 'ok'
          //   })
          // }
        }else{
        //  Message.error('表单信息错误');
          return false;
        }
      })
    }
  },
  created(){
    // console.log(sessionStorage.getItem('user'))
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
</style>
