<template>
  <a-form-model-item
    ref="item"
    v-if="obj && obj.if === false ? false : true && obj.prop"
    :label="obj.label"
    labelAlign="right"
    :prop="obj.prop2 ? obj.prop2 + '.' + obj.prop : obj.prop"
    :rules="getRules"
  >
    <div class="selectInput">
      <a-input
        v-if="!obj.type"
        v-model="val[obj.prop]"
        :placeholder="obj.tip ? obj.tip : `请输入${obj.label}`"
        @change="changeInput(val[obj.prop])"
        @focus='clickAuto(obj.prop)'
        @blur='changeBlur(obj.prop,val[obj.prop])'
        :disabled="obj.dis"
        :maxLength="obj.max ? obj.max : 32"
        :suffix="obj.suffix"
        :allowClear="true"
      >
      </a-input>
      <div
        class="select"
        v-if="isSelect && obj.show"
        :style="`height:${menuHeight}`"
        @mouseenter="flag=true"
        @mouseleave="flag=false"
      >
        <div
          class="selectBoby"
          v-for="(version, index) in restaurants"
          :key="index"
          @click.stop="onClick(version.value,obj.prop)"
        >
          {{ version.value}}
          <span STYLE='float: right;border: none'  @click.stop="deleteItem(version.value,obj.prop)" >x</span>
        </div>
      </div>
    </div>

    <a-input
      v-if="obj.type === 'input'"
      v-model="val[obj.prop]"
      :placeholder="obj.tip ? obj.tip : `请输入${obj.label}`"
      :maxLength="obj.max ? obj.max : 99999999999999999999999999"
      @change="changeInput"
      @blur='changeInputBlur'
      :disabled="obj.dis"
      :suffix="obj.suffix"
      :allowClear="obj.clear !== false"
    />
    <a-input
      v-if="obj.type === 'words'"
      v-model="val[obj.prop]"
      :maxLength="obj.max ? obj.max : 32"
      @change="changeInput"
      :disabled="obj.dis"
      :suffix="obj.suffix"
      bordered=true
      :defaultValue="obj.value"
      :allowClear='false'
    />
    <a-input
      v-else-if="obj.type === 'text'"
      v-model="val[obj.prop]"
      type="textarea"
      :rows="obj.rows || 2"
      style="padding-top:10px;"
      :placeholder="obj.tip ? obj.tip : `请输入${obj.label}`"
      :maxLength="obj.max ? obj.max : 100"
      :disabled="obj.dis">
    </a-input>
    <span :class="idToNameClass" v-else-if="obj.type === 'cowId' || obj.type === 'idToName'">
      <aaa-id-to-name
        class="id_to_name_class"
        :ids.sync="val[obj.prop]"
        :tableName="val[obj.tableName]"
        :toName="val[obj.toName]"
        :disabled="obj.dis"
        @aaaItemCard = 'aaaItemCard'
      />
    </span>
    <a-input-password
      v-else-if="obj.type === 'pwd'"
      v-model="val[obj.prop]"
      :disabled="obj.dis"
      :maxLength="obj.max ? obj.max : 25"
    />
    
