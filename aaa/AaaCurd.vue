<template>
  <div v-if="config" class="plTableBox">
    <md-card
      :style="{ height: $height - height + 'px', boxShadow: headerOf ? '' : '0 0px 0px 0 rgb(0 0 0 / 14%)' }"
      style="margin-bottom: 3px;"
    >
      <md-card-header data-background-color="custom" style="padding-bottom: 5px; padding-top: 5px; min-height: 60px">
        
          <h5 class="title"  style="font-size: 16px; height:10px margin-bottom: 0px!important; ">
            <span> {{ title }} </span>
          </h5>

        <p class="category" v-show="config.query">
          <aaa-query ref='aaaQuery' :config="config.query" :query="queryForm" v-if="queryShow" @query="query" @obj="changeQuery">
            <a-form-item
              v-if="
                (config.tool !== false && !config.auth) ||
                $auth(config.auth + ':tool') ||
                (config.tools && config.tools.length > 0)|| (config.toolOther !== false && !config.auth)"
              >
               <md-button
                  v-if="(config.tool !== false && !config.auth) || $auth(config.auth + ':tool')"
                  class="md-raised"
                  style="
                    height: 34px;
                    line-height: 34px;
                    font-size: 14px;
                    background-color: #f0f9eb;
                    margin-top: 3px;
                    min-width: 36px;
                    float: left;
                    font-weight: bold;
                    margin-right: 5px;"
                  @click="add()"
                >
                <i class="el-icon-plus"></i>
                {{ config.toolLabel ? config.toolLabel : '添加' }}
              </md-button>
              <aaa-tools :config="config.tools" />
            </a-form-item>
            <slot name="tools" />
          </aaa-query>
        </p>
      </md-card-header>
      <md-card-content>
        <u-table
          class="mjTable"
          v-if="refreshCol"
          :data="data"
          :style="{ height: $height - 305 + 'px' }"
          style="overflow: auto;"
          :beautify-table="false"
          @header-dragend="changePx"
          :tree-props="{ children: 'children' }"
          @sort-change="changeSort"
          @selection-change="check"
          @row-click="rowCli"
          :row-key="config.rowKeyNone ? '' : 'id'" >
          
          <u-table-column type="selection" v-if="config.check || config.delBatch" width="55" align="center" />
          <u-table-column width="1px" v-show="false" align="center" />

          <aaa-column :columns="col" 
                      :edit="editIndex" 
                      :col-btn="config.colDo ? true : false" 
                      @colDo="colDo" 
                      :root="config.root" 
                      :color="config.color"
                      :colorObvious="config.colorObvious">
            <div slot="do" v-if="!config.noInput">
              <u-table-column
                label="操作"
                align="center"
                :width="config.doWidth ? config.doWidth : '140px'"
                key="action"
              >
                <template v-slot="{ row, $index }">
                  <div v-if="row['son'] !== true">
                    <span v-if="editIndex === $index">
                      <a-button size="small" style="color: #2120ff" @click="cancelCol"> 取消 </a-button>
                    </span>

                    <div v-else>
                      <a-button
                        size="small"
                        v-if="config.editCol"
                        @click="editCol(row, $index)"
                        class="aaaEllipsis"
                        style="color: #0091b6"
                      >
                        编辑
                      </a-button>

                      <a-button
                        size="small"
                        v-if="config.dialong === true"
                        @nclick.stop="dialong(row.id)"
                        class="aaaEllipsis"
                        style="color: #0091b6"
                      >
                        {{ '详情' }}
                      </a-button>

                      <a-button
                        size="small"
                        v-if="config.info !== false && config.action !== false"
                        @click="action(row)"
                        class="aaaEllipsis"
                        style="color: #0091b6"
                      >
                        {{ config.actionLabel ? config.actionLabel : '详情' }}
                      </a-button>

                      <a-button
                        size="small"
                        v-for="(btn, i) in config.actions"
                        :key="i"
                        v-if="!btn.auth || $auth(btn.auth)"
                        @click="btn.fun(row)"
                        style="color: #0091b6">
                        {{ btn.label ? btn.label : '详情' }}
                      </a-button>
                      <a-button
                        v-if='config.specialAction&&config.specialAction.value.includes(row[config.specialAction.key])'
                        size="small"
                        @click="config.specialAction.fun(row)"
                        style="color: #0091b6">
                        {{ config.specialAction.label ? config.specialAction.label : '详情' }}
                      </a-button>

                      <slot name="actions" :row="row" />
                      <aaa-del :url="config.del" :id="row.id" @change="delOne" />
                    </div>
                  </div>
                </template>
              </u-table-column>
            </div>
          </aaa-column>
        </u-table>
        <div v-if="config.page !== false" style="background: white; padding: 15px 15px">
          <a-button
            type="danger"
            v-if="config.delBatch"
            :disabled="checkId.length <= 0"
            size="small"
            @click="doDelBatch()"
            style="float: left"
          >
            删除({{ checkId.length }})
          </a-button>
          
          <a-pagination
            style="text-align: right"
            size="small"
            show-less-items
            v-model="pageObj.current"
            :page-size.sync="pageObj.limit"
            :total="pageObj.total"
            :show-total="(total) => `共 ${total} 条`"
            @change="getList()"
          />
        </div>

        <aaa-form
          ref="form"
          :config="config.form"
          :paging="config.url"
          v-model="onForm"
          v-if="dalog && cancelClose"
          @cancel = 'close'
          @close = 'close'
          @change="getList"
          :place="$slots.tree ? $width * 0.316 : $width * 0.6"
          :tabs="tabs"
          @submit="(item)=>{this.$emit('submit', item)}"
          @tabs="(item)=>{this.$emit('tabsClick', item)}"
          @error="(item)=>{this.$emit('error', item)}"
        >
          <div :style="{ width: $width * 0.27 + 'px' }" style="float: left" v-if="$slots.tree">
            <slot name="tree" />
          </div>

          <div
            :style="{ width: $slots.tree ? $width * 0.316 + 'px' : $width * 0.58 + 'px' }"
            style="float: left; margin-top: 25px"
          >
            <slot name="form" />

          </div>
        </aaa-form>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
