<template>
  <div id="app">
    <router-view />
    
<el-backtop :bottom="60">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      UP
    </div>
  </el-backtop>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'App',
  data() {
    return {
      refresh: null
    }
  },
  created() {
    if (this.$util.getUserName() != "") {
      this.refresh = null;
      this.refresh = setInterval(() => {
        //每4分钟刷新一次token令牌
        this.axios({
          method: 'get',
          url: this.$util.requestDomain+'/refresh',
          data: {user_id: parseInt(this.$util.getUserId())}
        }).then(function(response) {
          if (response.data.code == 0) {
            // console.log("令牌已刷新")
          } else {
            // console.log("系统异常")
          }
        });
      },240000)
    } else {
      // this.$router.push('/');//未登录就跳回首页
    } 
  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
::-webkit-scrollbar{
  width: 6px;
  background-color: rgb(244, 244, 244);
}
::-webkit-scrollbar-thumb{
  border-radius: 4px;
  background: rgba(144,147,153,.3);
}
html,body {
  width:100%;
  height:100%;
  /* overflow:overlay; */
}
#app {
  height:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;  /*抗锯齿*/
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
