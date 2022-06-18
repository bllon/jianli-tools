<template>
  <div class="home">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="12" :offset="6" style="padding-left:0;padding-right:0;">
        <Nav></Nav>
        <div class="title">
          <h4>这是一款简历助手工具，将免费提供简历编辑功能</h4>
        </div>
        <div class="jianli">
          <div class="box" v-for="(item,index) in list" :key="index" @click="edit(item.id)">
            <h5 class="jianli_name">{{item.name}}</h5>
            <div class="jindu">
              <el-progress type="dashboard" :percentage="item.completion_progress" :color="colors" :width="60"></el-progress>
            </div>
            <p style="font-size:12px;padding:5px 0;margin-top:10px;">{{item.update_time.substr(0,10)}}</p>
            <!-- <div class="create">
              <el-button type="info" icon="el-icon-edit" circle @click="edit(item.id)"></el-button>
            </div> -->
          </div>
          <div class="box" @click="dialogFormVisible = true">
            <div class="create">
              <i class="el-icon-edit"></i>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="选择简历模板" @close="handleClose" :visible.sync="dialogFormVisible" style="text-align:left;">
      <el-form :model="form" ref="form">
        <el-form-item label="选择模板">
          <div class="style_list">
            <el-radio-group v-model="form.style_index">
              <div class="style_one">
                <div class="demo-image__preview">
                  <el-image 
                    style="width: 100px; height: 120px"
                    :src="cur_src" 
                    :preview-src-list="srcList">
                  </el-image>
                </div>
                <div class="style_check">
                  <slot></slot> 
                  <el-radio label="-1"><span style="font-size:12px;font-weight:500;">默认</span></el-radio>
                </div>
              </div>
              <div class="style_one" v-for="(item,index) in style_list" :key="index">
                <div class="demo-image__preview">
                  <el-image 
                    style="width: 100px; height: 120px"
                    :src="item.src" 
                    :preview-src-list="srcList">
                  </el-image>
                </div>
                <div class="style_check">
                  <slot></slot> 
                  <el-radio :label="index"><span>{{item.title}}</span></el-radio>
                </div>
              </div>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="edit()">开始编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import { Message } from 'element-ui';
export default {
  components: {Nav},
  name: 'Home',
  data () {
    return {
      dialogFormVisible:false,
      form:{
        style_index:'-1'
      },
      cur_src:"./static/img/style_temp/temp1.png",
      srcList: [],
      style_list: [],
      list:"",
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },
  methods: {
    handleClose(){

    },
    edit(id) {
      if (this.$util.getUserName() == '') {
        Message.error({
          message: '未登录授权',
          duration: 1000
        });
        return
      }

      if (this.form.style_index == -1) {//默认模板
        if (id == undefined) {
          this.$router.push('/resume')
        } else {
          this.$router.push('/resume/' + id)
        }
      } else {
        // if (id == undefined) {
        //   this.$router.push('/resume_plus?type=' + this.style_list[this.form.style_index].temp_id)
        // } else {
        //   this.$router.push('/resume_plus/' + id + this.style_list[this.form.style_index].temp_id)
        // }
        if (id == undefined) {
          this.$router.push({
            path : '/resume_plus',
            query: {
              type : this.style_list[this.form.style_index].temp_id
            }
          })
        } else {
          this.$router.push({
            path : '/resume_plus',
            query: {
              type : this.style_list[this.form.style_index].temp_id
            }
          })
        }
      }
      
    }
  },
  // beforeCreate() {
  //   console.log(1)
  //   console.log(this.list)
  // },
  created() {
    var that = this;
    // 发送axios请求
    this.axios({
      method: 'post',
      url: this.$util.requestDomain+'/jianli_list'
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

    //获取简历模板
    this.axios({
      method: 'post',
      url: this.$util.requestDomain+'/jianli_template_list'
    }).then(function(response) {
      if (response.data.code == 0) {
        for(let i=0;i<response.data.data.length;i++){
          that.style_list.push({
            temp_id: response.data.data[i].temp_id,
            title: response.data.data[i].name,
            src:"./static/img/style_temp/temp" + (i+1) + ".png"
          });
          that.srcList.push("./static/img/style_temp/temp" + (i+1) + ".png")
        }
      } else {
        // Message.error({
        //   message: response.data.msg,
        //   duration: 1000
        // });
      }
    });
  },
  // beforeMount() {
  //   console.log(3)
  //   console.log(this.list)
  // },
  // mounted() {
  //   console.log(4)
  //   console.log(this.list)
  // },
  // beforeUpdate() {
  //   console.log(5)
  //   console.log(this.list)
  // },
  // updated() {
  //   console.log(6)
  //   console.log(this.list)
  // },
  // beforeDestroy() {
  //   console.log(7)
  //   console.log(this.list)
  // },
  // destroyed() {
  //   console.log(8)
  //   console.log(this.list)
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  width: 100%;
  height:100%;
}
.el-row {
  margin-bottom: 20px;
  height:100%;
}
.el-col {
  border-radius: 4px;
  height:100%;
  background: rgb(215, 224, 228);
}
.title {
  height: 150px;
  background: rgb(223, 195, 195);
  overflow: hidden;
}
.title h4 {
  width: 60%;
  height: 100px;
  line-height: 100px;
  margin: 20px auto 0;
}
.jianli {
  width: 100%;
  height: auto;
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
.jianli_name {
  height:30px;
  line-height: 30px;
}
.jindu{
  width:60px;
  height:60px;
  margin:0 auto;
  font-size: 12px;
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
/* 垂直滚动条 */
.style_list{
  width:auto;
  height:207px;
  /* border: 1px rgb(201, 200, 200) solid; */
  background: #e0e2e7;
  margin-top:50px;
  overflow: scroll;
}
.style_one{
  width:100px;
  height:160px;
  margin:20px 10px 10px;
  float: left;
}
.style_check{
  width:100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.my_style{
  width:100px;
  height:120px;
  line-height:150px;
  text-align:center;
}
</style>