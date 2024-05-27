<template>
  <div class="aaaCowCheck">
       <div   style="float: left;">
         
        <aaa-tree
          slot="reference" 
          v-if='refreshTree'
          :titleName='titleName' 
          :config='group' 
          icon="el-icon-zoom-in"
          :width="$width * 0.13 +'px'"
          :height="$height -225+'px'"
          :is-group-check='true'
          :expanded = 'expanded'
           />
      </div>
      
      <div  style="float: left;">
        
        <el-card  
          class="aaaCow"  
          :style="{'width':$width * 0.13 +'px','height':selectHeight >0 ? selectHeight +'px' : $height - 189 +'px'}"
        >
          <div slot="header">
            <el-checkbox  v-if="!onCheck" v-model="selectAll" @change="checkAll()"  :style="{'width':$width * 0.03 +'px'}">全选</el-checkbox>
            <span v-else>单选牛号</span>
            <span style="float: right;">
                <el-input
                  placeholder="输入牛号"
                  v-model="text"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  style="margin-top: -5px;"
                  :style="{'width':$width * 0.06 +'px'}"
                  size="mini"
                  maxlength="6"
                  />
            </span>
            
          </div>
          
          <el-empty :image-size="140" description="暂无可供选择牛号" v-if="!selectData.length>0"></el-empty>
          
           <el-checkbox-group v-model="selectVal" @change="selectAffirm(item.id)" v-for="(item,i) in selectData" :key="i">
              <el-col :span="8">
                  <el-checkbox style="margin:0px" :label="item.id" size="mini">{{item.name}}</el-checkbox>
               </el-col>
           </el-checkbox-group>
        </el-card>
        
    </div>
      
  </div>
</template>

<script>
export default {
  name: 'AaaCowCheck',
  props: {
    onCheck:{
      type:Boolean,
      default:false
    },
    where:{
      type:Array,
      default:()=>[]
    },
    value:{
      type: String
    },
    titleName:{
      type:String,
      default:" 选择牛组"
    },
    maxSize:{
      type:Number,
      default:256
    },
    color:{
      type:String,
      default:"#00B55A"
    },
    selectHeight:{
      type:Number,
      default:0
    },
  },
  data() {
    return {
      url2:'/cowGroup/selByGroupId',
      visible:false,  
      groupName:'',
      checked:false,
      refreshTree: true,
      selectAll:false,
      selectData:'',
      selectVal:[],
      text:'',
      level: 0,
      expanded:0,
      group: {
        url:'/cowGroup/getCowGroup',
        click: e => {
          this.showData(e)
          },
        where:this.where ||''
      },
      cow: {
        url: '/cowGroup/getCowGroup',
      }
    }
  },
  watch:{
   value(n){
     if(typeof n =='string'){
       let val = []
       if(n !=''){
           val = n.split(',')
        }
       this.selectVal = val
     }else{
       this.selectVal = n
     }
   },
   selectVal(n,y){
     if(n.length > 0 && y.length > 0 ){
       if(n.length < y.length){
         this.selectAll = false
       }
     }
   },
   text(n,e){
     let num = new Number(n)
     if(num >= 0 && n!=e ){
       this.checkOn();
     }
   },
},
  methods: {
    // 刷新
    refresh() {
      this.refreshTree = false
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    /* 关闭选择框*/
    closeSelect(){
      this.visible = false
      this.selectAll = false
      this.selectData = ''
      this.selectVal = []
    },
    /* 显示群组中的牛号*/
   async  showData(e){
      this.level = e.level
      this.groupName = e.namePath
      if(this.level===3){
        //进行查询
        this.selectData = await this.$api.postBody(this.url2, 
                                                    {treeFormat:this.where},
                                                    {groupId:e.id} )
        this.visible = true
        this.selectAll = false
       }else{
         this.selectData = []
       }
    },
    
    /* 搜索一个*/
   async checkOn(){
       let data  = await this.$api.postBody( '/cowGroup/cowNoByData', {treeFormat:this.where}, {on:this.text})
       this.selectData = []
       if(data.length>0){
          //给与当前选择框覆盖值
         let json = {}
         json["id"] = data[0].id
         json["name"] = data[0].cowNo
         this.selectData.push(json)
         //给与树形结构默认展开位置：
         this.expanded = data[0].groupId
       }
    },
    /* 全选 */
    checkAll(e){
      if(this.selectAll && this.selectData.length>0 ){
        this.selectData.map( item=>{ 
          if( this.selectVal.indexOf(item.id) == -1 && this.selectVal.length < this.maxSize) {
                this.selectVal.push( item.id ) 
              }
          })
          if( this.selectData.length >  this.maxSize){
            this.$message.error('当前应勾选牛号:'+this.selectData.length+"个，此次最多选择给您勾选了"+this.maxSize+"个，请分批提交！")
          }
        this.selectAffirm()
      }else if(!this.selectAll && this.selectData.length>0){
        
        //全不选之后 仅排除当前的组别内容
          this.selectData.map( item=> {
            if(this.selectVal.indexOf(item.id) != -1){
              this.selectVal.splice(  this.selectVal.indexOf(item.id) ,1) 
              }
            })
        this.selectAffirm()
        
        }
        
    },
    //清空全部
    closeAll(){
       this.selectVal = []
       this.selectAll = false
    },
    /* 确认选择牛号*/
    selectAffirm(item){
      if(this.selectVal.length > this.maxSize && item){
         this.$message.error("一次最多提交"+this.maxSize+"个牛号！请分批选择提交")
         return
      }
      if(this.onCheck){ //如果是单选. 1、清空选择框的值， 2、剔除其他值
         this.selectVal = []
         this.selectVal.push(item)
       }
       
       this.$emit('update:value', this.selectVal.join(','))
    },
  }
}
</script>

<style>
.aaaCowCheck .aaaCow{
  padding: 0px; 
  margin-top: 24px;
  overflow-y: auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .1), 0 0 3px rgba(0, 0, 0, .01);
}
.aaaCowCheck .el-card__body {
    padding: 5px;
}
</style>