import { del, page } from './api'
import AaaQuery from './common/AaaQuery'
import AaaTools from './common/AaaTools'
import AaaDel from './common/AaaDel'
import AaaColumn from './common/AaaColumn'
import { Modal } from 'ant-design-vue'

export default {
  name: 'AaaTable',
  components: { AaaColumn, AaaTools, AaaQuery, AaaDel },
  props: {
    value: {
      type: Object,
    },
    headerOf: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 165,
    },
    list: {
      type: Array,
    },
    title: {
      type: String,
      default: '您需关注的表单',
    },
    dalog: {
      type: Boolean,
      default: true,
    },
    tabs:{
      type:Array,
      default:()=>{
        return []
      }
    },
    config: {
      type: [Object, String],
      default() {
        return {
          url: '',
          query: [],
        }
      },
    },
  },
  data() {
    return {
      onDo: 0,
      cancelClose: true,
      onForm: this.value,
      queryForm: {},
      queryShow:true,
      sortStr: '',
      sortType: '',
      col: [],
      refreshCol: true,
      data: [],
      through:[],
      whetherWath:false,
      pageObj: {
        total: 0,
        current: 1,
        limit: 10,
      },
      // 选中获取的值
      checkId: [],
      editIndex: '',
      // 是否存在操作栏
      hasAction: true,
    }
  },
  watch: {
    'pageObj.limit'(n) {
      this.getList()
    },
    onForm: {
      deep: true,
      handler: function (n, o) {
        this.$emit('input', n)
      },
    },
    value(n) {
      this.onForm = n
    },
    'config.where': {
      deep: true, //深度监听设置为 true
      handler: function (n,o) {
        this.queryShow = false
        this.$nextTick(()=>{
          this.queryShow = true
        })
        if (n) {
          this.query(n)
        }
      },
    },
    'config.columns': {
      deep: true, //深度监听设置为 true
      handler: function (n, o) {
          this.getCol()
      },
    },
  },
  methods: {
    close(){
      this.cancelClose = false
      this.$nextTick(()=>{
        this.cancelClose = true
      })
      this.$emit('close',false)
    },
    holdSubmit(e){
       this.$refs.form.holdSubmit()
       this.$nextTick(()=>{
         this.$refs.form.holdSubmit()
       })
      this.$emit('submit',false)
    },
    changePx(nw, ow, col, evt) {
      if (nw < ow && nw <= 84) {
        let len = col.label.length
        if (col.label === '操作') {
          let a = 89
          if (nw < a) {
            col.width = a
          }
        } else if (len < 4) {
          let f = 16 //每个字大小
          let a = f * len + 20
          if (nw < a) {
            col.width = a
          }
        } else {
          col.width = 84
        }
      }
    },
    delOne() {
      this.getList()
      if (this.config.delFun) {
        this.config.delFun()
      }
    },
    changeQuery(e) {
      this.$emit('query', e)
    },
    // 单元格编辑------------start------------------
    editCol(row, index) {
      this.editIndex = index
      this.config.editCol(row)
    },
    cancelCol() {
      this.editIndex = ''
      this.config.notEditCol()
    },
    // 单元格点击
    colDo(e) {
      if (this.config.colDo) {
        this.config.colDo(e)
      }
    },
    // 单元格编辑------------end------------------
    // 排序
    changeSort(v, prop, order) {
      this.sortStr = v.prop
      this.sortType = v.order
    },
    check(v) {
      if (this.config.check) {
        this.config.check(v)
      }
      let ids = []
      for (let a of v) {
        ids.push(a.id)
      }
      this.checkId = ids
    },
    post(url, tip, fun = '') {
      this.$refs.form.post(url, tip, fun)
    },
    put(url, tip, fun) {
      this.$refs.form.put(url, tip, fun)
    },
    add() {
      let obj = {}
      if (this.config.tool) {
        obj = this.config.tool()
      }
      this.$refs.form.add(obj)
    },
    action(record) {
      let record2 = JSON.parse(JSON.stringify(record))
      let obj = {}
      if (this.config.action) {
        obj = this.config.action(record2)
        // 清除表单
        if (obj && obj.clear === true) {
          delete obj.clear
          this.$refs.form.info(obj)
          return false
        }
        if (obj) {
          this.$refs.form.info(Object.assign({}, record2, obj))
          return false
        }
      }
      this.$refs.form.info(record2)
    },
    query(e) {
      this.$emit("clickQuery",e)
      this.queryForm = e
      this.pageObj.current = 1
      if(this.$refs.aaaQuery &&  this.$refs.aaaQuery.changeDisable(true)){
        this.$nextTick(()=>{
          this.$refs.aaaQuery.changeDisable(true)
        })
      }
      this.getList()
    },
    changeTable(e) {
      this.pageObj.current = e.current
      this.pageObj.pageSize = e.pageSize
      this.getList()
    },
    getCol() {
      if (!this.config) {
        return
      }
      for (let o of this.config.columns) {
        if (o.dataIndex === 'cowId') {
          o['type'] = 'idToName'
         } //else if (o.title === '计步器号') {
        //   o['sort'] = true
        // } else if (o.dataIndex === 'sn') {
        //   o['sort'] = true
        // }
        //未做排序！请注意
      }
      if( !this.config.xh){
      this.col = [{ dataIndex: 'xh', title: '序号', px: 65, width: 75, btn: false, resizable: true }]
      }
       /* let arr = []
      arr = JSON.parse(JSON.stringify(this.config.columns))
      arr.unshift({ dataIndex: 'xh', title: '序号', px: 65, width: 62, btn: false, resizable: true })
      this.col = JSON.parse(JSON.stringify(arr)) */
      this.col = this.col.concat(this.config.columns)
      // 没有操作栏
      this.hasAction = true
      if (!(this.config.action !== false || this.config.del || this.config.actions || this.config.dialong)) {
        this.hasAction = false
        //最后一列不可伸缩
        // this.col[this.col.length - 1]['resizable'] = false
      }
      this.setRefreshCol()
       if(!this.whetherWath){
          this.getList()
        }
    },
    setRefreshCol() {
      this.refreshCol = false
      this.$nextTick(() => {
        this.refreshCol = true
      })
    },
    closeGetList(){
      this.getList();
    },
    getList() {
      if (!this.config) {
        return
      }
      if (!this.config.url) {
        this.$emit('tableValue', this.list)
        this.data = this.list
        this.setTableIndex(this.data)
        return
      }
      let obj = Object.assign({}, this.queryForm)
      if (this.config.where) {
        obj = Object.assign(this.config.where, obj)
      }
      const vo = {
        current: this.pageObj.current,
        pageSize: this.pageObj.limit,
      }
      obj = Object.assign(obj, vo)
        page(this.config.url, obj).then((res) => {

          if(res.result){
            this.through =  res.result.records || res.result
          }
		  if(this.$refs.aaaQuery){
			  this.$refs.aaaQuery.changeDisable(false)
		  }

          this.$emit('tableValue', this.through)
          this.data = this.through
          this.pageObj.total = res.result.total
          if (this.data && this.data.length > 0) {
            this.setTableIndex(this.data)
          }
          if (this.config.change) {
            this.config.change({ total: this.pageObj.total, row: this.data })
          }
        },
        ).catch((res)=>{
			if(this.$refs.aaaQuery){
						  this.$refs.aaaQuery.changeDisable(false)
			}
        })
    },
    
    setData(val){
      this.through = val
    },
  
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.xh = (this.pageObj.current - 1) * this.pageObj.limit + key + 1
        if (index) {
          item.xh = ''
        }
        if (item.children) {
          this.setTableIndex(item.children, item.xh)
        }
      })
    },
    rowCli(row, column) {
      if (this.config.doRow) {
        this.config.doRow(row)
      }
    },
    doDelBatch() {
      Modal.confirm({
        title: '确认删除',
        content: '您确认删除选中的数据吗?',
        onOk: () => {
          del(this.config.delBatch, { ids: this.checkId.toString() }).then((res) => {
            this.$message.success('删除成功')
            this.getList()
          })
        },
      })
    },
    dialong(id) {
      this.$emit('dialong', id)
    },
    openDia() {
      this.dialogVisible = true
    },
  },
  created() {
    this.getCol()
  },
}
</script>

<style>
/*.table-head {*/
/*  vertical-align: middle;*/
/*  overflow: hidden;*/
/*  white-space: nowrap;*/
/*  text-overflow: ellipsis;*/
/*}*/
.ant-btn-link {
  border: none;
}

.aaa-tool {
  margin-bottom: 10px;
}

.plTableBox .el-table th .cell {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
}

.plTableBox .el-table th:hover {
  border-right: 1px solid #808284 !important;
}
/* .category form-item{
  margin-top: -2px;
} */

.plTableBox .el-table th.gutter {
  display: table-cell !important;
}


.plTableBox .el-table th .caret-wrapper {
  position: absolute;
  margin-top: -4px;
}
.plTableBox .el-table th {
  color: #209cbb;
  background-color: #f5f6f7 !important;
  border-right: 1px solid #ebeef5 !important;
  margin-bottom: -1px !important;
}
.plTableBox .el-table td {
  font: 12px/1.5 Tahoma, Helvetica, Arial, ‘宋体’, sans-serif;
  font-size: 14px;
  color: #000;
}
.plTableBox .el-table__header-wrapper {
  border-bottom: 1px solid #ebeef5 !important;
}
/* .ant-form-item-label label{
    color:#f0f0f0;
  } */
</style>
