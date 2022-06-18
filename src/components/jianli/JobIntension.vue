<template>
<!-- 求职意向组件 -->
  <div class="box">
    <h3 class="title">求职意向</h3>
    <div class="form">
      <el-form :inline="true" :model="JobIntensionData" class="introduction_form">
        <el-form-item label="求职岗位">
          <el-input v-model="JobIntensionData.job_name" placeholder="后端开发工程师"></el-input>
        </el-form-item>
        <el-form-item label="求职类型">
          <el-select v-model="JobIntensionData.job_type" placeholder="社招">
            <el-option label="校招" value="校招"></el-option>
            <el-option label="社招" value="社招"></el-option>
            <el-option label="实习" value="实习"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望薪资">
          <el-input v-model="JobIntensionData.hope_salary" placeholder="面议"></el-input>
        </el-form-item>
        <el-form-item label="目标城市">
          <el-input v-model="JobIntensionData.hope_city" placeholder="目标城市"></el-input>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-select v-model="JobIntensionData.current_status" placeholder="随时到岗">
            <el-option label="随时到岗" value="随时到岗"></el-option>
            <el-option label="月内到岗" value="月内到岗"></el-option>
            <el-option label="考虑机会" value="考虑机会"></el-option>
            <el-option label="暂不考虑" value="暂不考虑"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobIntension',
  props: ["JobIntensionData"],
  data() {
    return {
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
