<template>
  <div class="edit">
    <el-row :gutter="24" style="margin:0;">
      <el-col :xl="{span:12, offset:5}" :lg="{span:12, offset:4}" :md="{span:15, offset:1}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;">
        <div class="title">
          <h4>简历助手工具 plus</h4>
        </div>
        <div class="content">
          <!-- 动态加载简历组件模块 -->
          <ModuleEdit @saveListData="saveListData" v-for="(app,index) in modules" :key="index" v-show="app.show" v-bind:refName="app.ref" v-bind="app.data"></ModuleEdit>
        </div>
      </el-col>
      <el-col :xl="{span:5, offset:1}" :lg="{span:5, offset:1}" :md="{span:5, offset:1}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;position:relation;">
        <div class="oprate-box">
          <el-progress type="dashboard" :percentage="completion_progress" :color="progress_colors" :width="60"></el-progress>
          <el-input v-model="name" placeholder="简历名称"></el-input>
          <div class="module_list">
            <div class="module" v-for="(app,index) in modules" :key="index" draggable="true"
            @dragstart="handleDragStart($event, index)"
           @dragover.prevent="handleDragOver($event, index)"
           @dragenter="handleDragEnter($event, index)"
           @dragend="handleDragEnd($event, index)">
              <el-checkbox v-model="app.show" :disabled="index == 0"></el-checkbox><span class="module_name">{{app.data.ModuleData.module_name}}</span>
              <!-- <div class="mengceng"></div> -->
            </div>
          </div>
          <div class="save">
            <el-button v-if="this.id != undefined" type="danger" size="small" @click="beforeDel()">删除</el-button>
            <el-button v-if="this.id != undefined" type="success" size="small" @click="dialogFormVisible = true">导出</el-button>
            <el-button type="primary" size="small" @click="beforeSave()">保存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="导出简历" @close="handleClose" :visible.sync="dialogFormVisible" style="text-align:left;">
      <el-form :model="exportForm" ref="exportForm">
        <el-form-item label="文件类型">
          <el-radio-group v-model="exportForm.file_type">
            <el-radio label="doc"></el-radio>
            <el-radio label="pdf"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择样式">
          <div class="style_list">
            <el-radio-group v-model="exportForm.style_index">
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
                <el-radio :label="index"><span></span></el-radio>
              </div>
            </div>
            <div class="style_one">
              <div class="my_style">
                <el-color-picker
                  v-model="my_style_color"
                  :predefine="predefineColors">
                </el-color-picker>
              </div>
              <div class="style_check">
                <slot></slot> 
                <el-radio label="-1"><span style="font-size:12px;font-weight:500;">自定义</span></el-radio>
              </div>
            </div>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="beforeExport()">导出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { Message } from 'element-ui';
