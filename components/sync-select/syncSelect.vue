<template>
  <i-select :model.sync="value" query-mode="server1" @on-query="doQuery" :filterable="!disabled" clearable
            v-ref:select :disabled="disabled" :placeholder="placeholder" :disabled="disabled" :label-in-value="labelInValue" @on-change="change">
    <i-option v-for="item in items" :value="item[valueMember]" @click="_select(item)">{{ item[displayMember] }}
    </i-option>
    <div v-if="items.length == 0 && !loading">{{{noDataText}}}</div>
    <div class="loading" v-if="loading"></div>
    <div slot="page" v-if="showPagination && pageable">
      <Page :total="totalSize" :page-size="pageSize" :current="current" size="small" @on-change="_changePage"
            simple></Page>
    </div>
  </i-select>
</template>
<script>
  /**
   * @options
   *
   * valueMember 返回数据值属性名
   * displayMember 返回数据显示值属性名
   * url 请求数据url
   * value.sync 值
   * valueDisplay 显示值
   * disabled 设置禁用状态
   * searchKey 搜索时传递的关键字字段名称
   * placeholder placeholder
   * pageableSetting 返回数据中分页参数配置 {totalRoot, pageSizeRoot, pageNumberRoot, root}
   * noDataText 没有数据提示文字
   * labelInValue 在返回选项时，是否将 label 和 value 一并返回，默认只返回 value
   *
   *
   * @example
   *  <sync-select url="/wec-devops-tenant/tenantApp/getAppListByTenant" display-member="appName" value-member="appId" :page-size="4" :value="value" :value-display="valueDisplay" :params="params"></sync-select>
   */

  import DataAdapter from '../../utils/dataAdapter'

  export default {
    props: {
      url: String,
      value: {
        type: [String, Number, Boolean],
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false
      },
      displayMember: {
        type: String,
        default: 'name'
      },
      valueMember: {
        type: String,
        default: 'code'
      },
      pageSize: {
        type: Number,
        default: 10
      },

      pageable: {
        type: Boolean,
        default: true
      },

      searchKey:{
        type:String,
        default:'searchContent'
      },

      currentMember: Object,

      valueDisplay: String,

      params: Object,

      pageableSetting: {
        type: Object,
        default: function () {
          return {}
        }
      },

      noDataText: {
        type: String,
        default: '暂无数据'
      },

      placeholder: {
        type: String,
        default:'请选择'
      },

      labelInValue:{
        type:Boolean,
        default:false
      }
    },

    computed: {
      showPagination(){
        var show = false

        if (this.items.length > 0 && this.totalSize > this.pageSize) {
          show = true
        }

        return show
      }
    },

    watch: {
      value: function (newVal) {
        if (newVal == '') {
          this.valueDisplay = ''
          this.$refs.select.query = ''
        }
      },
      'params': function () {
        if (this.hasReady) {
          this.__fetchData()
        }
      }
    },

    created(){
      this.dataAdapter = new DataAdapter({
        url: this.url,
        totalRoot: this.pageableSetting.totalRoot || 'datas>totalSize',
        pageSizeRoot: this.pageableSetting.pageSizeRoot || 'datas>pageSize',
        pageNumberRoot: this.pageableSetting.pageNumberRoot || 'datas>pageNumber',
        root: this.pageableSetting.root || 'datas>rows'
      })
    },

    ready(){
      this.hasReady = true
      if (this.valueDisplay) {
        var selected = {}
        selected[this.displayMember] = this.valueDisplay
        selected[this.valueMember] = this.value
        this.items = [selected]
      }
      this.__fetchData()
    },

    data: function () {
      return {
        hasReady: false,
        loading: false,
        items: [],
        totalSize: 0,
        current: 1,
        searchContent: ''
      }
    },

    methods: {
      reload(){
        this.__fetchData()
      },

      __fetchData(){
        var searchContent = {}
        searchContent[this.searchKey] = this.searchContent

        var params = Object.assign({}, this.params, searchContent)

        this.dataAdapter.load(this.pageSize, this.current, params).then( (res) => {
          this.totalSize = res.total
          this.items = res.list
        })
      },

      doQuery(searchContent){
        this.current = 1
        this.value = ''
        this.searchContent = searchContent
        this.__fetchData()
      },

      _changePage(pageNumber){
        this.current = pageNumber
        this.__fetchData()
      },

      _select(item){
        this.currentMember = item
        this.valueDisplay = item[this.displayMember]
      },

      change(val){
        this.$emit('on-change', val)
      }
    }
  }
</script>
<style scoped>
  .loading {
    color: #666;
    width: 16px;
    height: 16px;
    background: url(data:image/gif;base64,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) no-repeat;
  }
</style>
