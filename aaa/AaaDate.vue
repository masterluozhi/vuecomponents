<template>
  <el-date-picker
    v-if="isSelect!=='true'"
    v-model='onVal'
    type='datetime'
    size='small'
    format='yyyy-MM-dd HH:mm:ss'
    :disabled='disabled'
    @change='changeTime'
    :clearable='!now'
    style='width: 100%;'
    :value-format="type==='dateTime'?'yyyy-MM-dd HH:mm:ss':type==='minute'?'yyyy-MM-dd HH:mm':'yyyy-MM-dd'"
    :picker-options='options'
    :placeholder="placeholder || '选择日期时间'">
  </el-date-picker>

  <el-date-picker
    v-else
    v-model='onVal'
    type='datetimerange'
    format='yyyy-MM-dd HH:mm'
    :value-format="type==='dateTime'?'yyyy-MM-dd HH:mm:ss':type==='minute'?'yyyy-MM-dd HH:mm':'yyyy-MM-dd'"
    align='right'
    size='small'
    @change='changeTime'
    unlink-panels
    :disabled='disabled'
    range-separator='-'
    start-placeholder='开始日期'
    end-placeholder='结束日期'
    :picker-options='pickerOptions'
  >
  </el-date-picker>

</template>

<script>
import moment from 'moment'

export default {
  name: 'AaaDate',
  props: {
    afterOrBefore: {
      type: String,
      default: ''
    },
    isSelect: {
      type: String,
      default: 'false'
    },
    checkDate:{
      type: Array | String,
      default: () => {
        []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'dateTime'
    },
    value: {
      type: Array | String,
      default: () => {
        []
      }
    },
    now: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let self = this
    return {
      onVal: this.value,
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            picker.$emit('pick', [start,new Date()])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        } ,{
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      options: {
        disabledDate(time) {
          return self.beforeOrAfter(time)
        }
      }
    }
  },
  watch: {
    value(n) {
      if (this.now === true) {
        n = n ? n : moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.onVal = n
    },
    onVal(n) {
      this.$emit('input', n)
    }
  },
  created() {
    if (this.now === true) {
      this.onVal = this.value ? this.value : moment().format('YYYY-MM-DD HH:mm:ss')
    }
    if(this.checkDate){
      this.onVal = this.checkDate
    }
  },
  methods: {
    changeTime(x) {
      if (null != x) {
        this.onVal = x
      } else {
        this.onVal = ''
        this.$emit('input','')
      }
      this.$emit('changeTime', this.onVal)
    },
    beforeOrAfter(time) {
      if (this.afterOrBefore === 'after') {
        return time.getTime() <= Date.now()
      }else if(this.afterOrBefore !=='none'){
         return time.getTime() > Date.now()
      }
    },

  }
}
</script>

<style scoped>
</style>