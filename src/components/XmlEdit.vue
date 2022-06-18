<template>
  <div class="edit">
    <el-row :gutter="20" style="margin:0;">
      <el-col :span="12" :offset="6" style="padding-left:0;padding-right:0;">
        <div class="title">
          <h4>xml编辑</h4>
        </div>
        <div class="content">
          {{xmlData}}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: 'XmlEdit',
  data() {
    return {
      xmlData:''
    }
  },
  methods: {
  },
  created() {
    var xmlhttp
    console.log(window.XMLHttpRequest)
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","./static/file/init.xml",false);
    xmlhttp.send();
    var xmlDoc=xmlhttp.responseXML;


    console.log(xmlDoc)
    var xmlData = "<table border='1'>"
    var x=xmlDoc.getElementsByTagName("document");
    console.log(x)
    for (let i=0;i<x.length;i++)
    {
      console.log(x[i])
      xmlData += "<tr><td>";
      xmlData += x[i].getElementsByTagName("ARTIST")[0].childNodes[0].nodeValue;
      xmlData += "</td><td>";
      xmlData += x[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;
      xmlData += "</td></tr>";
    }
    xmlData += "</table>";
    this.xmlData = xmlData
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-row {
  height: 100%;
  margin-bottom: 20px;
}
.el-col {
  height:100%;
}
.title {
  height: 70px;
  line-height: 70px;
  background: rgb(219, 184, 184);
  letter-spacing: 3px;
}
.title h4 {
  text-align: center;
  color: rgb(67, 78, 78);
}
.content {
  width:100%;
  height:90%;
  margin-top:20px;
  border: 1px rgb(201, 200, 200) solid;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
