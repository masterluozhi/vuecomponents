<template>
  <div  @mouseenter="doEnter"
        @mouseleave="doOut"
        :style="{'width':width}"
        :class="treeData && treeData.length>0  &&  treeData[0].children ? 'AaaTree': ''"
         @keyup.enter="selectNoCheckMethod">
         
   <md-card   style="margin-bottom: 3px;">
     
     
     <md-card-header v-if="head" :style="{'background':color}" style="padding-top:8px;padding-bottom: 8px; margin-left:6px;margin-right: 6px;">
       
       <h2 class="title">
         <i :class="icon" style="font-size: 30px;" ></i>
         <span style="font-size: 16px;">{{titleName}}</span>
         <!-- selectNoCheck -->
         
         <div style="width:66%;float: right;" v-if="selectNoCheck">
           <el-input 
             placeholder="输入牛号" 
             clearable 
             maxlength="6"
             size="small"
             v-model="checkCowNo" 
             @clear="selectNoCheckMethod" 
             class="input-with-select">
             <el-button size="mini" slot="append" style="width: 10px;" icon="el-icon-search" @click="selectNoCheckMethod" ></el-button>
           </el-input>
           </div>
         
      </h2>
        </md-card-header>
        <md-card-content  :style="{'height':height}"  style="overflow-y: auto;">
                    <a-tree
                      v-if="treeData && treeData.length > 0"
                      :checkable="config.check?true:false"
                      :multiple="config.check?true:false"
                      :disabled="disabled"
                      v-model="checkedKeys"
                      :tree-data="treeData"
                      :blockNode='true'
                      :expandedKeys='expandedKeys'
                      :replaceFields="{children:'children', title:'name', key:'id'}"
                      :defaultExpandParent="true"
                      @select="select"
                      @check="onCheck"
                      :selectedKeys= "selectedKeys"
                      @expand = "onExpand"
                      >
                <a-icon slot="switcherIcon" type="down" />
                  <template slot="title" slot-scope="row">
                    <p>
                      <i class="el-icon-folder-opened"></i>
                      <span style="margin-left: 5px;">{{ row.name }}{{ row.total ? '(' + row.total + ')' : '' }} </span>
                      <span class="totol" v-if='row.totol'>
                      {{ row.totol }}
                      </span>
                      <span style="float: right;position: absolute;right: 0px;" v-if="config.form" >
                        <a-button type="link" v-if="row.level<(config.level?config.level:3)&&config.form.add" @click.stop="add(row)"
                                  icon="plus-circle" size="small" title="添加"/>
                        <a-button type="link" @click.stop="edit(row)" v-if="row.level!==0&&config.form.edit" icon="form" size="small"
                                  title="编辑"/>
                                  
                        <a-button type="link" @click.stop="sort(row)" v-if="row.level!==0 && config.form.sort && row.idx !=1" icon="arrow-up" size="small"
                                   title="移动节点"/>
                                  
                        <a-button  type="link" size="small" icon="form"  v-else-if="( row.level==0 || row.idx ==1 ) && config.form.sort" style="color: white;"></a-button>
                      </span>
                      </p>
                      
                  </template>
                </a-tree>
            
                <aaa-form ref="form" :config="config.form" v-model="onForm" @change="changeForm()">
                  <slot name="form"/>
                </aaa-form>
        
        </md-card-content>
    </md-card>
    
  </div>

</template>

