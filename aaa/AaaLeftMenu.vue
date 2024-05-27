<template>
    <div>
        <a-layout>
            <a-layout-sider style='background-color: #ffffff;margin-right: 3px;' :width='$width*0.15'>
                <aaa-tree :config="tree" ref='tree' :key='keys'/>
            </a-layout-sider>
            <a-layout-content style="padding:0px 3px;">
               <component :is="div" v-if="div"/>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>

let Int
export default {
  name: 'aaa-left-menu',
  props: {
    list: {
      type: Array
    },
    permId: {
      type: String
    },
    width: {
      type: Int
    }
  },
  data() {
    return {
      keys:'',
      div: '',
      refreshDiv: true,
      tree: {
        url: `/reportBreed/getReportList/${this.permId}`,
        click: e => {
          let obj = this.list.find(it => {
            return it.id === e.id
          })
          if (obj) {
            this.div = obj.div
          } else {
            this.div = ''
          }
        }
      }
    }
  },
  methods: {
    setRefreshDiv() {
      this.refreshDiv = false
      this.$nextTick(() => {
        this.refreshDiv = true
      })
    },
    click(e){
      let obj ={
        id:e,
        name:'XXXXX'
      }
      this.$refs.tree.click(obj,e);
    }
  }
}
</script>

<style scoped>

</style>