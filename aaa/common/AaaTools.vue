<template>
  <span v-if="config">
    <md-button
      v-for="(btn,i) in config":key="i"  icon="el-icon-edit" 
      :disabled="btn.dis?true:false"
       class="md-raised"
       style="height: 34px;
                    line-height: 34px;
                    font-size: 14px;
                    background-color: #f0f9eb;
                    margin-top: 3px;
                    min-width: 36px;
                    font-weight: bold;
                    margin-right: 5px;"
       @click="btn.fun()" >
       <i class="el-icon-edit"></i>
       {{btn.label?btn.label:'添加'}}</md-button>
    
 </span>
</template>

<script>
export default {
  name: 'AaaTools',
  props: {
    config: {
      type: Array
    }
  }
}
</script>

<style scoped>

</style>