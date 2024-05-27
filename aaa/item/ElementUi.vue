<!-- ElementUi表单组件封装。 -->
<template>
 <el-cascader
      v-if="obj.type === 'cascade'"
      :class="classVal"
      :options="obj.dict"
      :show-all-levels="false"
      :props="{ emitPath: false ,expandTrigger: 'hover', multiple: obj.multiple}"
      v-model.sync="model"
      style="width: 100%;"
      size="small"
      :disabled="obj.dis"
      @change="()=>this.$emit('changeCascade',model)"
      @clearCheckedNodes="()=>this.$emit('changeCascade',model)"
      clearable
      :placeholder="obj.tip ? obj.tip : `请选择${obj.label}`"
    >
    </el-cascader>
    <el-row v-else-if="obj.type === 'casBut'">
      <el-col :span="21">
        <el-cascader
          :class="classVal"
          :options="obj.dict"
          :show-all-levels="false"
          :props="{emitPath: false ,expandTrigger: 'hover' }"
          v-model.sync="model"
          :disabled="obj.dis"
          style="width: 100%;"
          size="small"
          @change="()=>this.$emit('changeCascade',model)"
          @clearCheckedNodes="()=>this.$emit('changeCascade',model)"
          clearable
          :placeholder="obj.tip ? obj.tip : `请选择${obj.label}`"
        >
        </el-cascader>
      </el-col>
      <el-col :span="3">
        <el-button v-show="obj.haveButton" @click="clickButton" size="small" type="normal">编辑 </el-button>
      </el-col>
    </el-row>
</template>

<script>

export default {
  props:['obj','val','classVal'],
  data() {
    return {
      isDis:false,
      model:''
    // model:this.typeJudge(this.val)
    }
  },
  created() {
      setTimeout(() => {
        this.model = Number( this.val ) || this.val
        },200)
  },
  watch: {
    val:{
      deep: true,
      handler: function (n, o) {
       if(n==null){
         this.model = ''
       }else{
          this.model = n
       }
      },
    },
    model:{
      deep: true,
      handler: function (n, o) {
        if( n ||  o ){
          this.$emit('aaaItemCard', n)
        }
      },
    }
  },
  methods: {
    clickButton(){
       this.$emit('clickButton')
    }
  },
}
</script>