<template>
<!-- 简历信息组件 -->
  <div class="box">
    <h3 class="title">简历信息</h3>
    <div class="form">
      <el-form :inline="true" :model="BaseInfoData" :rules="rules" ref="baseInfo" :inline-message="true" class="introduction_form">
        <el-form-item label="简历名称" prop="jianli_name">
          <el-input v-model="BaseInfoData.jianli_name" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: ["BaseInfoData"],
  data() {
    return {
      rules: {
          jianli_name: [{required: true, message: '请输入简历名称', trigger: 'blur'}],
      },
    }
  },
  methods: {
    handleSubmit(){
      let flag = null;
      this.$refs.baseInfo.validate((valid) => {
        if(valid){
          flag = true;
        }else{
          flag = false;
        }
      })
      return flag;
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
.avatar-uploader .el-upload {
    border: 1px dashed #d6cdcd;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
