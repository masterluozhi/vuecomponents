<template>
  <a-time-picker v-model='val' format='HH:mm:ss' @change='change' :disabled='dis' />
</template>

<script>
import moment from 'moment'

export default {
  name: 'AaaTime',
  props: {
    value: {},
    dis: {
      type: Boolean,
      default: false
    },
    now: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      val: ''
    }
  },
  watch: {
    value(o, n) {
      this.getVal()
    }
  },
  methods: {
    change(x, x2) {
      this.$emit('input', x2)
    },
    getVal() {
      this.val = ''
      let abc = ''
      if (this.now === true && !this.value) {
        abc = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.value) {
        abc = moment().format('YYYY-MM-DD') + ' ' + this.value + ':00'
      }
      if (abc) {
        this.val = abc
      }
    }
  },
  created() {
    this.getVal()
  }
}
</script>

<style scoped>

</style>