<template>
  <div class="edit">
    <el-row :gutter="24" style="margin:0;">
      <el-col :xl="{span:12, offset:6}" :lg="{span:18, offset:3}" :md="{span:20, offset:2}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;">
        <Nav></Nav>
        <div class="title">
          <h4>模板中心</h4>
        </div>
        <div class="content">
          <div class="box" v-for="(item,index) in list" :key="index" @click="edit(item.temp_id)">
            <h5 class="muban_name">{{item.name}}</h5>
            <p style="font-size:12px;padding:5px 0;margin-top:10px;">创建人: {{item.creator}}</p>
            <p style="font-size:12px;padding:5px 0;margin-top:10px;">{{item.update_time.substr(0,10)}}</p>
            <!-- <div class="create">
              <el-button type="info" icon="el-icon-edit" circle @click="edit(item.id)"></el-button>
            </div> -->
          </div>
          <div class="box" @click="edit()">
            <div class="create">
              <i class="el-icon-edit"></i>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
export default {
  components: {Nav},
  name: 'MuBanCenter',
  data() {
    return {
      list:"",
    }
  },
  methods: {
    edit(id) {
      if (this.$util.getUserName() == '') {
        Message.error({
          message: '未登录授权',
          duration: 1000
        });
        return
      }

      if (this.$store.state.network == false) {
        this.$notify.error({
          title: '错误',
          message: '连接服务器异常,请联系管理员'
        });
        return
      }

      if (id == undefined) {
        this.$router.push('/resume/template/edit')
      } else {
        this.$router.push('/resume/template/edit/' + id)
      }
    }
  },
  created() {
    //未登录不请求
    if (this.$util.getUserName() == "") {
      return
    }
    
    var that = this;
    // 发送axios请求
    this.axios({
      method: 'post',
      url: this.$util.requestDomain+'/jianli_template_list'
    }).then(function(response) {
      if (response.data.code == 0) {
        that.list = response.data.data;
      } else {
        // Message.error({
        //   message: response.data.msg,
        //   duration: 1000
        // });
      }
    });
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
  height:100%;
}
.el-col {
  height:100%;
  border-radius: 4px;
  background: rgb(215, 224, 228);
}
.title {
  height: 70px;
  line-height: 70px;
  background: rgb(219, 216, 184);
  letter-spacing: 3px;
}
.title h4 {
  text-align: center;
  color: rgb(67, 78, 78);
}
.content {
  width:100%;
  height:auto;
}
.box {
  width: 124px;
  height: 150px;
  background: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 0 3px 0 #5f7cb6;
  margin: 20px 20px 0;
  float: left;
}
.box:hover{
  box-shadow: 0 0 3px 0 #cdd5e2;
  cursor: pointer;
}
.muban_name {
  height:30px;
  line-height: 30px;
}
.create {
  width:50px;
  height:50px;
  margin: 50px auto;
  line-height: 50px;
  font-size: 20px;
  color: rgb(43, 184, 66);
  /* border: 1px red solid; */
}
.create span {
  font-size: 14px;
  letter-spacing: 3px;
  font-weight: 600;
  color: #303133;
}
.clear{
  clear: both;
}
</style>
