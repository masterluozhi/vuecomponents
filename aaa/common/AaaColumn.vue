<template>
  <span>
    <template v-for='(it,i) of columns'>
      <u-table-column
        v-if="!it.children"
        :width="it.width"
        :prop="it.dataIndex"
        :label="it.title"
        :sortable="it.sort"
        scoped-slot="myHead"
        align="center">
        <template v-slot="{ row,$index }">
          <!-- 日期-->
           <span v-if="it.title==='序号'"  class='aaaEllipsis'>
             {{ row[it.dataIndex] }}
           </span>
           <!-- 名字与id互转-->
           <span v-else-if="it.type==='idToName'"  class='aaaEllipsis'>
                  <aaa-id-to-name
                    :ids.sync="row[it.dataIndex]"
                    :tableName="it.tableName"
                    :name='it.name'
                    :toName="it.toName"
                    :disabled = "true"
                    type="table"
                    />
           </span>
           
          <span v-else-if='it.date' class='aaaEllipsis'>
            <span v-if='edit!==$index'>
            {{ getDate(row[it.dataIndex], it.date === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm:ss') }}
            </span>
            <span v-else class='mj-edit'>
              {{ getDate(row[it.dataIndex], it.date === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm:ss') }}
            </span>
          </span>
          <!--标签-->
          <div v-else-if='it.tag===true'>
             <a-tag v-for='(it,i) in getTag(row[it.dataIndex])' :key='i'>{{ it }}</a-tag>
          </div>
          
          <!--图片-->
          <div v-else-if='it.tag===true'>
            <img v-if='row[it.dataIndex]' :src='row[it.dataIndex]'
                 :style='`width:${it.width}px;height: 60px;`' />
          </div>
          
          <!--链接-->
          <a v-else-if="it.type==='link'" :href='getHref(row[it.dataIndex])' target='_blank' rel='noopener noreferrer'
             class='aaaEllipsis' style='color: darkblue'>{{ row[it.dataIndex] }}</a>
          <!--开关-->
          <a-switch v-else-if="it.type==='switch'" v-model='row[it.dataIndex]'
                    :checked-children="it.checked"
                    :un-checked-children="it.unchecked"
                    :disabled='!it.dis'
                    @change='changeSwitch(row,it)' />
          <!-- 其他-->
          <span v-else class='aaaEllipsis'>
            <span v-if='edit!==$index'>
              <span v-if='it.btn!==false&&colBtn===true'>
                <aaa-link  :obj='{name:getInfo(it,row[it.dataIndex],row),
                cli:e=>colDo(it,row),
                noCli:e=>colDo(it,row),
                row:row,index:it.dataIndex,
                root:root,
                color:color,
                colorObvious:colorObvious
                }'>
              </aaa-link>
              </span>
              <span v-else :style="styleCont(it,row)">{{ getInfo(it, row[it.dataIndex], row) }}</span>
            </span>
            <span v-else class='mj-edit'>{{ getInfo(it, row[it.dataIndex], row) }}</span>
          </span>
        </template>
      </u-table-column>
      <u-table-column :key='i' v-if='it.children' :label='it.title' align='center'>
        <aaa-column :columns='it.children' />
      </u-table-column>
    </template>
    <slot name='do'></slot>
  </span>
</template>

<script>
import dateUtil from '../../../utils/dateUtil'
import AaaIdToName from '../item/AaaIdToName.vue'
import { getHref } from '@/utils/util'

export default {
  name: 'AaaColumn',
  components: { AaaIdToName },
  props: {
    columns: {
      type: Array
    },
    color: {
      type:String
    },
    colorObvious: {
      type: String
    },
    edit: {
      type: [String, Number]
    },
    colBtn: {
      type: Boolean
    },
    root:{
      type:Function
    }
  },
  mounted() {
    this.$emit('success', '1')
  },
  methods: {
    styleCont(e,row){
      if(e.Judge){
        return e.Judge(this.getInfo(e, row[e.dataIndex], row))
      }
    },
    getInfo(it, v, row) {
      if (it.dict) { // 字典
        if (row.children && row.children.length > 0) {
          let str = ''
          let i = 0
          let len = row.children.length
          for (let b of row.children) {
            i++
            str = str + this.getDict(b[it.dataIndex], it.dict)
            if (i < len) {
              str = str + '/'
            }
          }
          return str
        }
        let dictVal = this.getDict(v, it.dict)
        if(dictVal){
          return dictVal
        }
        return v
      } else if (it.toNowMonth === true) { // 现在多少月
        return dateUtil.toNowMonth(v)
      } else if (it.date === true){
        return v.replace("T"," ")
      } else if (it.toNowDay === true) { // 离现在多少天
        return dateUtil.toNowDay(v)
      } else if (it.end) {
        let end = it.end === 'now' ? new Date() : row[it.end]
        return dateUtil.toDay(v, end)
      } else if (it.start) {
        let start = it.start === 'now' ? new Date() : row[it.start]
        return dateUtil.toDay(start, v)
      } else if (it.path) {
        if (row[it.path]) { // 路径名称
          let arr = row[it.path].split('/')
          let len = arr.length
          if (it.pathIndex < len && it.pathIndex > -1) {
            let str = arr[it.pathIndex]
            return str ? str : ''
          }
        }
        return ''
      } else if (it.fileSize === true) {
        // 格式化文件大小
        if (v && v >= 1024) {
          let a = (v / 1024).toFixed(2)
          if (a < 1024) {
            return a + ' kb'
          }
          return (a / 1024).toFixed(2) + ' MB'
        }
        return ''
      } else if (typeof (it.divide) == 'string') {
        // 相除
        if (v && row[it.divide] && row[it.divide] !== 0) {
          return ((v / row[it.divide]) * 100).toFixed(2)+'%'
        }
        return '0%'
      } else if (it.divide) {
        // 除以位数
        return (v / it.divide).toFixed(2)
      } else if (it.rev) {
        // 除以位数
        let a = ''
        if (v && v.length === 4) {
          a = 'V' + v.substring(0, 1) + '.' + v.substring(1, 2) + '.' + v.substring(2, 4)
          return a
        }
        return ''
        return (v / it.divide).toFixed(2)
      } else if(it.hwRev){
        // 除以位数
        let a = ''
        if (v && v.length == 2 || v && v.length === 4){
          a = 'V' + v.substring(0, 1) + '.' + v.substring(1, 2)
          return a
        }
        return ''
      } else {
        return v
      }
    },
    getDict(v, dict) { // 字典
      let obj
      if (dict && dict.length > 0) {
        obj = dict.find(it => {
          return it.value === v + ''
        })
      }
      return obj ? obj.label : ''
    },
    getDate(v, p) {
      return dateUtil.format(v, p)
    },
    getTag(v) {
      return v.split(',')
    },
    changeSwitch(row, it) {
      if (it.fun) {
        it.fun(row)
      }
    },
    getHref(v) {
      return getHref(v)
    },
    colDo(it, row) {
      this.$emit('colDo', { it: it, row: row })
    },
    myHead(h, { column }) {
      if (column.label === '序号') {
        column.width = 60
        column.resizable = false
      } else {
        let obj = this.columns.find(key => key.title === column.label)
        let a = 16 * column.label.length + 20
        if (obj && obj.date) {
          if (a < 154 && obj.date === true) {
            a = 154
          } else if (a < 94 && obj.date === 'date') {
            a = 94
          }
        } else if (obj && obj.px) {
          a = obj.px
        }
        column.minWidth = a
      }
      return h('div', {
        class: 'table-head',
        style: {
          width: '100%',
          verticalAlign: 'middle',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        },
        attrs: {
          title: column.label
        }
      }, [column.label])
    }
  }
}
</script>

<style scoped>
.mj-edit {
color: #2120ff;
}

.aaaEllipsis {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>