<template>
  <div class="select">
    <a-form layout="inline" class="query" >
      <slot/>
      <span style="margin-left:10px;"/>
      <a-form-item v-for="(it, i) in config" :key="i" :label="it.label"  >
        <a-input
          v-if="!it.type"
          :placeholder="it.placeholder"
          :maxLength="it.maxLength ? it.maxLength : it.key == 'cowNo' ? 6 : 32"
          v-model="val[it.key]"
          :style="`width:${it.width ? it.width : 150}px`"
          @change="typeJud( it.key ,val[it.key])"
          allowClear
        />
        <a-input
          v-else-if="it.type === 'number'"
          :placeholder="it.placeholder"
          :maxLength="it.maxLength ? it.maxLength : it.key == 'cowNo' ? 6 : 32"
          v-model="val[it.key]"
          :style="`width:${it.width ? it.width : 150}px`"
          @change="numberJud( it.key ,val[it.key])"
          allowClear
        />
        <aaa-select
          v-else-if="it.type === 'select'"
          v-model="val[it.key]"
          :url="it.url"
          :dict="it.dict"
          :code="it.code"
          :pvalue="val[it.pvalue]"
          :p="it.pvalue ? '1' : ''"
          :placeholder="it.placeholder"
          style=" height: 29px"
          :clear="it.clear"
          :defaultval="it.val"
          :style="`width:${it.width ? it.width : 180}px`"
        />
        <span v-else-if="it.type === 'date'" >
          <aaa-date
            ref='aaadate'
            v-model="setValDate[i]"
            placeholder="开始->结束时间"
            :style="`width:${it.width ? it.width : 310}px`"
            style=" height: 30px"
            type="dateTime"
            isSelect="true"
            :checkDate="it.checkDate"
            @input="(e) => changeBegin(e, it.key)"
          />
        </span>
        <span v-else-if="it.type === 'year'">
          <aaa-select v-model="val[it.key]" :dict="yearDict" style="width: 120px"  @input="changeYear(it)" />
        </span>
        <aaa-select-page
          v-else-if="it.type === 'selectPage'"
          :url="it.url"
          v-model="val[it.key]"
          :style="`width:${it.width ? it.width : 170}px;`"
        />
        <el-cascader
          v-else-if="it.type === 'cascade'"
          :options="it.dict"
          v-model="val[it.key]"
          :show-all-levels="false"
          :props="{ emitPath: false }"
          :clearable="true"
          :placeholder="it.placeholder"
          :style="`width:${it.width ? it.width : 150}px`"
        />
      </a-form-item>
      <a-form-item>
        <md-button
          v-if="config && config.length > 0"
          class="md-raised"
          style="
            height: 34px;
            line-height: 34px;
            font-size: 14px;
            background-color: #f0f9eb;
            margin-top: 3px;
            min-width: 32px;
            font-weight: bold;
          "
          @click="changeObj()"
          :disabled='disabled'
        >
          <i class="el-icon-search"></i>
          查询</md-button
        >

        <!-- <el-button type='primary' plain
                   v-if='config&&config.length>0'
                   @click='changeObj()'
                   size='small'
                   icon='el-icon-search'
        >
          查询
        </el-button> -->
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { format } from '@/utils/dateUtil'

export default {
  name: 'AaaQuery',
  props: {
    query: {
      type: Object,
    },
    config: {
      type: Array,
    },
  },
  data() {
    return {
      disabled:false,
      val: {},
      valDate: [],
      setValDate: [],
      yearDict: [],
      yearNew: '',
    }
  },
  watch: {
    val: {
      deep: true,
      handler: function (n, o) {
        this.$emit('obj', n)
      },
    },
    query: {
      deep: true,
      handler: function (n, o) {
        this.val = Object.assign({}, n)
      },
    },
  },
  created() {
    if(this.config && this.config.length>0 && this.config[0].type == 'year'){
      let date = format(new Date(), 'yyyy')
      let a = parseInt(date)
      this.yearNew = a
      let year = []
      year.push({ label: a, value: a })
      for (let i = 1; i < 10; i++) {
        year.unshift({ label: a - i, value: a - i })
        year.push({ label: a + i, value: a + i })
      }
      this.yearDict = year
    }
  },
  methods: {
    numberJud( key , val ){
      this.recursionCa(key,val)
    },
   recursionCa(key,val){
      this.val[key]  = val.replace(/ /g,"")
     let num = new Number(val)
           if( num != 0 )  {
             this.val[key] = num
           }
           
           if( !(num >= 0) ){
             this.val[key] = val.substring(0,val.length-1)
             let ret = new Number( this.val[key] )  
             
           if( !(num >= 0) ) {
              this.recursionCa(key, this.val[key])
            }
           }
   },
    typeJud( key , val ){
      if(key != 'cowNo'){
        return
      }
      let num = new Number(val) 
      if( num != 0 )   this.val[key] = num
     if( !(num >= 0)  ){
       this.val[key] = val.substring(0,val.length-1)
       let ret = new Number( this.val[key] )  
      if( !(num >= 0)  ) {
        this.typeJud('cowNo', this.val[key])
      }
     }
    },
    changeDate(e, key) {
      this.val[key] = e + ':00'
    },
    changeYear(it) {
      if (!this.val[it.key]) {
        this.val[it.key] = this.yearNew
      }
    },
    changeBegin(e, key) {
      if (e == null) return
      this.val['begin' + key] = e[0]
      this.val['end' + key] = e[1]
    },
    /* changeBegin(e, key) {
      this.val['begin' + key] = e
    },
    changeEnd(e, key) {
      this.val['end' + key] = e
    }, */
    changeObj() {
      this.$emit('query', this.val)
    },
    changeDisable(n){
      this.disabled=n
    }

  },
}
</script>

<style >
.query label{
    color:#fff;
    font-size: 15px;
  }
.select .ant-form-inline .ant-form-item{
  margin-right: 0px !important;
}
.select .ant-form-item-control{
  margin-right: 0px !important;
}
.select .ant-input-affix-wrapper {
  margin-right: 20px;
}
form .ant-select, form .ant-cascader-picker{
  margin-right: 15px !important;
}
/*.select .ant-select-selection--single{*/
/*  margin-right: 20px;*/
/*}*/
.select .ant-input-affix-wrapper{
  margin-right: 20px;
}

.select .el-range-editor--small.el-input__inner{
  margin-right: 20px;
}
.query input{
  height: 30px;
}
.query a-form-item{
  height: 30px;
}
</style>