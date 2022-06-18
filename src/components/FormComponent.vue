<template>
  <div class="content">
    <el-form ref="form" :model="sizeForm" label-width="50px" size="mini" style="text-align:left;padding:2px;">
      <div class="item" draggable="true" 
        @dragstart="handleDragStart($event, 'input')" 
        @dragover.prevent="handleDragOver($event, 'input')" 
        @dragenter="handleDragEnter($event, 'input')" 
        @dragend="handleDragEnd($event, 'input')">
        <el-form-item label="输入框">
          <el-input style="width: 80%;"></el-input>
        </el-form-item>
        <div class="mengceng"></div>  
      </div>
      
      <div class="item" draggable="true" 
        @dragstart="handleDragStart($event, 'select')" 
        @dragover.prevent="handleDragOver($event, 'select')" 
        @dragenter="handleDragEnter($event, 'select')" 
        @dragend="handleDragEnd($event, 'select')">
        <el-form-item label="下拉菜单">
          <el-select v-model="sizeForm.region" placeholder="">
          </el-select>
        </el-form-item>
        <div class="mengceng"></div>
      </div>
      
      <div class="item" draggable="true" 
        @dragstart="handleDragStart($event, 'date')" 
        @dragover.prevent="handleDragOver($event, 'date')" 
        @dragenter="handleDragEnter($event, 'date')" 
        @dragend="handleDragEnd($event, 'date')">
        <el-form-item label="日期">
          <el-col :span="11" style="padding-left:0;">
            <el-date-picker type="date" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <div class="mengceng"></div>  
      </div>

      <div class="item" draggable="true" 
        @dragstart="handleDragStart($event, 'date-group')" 
        @dragover.prevent="handleDragOver($event, 'date-group')" 
        @dragenter="handleDragEnter($event, 'date-group')" 
        @dragend="handleDragEnd($event, 'date-group')">
        <el-form-item label="日期范围">
          <el-col :span="10" style="padding-left:0;padding-right:0;">
            <el-date-picker type="date" placeholder="" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="10" style="padding-left:0;padding-right:0;">
            <el-date-picker type="date" placeholder="" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <div class="mengceng"></div>  
      </div>
      
      <div class="item" draggable="true" 
        @dragstart="handleDragStart($event, 'textarea')" 
        @dragover.prevent="handleDragOver($event, 'textarea')" 
        @dragenter="handleDragEnter($event, 'textarea')" 
        @dragend="handleDragEnd($event, 'textarea')">
        <el-form-item label="文本框">
          <el-input type="textarea" rows="3" resize="none" style="width: 80%;"></el-input>
        </el-form-item>
        <div class="mengceng"></div>  
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FormComponent',
  data() {
    return {
      sizeForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dragging:null,
      ending:null
    };
  },
  methods: {
    handleDragStart (e, index) {

    },
    handleDragEnd (e, index) {
      // this.$parent.addFormComponent(index,0);
      this.$emit('addFormComponent',[index])

      //重新渲染列表
      this.$forceUpdate()
      this.$nextTick(() => {
        this.dragging = null
        this.ending = null
      })
    },
    handleDragOver (e,index) {
      e.preventDefault()
      // 首先把div变成可以放置的元素，即重写dragenter/dragover
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter (e, index) {
      e.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{
  width:100%;
  height:auto;
}
.item{
  position: relative;
}
.mengceng{
  width:100%;
  height:100%;
  position: absolute;
  top:0;
  z-index: 999;
}
</style>

<style>
.el-form-item .mengceng{
  width:100%;
  height:30px;
  position: absolute;
  top:0;
}
.item .el-form-item__label{
  font-size:12px;
  padding: 0 1px 0 0;
}
</style>