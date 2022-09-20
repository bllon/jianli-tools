<template>
  <div class="box">
    <h3 class="title">{{ModuleData.module_name}}</h3>
    <div class="form">
      <el-form v-if="ModuleData.type == 0" :inline="true" :model="ModuleData" :ref="refName" class="module_form">
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
              <el-date-picker type="date" v-model="item.value" @change="pickDate($event, item)"></el-date-picker>
            </el-col>
          </el-form-item>

          <!-- date -->
          <el-form-item :label="item.label" :prop="item.name1"  v-if="item.type == 'date-group'">
            <el-col :span="11">
              <el-date-picker type="date" v-model="item.value1" style="width: 100%;" @change="pickDate($event, item, 1)"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" v-model="item.value2" style="width: 100%;" @change="pickDate($event, item, 2)"></el-date-picker>
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
          
          <div class="list-item-box" v-for="(onelist,k) in ModuleData.list_data" :key="k" @click="edit(k)">
            <el-descriptions class="margin-top" title="" :column="2" :size="size" :border="true">
              <el-descriptions-item v-for="(item,index) in onelist" :key="index">
                <template slot="label">
                  <i class="el-icon-edit-outline"></i>
                  <span>{{item.label}}</span>
                </template>
                <span>{{item.value}}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          
          <div style="margin:10px;">
            <el-button size="mini" type="success" @click="add()">添加</el-button>
          </div>
        </div>
        <el-dialog :title="ModuleData.module_name" @close="handleClose" :visible.sync="dialogFormVisible">
          <el-form :inline="true" :model="ModuleData" ref="listModuleForm">
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
                  <el-date-picker type="date" v-model="item.value" @change="pickDate($event, item)"></el-date-picker>
                </el-col>
              </el-form-item>

              <!-- date -->
              <el-form-item :label="item.label" :prop="item.name1"  v-if="item.type == 'date-group'">
                <el-col :span="11">
                  <el-date-picker type="date" v-model="item.value1" style="width: 100%;" @change="pickDate($event, item, 1)"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2" style="text-align:center;">-</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" v-model="item.value2" style="width: 100%;" @change="pickDate($event, item, 2)"></el-date-picker>
                </el-col>
              </el-form-item>

              <!-- textarea -->
              <el-form-item :label="item.label" :prop="item.name"  v-if="item.type == 'textarea'" class="textarea-item">
                <el-input type="textarea" v-model="item.value" rows="10" class="textarea-item-one"></el-input>
              </el-form-item>

            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="this.index!==''" type="danger" size="small" @click="beforeDel()">删除</el-button>
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
      size: 'mini',
      dialogFormVisible: false,
      list: [],
      index:'',
      is_add: false
    }
  },
  methods: {
    add() {
      for (var i=0; i<this.ModuleData.form.length;i++) {
        //重置表单
        this.ModuleData.form[i].value = "";
        this.ModuleData.form[i].value1 = "";
        this.ModuleData.form[i].value2 = "";
      }
      this.dialogFormVisible = true;
      this.list = this.ModuleData.list_data != null ? this.ModuleData.list_data : [];
      this.is_add=true;
    },
    handleClose() {
      this.$refs['listModuleForm'].resetFields();
      this.index = ''
    },
    pickDate(date, item, index) {
      if (date == null) {
        return
      }
      if (index == 1) {
        item.value1 = this.$util.dateFormat(date)
      } else if (index == 2) {
        item.value2 = this.$util.dateFormat(date)
      } else {
        item.value = this.$util.dateFormat(date)
      }
    },
    edit(index) {
      this.list = this.ModuleData.list_data != null ? this.ModuleData.list_data : [];
      this.index = index;
      this.dialogFormVisible = true;
      for(var i=0;i<this.ModuleData.list_data[index].length;i++) {
        if (this.ModuleData.form[i].type == 'date-group') {
          var arr = this.ModuleData.list_data[index][i].value.split(' - ')
          this.ModuleData.form[i].value1 = arr[0] ? arr[0] : ''
          this.ModuleData.form[i].value2 = arr[1] ? arr[1] : ''
        } else {
          this.ModuleData.form[i].value = this.ModuleData.list_data[index][i].value
        }
      }
    },
    save() {
      if (this.is_add) {
        var data = [];
        for (var i=0; i<this.ModuleData.form.length;i++) {
          if (this.ModuleData.form[i].type == 'date-group') {
            data.push({
              'type': this.ModuleData.form[i].type,
              'label': this.ModuleData.form[i].label,
              'value': this.ModuleData.form[i].value1 + " - " + this.ModuleData.form[i].value2
            })
          } else {
            data.push({
              'type': this.ModuleData.form[i].type,
              'label': this.ModuleData.form[i].label,
              'value': this.ModuleData.form[i].value
            })
          }
          //重置表单
          this.ModuleData.form[i].value = "";
          this.ModuleData.form[i].value1 = "";
          this.ModuleData.form[i].value2 = "";
        }
        this.list.push(data)
      } else {
        for (var i=0; i<this.ModuleData.form.length;i++) {
          if (this.ModuleData.form[i].type == 'date-group') {
            this.list[this.index][i].value = this.ModuleData.form[i].value1 + " - " + this.ModuleData.form[i].value2
          } else {
            this.list[this.index][i].value = this.ModuleData.form[i].value
          }
          //重置表单
          this.ModuleData.form[i].value = "";
          this.ModuleData.form[i].value1 = "";
          this.ModuleData.form[i].value2 = "";
        }
      }
      this.$emit('saveListData',[this.list, this.ModuleData.module_name])
      this.dialogFormVisible = false;
      this.is_add=false;
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
      this.list.splice(this.index,1);
      this.$emit('saveListData',[this.list, this.ModuleData.module_name])
      this.dialogFormVisible = false;
      this.index=''
    }
  },
  created() {
    
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
  background: rgb(232, 210, 210);
}
.list-item-box {
  width:100%;
  height:auto;
  margin-top:10px;
  cursor: pointer;
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