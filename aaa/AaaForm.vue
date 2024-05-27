<template>
  <div v-if="vis" class="aaa-from">
    <AaaModel :visible="vis" @cancel="cancel" :closeTip="closeTip">
      <span slot="title">
        
        <div class="aaa-from-wrap"
           v-if="tabs.length>0">
            <div :class="item == checkTabs ?  'aaa-from-content-check' :'aaa-from-content' " 
                  v-for="(item, i) in tabs"   
                  @click="()=>{
                  checkTabs = item
                  $emit('tabs', item)}"
                  v-if="item">
              
                  {{item}}
            </div>
        </div>
        
        <span  v-if="tabs.length==0" style="font-size: 16px;color: #000;">
          {{ title ? title : tit }}
        </span>
        
         <el-dropdown 
           @command="retrunCommand"
           v-if="config.history && ( title == '添加' || tit =='添加' )"  
           style="cursor: pointer;"  
           trigger="click"
         >
              
            <span 
             @click="handleCommand"
             style="font-size: 12px;color: #999;margin-left: 10px;"> 
             
              <span class="el-icon-document-copy"/>
              [ 获取历史记录 ]  
              
            </span> 
       
           <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  v-for="(item) in selectHistory" :key ="item.id"  :command='item.id'> 
                  {{item.createdTime.replace('T',' ')}}
                </el-dropdown-item>
             </el-dropdown-menu>
         </el-dropdown>
         
       </span>
        <slot name="tit" />
      </span>
      <a-form-model
        ref="ruleForm"
        :model="value"
        :rules="config.rules"
        :label-col="{ span: config.labelSpan ? config.labelSpan : 6, style: 'max-width: 140px;' }"
        :wrapper-col="{ span: config.labelSpan ? 23 - config.labelSpan : 17 }"
        has-feedback
      >
        <slot></slot>
      </a-form-model>

      <div slot="footer">
        <span v-if="type !== 'add'" style="float: left" class="btn-group">
          <a-button
            v-if="config.edit && config.disabled && actionTag === false"
            :disabled="disEdit === true"
            type="primary"
            @click="edit()"
          >
            编辑</a-button
          >

          <a-button
            v-if="config.actions   && config.disabled && actionTag === false"
            type="primary"
            @click="doAction(config.actions)"
          >
            {{ config.actions.label }}
          </a-button>
          
          <a-button
            v-if="config.customAction"
            style="background: #cb4e56; color: white"
            @click="customActionFunction(value)"
          >
            {{ config.customAction.label }}
          </a-button>
          
          
          <a-button
            v-if="config.enable && actionTag === false"
            @click="doEnable()"
            style="background: #ff7b18; color: white"
          >
            {{ this.value.enable === false ? '启' : '禁' }}用
          </a-button>
          <a-button v-if="config.del && actionTag === false" @click="doDel()" style="background: #cb4e56; color: white"
            >删除</a-button
          >
          <slot name="action"></slot>
        </span>

        <a-button v-if="notBtn !== true" @click="close()">关闭</a-button>
        <a-button
          type="primary"
          v-if="notBtn !== true && (tit !== '详情' || !config.disabled) && !config.submit"
          @click="doSubmit"
          :loading="load"
          >确定
        </a-button>
      </div>
    </AaaModel>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import AaaModel from './model/AaaModel'
import { del, put } from './api'
import AaaItem from './common/AaaItem'

