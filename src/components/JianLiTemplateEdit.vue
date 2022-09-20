<template>
  <div class="edit" @dragover.prevent="handleDragOver($event)">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="5" :offset="0" style="padding-left:0;padding-right:0;position:relation;" class="form-pro">
        <div class="module_component">
          <FormComponent @addFormComponent="addFormComponent"></FormComponent>
        </div>
        <div class="oprate-left-box">
          <div class="module_oprate">
            <el-button type="primary" size="small" @click="dialogFormVisible = true">增加模块</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12" :offset="1" style="padding-left:0;padding-right:0;background: rgb(215, 224, 228);">
        <div class="title">
          <h4>{{name}}</h4>
        </div>
        <div class="content">
          <Module @setCurrentModule="setCurrentModule" v-for="(app,index) in modules" :key="index" v-bind:refName="app.ref" v-bind="app.data"></Module>
        </div>
      </el-col>

      <!-- 右侧操作区域start -->
      <el-col :span="5" :offset="1" style="padding-left:0;padding-right:0;position:relation;background: rgb(215, 224, 228);">
        <div v-if="modules.length == 0" style="margin-top:100px;padding:5px 10px;line-height:40px;font-size:14px;">
          <p>暂无模块</p>
          <p>点击左侧添加模块，通过拖拽表单控件到指定模块内</p>
        </div>
        <div class="oprate-right-box">
          <!-- 模块列表 -->
          <div class="module_list">
            <el-input v-model="name" placeholder="模板名称"></el-input>
            <div class="module" v-for="(app,index) in modules" :key="index">
              <div class="module-title" draggable="true"
            @dragstart="handleDragStart($event, index)"
           @dragover.prevent="handleDragOver($event, index)"
           @dragenter="handleDragEnter($event, index)"
           @dragend="handleDragEnd($event, index)">
                <span class="module_name">{{app.data.ModuleData.module_name}}</span>
                <el-popover
                  placement="bottom"
                  width="160"
                  v-model="app.removeVisible">
                  <p>确定删除 "{{app.data.ModuleData.module_name}}" 吗?</p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="info" @click="app.removeVisible = false">取消</el-button>
                    <el-button size="mini" type="primary" @click="delModule(index)">确定</el-button>
                  </div>
                  <i class="el-icon-remove-outline module-child-oprate" slot="reference" style="float:right;"></i>
                </el-popover>
                <el-popover
                  placement="bottom"
                  width="250"
                  v-model="app.editVisible">
                  <el-form :inline="true" size="mini" class="module_input_form">
                    <el-form-item label="标题">
                      <el-input v-model="app.data.ModuleData.module_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <i class="el-icon-edit module-child-oprate" slot="reference" style="float:right;"></i>
                </el-popover>
              </div>
              <!-- 控件列表 -->
              <div class="module-child" v-for="(formItem,k) in app.data.ModuleData.form" :key="k">
                <span class="module-child-name">{{formItem.label}}</span>
                <!-- 编辑控件 -->
                <el-popover
                  placement="bottom"
                  width="250"
                  v-model="formItem.editVisible">
                  <el-form :inline="true" size="mini" class="module_input_form">
                    <el-form-item label="标题">
                      <el-input v-model="formItem.label"></el-input>
                    </el-form-item>
                    <el-form-item v-if="formItem.type != 'date' && formItem.type != 'date-group' && formItem.type != 'textarea'" label="默认值">
                      <el-input v-model="formItem.value"></el-input>
                    </el-form-item>

                    <el-form-item v-if="formItem.type == 'date'" label="默认值" style="text-align:left;">
                      <el-col :span="24" style="padding:0;">
                        <el-date-picker type="date" v-model="formItem.value" style="width:100%;"></el-date-picker>
                      </el-col>
                    </el-form-item>

                    <el-form-item v-if="formItem.type == 'date-group'" label="默认值">
                      <el-form-item label="">
                        <el-col :span="24" style="padding-left:0;padding-right:0;">
                          <el-date-picker type="date" v-model="formItem.value1" placeholder="" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="24" style="text-align:left;">-</el-col>
                        <el-col :span="24" style="padding-left:0;padding-right:0;">
                          <el-date-picker type="date" v-model="formItem.value2" placeholder="" style="width: 100%;"></el-date-picker>
                        </el-col>
                      </el-form-item>
                    </el-form-item>

                    <div v-if="formItem.type == 'select'">
                      <div style="text-align:left;padding-left:30px;">
                        选项<i class="el-icon-circle-plus-outline module-child-oprate" @click="addSelectOpt(index,k)"></i></div>
                      <el-form-item v-for="(opt,j) in formItem.list" :key="j" :label="opt.label">
                        <el-input v-model="opt.value" style="width:80%;"></el-input>
                        <i class="el-icon-remove-outline module-child-oprate" style="float:right;" @click="delSelectOpt(index,k,j)"></i>
                      </el-form-item>
                    </div>
                    <el-form-item v-if="formItem.type == 'textarea'" label="文本框">
                      <el-input type="textarea" v-model="formItem.value" rows="3" resize="none" style="width: 80%;"></el-input>
                    </el-form-item>
                  </el-form>
                  
                  <i class="el-icon-edit module-child-oprate" slot="reference"></i>
                </el-popover>
                <!-- 删除控件 -->
                <el-popover
                  placement="bottom"
                  width="160"
                  v-model="formItem.removeVisible">
                  <p>确定删除 "{{formItem.label}}" 吗?</p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="info" @click="formItem.removeVisible = false">取消</el-button>
                    <el-button size="mini" type="primary" @click="delModuleChild(index,k)">确定</el-button>
                  </div>
                  <i class="el-icon-remove-outline module-child-oprate" slot="reference"></i>
                </el-popover>


              </div>
            </div>
          </div>
          <div v-if="modules.length > 0" class="save">
            <el-button v-if="this.id != undefined" type="danger" size="small" @click="beforeDel()">删除</el-button>
            <el-button type="primary" size="small" @click="beforeSave()">保存</el-button>
            <!-- <el-button type="success" size="small" @click="beforeExport()">导出模板</el-button> -->
            <el-button v-if="this.id != undefined" type="success" size="small" @click="createJianLi()">创建简历</el-button>
          </div>
        </div>
      </el-col>
      <!-- 右侧操作区域end -->
    </el-row>

    <!-- 增加模块模态框start -->
    <el-dialog title="添加模块" @close="handleClose" :visible.sync="dialogFormVisible" style="text-align:left;">
      <el-form :model="addModuleForm" ref="addModuleForm" :rules="rules">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="addModuleForm.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="模块类型">
          <el-radio-group v-model="addModuleForm.type">
            <el-radio label="0"><span>标准</span></el-radio>
            <el-radio label="1"><span>列表</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复制模块（可选）">
          <el-select v-model="addModuleForm.copy_module">
            <template v-for="(item,index) in modules" >
              <el-option v-if="addModuleForm.type == item.data.ModuleData.type" :key="index" :label="item.data.ModuleData.module_name" :value="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addModule()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加模块模态框end -->

  </div>
