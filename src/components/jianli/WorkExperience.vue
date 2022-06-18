<template>
<!-- 工作经历组件 -->
  <div class="box">
    <h3 class="title">工作经历</h3>
    <div class="form">
      <div class="expirience">
        <div class="box"  v-for="(item,index) in WorkExperienceData" :key="index" @click="edit(index)">
          <h4 class="name">{{item.company_name}} </h4>
          <div class="icon"><i class="el-icon-arrow-right"></i></div>
          <h4 class="time">{{item.start_time}}-{{item.end_time}}</h4>
        </div>
        <div style="margin:10px;">
          <el-button size="mini" type="success" @click="add()">添加</el-button>
        </div>
      </div>
      <el-dialog title="工作经历" @close="handleClose" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="form" :rules="rules" ref="workExperienceForm">
          <el-form-item label="公司名称" prop="company_name">
            <el-input v-model="form.company_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="你的职位" prop="job">
            <el-input v-model="form.job" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="工作时间" prop="start_time">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.start_time" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.end_time" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="工作内容" prop="job_content">
            <el-input type="textarea" v-model="form.job_content" :rows="5" placeholder="" style="min-width:500px;"></el-input>
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
  name: 'WorkExperience',
  props: ["WorkExperienceData"],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        company_name: "",
        job: "",
        start_time: "",
        end_time: "",
        job_content: "",
      },
      rules: {
        company_name: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        job: [{required: true, message: '请输入职位名称', trigger: 'blur'}],
        start_time: [{required: true, message: '请选择工作时间', trigger: 'blur'}],
        end_time: [{required: true, message: '请选择工作时间', trigger: 'blur'}],
        job_content: [{required: true, message: '请填写工作内容', trigger: 'blur'}],
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
      this.form = Object.assign({}, this.WorkExperienceData[index]);
    },
    save() {
      let flag = null;
      this.$refs.workExperienceForm.validate((valid) => {
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
        this.WorkExperienceData.push(Object.assign({}, this.form));
      } else {
        this.WorkExperienceData[this.index] = Object.assign({}, this.form);
      }
      Message.success({
        message: '保存成功',
        duration: 1000
      });
      this.dialogFormVisible=false;
      this.form.company_name = "",
      this.form.job = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.job_content = "",
      this.is_add=false;
    },
    add() {
      this.form.company_name = "",
      this.form.job = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.job_content = "",
      this.dialogFormVisible = true;
      this.is_add=true;
    },
    handleClose() {
      this.$refs['workExperienceForm'].resetFields();
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
      this.WorkExperienceData.splice(this.index,1);
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
.title {
  width:150px;
  height:50px;
  line-height:50px;
  border-bottom:1px rgb(167, 164, 164) solid;
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
