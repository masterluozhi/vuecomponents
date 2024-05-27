<template>
  <aaa-select v-model='val' :dict='list' @search='getList' @down='toDown' :page='true' :placeholder='placeholder'
              :disabled='dis'
              @input='changePage'
              :clear='clear' :down='down'>
    <a-select-option value='next' disabled v-if='total>pageSize'>
      <a-icon type='caret-left' title='上一页' :style='`color:${config.primaryColor};font-size: 18px;`'
              @click='pre()' />
      <span :style='`color:${config.fontColor};`'>{{ page }}/{{ totalPage }} </span>
      <a-icon type='caret-right' title='下一页' :style='`color:${config.primaryColor};font-size: 18px;`'
              @click='next()' />
      <span :style='`color:${config.fontColor};`'>共{{ total }}条</span>
    </a-select-option>
  </aaa-select>
</template>

<script>
import config from '@/config/defaultSettings'
import { page } from './api'

export default {
  name: 'AaaSelectPage',
  props: {
    value: {
      type: [String, Number]
    },
    url: {
      type: String
    },
    placeholder: {
      type: String
    },
    top: {
      type: Object
    },
    dis: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: true
    },
    down: {
      type: Function
    }
  },
  computed: {
    totalPage() {
      let a = (this.total - 1) / this.pageSize + 1
      a = a === 0.9 ? 1 : a
      return parseInt(a)
    }
  },
  data() {
    return {
      config: config,
      page: 1,
      pageSize: 100,
      total: 0,
      list: [],
      val: this.value,
      str: ''
    }
  },
  watch: {
    val(n) {
      this.$emit('input', n)
    },
    value(n) {
      this.val = n ? n : ''
    }
  },
  methods: {
    changePage(n){
      this.$emit('changePage', n)
    },
    pre() {
      if (this.page > 1) {
        this.page = this.page - 1
        this.getList(this.str)
      }
    },
    next() {
      if (this.page >= this.totalPage) {
        return false
      }
      this.page = this.page + 1
      this.getList(this.str)
    },
    toDown() {
      if (this.str) {
        this.getList('')
      }
    },
    getList(v) {
      if (!this.url) {
        return
      }
      this.str = v
      const vo = {
        current: this.page,
        pageSize: this.pageSize
      }
      let obj = Object.assign(vo, {})
      if (v) {
        obj = Object.assign({ str: v }, obj)
      }
      page(this.url, obj).then((res) => {
        this.total = res.result.total
        this.list = res.result.records
        if (this.top) {
          this.list.unshift(this.top)
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>

</style>