<!--    <a-input-number
      v-else-if="obj.type === 'number'"
      v-model="val[obj.prop]"
      style="width: 100%;"
      :precision="obj.precision ? obj.precision : 0"
      :max="obj.max"
      :min="obj.min"
      :key="obj.key"
      @change="changeNumber"
      :disabled="obj.dis"
    /> -->
    <a-input
      v-else-if="obj.type === 'number'"
      :placeholder="obj.tip ? obj.tip : `请输入${obj.label}`"
       :maxLength="obj.max ? obj.max : 32"
       @focus='clickAuto(obj.prop)'
       @blur='changeBlur(obj.prop,val[obj.prop])'
       @change="numberJud( obj.prop ,val[obj.prop])"
      v-model="val[obj.prop]"
      :suffix="obj.suffix"
      :allowClear="true"
    />
    
    <aaa-date
      :class="idToNameClass"
      v-else-if="obj.type === 'date' && !obj.dis"
      v-model="val[obj.prop]"
      :disabled="obj.dis"
      :now="obj.notNow !== true"
      :afterOrBefore="obj.afterOrBefore"
      :isSelect='obj.isSelect'
      @changeTime="changeTime"
      @input ="aaaItemCard"
    />
    <el-date-picker
      v-model="val[obj.prop]"
      v-else-if="obj.type === 'time' && !obj.dis"
      size="small"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间">
    </el-date-picker>
    <div v-else-if="obj.type === 'date' && obj.dis" class="dataClass">
      {{ val[obj.prop] }}
    </div>
    <a-a-a-editor
      v-else-if="obj.type === 'editor'"
      :text="val[obj.prop]"
    />
    <aaa-select
      v-else-if="obj.type === 'select'"
      v-model="val[obj.prop]"
      :placeholder="obj.tip ? obj.tip : `请选择${obj.label}`"
      :mode="obj.mode"
      :disabled="obj.dis"
      :url="obj.url"
      :dict="obj.dict"
      :code="obj.code"
      :pvalue="val[obj.pvalue]"
      :p="obj.pvalue ? '1' : ''"
      :clear="true"
      @input="(e) => changeSelect(e, obj.prop)"
    />
    <aaa-select-page
      v-else-if="obj.type === 'selectPage'"
      @changePage="changePage"
      :url="obj.url"
      v-model="val[obj.prop]"
      :dis="obj.dis"
    />
    <a-tree-select
      v-else-if="obj.type === 'selectTree'"
      v-model="val[obj.prop]"
      :tree-data="obj.dict"
      tree-default-expand-all
      :dropdown-style="{ maxHeight: '250px', overflow: 'auto' }"
      :replaceFields="{ children: 'children', title: 'name', key: 'id', value: 'id' }"
      allow-clear
      :disabled="obj.dis"
    />
    <aaa-tree
      :config="obj.config"
      v-else-if="obj.type === 'tree'"
      :head="false"
      :check="val[obj.prop]"
      :disabled="obj.dis"
      :all="obj.all"
      :leaf="obj.leaf"
    />
    
    <a-switch
      v-else-if="obj.type === 'switch'"
      :disabled="obj.dis"
      v-model="val[obj.prop]"
      @change="onChange"
      :checked-children="obj.checked"
      :un-checked-children="obj.unchecked"
    />
    <a-radio-group v-else-if="obj.type === 'radio'" v-model="val[obj.prop]" :disabled="obj.dis">
      <a-radio v-for="s in obj.dict" :value="s.value" :key="s.value">
        {{ s.label }}
      </a-radio>
    </a-radio-group>
    
    <aaa-upload 
        v-else-if="obj.type === 'img'"
        :multiple="obj.multiple"
        v-model="val[obj.prop]" 
       :path="obj.path" 
       :dis="obj.dis"
        @input="(e) => changeSelect(e, obj.prop)"
        />
     
    <el-row v-else-if="obj.type === 'selectBut'">
      <el-col :span="10">
        <aaa-select
          v-model="val[obj.prop]"
          :placeholder="obj.tip ? obj.tip : `请选择${obj.label}`"
          :disabled="obj.dis"
          :url="obj.url"
          :dict="obj.dict"
          @input="(e) => changeSelect(e, obj.prop)"
        />
      </el-col>
      <el-col :span="12">
        <el-button size="small" v-show="obj.haveButton" @click="clickButton" type="primary" plain>编辑 </el-button>
      </el-col>
    </el-row>
    <ElementUi
    :classVal="idToNameClass"
     v-else-if="obj.type =='cascade' || obj.type == 'casBut' "
     :obj.score="obj"
     :val.score = "val[obj.prop]"
     @clickButton='clickButton'
     @aaaItemCard="aaaItemCard"
     @changeCascade="changeCascade"
      />
  </a-form-model-item>
</template>

