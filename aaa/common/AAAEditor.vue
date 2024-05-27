<template>
  <div style='border: 1px solid #ccc;'>
    <Toolbar
      style='border-bottom: 1px solid #ccc'
      :editor='editor'
      :defaultConfig='toolbarConfig'
      :mode='mode'
    />
    <Editor
      style='height: 500px; overflow-y: hidden;'
      v-model='html'
      :defaultConfig='editorConfig'
      :mode='mode'
      @onCreated='onCreated'
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import api from '@/views/aaa/api'

export default Vue.extend({
  components: { Editor, Toolbar },
  props:{
    text:{
      type:String
    },
    isRead:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      editor:null,
      html: '',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...',
        readOnly:this.isRead,
        MENU_CONF: {
          uploadImage: {
            async customUpload(File, insertFn) {
              // file 即选中的文件
              // 自己实现上传，并得到图片 url alt href
              // 最后插入图片
              api.fileNew('/common/news', File).then(res => {
                insertFn(res.result.url, null, null)
              })
            },
            fieldName: 'fileName',
            headers: {
              token: this.$store.getters.token
            }
          }
        }
      },
      mode: 'default' // or 'simple'
    }
  },
  methods: {
    open(){
      this.$nextTick(() => {
        this.html= this.text
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    }
  },
  created() {
  },
  mounted() {

  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>
<style src='@wangeditor/editor/dist/css/style.css'></style>