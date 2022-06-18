<template>
  <div class="box">
    <h3 class="title">{{ModuleData.module_name}}</h3>
    <div class="form">
      <el-form v-if="ModuleData.type == 0" :inline="true" :model="ModuleData" class="module_form">
        <div :class="item.type == 'textarea' || item.type == 'date-group'? 'module_block' : 'module_item'" v-for="(item,index) in ModuleData.form" :key="index">

          <!-- input -->
          <el-form-item :label="item.label" :prop="item.name" v-if="item.type == 'input'">
            <el-input v-model="item.value"></el-input>
          </el-form-item>

          <!-- select -->
          <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'select'">
            <el-select v-model="item.value">
              <el-option v-for="(opt,i) in item.list" :key="i" :label="opt.label" :value="opt.value"></el-option>
            </el-select>
          </el-form-item>

          <!-- date -->
          <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'date'">
            <el-col :span="11">
              <el-date-picker type="date" v-model="item.value"></el-date-picker>
            </el-col>
          </el-form-item>

          <!-- date -->
          <el-form-item :label="item.label" :prop="item.name1"  v-if="item.type == 'date-group'">
            <el-col :span="11">
              <el-date-picker type="date" v-model="item.value1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" v-model="item.value2" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>

          <!-- textarea -->
          <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'textarea'" class="textarea-item">
            <el-input type="textarea" v-model="item.value" rows="10" class="textarea-item-one"></el-input>
          </el-form-item>

        </div>
      </el-form>

      <!-- 列表模块类型 -->
      <div v-if="ModuleData.type == 1" class="list_module">
        <div class="list_form">
          <!-- <div class="box"  v-for="(item,index) in WorkExperienceData" :key="index" @click="edit(index)">
            <h4 class="name">{{item.company_name}} </h4>
            <div class="icon"><i class="el-icon-arrow-right"></i></div>
            <h4 class="time">{{item.start_time}}-{{item.end_time}}</h4>
          </div> -->
          <el-descriptions v-for="k in [0,1]" :key="k" class="margin-top" style="margin-top:20px;" title="" :column="3" :size="size" border>
            <el-descriptions-item v-for="(item,index) in ModuleData.form" :key="index">
              <template slot="label">
                <i class="el-icon-edit-outline"></i>
                <span v-if="item.type != 'date-group'">{{item.label}}</span>
                <span v-if="item.type == 'date-group'">{{item.label}}</span>
              </template>
              <span v-if="item.type != 'date-group' && item.type != 'date'">{{item.value}}</span>
              <span v-if="item.type == 'date'">{{item.value | dateFormat}}</span>
              <span v-if="item.type == 'date-group'">{{item.value1 | dateFormat}} <span v-if="item.value1 != null && item.value1 != '' && item.value2 != null && item.value2 != ''">-</span> {{item.value2 | dateFormat}}</span>
            </el-descriptions-item>
          </el-descriptions>
          <div style="margin:10px;">
            <el-button size="mini" type="success" @click="add()">添加</el-button>
          </div>
        </div>
        <el-dialog :title="ModuleData.module_name" @close="handleClose" :visible.sync="dialogFormVisible">
          <el-form :inline="true" :model="ModuleData" ref="moduleForm">
            <div :class="item.type == 'textarea' || item.type == 'date-group'? 'module_block' : 'module_item'" v-for="(item,index) in ModuleData.form" :key="index">

              <!-- input -->
              <el-form-item :label="item.label" :prop="item.name" v-if="item.type == 'input'">
                <el-input v-model="item.value"></el-input>
              </el-form-item>

              <!-- select -->
              <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'select'">
                <el-select v-model="item.value">
                  <el-option v-for="(opt,i) in item.list" :key="i" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
              </el-form-item>

              <!-- date -->
              <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'date'">
                <el-col :span="11">
                  <el-date-picker type="date" v-model="item.value"></el-date-picker>
                </el-col>
              </el-form-item>

              <!-- date -->
              <el-form-item :label="item.label" :prop="item.name1"  v-if="item.type == 'date-group'">
                <el-col :span="11">
                  <el-date-picker type="date" v-model="item.value1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2" style="text-align:center;">-</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" v-model="item.value2" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>

              <!-- textarea -->
              <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'textarea'" class="textarea-item">
                <el-input type="textarea" v-model="item.value" rows="10" class="textarea-item-one"></el-input>
              </el-form-item>

            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button v-if="this.index!==''" type="danger" size="small" @click="beforeDel()">删除</el-button> -->
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="save()">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleEdit',
  props: ["refName","ModuleData"],
  data() {
    return {
      size: '',
      dialogFormVisible: false,
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
      // this.is_add=true;
    },
    handleClose() {
      this.$refs['moduleForm'].resetFields();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width:100%;
  min-height:240px;
  height:auto;
  border-bottom: 1px rgb(168, 168, 168) solid;
}
.title {
  width:150px;
  height:50px;
  line-height:50px;
  border-bottom:1px rgb(167, 164, 164) solid;
}
.module_form {
  padding: 10px;
  text-align: left;
}
.module_item{
  display:inline-block;
}
.module_block{
  display: block;
}
.module_block .textarea-item{
  display:block;
}
.list_module{
  width:100%;
  margin: 20px auto;
}

.list_form {
  padding: 0 20px;
}
.list_form .box {
  width:100%;
  height:40px;
  margin:5px 0;
  background: #EBEEF5;
  border:none;
  cursor: pointer;
}
.list_form .box:hover {
  box-shadow: 0px 0px 1px 0px #000;
}
.list_form .box h4.name{
  line-height:40px;
  text-align:left;
  text-indent: 10px;
  float: left;
}
.list_form .box h4.time{
  min-width: 140px;
  line-height:40px;
  text-align:left;
  text-indent: 10px;
  float: right;
}
.list_form .box .icon {
  width:40px;
  height:40px;
  line-height:40px;
  float: right;
}
.form {
  text-align: left;
}
</style>
<style>
.textarea-item .el-form-item__content{
  display: block !important;
}
</style>