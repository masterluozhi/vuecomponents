
<!-- 牛号的转译 -->
<template>
    
      <span :style="{ backgroundColor:disabled && type=='parameter' ? ' #F5F7FA' : '',
                  border:type == 'parameter' ? '1px solid #D5DBD8' : '',
                  display: type=='table'? '' : 'block',
                  position:type=='table'? '' : 'relative'}">
                  
        <span v-if="!ids && type =='parameter'" style="color:#BFBFBF ; margin-left: 5px;">请选择牛号</span>  
        
        <!-- 表单类型， 标签显示-->
        <div  v-else-if="type =='parameter'" v-for="(item,i) in dataValue" :key="i" style="float: left;">
            <el-tag size="mini"  :closable="!disabled" style="margin:1px;" @close="handleClose(i,dataValue[i].id)">{{dataValue[i][toName]}}</el-tag>
        </div>
        
        <!-- 列表类型，普通显示-->
         <span v-if="type =='table'">
           {{tableValue}}
         </span>
              <el-button type="info"
                style="position:absolute; bottom: 0px;right: 0px;padding:3px;"
                size="mini"
                plain
                v-if="!disabled"
                @click="closeAll()"
                icon="el-icon-delete"
              />
      </span>
      
</template>

<script>

export default {
  props: {
    ids:{
      type: Array | String,
     },
     type:{
       type: String,
       default:"parameter"
     },
    disabled: {
      type: Boolean,
      default: false
    },
    toName:{
      type:String,
      default:"cow_no"
    },
    tableName:{
      type:String,
      default:"cow"
    },
    name:{
      type:String,
      default:"id"
    }
  },
  data() {
    return {
      tableValue:'',
      dataValue:[], //结果
    }
  },
  created() {
    if(this.ids){
       this.selectIdsOfCow(this.ids)
    }
  },
  watch: {
   ids(e) {
       if(e && e.length>0){
          this.selectIdsOfCow(e)
       }else{
         this.dataValue = []
       }
        this.$emit("aaaItemCard",e)
      },
    immediate: true,
        deep: true
  },
  methods: {
    //将牛ID转换为牛对象
    selectIdsOfCow(ids){
      this.$api.post('/idsToName/getCowsByCowIds', {
        ids:  ids,
        tableName:this.tableName,
        toName:this.toName,
        name:this.name
      }).then(r => {
        this.dataValue = r.result
        if(this.type=='table' &&  r.result.length>0){
         for(let i in r.result){
            if(i==0){
              this.tableValue = r.result[i][this.toName]
            }else{
              this.tableValue = this.tableValue + ','+ r.result[i][this.toName] 
            }
          }
        }
        
        
      }).catch(e=>{
          //清空
          //this.$emit("close",'')
          this.ids = ''
          this.$message.error("牛群参数转换错误，系统异常。请重新操作!")
      })
    },
    /* 清空全部*/
    closeAll(){
        this.dataValue = []
         this.$emit('update:ids','')
    },
    //手动删除一条
   handleClose(tag,id) {
     this.dataValue.splice(tag, 1);
     if(typeof this.ids =='string'){
          let val = this.ids.split(',')
          val.splice(  val.indexOf(id) ,1) 
          this.$emit('update:ids',val.join(","))
     }else{
        this.ids.splice(  this.ids.indexOf(id) ,1) 
     }
  },
    
  },
}
</script>

<style >
  .aaaEllipsis {
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>