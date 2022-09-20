<template>
  <div class="edit">
    <el-row :gutter="24" style="margin:0;">
      <el-col :xl="{span:12, offset:5}" :lg="{span:12, offset:4}" :md="{span:15, offset:1}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;">
        <div class="title">
          <h4>简历助手工具</h4>
        </div>
        <div class="content">
          <!-- 动态加载简历组件模块 -->
          <component @sortData="sortData" v-for="(app,index) in modules" :key="index" :is="app.module" v-show="app.show" v-bind:ref="app.ref" v-bind="app.data"></component>
        </div>
      </el-col>
      <el-col :xl="{span:5, offset:1}" :lg="{span:5, offset:1}" :md="{span:5, offset:1}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;position:relation;">
        <div class="oprate-box" id="oprate-box">
          <el-progress class="progress" type="dashboard" :percentage="completion_progress" :color="progress_colors" :width="60"></el-progress>
          <el-input class="jianli_name" v-model="name" placeholder="简历名称"></el-input>
          <div class="module_list">
            <div class="module" v-for="(app,index) in modules" :key="index" draggable="true"
            @dragstart="handleDragStart($event, index)"
           @dragover.prevent="handleDragOver($event, index)"
           @dragenter="handleDragEnter($event, index)"
           @dragend="handleDragEnd($event, index)">
              <el-checkbox v-model="app.show" :disabled="app.module == 'PersonalIntroduction' || app.module == 'JobIntension'"></el-checkbox><span class="module_name">{{app.label}}</span>
              <div v-if="app.module == 'PersonalIntroduction' || app.module == 'JobIntension'" class="mengceng"></div>
            </div>
          </div>
          <div class="save">
            <el-button v-if="this.id != undefined" type="danger" size="small" @click="beforeDel()">删除</el-button>
            <el-button v-if="this.id != undefined" type="success" size="small" @click="checkExport()">导出</el-button>
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
import PersonalIntroduction from "@/components/jianli/PersonalIntroduction"
import JobIntension from "@/components/jianli/JobIntension"
import RelatedSkills from "@/components/jianli/RelatedSkills"
import EducationExperience from "@/components/jianli/EducationExperience"
import WorkExperience from "@/components/jianli/WorkExperience"
import ProjectExperience from "@/components/jianli/ProjectExperience"
import PersonalSummary from "@/components/jianli/PersonalSummary"

import { Message } from 'element-ui';