<script type="text/javascript">
  import { getAllNodeId } from '@/utils/util'

  export default {
    name: 'AaaTree',
    props: {
      titleName:{
        type:String,
        default:'切换列表类型'
      },
      isGroupCheck:{ //是否是牛群树形结构!
        type:Boolean,
        default:false
      },
      head:{
        type:Boolean,
        default:true
      },
      selectNoCheck:{
        type:Boolean,
        default:false
      },
      config: {
        type: Object
      },
      leaf: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object
      },
      disabled: {
        type: Boolean,
        default: false
      },
      check: {
        type: Array,
        default() {
          return undefined
        }
      },
      all: { //全选
        type: Boolean,
        default() {
          return false
        }
      },
      defaultId: {
        type: Number
      },
      color:{
        type:String,
        default:"linear-gradient(to right,#7DB09E,#5A9B85 )"
      },
      icon:{
        type:String,
        default:"el-icon-s-promotion"
      },
      height:{
        type:String,
        default:document.body.clientHeight-200+'px'
      },
      width:{
        type:String,
        default:document.body.clientWidth *0.15+'px'
      },
      expanded:{
        type: Number
      },
    },
    data() {
      return {
        checkCowNo:'',
        AaaTree:'AaaTree',
        type: 'add',
        onForm: this.value,
        autoExpandParent: true,
        expandedKeys:[0],
        clickId:'',
        refTo:false,
        str: '',
        selectedKeys:[],
        treeData: [],
        selectId: this.defaultId,
        selectObj: '',
        checkedKeys: this.check
      }
    },
    watch: {
      checkCowNo(n,e){
        if(!n || n==''){
          return
        }
        if(!Number(n) && n!=''){
          this.checkCowNo = e
          return
        }
        let arr = n.split('')
        let last_character = arr[arr.length - 1]
        if(last_character == ' '){
          this.checkCowNo = e
        }
      },
      value(n) {
        this.onForm = n
      },
      onForm(n) {
        this.$emit('input', n)
      },
      check(n) {
        this.checkedKeys = n
        if (!n) {
          this.onAll()
        }
      },
      expanded(n){
        if(n && n>0){
          this.getGroup(n)
        }
      },
      'config.where': {
        deep: true, //深度监听设置为 true
        handler(n, o) {
          this.getList()
        }
      },
      all(n) {
        this.onAll()
      }
    },
    methods: {
      checkCowNoTable(n){
          this.checkCowNo = n
          this.refTo = true
          this.selectNoCheckMethod()
      },
      outSelect() {
        this.selectId = ''
      },
      doEnter() {
        this.$emit('mouseenter')
      },
      doOut() {
        this.$emit('mouseleave')
      },
      changeForm() {
        this.getList(this.clickId)
        if (this.config.change && this.type === 'edit') {
          this.config.change()
        }
      },
      
      /* 找到牛组当前组别的完整路径*/
     async getGroup(n){
       let data = await this.$api.result('/cowGroup/getGroupById',  { 'id': n })
       this.expandedKeys = [0]
       if(data && data.idPath){
          let path = data.idPath.split(',')
            for(let i in path){
             path[i] = Number(path[i])
            }
          path.unshift(0)
          this.expandedKeys = path
          this.selectedKeys = []
          this.selectedKeys.push(n)
          this.$emit('toGroup',data,this.checkCowNo) //牛群概览中需要使用，即搜索到牛号，跳转到对应列表的功能！。
        }
      },
      
      onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
          },
      // 设置全选
      onAll() {
        if (this.all === true) {
          this.checkedKeys = []
          let row = []
          getAllNodeId(this.checkedKeys, row, this.treeData)
          if (this.config.check) {
            this.config.check({ check: this.checkedKeys, half: [], row: row })
          }
        }
      },
      // 选中
      onCheck(checkedKeys, info) {
        let objList = []
        let leafKey = []
        if (info.checkedNodes) {
          for (let it of info.checkedNodes) {
            let obj = it.data.props.dataRef

            if (obj) {
              if (this.leaf && !obj.children) {
                leafKey.push(obj.id)
              }
              objList.push(obj)
            }
          }
        }
        this.checkedKeys = this.leaf ? leafKey : checkedKeys
        if (this.config.check) {
          this.config.check({
            check: this.checkedKeys,
            half: info.halfCheckedKeys,
            row: objList
          })
        }
      },
      onChange(e) {
        if (!e) {
          this.onSearch(e)
        }
      },
      // 搜索
      onSearch(e) {
        this.str = e
        this.getList()
        if (e.length >= 3 && this.config.find) {
          this.config.find(e)
        }
      },
      
      /* 查询参数拼接*/
      selectData(){
        let format = []
        if(this.config.where){
          format = this.config.where
        }
        return {treeFormat:format}
      },


      // 获取数据
      async getList(toId) {
        if (this.config.treDate){
          this.treeData =  this.config.treDate
        }
        if (!this.config.url&&!this.config.treDate) {  return }
        if (this.config.url){
          if(this.isGroupCheck){
            let treeVal = await this.$api.postBody(this.config.url, this.selectData()  )
            if( treeVal[0] && !treeVal[0]["total"]){ //递归计算数量
              this.recursionTree(treeVal)
            }
            this.treeData = treeVal

          }else{
            let obj = { str: this.str }
            if (this.config.where) {
              obj = Object.assign(obj, this.config.where)
            }
            this.treeData =  await this.$api.result(this.config.url, obj)

          }
        }
          this.onAll()
          if (this.config.data) {
            this.config.data(this.treeData)
          }
        //  ----------------- 默认展开有参数的最近数据
         let arr = []
         arr.push(0)
        if (this.treeData && this.treeData.length > 0) {
          
          let children = this.treeData[0].children
          if (children && children.length > 0) {
             for(let i in children){
               if(children[i].children && children[i].children.length >0){
                 arr.push(children[i].id)
                 break;
               }
             }
            this.expandedKeys = arr
          }
          
          if ( this.selectedKeys.length<1  && this.head){
            this.selectedKeys.push(this.treeData[0].id)
          }
        }
        // ------------选择行
        if (!this.selectId && !this.refTo && this.config.click && this.treeData.length > 0) {
          this.click(this.treeData[0])
        }
        if(toId){
           this.getGroup(toId )
        }
      },
      /* 递归计算数量*/
      recursionTree(tree){
        let sum = 0;
        for(let item of tree){
          //存在子级
          if(item.children){
           item['total'] = this.recursionTree(item.children)
           sum = item['total'] + sum
            //不存在子级,无需遍历 ，直接返回即可
          }else{
            sum = item['total'] + sum;
          }
        }
        return sum
      },

      click(row,e) {
        this.selectId = row.id
        if (this.config.click) {
          this.config.click(row)
        }
        this.selectedKeys.push(e)
        this.checkCowNo = ''
        this.$emit('select', row)
      },
      // 选中 this.selectedKeys
      select(selectedKeys, info) {
        this.clickId = selectedKeys[0]
        let checkval = info.node.dataRef.id
        this.selectedKeys = selectedKeys
        //判断是否有子及，有就展开
          let obj = info.node.dataRef
          this.click(obj)
          if(!this.head){
             this.expandedKeys = selectedKeys
          }else if( obj['children'] ){
            
              let tar = 0; //展开前判断  子级是否在本身内容中,在起重则将上级目录展开
             if(this.expandedKeys && this.expandedKeys.length>0 ){
               for(let item of this.expandedKeys){
                 if(item == checkval && info.node.dataRef.pid >=0){
                    tar = this.getPashs(this.treeData[0],info.node.dataRef.pid)
                 }
               }
               if(!tar){
                  tar = this.getPashs(this.treeData[0],checkval)
               }
             }else{
                 tar =  this.getPashs(this.treeData[0],checkval)
             }
             this.expandedKeys = tar
          }
      },
      
      //递归，获取当前节点的所有目录
      getPashs(struct, cmp) {
        if (struct.id === cmp) {
            return [cmp]; //找到了， 返回
        } else if (struct.children) {
            for (var i = 0; i < struct.children.length; i++) {
                var path = this.getPashs(struct.children[i], cmp);
                if (path !== null) { //拿到返回的结果进行添加
                    path.unshift(struct.id);
                    return path;
                }        
            }
        }
        //没有返回结果的节点直接排除
        return null; 
    },
      
      //排序
      sort(row){
        if( !row.idx || row.idx < 2){
          return
        }
        //后台进行修改 当前 idx 与 当前idx - 1  互换 根据ipd 
        this.$api.get(this.config.form.sort+"?pid="+row.pid+"&idx="+row.idx+"&id="+row.id).then(res=>{
          //2、刷新当前tree
          this.getList()
        })
      },
      // 添加
      add(row) {
        let idx = this.getMaxNo(row.children);
        this.type = 'add'
        if (this.config.before) {
          this.config.before({ row: row, action: 'add' })
        }
        this.selectId = row.id
        //let str = row['namePath'] ? row['namePath'] : row['name']
        let str =''
        if(row.level ==2){
           this.$refs.form.add({ pid: row.id, idx:idx,pName: row.name,cowType:row.cowType},str)
        }else{
          this.$refs.form.add({ pid: row.id, idx:idx, pName: row.name}, str)
          }
      },
      //点击添加时，找到最大的序号
      getMaxNo(list){
        if(!list){
          return 1;
        }else{
          let max = 2;
          for(let item of list){
           if( item.idx == max ){
             max = item.idx+1
           }
          }
          return max;
        }
      },
      // 编辑
      edit(row) {
        this.type = 'edit'
        if (this.config.before) {
          this.config.before({ row: row, action: 'edit' })
        }
        this.selectId = row.id
        let str = row['namePath'] ? row['namePath'] : row['name']
        let obj = JSON.parse(JSON.stringify(row))
        delete obj.children
        //this.$refs.form.editOnly(obj, '编辑: ' + str +" 的牛场 / 组别信息")
        this.$refs.form.editOnly(obj, '编辑')
      },
      // 删除
      del(row) {
        this.type = 'del'
        this.selectId = row.id
        this.$refs.form.doDel(row.id)
        this.expandedKeys = [row.pid]
      },
      /* 根据牛号查询对应牛只*/
    async selectNoCheckMethod(){
      if(this.checkCowNo){
      
          let data  = await this.$api.postBody( '/cowGroup/cowNoByData', {treeFormat:[]}, {on:this.checkCowNo})
            if(data.length>0){
              //给与树形结构默认展开位置：
              this.getGroup(data[0].groupId)
            }else{
              this.$message.warning("没有此牛号！")
              this.checkCowNo = ''
               this.$emit('toGroup')
            }
        
        }else{
          this.$emit('clear') 
        }
        
      },
      
    },
    mounted() {
      this.getList()
    }
  }
</script>
<style >
 .AaaTree .ant-tree , .ant-tree-treenode-switcher-open{
    position: relative;
    padding: 0px !important;
  }
  .AaaTree .ant-tree-treenode-switcher-close::before {
            content: '一';
            margin-top:1px;
            margin-left:-6px;
            color: #999;
            position: absolute;
      }
      .AaaTree .ant-tree.ant-tree-block-node li .ant-tree-node-content-wrapper{
        width:125px;
        overflow: hidden;
      }
    .AaaTree .ant-tree-child-tree::before {
       border-left: 1px solid #999; 
           height: calc(100% - 31px);
           position: absolute;
           top:20px;
           left: 11px;
           content: '';
      }
 span.totol {
      background-color: #F56C6C;
      border-radius: 10px;
      color: #FFF;
      display: inline-block;
      font-size: 12px;
      height: 18px;
      line-height: 16px;
      padding: 0 6px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #FFF;
    }

</style>