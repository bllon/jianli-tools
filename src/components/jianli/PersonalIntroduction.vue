<template>
<!-- 基本信息组件 -->
  <div class="box">
    <h3 class="title">基本信息</h3>
    <div class="form">
      <el-form :inline="true" :model="PersonalIntroductionData" class="introduction_form">
        <el-form-item label="姓名">
          <el-input v-model="PersonalIntroductionData.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="PersonalIntroductionData.sex" placeholder="性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="照片">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="出生日期">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="PersonalIntroductionData.birthdate"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="PersonalIntroductionData.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="PersonalIntroductionData.phone" placeholder="电话"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalIntroduction',
  props: ["PersonalIntroductionData"],
  data() {
    return {
      imageUrl: '',
      form: {
        name: '',
        sex: '',
        birthdate: '',
        email: '',
        phone: '',
      }
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