import ModuleEdit from '@/components/ModuleEdit'
export default {
  components: {ModuleEdit},
  name: 'JianLiPlusEdit',
  data() {
    return {
      id:this.$route.params.id,
      temp_id:this.$route.query.type,
      completion_progress:0,//完成进度
      name:"",
      loading:null,
      progress_colors: [//进度颜色
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      exportForm: {//导出选择表单
        file_type:"doc",
        style_index:0
      },
      my_style_color: '#FF4500',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
      dragging:null,
      ending:null,
      dialogFormVisible:false,
      srcList: [],
      style_list: [],
      modules:[],
    }
  },
  methods: {
    handleDragStart (e, index) {
      this.dragging = index
    },
    handleDragEnd (e, index) {
      if (this.ending === this.dragging
      || this.ending == 0
      || this.dragging == 0) {
        return
      }
      //交换位置
      let obj = this.modules[this.dragging];
      this.modules[this.dragging] = this.modules[this.ending];
      this.modules[this.ending] = obj;

      //重新渲染列表
      this.$forceUpdate()
      this.$nextTick(() => {
        this.dragging = null
        this.ending = null
      })
    },
    handleDragOver (e,index) {
      // 首先把div变成可以放置的元素，即重写dragenter/dragover
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter (e, index) {
      e.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
      this.ending = index
    },
    handleClose() {
      this.$refs['exportForm'].resetFields();
    },
    saveListData(param) {
      var list = param[0];
      var module_name = param[1];
      for (var i=0;i<this.modules.length;i++) {
        if (this.modules[i].data.ModuleData.list_data == null) {
          this.modules[i].data.ModuleData.list_data = [];
        }
        if (this.modules[i].data.ModuleData.module_name == module_name) {
          this.modules[i].data.ModuleData.list_data = list;
          break;
        }
      }
    },
    beforeDel() {
      this.$confirm('将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        this.del()
      }).catch(() => {
        console.log("取消了删除")
      });
    },
    del() {
      var that = this;
      this.axios({
        method: 'post',
        url: this.$util.requestDomain+'/del_jianli_plus',
        data: {id: parseInt(that.id)}
      }).then(function(response) {
        if (response.data.code == 0) {
          Message.success({
            message: '删除成功',
            duration: 1000
          });
          that.$router.push('/');
        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });
    },
    beforeExport() {
      this.$confirm('将导出word文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        lockScroll: false
      }).then(() => {
        this.loading = this.$loading({
          lock: true,
          text: '导出中, 请等候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.export()
      }).catch(() => {
        // console.log("取消了导出")
      });
    },
    export() {
      let color
      if(this.exportForm.style_index == -1){
        color = this.my_style_color.substr(1)
      } else {
        color = this.style_list[this.exportForm.style_index].color
      }
      this.dialogFormVisible=false
      var that = this;
      this.axios({
        method: 'post',
        responseType: 'blob',
        url: this.$util.requestDomain+'/export_jianli_plus',
        data: {id: parseInt(that.id), color: color, file_type: this.exportForm.file_type}
      }).then(function(response) {
        if (response.status == 200) {
          let reader = new FileReader(); // 创建读取文件对象
          reader.readAsText(response.data, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8
          reader.addEventListener("loadend", function () { // 
            try {
              let res = JSON.parse(reader.result); // 返回的数据
              if (res.code) {//是json
                if (that.loading != null) {
                  that.loading.close();
                  that.loading = null;
                }
                Message.error({
                  message: res.msg,
                  duration: 1000
                });
                return
              }
            } catch(err) {//是文件
              if (that.loading != null) {
                that.loading.close();
                that.loading = null;
              }
              Message.success({
                message: '导出成功',
                duration: 1000
              });
              var contentType
              if (that.exportForm.file_type == 'pdf') {
                contentType = `application/pdf`
              } else {
                contentType = `application/msword`
              }
              let url = window.URL.createObjectURL(new Blob([response.data], {
                type: contentType //word文档为msword,pdf文档为pdf
              }));
              let link= document.createElement('a');
              link.style.display='none';
              link.href=url;

              let jianli_name = that.name;
              link.setAttribute('download', jianli_name);
              document.body.appendChild(link);
              link.click();
            }
          });
        } else {
          if (that.loading != null) {
            that.loading.close();
            that.loading = null;
          }
          Message.error({
            message: '操作失败',
            duration: 1000
          });
        }
      });
    },
    beforeSave() {
      //校验各个表单

      this.$confirm('将修改信息保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        lockScroll: false
      }).then(() => {
        this.save()
      }).catch((err) => {
        console.log("取消了保存")
      });
    },
    save() {
      var saveData = {}
      var module_config = []
      for(var i=0;i<this.modules.length;i++){
        module_config.push({
          label: this.modules[i].data.ModuleData.module_name,
          module:this.modules[i].ref,
          ref:this.modules[i].ref,
          show:this.modules[i].show,
          draggable:true
        })
      }

      saveData.temp_id = parseInt(this.temp_id);
      saveData.name = this.name;
      saveData.modules = this.modules;
      saveData.module_config = module_config;

      var that = this;

      if (this.id == undefined) {
        // 发送axios请求
        this.axios({
          method: 'post',
          url: this.$util.requestDomain+'/save_jianli_plus',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
            Message.success({
              message: '保存成功',
              duration: 1000
            });
            that.id = response.data.data.last_id
            that.completion_progress = response.data.data.completion_progress
            that.$router.push({
              path : '/resume_plus/' + response.data.data.last_id,
              query: {
                type : that.temp_id
              }
            })
          } else {
            Message.error({
              message: response.data.msg,
              duration: 1000
            });
          }
        });
      } else {
        saveData.id = parseInt(this.id);
        // 发送axios请求
        this.axios({
          method: 'post',
          url: this.$util.requestDomain+'/update_jianli_plus',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
            Message.success({
              message: '保存成功',
              duration: 1000
            });
            that.completion_progress = response.data.data.completion_progress
          } else {
            Message.error({
              message: response.data.msg,
              duration: 1000
            });
          }
        });
      }
    }
  },
  created() {
    if (this.id == undefined) {
      //查询
      var that = this;
      // 发送axios请求
      this.axios({
        method: 'post',
        url: this.$util.requestDomain+'/jianli_template_detail',
        data: {temp_id: parseInt(that.temp_id)}
      }).then(function(response) {
        console.log(response.data)
        if (response.data.code == 0) {
          var data = response.data.data;
          that.modules = data.modules
          var imgSrc
          if (response.data.data.img != "") {
            imgSrc = that.$util.requestDomain + '/image/' + response.data.data[i].img + '.png'
          } else {
            imgSrc = ""
          } 
          that.style_list.push({
            color:"7BA1AF",
            src: imgSrc
          });
          that.srcList.push(imgSrc)

        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });
    } else {
      //查询
      var that = this;
      // 发送axios请求
      this.axios({
        method: 'post',
        url: this.$util.requestDomain+'/jianli_template_detail',
        data: {temp_id: parseInt(that.temp_id)}
      }).then(function(response) {
        if (response.data.code == 0) {
          var data = response.data.data;
          var imgSrc
          if (data.img != "") {
            imgSrc = that.$util.requestDomain + '/image/' + data.img + '.png'
          } else {
            imgSrc = ""
          } 
          that.style_list.push({
            color:"7BA1AF",
            src: imgSrc
          });
          that.srcList.push(imgSrc)

        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });

      //查询
      var that = this;
      // 发送axios请求
      this.axios({
        method: 'post',
        url: this.$util.requestDomain+'/jianli_plus_detail',
        data: {id: parseInt(that.id)}
      }).then(function(response) {
        if (response.data.code == 0) {
          var data = response.data.data;
          that.name = data.name
          that.module_config = data.module_config
          that.modules = data.modules
          that.completion_progress = data.completion_progress
        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
}
.el-row {
  height: 100%;
  margin-bottom: 20px;
}
.el-col {
  height:100%;
}
.title {
  height: 70px;
  line-height: 70px;
  background: rgb(219, 184, 184);
  letter-spacing: 3px;
}
.title h4 {
  text-align: center;
  color: rgb(67, 78, 78);
}
.content {
  width:100%;
  height:90%;
  margin-top:20px;
  border: 1px rgb(201, 200, 200) solid;
  overflow: hidden;
  overflow-y: scroll;
}
.save {
  width:100%;
  height:80px;
  line-height:80px;
}

.oprate-box{
  max-width:326px;
  height:500px;
  margin:100px auto;
  padding:0 25px;
  border: 1px rgb(241, 237, 237) solid;
}
.module_list{
  width:250px;
  height:auto;
  margin:20px auto;
}
.module{
  width:100%;
  height:30px;
  line-height:30px;
  text-align:left;
  text-indent:5px;
  position:relative;
}
.mengceng{
  width:100%;
  height:30px;
  position: absolute;
  top:0;
  z-index: 999;
}
.module:hover{
  background:rgb(231, 228, 228);
}
.module_name{
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}
/* 水平滚动条 */
/* .style_list{
  width:400px;
  height:190px;
  border: 1px rgb(201, 200, 200) solid;
  white-space: nowrap;
  margin-top:50px;
  overflow: hidden;
  overflow-x: scroll;
}
.style_one{
  display: inline-block;
  width:100px;
  height:160px;
  margin:20px 10px 10px;
} */

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