export default {
  name: 'AaaFrom',
  components: { AaaItem, AaaModel },
  props: {
    disEdit: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    closeTip: {
      type: String,
    },
    value: {
      type: Object,
    },
    submit: {
      type: Function,
    },
    width: {
      type: String,
    },
    tabs:{
      type:Array,
      default:()=>{
        return []
      }
    },
    paging:{
      type:String
    },
    config: {
      type: Object,
      default() {
        return {
          width: '',
        }
      },
    },
  },
  data() {
    return {
      checkTabs:'',
      onSubmit:true,
      allow:true,
      type: '',
      vis: false,
      tit: '详情',
      url: '',
      method: '',
      actionTag: false,
      val: this.value,
      notBtn: false,
      load: false,
      selectHistory:[]
    }
  },
  watch: {
    val: {
      deep: true,
      handler: function (n, o) {
        this.$emit('input', n)
      },
    },
    vis(n) {
      if(!this.checkTabs && this.tabs[0]){
        this.checkTabs =  this.tabs[0]
      }
      if (n === false) {
        if (this.config.back) {
          this.config.back()
        }
      }
    },
  },
  methods: {
     //返回处理！
    retrunCommand(e){  //通过id获取表单，覆盖当前填写表单
      for(let item of this.selectHistory){
        if(item.id == e ){
           item.id = ''
           this.val = item
           return
        }
      }
    },
    //点击处理
    handleCommand(){
      if( !this.allow ){
         this.$message.error("获取失败,请勿频繁获取!")
        return
      }
      this.allow = false
         setTimeout(()=>{
            this.allow = true
      },500)
       this.$api.get(this.paging+"?current=1&pageSize=10&createdUserId="+this.$store.getters.userInfo.id)
       .then(res => {
         if( res.result.records.length==0){
           this.$message.warning("您未填写过当前表单，没有找到对应记录")
           return
         }
           this.selectHistory = res.result.records
         })
       
    },
    cancel() {
      this.vis = false
      if (this.config.doBefore) {
        this.config.doBefore('cancel')
      }
      this.$emit('cancel')
    },

    post(url, tip, fun = '') {
      return this.to(url, tip, 'post', fun)
    },
    put(url, tip, fun = '') {
      return this.to(url, tip, 'put', fun)
    },
    to(url, tip, method, fun) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.to(url, method, this.value).then((r) => {
            this.$message.success(tip + '成功')
            if (this.config.close !== false) {
              this.doClose()
            }
            if (fun) {
              fun()
            }
          })
        }
      })
    },
    add(row, tit = '') {
      this.type = 'add'
      this.vis = true
      this.tit = '添加' + tit
      this.url = this.config.add
      this.method = 'post'
      if (this.config.disabled) {
        this.config.disabled(false)
      }
      if (row && row.id) {
        delete row.id
      }
      this.val = Object.assign({}, row)
      if (this.config.doBefore) {
        this.config.doBefore('add')
      }
    },
    editOnly(row = '', tit = '') {
      this.type = 'edit'
      this.vis = true
      this.tit = tit
      this.url = this.config.edit
      this.method = 'put'
      if (this.config.disabled) {
        this.config.disabled(false)
      }
      if (row) {
        this.val = Object.assign({}, row)
      }
    },
    open() {
      this.vis = true
      this.actionTag = false
      this.notBtn = true
    },
    openOther() {
      this.vis = true
      this.actionTag = false
      this.notBtn =false
    },
    edit(row = '') {
      this.type = 'edit'
      if (this.tit === '编辑') {
        this.info(this.value)
      } else {
        this.vis = true
        this.tit = '编辑'
        this.url = this.config.edit
        this.method = 'put'
        if (this.config.disabled) {
          this.config.disabled(false)
        }
        if (row) {
          this.val = Object.assign({}, row)
        }
        if (this.config.doBefore) {
          this.config.doBefore('edit')
        }
      }
    },
    info(row) {
      this.type = 'info'
      this.actionTag = false
      this.vis = true
      this.tit = '详情'
      if (this.config.add && !this.config.disabled) {
        this.url = this.config.add
        this.method = 'POST'
      }
      this.val = Object.assign({}, row)

      if (this.config.disabled) {
        this.config.disabled(true)
      }
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
      if (this.config.doBefore) {
        this.config.doBefore('info',row)
      }
    },
    back() {
      this.actionTag = false
      if (this.config.back) {
        this.config.back()
      }
      this.info(this.value)
    },
    holdSubmit(){
      this.onSubmit = !this.onSubmit
    },
    // 确定
    doSubmit(val,constraint) {
      //控制submit提交，  可参考  calving.vue页 的submit!
      this.$emit("submit",this.onSubmit)
      this.$refs.ruleForm.validate((valid) => {
        if(!this.onSubmit || !valid){  
           this.$message.error("请根据要求完善表单内容！")
          return   
          } 
        if (valid) {
          this.load = true
          if (this.submit) {
            this.submit()
          } else {
            
            let commitValue = this.value
            if(constraint && this.method =='post'){
              commitValue['constraint'] = true
            } 
            if(!this.url){
              this.edit()
            }
            this.$api.to(this.url, this.method, commitValue).then(r => {
                 this.load = false
                let tip = this.tit === '详情' ? '添加' : this.tit
                if(r.result==undefined||(!r.result.hasOwnProperty('warning'))){
                   this.$message.success(tip + '成功')
                 }else if(r.result.warning!=null){
                   this.$message({
                        message: r.result.warning,
                        type: 'warning'
                    });
                 }     
                if (this.config.close !== false) {
                  this.doClose()
                }
                let str = this.method === 'post' ? 'add' : 'edit'
                if (this.config.change) {
                  this.config.change(str)
                }
                this.$emit('change', str)
              })
              .catch((res) => {
                  this.$emit('error', res)
                if(res === '同一头牛在一天内,不得有两次输精事件'){ //允许强制提交， 增加标识！
                   this.$confirm('当前牛只在今日已输精,是否强制提交输精记录？','是否强制提交', {
                            confirmButtonText: '强制提交',
                            cancelButtonText: '取消',
                            type: 'warning',
                            }).then(() => {
                              this.doSubmit(null,true)
                              }).catch(() => {}) 
                }
                this.load = false
              })
          }
        }
      })
    },
    doClose() {
      if (this.config.actionClose === false && this.actionTag === true) {
        return false
      }
      if (this.config.close !== false) {
        this.close()
      }
      this.load = false
    },
    // 关闭
    close() {
      this.$emit('close')
      if (this.actionTag === true) {
        this.back()
        return false
      }
      this.vis = false
      if (this.config.back) {
        this.config.back()
      }
    },
    // 禁用/启用
    doEnable() {
      let enableText = this.value.enable === false ? '启用' : '禁用'
      Modal.confirm({
        title: '确认'+enableText,
        content: '您确认'+enableText+'此条数据吗?',
        onOk: () => {
          put(this.config.enable, { id: this.value.id, enable: !this.value.enable }).then((res) => {
            this.$message.success(enableText + '成功')
            this.$emit('change', 'del')
            this.doClose()
          })
        },
      })
    },
    // 其他操作
    doAction(it) {
      this.type = 'action'
      if (this.config.back) {
        this.actionTag = true
      }
      this.tit = it.label
      this.url = it.url
      this.method = it.method ? it.method : 'put'
      it.fun()
    },
    //自定义按钮
    customActionFunction(val){
      Modal.confirm({
              title: '提示',
              content: '请再次确认当前操作！?',
              onOk: () => {
                  this.config.doBefore('custom',val)
                  this.close()
              },
            })
    },
    // 删除
    doDel(id = '') {
      Modal.confirm({
        title: '确认删除',
        content: '您确认删除此条数据吗?',
        onOk: () => {
          let delId = id ? id : this.value.id
          del(this.config.del, { id: delId }).then((res) => {
            this.$message.success('删除成功')
            this.close()
            if (this.config.change) {
              this.config.change('del')
            }
            this.$emit('change', 'del')
          })
        },
      })
    },
  },
}
</script>

