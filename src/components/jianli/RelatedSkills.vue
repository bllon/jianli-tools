<template>
<!-- RelatedSkills组件 -->
  <div class="box">
    <h3 class="title">相关技能</h3>
    <div class="form">
      <el-form :inline="false" :model="RelatedSkillsData" class="introduction_form">
        <el-form-item label="" prop="desc">
          <el-input type="textarea" v-model="RelatedSkillsData.skills" :rows="10" placeholder="描述你的相关技能"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedSkills',
  props: ["RelatedSkillsData"],
  data() {
    return {
    }
  },
  methods: {
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
</style>
