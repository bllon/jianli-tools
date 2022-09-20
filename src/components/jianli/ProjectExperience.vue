<template>
<!-- 项目经验组件 -->
  <div class="box">
    <div class="top">
      <h3 class="title">项目经验</h3>
      <div class="btn-box">
          <el-button size="mini" type="primary" @click="sort()">按时间排序</el-button>
      </div>
    </div>
    
    <div class="form">
      <div class="expirience">
        <div class="box"  v-for="(item,index) in ProjectExperienceData" :key="index" @click="edit(index)">
          <h4 class="name">{{item.project_name}} </h4>
          <div class="icon"><i class="el-icon-arrow-right"></i></div>
          <h4 class="time">{{item.start_time}}-{{item.end_time}}</h4>
        </div>
        <div style="margin:10px;">
          <el-button size="mini" type="success" @click="add()">添加</el-button>
        </div>
      </div>
      <el-dialog title="项目经验" @close="handleClose" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="form" :rules="rules" ref="projectExperienceForm">
          <el-form-item label="项目名称" prop="project_name">
            <el-input v-model="form.project_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="项目职务" prop="project_job">
            <el-input v-model="form.project_job" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="start_time">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.start_time" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.end_time" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="项目描述" prop="project_content">
            <el-input type="textarea" v-model="form.project_content" :rows="5" placeholder="" style="width: 100%;min-width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="this.index!==''" type="danger" size="small" @click="beforeDel()">删除</el-button>
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="save()">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'ProjectExperience',
  props: ["ProjectExperienceData"],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        project_name: "",
        project_job: "",
        start_time: "",
        end_time: "",
        project_content: "",
      },
      rules: {
        project_name: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
        project_job: [{required: true, message: '请输入项目职务', trigger: 'blur'}],
        start_time: [{required: true, message: '请选择项目时间', trigger: 'blur'}],
        end_time: [{required: true, message: '请选择项目时间', trigger: 'blur'}],
        project_content: [{required: true, message: '请填写项目描述', trigger: 'blur'}],
      },
      index:"",
      is_add:false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    time(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      return y + '-' + m
    },
    edit(index) {
      this.index = index;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, this.ProjectExperienceData[index]);
    },
    save() {
      let flag = null;
      this.$refs.projectExperienceForm.validate((valid) => {
        if(valid){
          flag = true;
        }else{
          flag = false;
        }
      })
      if (!flag) {
        return
      }
      if (typeof(this.form.start_time) == 'object') {
        this.form.start_time = this.time(this.form.start_time);
      }
      if (typeof(this.form.end_time) == 'object') {
        this.form.end_time = this.time(this.form.end_time);
      }
      if (this.is_add) {
        this.ProjectExperienceData.push(Object.assign({}, this.form));
      } else {
        this.ProjectExperienceData[this.index] = Object.assign({}, this.form);
      }
      Message.success({
        message: '保存成功',
        duration: 1000
      });
      this.dialogFormVisible=false;
      this.form.project_name = "",
      this.form.project_job = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.project_content = "",
      this.is_add=false;
    },
    add() {
      this.form.project_name = "",
      this.form.project_job = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.project_content = "",
      this.dialogFormVisible = true;
      this.is_add=true;
    },
    sort() {
      //按开始时间进行排序
      for(var i=0;i<this.ProjectExperienceData.length;i++){
        for(var j=0;j<this.ProjectExperienceData.length-1-i;j++){
          if (this.ProjectExperienceData[j].start_time < this.ProjectExperienceData[j+1].start_time) {
            var temp = this.ProjectExperienceData[j];
            this.ProjectExperienceData[j] = this.ProjectExperienceData[j+1];
            this.ProjectExperienceData[j+1] = temp;
          }
        }
      }
      this.$emit('sortData',["ProjectExperience", this.ProjectExperienceData])
      this.$forceUpdate()
    },
    handleClose() {
      this.$refs['projectExperienceForm'].resetFields();
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
      this.ProjectExperienceData.splice(this.index,1);
      this.dialogFormVisible = false;
      this.index=''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width:100%;
  height:auto;
  border-bottom: 1px rgb(168, 168, 168) solid;
}
.top{
  width:auto;
  height:50px;
}
.title {
  width:150px;
  line-height:50px;
  border-bottom:1px rgb(167, 164, 164) solid;
  float: left;
}
.btn-box {
  min-width: 100px;
  height: 50px;
  line-height:50px;
  float: right;
}
.introduction_form {
  padding: 10px;
  text-align: left;
}
.expirience {
  padding: 0 20px;
}
.expirience .box {
  width:100%;
  height:40px;
  margin:5px 0;
  background: #EBEEF5;
  border:none;
  cursor: pointer;
}
.expirience .box:hover {
  box-shadow: 0px 0px 1px 0px #000;
}
.expirience .box h4.name{
  line-height:40px;
  text-align:left;
  text-indent: 10px;
  float: left;
}
.expirience .box h4.time{
  min-width: 140px;
  line-height:40px;
  text-align:left;
  text-indent: 10px;
  float: right;
}
.expirience .box .icon {
  width:40px;
  height:40px;
  line-height:40px;
  float: right;
}
.form {
  text-align: left;
}
</style>
