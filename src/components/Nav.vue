<template>
  <el-menu :default-active="this.$route.path" class="el-menu-demo" router mode="horizontal">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/muban_center">模板中心</el-menu-item>
    <el-menu-item index="/soft_center">应用中心</el-menu-item>
    <el-menu-item index="/update_log">更新日志</el-menu-item>
    <el-menu-item v-if="username==''" index="/login">登录</el-menu-item>
    <el-menu-item v-if="username==''" index="/register">注册</el-menu-item>
    <el-submenu v-if="username!=''" index="4">
      <template slot="title">{{username}}</template>
      <el-menu-item index="/user">账户</el-menu-item>
      <el-menu-item @click="logout">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'Nav',
  data() {
    return {
      username: '',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      this.$util.delCookie('token')
      // Message.error({
      //   message: '退出成功',
      //   duration: 1000
      // });
      // this.$router.go(0)
      location.reload()
    }
  },
  created(){
    this.username = this.$util.getUserName();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
