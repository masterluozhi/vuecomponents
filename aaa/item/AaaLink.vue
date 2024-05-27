<template>
  <span>
    <a v-if='obj.cli && obj.root != null && obj.root(obj)'  href='javascript:void(0)' class='aaaEllipsis' :title='obj.name' @click='obj.cli'>
      <span  :style="{'color': obj.colorObvious? obj.colorObvious:'red'}">{{ obj.name }}</span>
    </a>
    <a v-else-if='obj.cli' style="textDecoration :none;" href='javascript:void(0)' class='aaaEllipsis' :title='obj.name' @click='obj.cli'>
       <span class="aaaInfo" :style="{'color': obj.color? obj.color:'#00a8e8'}">{{ obj.name }}</span>
    </a>
    <a v-else-if='obj' class='aaaEllipsis' target='_blank' :title='obj.name' :href='getUrl()'
        :style="{'color': obj.color ? obj.color:'red'}">
      {{ obj.name }}
    <slot />
    </a>
  </span>
</template>

<script>
import { getHref } from '@/utils/util'
  //text-decoration:none !important;
export default {
  name: 'AaaLink',
  props: {
    obj: Object,
  },
  methods: {
    getUrl() {
      if (this.obj) {
        return getHref(this.obj.link)
      }
      return ''
    },
  }
}
</script>

<style scoped>
.aaaEllipsis {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.aaaInfo:hover{
    text-decoration:none !important;
    border-bottom:0px !important;
  }
</style>