<script>
import AaaUpload from '../../aaa/AaaUpload'
import AaaIdToName from '../item/AaaIdToName.vue'
import ElementUi from '../item/ElementUi.vue'
import AAAEditor from '@/views/aaa/common/AAAEditor'
export default {
  name: 'AaaItem',
  components: { AAAEditor, AaaUpload, AaaIdToName,ElementUi},
  props: {
    obj: {
      type: Object,
    },
    value: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      val: this.value,
      restaurants:[],
      cowNum: 0,
      isSelect:false,
      flag: false,
      currentVersion:'',
      idToNameClass:'aaaItemCard',
      returnRules:'',
    }
  },
  computed: {
    getRules() {
     return  this.returnRulesFunction()
    },
    // 下拉框的高度
    menuHeight() {
      return this.restaurants.length * 50 > 150
        ? 150 + 'px'
        : `${this.restaurants.length * 50}px`
    },
  },
  methods: {
    numberJud( key , val ){
      this.recursionCa(key,val)
      this.changeInput(val)
    },
    recursionCa(key,val){
       this.val[key]  = val.replace(/ /g,"")
      let num = new Number(val)
            if( num != 0 )   this.val[key] = num > this.obj.max ? this.obj.max : num
            
            if( !(num >= 0) ){
              this.val[key] = val.substring(0,val.length-1)
              let ret = new Number( this.val[key] )  
              
            if( !(num >= 0) ) {
               this.recursionCa(key, this.val[key])
             }
            }
    },
    changeInput(n) {
       this.$emit('changeInput', n)
    },
    onClick(version,prop){
     this.val[prop]=version
      this.isSelect= false
      this.flag = false
    },
    deleteItem(n,key){
      this.$api.del("/userAcceptMessage/delSelect",{
        key:key,
        value:n
      })
      const index = this.restaurants.indexOf(n)
      this.restaurants.splice(index, 1)
    },
    clickAuto(n){
      this.isSelect=true
      this.$api.get("/userAcceptMessage/getDataSource?key="+n).then(res=>{
        this.restaurants=res.result
      })
    },
    changeInputBlur(){
      this.$emit('changeInputBlur')
    },
    changeBlur(e,n){
      this.isSelect= this.flag
      if(n!==""&&n!==null){
        this.$api.post("/userAcceptMessage/sendSelect",{
          key:e,
          value:n
        })
      }
      this.$emit('changeBlur')
    },
    returnRulesFunction(){
      let r = this.obj.rules // 传过来的验证规则
      let str = '' // 去除必填
      let arr = []
      str = this.obj.not !== true ? 'null' : ''
      if (r) {
        if (typeof r === 'string') {
          // 字符串时候的验证规则
          str = str + ',' + r
        } else if ( Array.isArray(r) ) {
          // 数组时候的验证规则
          arr = r
        } else {
          // Object时候的验证规则
          if ( r['str'] ) {
            // 常见验证
            str = str + ',' + r[str]
          }
          arr = r['arr']
        }
      }
      this.returnRules = this.$rules(str, arr)
      return this.returnRules
    },
    changePage(n) {
      this.$emit('changePage', n)
    },
    aaaItemCard(n){
      if( this.obj.not === true) return
      if(!n){
        this.idToNameClass='aaaItemCard_error'
      }else{
        this.idToNameClass='aaaItemCard_succeed'
      }
    },
    changeSelect(e, prop) {
      this.$set(this.val, prop, e)
      if(this.val[prop]){
         this.$refs['item'].validate((valid) => {})
        }
      this.$emit('input', this.val)
    },
    
    changeTime(time) {
      if(!time){
        if( this.obj.not == true) return
        this.idToNameClass='aaaItemCard_error'
      }else{
        this.idToNameClass='aaaItemCard_succeed'
      }
      this.$emit('changeTime', time)
    },
    onChange(checked) {
      this.$emit('onChange', checked)
    },
    changeCascade(n) {
      this.val[this.obj.prop] = n
       this.returnRulesFunction()
      this.$emit('changeCascade')
    },
    onSearch() {
      this.$emit('onSearch')
    },
    changeCheckbox() {
      this.$emit('changeCheckbox')
    },
    changeNumber(v) {
      this.$emit('changeNumber', v)
    },
    clickButton() {
      this.$emit('clickButton')
    },
  },
  watch: {
    value: {
      deep: true,
      handler: function (n, o) {
        this.val = n
      },
    }
  },
  mounted() {
    this.val = this.value
  },
  created() {
  }

}
</script>


<style lang="scss" scoped>
.selectInput {
  position: relative;
  .select {
    width: 100%;
    position: absolute;
    background: #fff;
    z-index: 99999;
    overflow: auto;
    cursor: pointer;
    border:1px solid #ccc;
  }
}
.dataClass {
  color: #666666;
  background-color: #ffffff;
  border: 0px;
  cursor: not-allowed;
  opacity: 1;
  height: 34px;
  margin-left: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

</style>
<style>
.aaaItemCard_error  .el-input__inner{
  border: 1px solid red !important;
}
.has-error  .aaaItemCard .el-input__inner{
  border : 1px solid red !important;
}

.has-error  .aaaItemCard .id_to_name_class{
  border : 1px solid red !important;
}
.aaaItemCard_error  .id_to_name_class{
  border:1px solid red !important;
}

.selectBoby:hover{
  background-color: #F0FFFE;
}
.selectBoby{
  padding:0 10px;
}
.aaaItemCard_error  .el-input__icon{
  color:red !important;
}
.has-error  .aaaItemCard  .el-input__icon{
  color : red !important;
}

.id_to_name_class{
  padding: 0px;
  min-height: 80px;
  overflow: auto;
  line-height: 20px;
}
</style>

