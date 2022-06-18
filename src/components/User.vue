<template>
  <div class="edit">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="12" :offset="6" style="padding-left:0;padding-right:0;">
        <Nav></Nav>
        <div class="title">
          <h4>个人账户</h4>
        </div>
        <div class="content">
          <div class="block">
            <el-descriptions title="基本信息" direction="vertical" :column="4" border>
              <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
              <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
              <el-descriptions-item label="居住地" :span="2">苏州市</el-descriptions-item>
              <el-descriptions-item label="备注">
                <el-tag size="small">学校</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
export default {
  components: {Nav},
  name: 'User',
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
  background: rgb(188, 219, 184);
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
.block {
  width:60%;
  margin:50px auto;
  text-align: left;
}
</style>