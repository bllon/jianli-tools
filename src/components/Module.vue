<template>
  <div class="box" :class="[{'is_over': is_over},{'is_drag': is_drag}]"
   @dragover.prevent="handleDrag($event,refName)" 
   @dragenter.prevent="handleDrag($event,refName)"
   @dragleave="handleDragLeave($event,refName)"
   @drop.prevent="handleDrop($event,refName)">
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
        <el-descriptions v-for="k in [0]" :key="k" class="margin-top" style="margin-top:20px;" title="" :column="3" :size="size" border>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Module',
  props: ["refName","ModuleData"],
  data() {
    return {
      size: '',
      is_over:false,//是否进入模块区域
      is_drag:false,
      timeout:null,
      timeout2:null,
    }
  },
  methods: {
    handleDrop(){
      //重置
      this.is_over = false;
      if(this.timeout2 !== null) {
        clearTimeout(this.timeout2)
      }
      this.timeout2 = setTimeout(() => {
        this.timeout2 = null;
        this.$emit('setCurrentModule',[null])
      },100)
    },
    handleDrag (e,refName) {
      if(this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      if(this.timeout3 !== null) {
        clearTimeout(this.timeout3)
      }
      this.is_drag = true;
      this.is_over = true;
      this.timeout = null;
      if (refName != "") {
        this.$emit('setCurrentModule',[refName])
      }
      e.preventDefault()
      // 首先把div变成可以放置的元素，即重写dragenter/dragover
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragLeave(){
      if(this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {//过了100ms没有enter或over才算真正leave
        this.timeout = null;
        this.is_over = false;
        this.$emit('setCurrentModule',[null])
      },100)

      this.timeout3 = setTimeout(() => {//防止颜色抖动
        this.timeout3 = null;
        this.is_drag = false;
      },1000)
    }
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
.is_over {
  border-bottom: 1px rgb(204, 91, 91) solid;
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
  width:90%;
  margin: 20px auto;
}
</style>
<style>
.textarea-item .el-form-item__content{
  display: block !important;
}
</style>