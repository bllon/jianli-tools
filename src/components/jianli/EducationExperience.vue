<template>
<!-- 教育经历组件 -->
  <div class="box">
    <h3 class="title">教育经历</h3>
    <div class="form">
      <div class="expirience">
        <div class="box"  v-for="(item,index) in EducationExperienceData" :key="index" @click="edit(index)">
          <h4 class="name">{{item.school_name}} </h4>
          <div class="icon"><i class="el-icon-arrow-right"></i></div>
          <h4 class="time">{{item.start_time}}-{{item.end_time}}</h4>
        </div>
        <div style="margin:10px;">
          <el-button size="mini" type="success" @click="add()">添加</el-button>
        </div>
      </div>
      <el-dialog title="教育经历" @close="handleClose" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="form" :rules="rules" ref="educationForm">
          <el-form-item label="学校名称" prop="school_name">
            <el-input v-model="form.school_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="speciality">
            <el-input v-model="form.speciality" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="学历" prop="academic_degree">
            <el-select v-model="form.academic_degree" placeholder="">
              <el-option label="小学" value="小学"></el-option>
              <el-option label="初中" value="初中"></el-option>
              <el-option label="高中" value="高中"></el-option>
              <el-option label="中专" value="中专"></el-option>
              <el-option label="大专" value="大专"></el-option>
              <el-option label="本科" value="本科"></el-option>
              <el-option label="硕士" value="硕士"></el-option>
              <el-option label="博士" value="博士"></el-option>
              <el-option label="博士后" value="博士后"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入学年份" prop="start_time">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.start_time" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.end_time" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="所学课程" prop="course">
            <el-input type="textarea" v-model="form.course" :rows="5" placeholder="" style="width:100%;min-width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="是否统招" prop="is_unify">
            <el-select v-model="form.is_unify" placeholder="">
              <el-option label="统招" value="统招"></el-option>
              <el-option label="非统招" value="非统招"></el-option>
            </el-select>
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
  name: 'EducationExperience',
  props: ["EducationExperienceData"],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        school_name: "",
        speciality: "",
        academic_degree: "",
        start_time: "",
        end_time: "",
        course: "",
        is_unify: ""
      },
      rules: {
        school_name: [{required: true, message: '请输入学校名称', trigger: 'blur'}],
        speciality: [{required: true, message: '请输入专业名称', trigger: 'blur'}],
        academic_degree: [{required: true, message: '请选择学历', trigger: 'blur'}],
        start_time: [{required: true, message: '请选择入学年份', trigger: 'blur'}],
        end_time: [{required: true, message: '请选择入学年份', trigger: 'blur'}],
        course: [{required: true, message: '请填写所学课程', trigger: 'blur'}],
        is_unify: [{required: true, message: '请选择是否统招', trigger: 'blur'}],
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
      this.form = Object.assign({}, this.EducationExperienceData[index]);
    },
    save() {
      let flag = null;
      this.$refs.educationForm.validate((valid) => {
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
        this.EducationExperienceData.push(Object.assign({}, this.form));
      } else {
        this.EducationExperienceData[this.index] = Object.assign({}, this.form);
      }
      Message.success({
        message: '保存成功',
        duration: 1000
      });
      this.dialogFormVisible=false;
      this.form.school_name = "",
      this.form.speciality = "",
      this.form.academic_degree = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.course = "",
      this.form.is_unify = "",
      this.is_add=false;
    },
    add() {
      this.form.school_name = "",
      this.form.speciality = "",
      this.form.academic_degree = "",
      this.form.start_time = "",
      this.form.end_time = "",
      this.form.course = "",
      this.form.is_unify = "",
      this.dialogFormVisible = true;
      this.is_add=true;
    },
    handleClose() {
      this.$refs['educationForm'].resetFields();
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
      this.EducationExperienceData.splice(this.index,1);
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
