<template>
  <div class="edit">
    <el-row :gutter="24" style="margin:0;">
      <el-col :xl="{span:12, offset:6}" :lg="{span:18, offset:3}" :md="{span:20, offset:2}" :sm="{span:20, offset:2}" :xs="{span:24, offset:0}" style="padding-left:0;padding-right:0;">
        <Nav></Nav>
        <div class="title">
          <h4>更新日志</h4>
        </div>
        <div class="content">
          <div class="block">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
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
  name: 'UpdateLog',
  data() {
    return {
      activities: [
        {
          content: '创建 "简历助手工具" 项目',
          timestamp: '2022-03-02 14:46',
          size: 'large',
          type: 'success',
          icon: 'el-icon-s-promotion'
        },
        {
          content: '完成简历模块，编辑，保存，删除，导出功能',
          timestamp: '2022-03-10',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '完成登录注册功能，jwt身份令牌校验',
          timestamp: '2022-03-15',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '完成简历多组件表单验证',
          timestamp: '2022-03-16',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '优化简历导出，模块内容按需导出',
          timestamp: '2022-03-26',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '增加简历模块调整顺序',
          timestamp: '2022-03-27',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '优化接口代码，设计简历导出选择样式功能（弹出模态框，选择样式并导出），完成简历完成进度权重优化',
          timestamp: '2022-03-28',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '支持简历导出选择模板颜色样式以及自定义',
          timestamp: '2022-03-29',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '自定义模板功能开发中...',
          timestamp: '2022-03-29',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '支持简历模板创建，自定义构建简历表单模块',
          timestamp: '2022-03-30',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '支持模板模块名称修改，模块复制（后续迭代：更多表单组件，绑定doc模板文件xml数据，自动生成模板示例图片）',
          timestamp: '2022-03-31',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '表单控件添加，重置和防抖动',
          timestamp: '2022-03-31',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '基本支持自定义简历模板生成，有部分问题待解决（1.表格的位置不齐，方法：通过自己设计一个工整的表单解析xml。2.自定义表格单元格的宽度 3.标题统一图标，以及文字对齐 4.富文本独占一行表格）',
          timestamp: '2022-04-02',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '解决超级简历导出样式问题',
          timestamp: '2022-07-07',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
        {
          content: '测试jenkins自动部署第10次',
          timestamp: '2022-09-21',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        },
      ]
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