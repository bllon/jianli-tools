<template>
  <div class="edit">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="12" :offset="6" style="padding-left:0;padding-right:0;">
        <div class="title">
          <h4>简历助手工具</h4>
        </div>
        <div class="content">
          <!-- 动态加载简历组件模块 -->
          <ModuleEdit v-for="(app,index) in modules" :key="index" v-show="app.show" v-bind:refName="app.ref" v-bind="app.data"></ModuleEdit>
        </div>
      </el-col>
      <el-col :span="5" :offset="1" style="padding-left:0;padding-right:0;position:relation;">
        <div class="oprate-box">
          <el-progress type="dashboard" :percentage="completion_progress" :color="progress_colors" :width="60"></el-progress>
          <div class="module_list">
            <div class="module" v-for="(app,index) in modules" :key="index" draggable="true"
            @dragstart="handleDragStart($event, index)"
           @dragover.prevent="handleDragOver($event, index)"
           @dragenter="handleDragEnter($event, index)"
           @dragend="handleDragEnd($event, index)">
              <el-checkbox v-model="app.show"></el-checkbox><span class="module_name">{{app.data.ModuleData.module_name}}</span>
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
      id:this.$route.query.id,
      temp_id:this.$route.query.type,
      completion_progress:0,//完成进度
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
      srcList: [
        "./static/img/style_temp/temp1.png",
        "./static/img/style_temp/temp2.png",
        "./static/img/style_temp/temp3.png",
      ],
      style_list: [
        {
          color:"7BA1AF",
          src:"./static/img/style_temp/temp1.png"
        },
        {
          color:"F4B183",
          src:"./static/img/style_temp/temp2.png"
        },
        {
          color:"DBB8B8",
          src:"./static/img/style_temp/temp3.png"
        },
      ],
      modules:[
        {
          ref:"module1",
          editVisible:false,
          removeVisible:false,
          type:0,
          data:{ModuleData:{
              module_name : "基本信息",
              type:0,
              form:[]
            }
          }
        }
      ],
    }
  },
  methods: {
    handleDragStart (e, index) {
      this.dragging = index
    },
    handleDragEnd (e, index) {
      var module_list = ["BaseInfo","PersonalIntroduction","JobIntension"];
      if (this.ending === this.dragging
      || module_list.indexOf(this.modules[this.dragging].module) > -1
      || module_list.indexOf(this.modules[this.ending].module) > -1) {
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
        url: this.$util.requestDomain+'/del_jianli',
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
        this.export()
      }).catch(() => {
        console.log("取消了导出")
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
        url: this.$util.requestDomain+'/export_jianli',
        data: {id: parseInt(that.id), color: color}
      }).then(function(response) {
        if (response.status == 200) {
          let reader = new FileReader(); // 创建读取文件对象
          reader.readAsText(response.data, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8
          reader.addEventListener("loadend", function () { // 
            try {
              let res = JSON.parse(reader.result); // 返回的数据
              if (res.code) {//是json
                Message.error({
                  message: res.msg,
                  duration: 1000
                });
                return
              }
            } catch(err) {//是文件
              Message.success({
                message: '导出成功',
                duration: 1000
              });
              let url = window.URL.createObjectURL(new Blob([response.data], {
                type: `application/msword` //word文档为msword,pdf文档为pdf
              }));
              let link= document.createElement('a');
              link.style.display='none';
              link.href=url;

              let jianli_name = "我的简历";
              for(var i=0;i<that.modules.length;i++){
                switch(that.modules[i].module){
                  case "BaseInfo":
                    jianli_name = that.modules[i].data.BaseInfoData.jianli_name;
                    break;
                }
              }

              link.setAttribute('download', jianli_name);
              document.body.appendChild(link);
              link.click();
            }
          });
        } else {
          Message.error({
            message: '操作失败',
            duration: 1000
          });
        }
      });
    },
    beforeSave() {
      //校验各个表单
      var flag = this.$refs['baseInfo'][0].handleSubmit();

      if (!flag) {
        this.$alert('未填写必填项', '提示', {
          type: 'warning',
          showConfirmButton: '确定',
          lockScroll: false
        })
        return
      }

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
          label: this.modules[i].label,
          module:this.modules[i].module,
          ref:this.modules[i].ref,
          show:this.modules[i].show,
          draggable:this.modules[i].draggable
        })

        switch(this.modules[i].module){
          case "BaseInfo":
            saveData.base_info = this.modules[i].data.BaseInfoData;
            break;
          case "PersonalIntroduction":
            saveData.personal_introduction = this.modules[i].data.PersonalIntroductionData;
            break;
          case "JobIntension":
            saveData.job_intension = this.modules[i].data.JobIntensionData;
            break;
          case "RelatedSkills":
            saveData.related_skills = this.modules[i].data.RelatedSkillsData;
            break;
          case "EducationExperience":
            saveData.education_experience = this.modules[i].data.EducationExperienceData;
            break;
          case "WorkExperience":
            saveData.work_experience = this.modules[i].data.WorkExperienceData;
            break;
          case "ProjectExperience":
            saveData.project_experience = this.modules[i].data.ProjectExperienceData;
            break;
          case "PersonalSummary":
            saveData.personal_summary = this.modules[i].data.PersonalSummaryData;
            break;
        }
      }
      saveData.module_config = module_config;
      var that = this;

      if (this.id == undefined) {
        // 发送axios请求
        this.axios({
          method: 'post',
          url: this.$util.requestDomain+'/save_jianli',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
            Message.success({
              message: '保存成功',
              duration: 1000
            });
            that.id = response.data.data.last_id
            that.completion_progress = response.data.data.completion_progress
            that.$router.push('/resume/'+response.data.data.last_id);
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
          url: this.$util.requestDomain+'/update_jianli',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
            that.completion_progress = response.data.data.completion_progress
            Message.success({
              message: '保存成功',
              duration: 1000
            });
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
        if (response.data.code == 0) {
          var data = response.data.data;
          that.name = data.name
          that.modules = data.modules
        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });
      return;
    } else {
      //查询
      var that = this;
      // 发送axios请求
      this.axios({
        method: 'post',
        url: this.$util.requestDomain+'/jianli_detail',
        data: {id: parseInt(that.id)}
      }).then(function(response) {
        if (response.data.code == 0) {
          var data = response.data.data;
          for(var i=0;i<data.module_config.length;i++){
            data.module_config[i].data = {}
            switch(data.module_config[i].module){
              case "BaseInfo":
                data.module_config[i].data.BaseInfoData = data.base_info;
                break;
              case "PersonalIntroduction":
                data.module_config[i].data.PersonalIntroductionData = data.personal_introduction;
                break;
              case "JobIntension":
                data.module_config[i].data.JobIntensionData = data.job_intension;
                break;
              case "RelatedSkills":
                data.module_config[i].data.RelatedSkillsData = data.related_skills;
                break;
              case "EducationExperience":
                data.module_config[i].data.EducationExperienceData = data.education_experience ? data.education_experience : [];
                break;
              case "WorkExperience":
                data.module_config[i].data.WorkExperienceData = data.work_experience ? data.work_experience : [];
                break;
              case "ProjectExperience":
                data.module_config[i].data.ProjectExperienceData = data.project_experience ? data.project_experience : [];
                break;
              case "PersonalSummary":
                data.module_config[i].data.PersonalSummaryData = data.personal_summary ? data.personal_summary : {};
                break;
            }
          }
          that.modules = data.module_config;
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
  overflow: hidden;
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
  width:auto;
  height:500px;
  margin-top:100px;
  padding:0 25px;
  border: 1px rgb(241, 237, 237) solid;
  position:fixed;
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
