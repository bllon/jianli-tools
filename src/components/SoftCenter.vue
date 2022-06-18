<template>
  <div class="edit">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="12" :offset="6" style="padding-left:0;padding-right:0;">
        <Nav></Nav>
        <div class="title">
          <h4>应用中心</h4>
        </div>
        <div class="content">
          
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
export default {
  components: {Nav},
  name: 'SoftCenter',
  data() {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  height:100%;
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
  margin-top:20px;
  border: 1px rgb(201, 200, 200) solid;
}
</style>