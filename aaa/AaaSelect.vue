<template>
  <a-select show-search v-model='val' :disabled='disabled' :placeholder='placeholder'
            :dropdownMatchSelectWidth='true'
             :mode="mode ? 'multiple' : 'none'"
            :filter-option='page===true?false:filterOption' :allowClear='clear'
            @change='change' @search='search' @dropdownVisibleChange='downOpen'>
    <a-select-option v-for='(it,i) in list' :disabled='it.enable===false?true:false' :value='it.value' :key="'A'+i">
      {{ it.label }}
    </a-select-option>
    <slot />
  </a-select>
</template>

<script>

export default {
  name: 'AaaSelect',
  props: {
    disabled: {
      Boolean,
      default: false
    },
    mode:{
      type:Boolean,
      default:false
    },
    value: {
      type: Number | String
    },
    defaultval: {
      type: Number | String
    },
    url: {
      type: String
    },
    // 字典code
    code: {
      type: String,
      default: ''
    },
    p: {
      type: String
    },
    pvalue: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    },
    dict: {
      type: Array
    },
    page: {
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
  data() {
    return {
      list: [],
      val: this.value
    }
  },
  watch: {
    url() {
      this.getList()
    },
    pvalue(n) {
      this.getList()
    },
    dict(n) {
      this.list = n
    },
    value(n) {
      this.getVal(n)
    }
  },
  methods: {
    getVal(n) {
      this.val = n
      if (!n) {
        this.val = this.defaultval
        this.$emit('search', this.val)
        this.$emit('input', this.val)
      }
    },
    search(value) {
      if (value) {
        this.$emit('search', value)
      }
    },
    filterOption(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    change(v) {
      let obj = ''
      if (this.list) {
        obj = this.list.find(it => {
          return it.value === v
        })
      }
      this.$emit('input', v)
      this.$emit('obj', obj)
    },
    downOpen() {
      if (this.down) {
        this.down()
      }
      this.$emit('down')
    },
    async getList() {
      this.list = []
      if (this.dict) {
        this.list = this.dict
      } else {
        let url = this.url
        if (this.code) {
          url = `/sysDict/get?type=${this.code}`
          if (this.p === '1') {
            // p==='1' 在pvalue有值的时候才会去请求数据
            if (!this.pvalue) {
              return false
            }
            url = `/sysDict/get?type=${this.code}&pvalue=${this.pvalue}`
          }
        }
        if (url) {
          this.list = await this.$api.result(url)
          this.$emit('data', this.list)
          if (this.p === '1' && this.value) {
            let obj = this.list.find(it => it.value === this.value)
            if (!obj) {
              this.$emit('input', '')
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getVal(this.value)
    this.getList()
  }
}
</script>

<style scoped>

</style>