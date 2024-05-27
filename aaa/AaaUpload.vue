<template>
   <div class="clearfix">
      <a-upload
        action="#"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        :customRequest='customRequest'
        @change="handleChange"
        :disabled="dis"
        :before-upload="beforeUpload"
      >
        <div v-if="fileList && fileList.length < ( multiple ? 4 : 1 ) && !dis">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            上传图片
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible"  title="图片详情" :footer="null" @cancel="handleCancel">
        <img alt="图片加载错误" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
    
</template>
<script>
// 上传封装
export default {
  name: 'AaaUpload',
  props: {
    value: {
      type: String, Array
    },
    path: {
      type: String
    },
    url: {
      type: String
    },
    multiple:{
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    dis: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(n) {
      this.val = n
    }
  },
  mounted() {
    if( this.value ){
      this.setFiles()
    }
  },
  data() {
    return {
      previewImage:'',
      fileList: [],
      previewVisible:false,
      val: this.value
    }
  },
  methods: {
      //转换参数值
    setFiles(){
      let files = this.value.split(",")
      let arr = []
      for(let item in files){
         let json = {}
        json['uid'] = item
        json['name'] = item
        json['url'] = files[item]
        arr.push(json)
      }
      this.fileList = arr
    },
    
    returnFiles(){
      let src = ''
      for(let item of this.fileList){
        if(src){
          src = src + "," + item.url
        }else{
          src = item.url
        }
      }
      this.$emit('input', src)
    },
    
    beforeUpload(file) {
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
            this.$message.error('上传文件类型必须是JPG,PNG图片！');
          }
          const isLt2M = file.size / 1024 / 1024 < 10;
          if (!isLt2M) {
            this.$message.error('图片大小必须小于10MB');
          }
          return isJpgOrPng && isLt2M;
        },
        
    handleChange(e) {
     if( e.file.status == "removed" ){ //删除
       this.fileList.splice(Number(e.file.uid),1)
       this.returnFiles()
     }
    },
    
    handleCancel(e){
      if(this.val){
         this.previewVisible = !this.previewVisible
      }
    },
    handlePreview(e){
      this.previewImage = e.url
      this.previewVisible = true
    },
    customRequest(data) {
      const formData = new FormData()
      formData.append('file', data.file)
      let url = this.url ? this.url : ('/common/upload/' + this.path)
      this.$api.file(url, formData).then(res => {
        this.$message.success(`${data.file.name} 文件上传成功`)
        
        let json = {}
        if(this.fileList && this.fileList.length){
          json['uid'] = this.fileList.length 
          json['name'] = this.fileList.length 
        }else{
          json['uid'] = 0
          json['name'] = 0
        }
        json['url'] =  res.result.url
        this.fileList.push(json)
        this.returnFiles()
      })
    }
  }
}
</script>