<style>
 .aaa-from-wrap {
 overflow: hidden;
}
 .aaa-from-content {
  position:relative;
  background:#127783; 
  height: 30px; 
  text-align: center;
  line-height: 30px;
  min-width: 120px;
  transform:translate(-50%-50%);
  float: left;
  margin-left: 17px;
  color: #fff;
}
 .aaa-from-content::before { 
  content:"";
  position: absolute;
  border-top: 15px solid  transparent;
  border-left:16px solid #fff;
  border-bottom: 16px solid transparent;
  left:-1px; 
  top: 0;
}

 .aaa-from-content::after { 
  content:'';
  position:absolute;
  border-top: 15px solid transparent; 
  border-left: 16px solid #127783;
  border-bottom: 16px solid transparent; 
  right:-16px; 
  top: 0;
}
.aaa-from-content:hover::after{
  content:'';
  position:absolute;
  border-top: 15px solid transparent; 
  border-left: 16px solid #1FC9DC;
  border-bottom: 16px solid transparent; 
  right:-16px; 
  top: 0;
  cursor: pointer;
}
.aaa-from-content:hover{
  background:#1FC9DC;
  cursor: pointer;
}


 .aaa-from-content-check {
  position:relative;
  background:#1FC9DC; 
  min-height: 30px; 
  text-align: center;
  line-height: 30px;
  min-width: 120px;
  transform:translate(-50%-50%);
  float: left;
  margin-left: 17px;
  color: #fff;
}
 .aaa-from-content-check::before { 
  content:"";
  position: absolute;
  border-top: 15px solid  transparent;
  border-left:16px solid #fff;
  border-bottom: 16px solid transparent;
  left:-1px; 
  top: 0;
}

 .aaa-from-content-check::after { 
  content:'';
  position:absolute;
  border-top: 15px solid transparent; 
  border-left: 16px solid #1FC9DC;
  border-bottom: 16px solid transparent; 
  right:-16px; 
  top: 0;
}



.ant-form-item-label {
  margin-right: 10px;
}
.ant-form-item-label label {
  font-size: 14px;
}
.ant-input[disabled] {
  color: #666666  !important;
  background-color: #ffffff !important;
  border: 0px;
  cursor: not-allowed;
  opacity: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
.ant-input-number-disabled{
   color: #666666;
   background-color: #ffffff;
   border: 0px;
   cursor: not-allowed;
   opacity: 1;
   height: 34px;
   border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
.is-disabled .el-input__inner {
  background-color: #fff !important;
  color: #666666 !important;
  border: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25) !important;
  cursor: not-allowed !important;
}
.ant-select-disabled .ant-select-selection {
  color: #666666;
  background-color: #ffffff;
  border: 0px;
  cursor: not-allowed;
  opacity: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>