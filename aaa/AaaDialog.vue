<template>
  <el-dialog 
      :title = "title"
      @close="handleCancel"
      :width="width"
      bottom="0"
      top="0"
      class="aaaDialog"
      :visible.sync="vShow"
      style="margin-bottom: 0px !important;"
      >
      
      <div :style="{'height':$height - 176+'px'}" style="overflow: auto;">
        <slot></slot>
      </div>


    <div slot="footer" class="dialog-footer" style="margin-bottom: 0px;">
      <el-button v-show="submitVisible" size="small" @click="handleCancel">
        {{ cancelText }}
      </el-button>
      <el-button
        v-show="cancelVisible"
        size="small"
        type="primary"
        @click="handleSubmit"
      >
        {{ submitText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isFunction } from 'lodash'

export default {
  props:{
    visible:{
      default:false,
      type:Boolean
    },
    title:{
      default:"详细内容",
      type:String
    },
    width:{
      default:"100%",
      type:String
    }
  },
  watch:{
    visible(n){
      this.vShow = n
    }
  },
  data() {
    return {
      vShow: false,
      /* footer */
      submitVisible: true,
      submitText: '确定',
      cancelVisible: true,
      cancelText: '取消',
      onCancel: null
    }
  },

  methods: {
    handleSubmit(data) {
      this.$emit('close','')
    },
    handleCancel() {
      this.$emit('close','')
    },
  }
}
</script>
<style>
.el-dialog__header {
      border-bottom: 1px solid #e8eaec;
    }
</style>