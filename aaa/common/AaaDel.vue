<template>
  <span v-if="url&&(!auth||$auth(auth+':del'))">
    <a-button type='link' size='small' style='color:red;' @click='doDel()'>
      删除
    </a-button>
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { del } from '../api'

export default {
  name: 'AaaDel',
  props: {
    url: {
      type: String
    },
    id: {
      type: [String, Number]
    },
    auth: {
      type: String
    }
  },
  methods: {
    doDel() {
      Modal.confirm({
        title: '确认删除',
        content: '您确认删除此条数据吗?',
        onOk: () => {
          del(this.url, { id: this.id }).then((res) => {
            this.$message.success('删除成功')
            this.$emit('change', 'del')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>