export default {
  components: {PersonalIntroduction,JobIntension,RelatedSkills,EducationExperience,WorkExperience,ProjectExperience,PersonalSummary},
  name: 'JianLiEdit',
  data() {
    return {
      id:this.$route.params.id,
      completion_progress:0,//完成进度
      name:"",
      src_name:"",
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
      srcList: [
        "/static/img/style_temp/temp1.png",
        "/static/img/style_temp/temp2.png",
        "/static/img/style_temp/temp3.png",
      ],
      style_list: [
        {
          color:"7BA1AF",
          src:"/static/img/style_temp/temp1.png"
        },
        {
          color:"F4B183",
          src:"/static/img/style_temp/temp2.png"
        },
        {
          color:"DBB8B8",
          src:"/static/img/style_temp/temp3.png"
        },
      ],
      modules: [
        {
          label: '基本信息',
          module:"PersonalIntroduction",
          ref:"personalIntroduction",
          data:{PersonalIntroductionData:{
            name:"",
            sex:"",
            birthdate:"",
            email:"",
            phone:""
          }},
          show:true,
          draggable:true
        },
        {
          label: '求职意向',
          module:"JobIntension",
          ref:"jobIntension",
          data:{JobIntensionData:{
            name:"",
            sex:"",
            birthdate:"",
            email:"",
            phone:""
          }},
          show:true,
          draggable:true
        },
        {
          label: '相关技能',
          module:"RelatedSkills",
          ref:"relatedSkills",
          data:{RelatedSkillsData:{
            skills:""
          }},
          show:true,
          draggable:true
        },
        {
          label: '教育经历',
          module:"EducationExperience",
          ref:"educationExperience",
          data:{EducationExperienceData:[]},
          show:true,
          draggable:true
        },
        {
          label: '工作经历',
          module:"WorkExperience",
          ref:"workExperience",
          data:{WorkExperienceData:[]},
          show:true,
          draggable:true
        },
        {
          label: '项目经验',
          module:"ProjectExperience",
          ref:"projectExperience",
          data:{ProjectExperienceData:[]},
          show:true,
          draggable:true
        },
        {
          label: '个人总结',
          module:"PersonalSummary",
          ref:"personalSummary",
          data:{PersonalSummaryData:{
            summary:""
          }},
          show:true,
          draggable:true
        },
      ],
      src_modules: null,
      intro: null,
    }
  },
  methods: {
    handleDragStart (e, index) {
      this.dragging = index
    },
    handleDragEnd (e, index) {
      var module_list = ["PersonalIntroduction","JobIntension"];
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
    checkExport(){
      if (this.checkEdit() == false) {
        this.$confirm('简历信息未保存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          lockScroll: false
        }).then(() => {
          setTimeout(()=>{
            this.dialogFormVisible=true
          }, 500) //解决弹框跳转闪烁问题
        }).catch(() => {
          // console.log("取消了导出")
        });
      } else {
        this.dialogFormVisible=true
      }
    },
    beforeExport() {
      this.$confirm('将导出'+this.exportForm.file_type+'文档, 是否继续?', '提示', {
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
        url: this.$util.requestDomain+'/export_jianli',
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
              if (that.loading != null) {
                that.loading.close();
                that.loading = null;
              }
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
      // var flag = this.$refs['baseInfo'][0].handleSubmit();

      // if (!flag) {
      //   this.$alert('未填写必填项', '提示', {
      //     type: 'warning',
      //     showConfirmButton: '确定',
      //     lockScroll: false
      //   })
      //   return
      // }

      if (this.name == '') {
        this.$alert('简历名称未填写', '提示', {
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
        // console.log("取消了保存")
      });
    },
    save() {
      if (this.checkEdit()) {
        //未做修改
        Message.success({
          message: '保存成功',
          duration: 1000
        });
        return
      }
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
      saveData.name = this.name;
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
            that.src_modules = JSON.stringify(that.modules)
            that.src_name = that.name
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
            that.src_modules = JSON.stringify(that.modules)
            that.src_name = that.name
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
    },
    sortData(module,data){
      for(var i=0;i<this.modules.length;i++){
        if (this.modules[i].module == "ProjectExperience" && module == "ProjectExperience") {
          this.modules[i].data.ProjectExperienceData = data;
        }
      }
    },
    checkEdit() {
      // console.log(this.src_name)
      // console.log(this.name)
      var a = this.$md5(JSON.stringify(this.modules));
      var b = this.$md5(this.src_modules)
      // console.log(JSON.stringify(this.modules))
      // console.log(this.src_modules)
      if (a != b || this.src_name != this.name) {
        // console.log('修改未保存')
        return false
      }
      return true
    },
    beforeunloadHandler(e) {
      if (this.intro != null) {
        this.intro.exit()
      }
      e = e || window.event;
      var that = this
      if ((this.$route.name == 'JianLiUpdate' || this.$route.name == 'JianLiEdit') && this.checkEdit() == false) {
        // setTimeout(function(){
        //   that.$confirm('简历信息未保存, 是否离开?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning',
        //     lockScroll: false,
        //     closeOnClickModal:false,
        //     center:false
        //   }).then(() => {
        //     // next()
        //   }).catch((err) => {
        //     // console.log("取消了保存")
        //     // next(false)
        //   });
        // }, 100)
        // e.preventDefault()
        e.returnValue = '您在页面编辑了未保存，是否确认离开'
        return '您在页面编辑了未保存，是否确认离开'
        // e.returnValue = '';
      }
    },
  },
  beforeRouteLeave(to, from, next){
      // 导航离开当前路由的时候被调用，this可以被访问到
      // console.log(this) // 可以访问this
      // console.log('beforeRouteLeave')
      var that = this;
      if ((from.name == 'JianLiUpdate' || from.name == 'JianLiEdit') && that.checkEdit() == false) {
        // console.log("未保存")
        setTimeout(function(){
          that.$confirm('简历信息未保存, 是否离开?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            lockScroll: false,
            closeOnClickModal:false,
            center:false
          }).then(() => {
            next()
          }).catch((err) => {
            // console.log("取消了保存")
            next(false)
          });
        }, 100)
      } else {
        // console.log("离开")
        next()
      }
  },
  created() {
      //阻止后退的所有动作，包括 键盘、鼠标手势等产生的后退动作。
      // history.pushState(null, null, window.location.href);
      // window.addEventListener("popstate", function () {
      //   history.pushState(null, null, window.location.href);
      // });

    if (this.id == undefined) {
      this.src_modules = JSON.stringify(this.modules)
      this.src_name = this.name
      return;
    }
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
        var delIndex = null;
        for(var i=0;i<data.module_config.length;i++){
          data.module_config[i].data = {}
          switch(data.module_config[i].module){
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
            case "BaseInfo":
              //兼容旧数据
              delIndex = i
              break;
          }
        }
        if (delIndex != null) {
          data.module_config.splice(delIndex,1)
        }
        that.name = data.name
        that.modules = data.module_config;
        that.completion_progress = data.completion_progress
        that.src_modules = JSON.stringify(that.modules)
        that.src_name = that.name
      } else {
        Message.error({
          message: response.data.msg,
          duration: 1000
        });
      }
    });
  },
  mounted() {
    window.addEventListener("beforeunload", (e) => {
      this.beforeunloadHandler(e);
    });
    var steps = [
      {
        title: "简历助手提示",
        intro: '欢迎使用简历助手工具', //这是引导提示内容
      },
      {
          element: '.content',
          title: "简历助手提示",
          intro: '这里是简历编辑区域',
          position: 'right'
      },
      {
          element: '.progress',
          title: "简历助手提示",
          intro: '这里是简历完善程度',
          position: 'top'
      },
      {
          element: '.jianli_name',
          title: "简历助手提示",
          intro: '这里填写简历名称',
          position: 'top'
      },
      {
          element: '.module_list',
          title: "简历助手提示",
          intro: '这里是简历的所有模块，可通过鼠标拖动进行调整位置，也可将模块进行隐藏',
          position: 'top'
      },
      {
          element: '.save',
          title: "简历助手提示",
          intro: '这里是简历操作区域，可进行简历保存，导出，删除等操作',
          position: 'top'
      },
      {
          title: "简历助手提示",
          intro: '祝你使用愉快',
      }
    ]
    

    this.$nextTick(() => {
      if (localStorage.getItem('jianli_isFirst') === null || localStorage.getItem('jianli_isFirst') !== '1') {
        this.intro = this.$intro().setOptions({
          prevLabel: "上一步",
          nextLabel: "下一步",
          doneLabel: "完成",
          exitOnOverlayClick: false,
          steps:steps
        }).oncomplete(()=> {
          //点击结束按钮后执行的事件
          localStorage.setItem('jianli_isFirst', 1)
        }).onexit(()=> {
          //点击跳过按钮后执行的事件
          localStorage.setItem('jianli_isFirst', 1)
        })

        this.intro.start()
      }     
    })

  //   curIntro.setOptions({
  //     prevLabel: `上一步`,
  //     nextLabel: `下一步`,
  //     skipLabel: `跳过`,
  //     doneLabel: `完成`,
  //     tooltipPosition: `bottom` /* 引导说明框相对高亮说明区域的位置 */,
  //     hidePrev: `true`, // 隐藏第一步中的上一个按钮
  //     tooltipClass: `` /* 引导说明文本框的样式 */,
  //     highlightClass: `` /* 说明高亮区域的样式 */,
  //     exitOnOverlayClick: false /* 是否允许点击空白处退出 */,
  //     showStepNumbers: false /* 是否显示说明的数据步骤*/,
  //     keyboardNavigation: false /* 是否允许键盘来操作 */,
  //     showButtons: true /* 是否按键来操作 */,
  //     showBullets: true /* 是否使用点点点显示进度 */,
  //     showProgress: false /* 是否显示进度条 */,
  //     scrollToElement: true /* 是否滑动到高亮的区域 */,
  //     overlayOpacity: 0.6 /* 遮罩层的透明度 */,
  //     positionPrecedence: [`bottom`, `top`, `right`, `left`] /* 当位置选择自动的时候，位置排列的优先级 */,
  //     disableInteraction: false, /* 是否禁止与元素的相互关联 */
  //     hintPosition: 'top-middle',
  //     steps: allSteps
  // })
  },
  beforeDestroy() {
    if(this.intro != null) {
      this.intro.exit()
    }
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) => {
      this.beforeunloadHandler(e);
    });
  },
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
  /* position:fixed; */
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