</template>

<script>
import FormComponent from '@/components/FormComponent'
import Module from '@/components/Module'
import { Message } from 'element-ui';
export default {
  components: {FormComponent,Module},
  name: 'JianLiTemplateEdit',
  data() {
    return {
      id:this.$route.params.id,
      name:'',
      visible: false,
      dialogFormVisible:false,
      addModuleForm:{
        name:'',
        type:'0',
        copy_module:''
      },
      rules: {
          name: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
      },
      modules:[
        {
          ref:"module1",
          show:true,
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
      moduleItem:{
        ref:'',
        show:true,
        editVisible:false,
        removeVisible:false,
        type:'',
        data:{ModuleData:{
            module_name : '',
            type:'',
            form:[]
          }
        }
      },
      dragging:null,
      ending:null,
      currentModuleRef:null,
    }
  },
  methods: {
    handleDragStart (e, index) {
      this.dragging = index
    },
    handleDragEnd (e, index) {
      if (this.ending === this.dragging) {
        return
      }
      //交换位置
      let obj = this.modules[this.dragging];
      this.modules[this.dragging] = this.modules[this.ending];
      this.modules[this.ending] = obj;
      
      //交换ref
      var ref = this.modules[this.dragging].ref;
      this.modules[this.dragging].ref = this.modules[this.ending].ref;
      this.modules[this.ending].ref = ref;

      //更新name
      var setName = "formItem-" + this.modules[this.dragging].ref + "-";
      for(let i=0;i<this.modules[this.dragging].data.ModuleData.form.length;i++){
        if (this.modules[this.dragging].data.ModuleData.form[i].type == 'date-group') {
          this.modules[this.dragging].data.ModuleData.form[i].name1 = setName + (i) + "-0";
          this.modules[this.dragging].data.ModuleData.form[i].name2 = setName + (i) + "-1";
        } else {
          this.modules[this.dragging].data.ModuleData.form[i].name = setName + (i);
        }
      }

      setName = "formItem-" + this.modules[this.ending].ref + "-";
      for(let i=0;i<this.modules[this.ending].data.ModuleData.form.length;i++){
        if (this.modules[this.ending].data.ModuleData.form[i].type == 'date-group') {
          this.modules[this.ending].data.ModuleData.form[i].name1 = setName + (i) + "-0";
          this.modules[this.ending].data.ModuleData.form[i].name2 = setName + (i) + "-1";
        } else {
          this.modules[this.ending].data.ModuleData.form[i].name = setName + (i);
        }
      }

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
      this.$refs['addModuleForm'].resetFields();
    },
    beforeExport() {
      this.$confirm('将导出word模板文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        lockScroll: false
      }).then(() => {
        console.log(123)
        this.export()
      }).catch(() => {
        console.log("取消了导出")
      });
    },
    export() {
      var that = this;
      this.axios({
        method: 'post',
        responseType: 'blob',
        url: this.$util.requestDomain+'/export_jianli_template',
        data: {temp_id: parseInt(that.id)}
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

              let jianli_name = that.name;

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
    beforeDel() {
      this.$confirm('将删除该模板, 是否继续?', '提示', {
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
        url: this.$util.requestDomain+'/del_jianli_template',
        data: {temp_id: parseInt(that.id)}
      }).then(function(response) {
        if (response.data.code == 0) {
          Message.success({
            message: '删除成功',
            duration: 1000
          });
          that.$router.push('/muban_center');
        } else {
          Message.error({
            message: response.data.msg,
            duration: 1000
          });
        }
      });
    },
    createJianLi() {
      this.$router.push({
        path : '/resume_plus',
        query: {
          type : this.id
        }
      })
    },
    addModule() {
      let flag = null;
      this.$refs['addModuleForm'].validate((valid) => {
        if(valid){
          flag = true;
        }else{
          flag = false;
        }
      })
      if (!flag){
        return
      }

      var obj
      // console.log(this.addModuleForm)
      if (this.addModuleForm.copy_module !== "") {
        //复制模块
        obj = JSON.parse(JSON.stringify(this.modules[this.addModuleForm.copy_module]));//深拷贝
      } else {
        obj = JSON.parse(JSON.stringify(this.moduleItem));//深拷贝
      }
      obj.type = parseInt(this.addModuleForm.type);
      obj.ref = "module" + (this.modules.length+1);
      obj.data.ModuleData.module_name = this.addModuleForm.name;
      obj.data.ModuleData.type = parseInt(this.addModuleForm.type);

      //更新name
      var setName = "formItem-" + obj.ref + "-";
      for(let i=0;i<obj.data.ModuleData.form.length;i++){
        if (obj.data.ModuleData.form[i].type == 'date-group') {
          obj.data.ModuleData.form[i].name1 = setName + (i) + "-0";
          obj.data.ModuleData.form[i].name2 = setName + (i) + "-1";
        } else {
          obj.data.ModuleData.form[i].name = setName + (i);
        }
      }

      this.modules.push(obj);
      this.dialogFormVisible=false;
    },
    delModule(index){
      this.modules.splice(index,1)
      //更新ref
      for (let i=index+1;i<this.modules.length;i++){
        this.modules[i].ref = 'module' + (i+1)
      }
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
        console.log(err)
        console.log("取消了保存")
      });
    },
    save(){
      var saveData = {
        name:this.name,
        modules:this.modules
      }

      for(let i=0;i<saveData.modules.length;i++) {
        delete saveData.modules[i].name
        saveData.modules[i].editVisible = false;
        saveData.modules[i].removeVisible = false;
        saveData.modules[i].data.ModuleData.editVisible = false;
        saveData.modules[i].data.ModuleData.removeVisible = false;
      }

      var that = this

      if (this.id == undefined) {
        // 发送axios请求
        this.axios({
          method: 'post',
          url: this.$util.requestDomain+'/save_jianli_template',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
            Message.success({
              message: '保存成功',
              duration: 1000
            });
            that.id = response.data.data.last_id
            that.completion_progress = response.data.data.completion_progress
            that.$router.push('/resume/template/edit/'+response.data.data.last_id);
          } else {
            Message.error({
              message: response.data.msg,
              duration: 1000
            });
          }
        });
      } else {
        saveData.temp_id = parseInt(this.id);
        // 发送axios请求
        this.axios({
          method: 'post',
          url: this.$util.requestDomain+'/update_jianli_template',
          data: saveData
        }).then(function(response) {
          if (response.data.code == 0) {
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
    setCurrentModule(param){
      this.currentModuleRef = param[0]
    },
    addFormComponent(param){
      if (this.currentModuleRef == null){
        return
      }

      let index
      for(let i=0;i<this.modules.length;i++){
        if(this.modules[i].ref == this.currentModuleRef){
          index = i;
          break;
        }
      }

      var type = param[0];
      var setName = "formItem-" + this.modules[index].ref + "-" + this.modules[index].data.ModuleData.form.length;
      switch(type){
        case "input":
          this.modules[index].data.ModuleData.form.push({
            type:"input",
            editVisible:false,
            removeVisible:false,
            name:setName,
            label:"输入框",
            value:"",
          })
          break;
        case "select":
          this.modules[index].data.ModuleData.form.push({
            type:"select",
            editVisible:false,
            removeVisible:false,
            name:setName,
            label:"下拉框",
            value:"",
            list:[
              {
                label:"",
                value:""
              },
              {
                label:"",
                value:""
              }
            ]
          })
          break;
        case "date":
          this.modules[index].data.ModuleData.form.push({
            type:"date",
            editVisible:false,
            removeVisible:false,
            name:setName,
            label:"日期",
            value:"",
          })
          break;
        case "date-group":
          this.modules[index].data.ModuleData.form.push({
            type:"date-group",
            editVisible:false,
            removeVisible:false,
            label:"日期范围",
            name1:setName + "-0",
            value1:"",
            name2:setName + "-1",
            value2:""
          })
          break;
        case "textarea":
          this.modules[index].data.ModuleData.form.push({
            type:"textarea",
            editVisible:false,
            removeVisible:false,
            name:setName,
            label:"文本框",
            value:"",
            row:10
          })
          break;
      }
    },
    delModuleChild(index,k){
      this.modules[index].data.ModuleData.form[k].removeVisible=false;
      this.modules[index].data.ModuleData.form.splice(k,1)

      //更新name
      var setName = "formItem-" + this.modules[index].ref + "-";
      for(let i=0;i<this.modules[index].data.ModuleData.form.length;i++){
        if (this.modules[index].data.ModuleData.form[i].type == 'date-group') {
          this.modules[index].data.ModuleData.form[i].name1 = setName + (i) + "-0";
          this.modules[index].data.ModuleData.form[i].name2 = setName + (i) + "-1";
        } else {
          this.modules[index].data.ModuleData.form[i].name = setName + (i);
        }
      }
    },
    addSelectOpt(index,k){//添加select的option
      this.modules[index].data.ModuleData.form[k].list.push({
        label:"",
        value:""
      })
    },
    delSelectOpt(index,k,j){
      if (this.modules[index].data.ModuleData.form[k].list.length == 2) {
        return
      }
      this.modules[index].data.ModuleData.form[k].list.splice(j,1)
    }
  },
  created() {
    if (this.id == undefined) {
      return;
    }
    //查询
    var that = this;
    // 发送axios请求
    this.axios({
      method: 'post',
      url: this.$util.requestDomain+'/jianli_template_detail',
      data: {temp_id: parseInt(that.id)}
    }).then(function(response) {
      if (response.data.code == 0) {
        var data = response.data.data;
        that.name = data.name
        that.modules = data.modules

        // //补充未有的字段
        // for(let i=0;i<that.modules.length;i++){
        //   that.modules[i].show = true;
        // }
      } else {
        Message.error({
          message: response.data.msg,
          duration: 1000
        });
      }
    });
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
  height:100%;
}
.el-col {
  border-radius: 4px;
  height:100%;
  padding-bottom: 20px;
  overflow-y: scroll;
}
.title {
  height: 70px;
  line-height: 70px;
  background: rgb(184, 215, 219);
  letter-spacing: 3px;
}
.title h4 {
  text-align: center;
  color: rgb(67, 78, 78);
}
.content {
  width:100%;
  height:auto;
  /* border: 1px rgb(201, 200, 200) solid; */
}
.form-pro{
  background: rgb(224, 227, 228);
}
.oprate-left-box{
  width:400px;
  height:100px;
  line-height:100px;
  position: absolute;
  bottom: 0;
  left:0;
}
.module_oprate{
  width:200px;
  height:100px;
  line-height:100px;
  margin: 0 auto;
}

.oprate-right-box{
  width:auto;
  margin-top:100px;
  padding:10px 25px;
  border: 1px rgb(241, 237, 237) solid;
}
.module_list{
  width:250px;
  height:auto;
  margin:20px auto;
}
.module{
  width:100%;
  height:auto;
}
.module-title{
  width:100%;
  height:30px;
  line-height:30px;
  text-align:left;
  text-indent:5px;
  position:relative;
}
.module-title:hover{
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
.module-child{
  width:100%;
  height:30px;
  line-height:30px;
  text-align:left;
  text-indent:5px;
  position:relative;
  padding-left:20px;
}
.module-child-name{
  display: inline-block;
  padding-left: 10px;
  line-height: 30px;
  color: #606266;
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
}
.module_component{
  width:100%;
  height:auto;
  margin:20px auto;
}
.module-child-oprate{
  display: inline-block;
  width:30px;
  height:30px;
  line-height:30px;
  text-align:center;
}
.module-child-oprate:hover{
  color:rgb(117, 196, 199);
  cursor:pointer;
}
.module_input_form{
  width:250px;
  text-align: right;
}
</style>
<style>
::-webkit-scrollbar {
    background:none;
}
.module_input_form .el-form-item .el-form-item__label{
  font-size:12px;
  padding: 0 3px 0 0;
}
</style>