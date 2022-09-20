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
      errtime: null
    }
  },
  methods: {
    // beforeunloadHandler(e) {
    //   e = e || window.event;
    //   // console.log('刷新或关闭')
    //   // this.$confirm('将修改信息保存, 是否继续?', '提示', {
    //   //   confirmButtonText: '确定',
    //   //   cancelButtonText: '取消',
    //   //   type: 'info',
    //   //   lockScroll: false
    //   // }).then(() => {
    //   //   // this.save()
    //   // }).catch((err) => {
    //   //   console.log("取消了保存")
    //   // });
    //   if (e) {
    //     e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
    //   }
    //   e.returnValue = "";
    // },
    // stopF5Refresh() {
    //   document.onkeydown = function (e) {
    //     var evt = window.event || e;
    //     var code = evt.keyCode || evt.which;
    //     //屏蔽F1---F12
    //     if (code > 111 && code < 124) {
    //       if (evt.preventDefault) {
    //         evt.preventDefault();
    //       } else {
    //         evt.keyCode = 0;
    //         evt.returnValue = false;
    //       }
    //     }
    //   };
    //   //禁止鼠标右键菜单
    //   // document.oncontextmenu = function () {
    //   //   return false;
    //   // };
    //   //阻止后退的所有动作，包括 键盘、鼠标手势等产生的后退动作。
    //   history.pushState(null, null, window.location.href);
    //   window.addEventListener("popstate", function () {
    //     history.pushState(null, null, window.location.href);
    //   });
    // },
  },
  async created() {
    // this.stopF5Refresh();
    var that = this
    //请求拦截
    this.axios.interceptors.request.use(function(config) {
      return config;
    },function(err){
      return Promise.reject(err)
    });

    //响应拦截
    this.axios.interceptors.response.use(function(response){
      if (that.$store.state.network == false) {
          // console.log("网络异常")
          that.$store.commit('networkYes')
        }
      return response;
    },function(err){
      if (err == "Error: Network Error") {
        if (that.$store.state.network) {
          // console.log("网络异常")
          that.$store.commit('networkNo')
        }
        if (that.errtime == null) {
          that.$notify.error({
            title: '错误',
            message: '连接服务器异常,请联系管理员'
          });
          that.errtime = setTimeout(() => {
            that.errtime = null;
          }, 3000)
        }
      }
      return Promise.reject(err)
    })
  },
  // async mounted() {
  //   window.addEventListener("beforeunload", (e) => {
  //     this.beforeunloadHandler(e);
  //   });
  // },
  // destroyed() {
  //   window.removeEventListener("beforeunload", (e) => {
  //     this.beforeunloadHandler(e);
  //   });
  // }
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
