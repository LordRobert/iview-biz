<template>
  <div>
    <slot></slot>
    <slot name="empty" v-if="options.listData.length == 0 && !isLoading && pageNumber === 1"></slot>
    <div v-else>
      <div style="margin: 10px;overflow: hidden" v-if="options.pageable !== false">
        <div style="float: right;">
          <Page :total="total" :current="pageNumber" @on-change="onChange"
                @on-page-size-change="onPageSizeChange" :show-sizer="options.showSizer!==false"
                :page-size="pageSize" :page-size-opts="options.pageSizeOpts || [10, 20, 30, 40]"
                :show-elevator="options.showElevator!==false" :show-total="options.showTotal!==false"
                :simple="options.simple"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   *
   * @options
   *    tableData 表格数据
   *    tableColumns 表格meata
   *    pageable 是否有分页
   *    url 请求数据url
   *    pageSizeOpts 每页条数切换的配置
   *    headerHeight 设置header高度
   *    showElevator 是否显示跳转至 默认显示
   *    showTotal 是否显示总条数
   *    showSizer 是否展示分页条数
   *    simple 简洁版
   *    manualLoadData 是否手动获取数据 此时表格初始化时不执行ajax获取数据
   *
   *
   * @events
   *    on-created vue created生命周期事件
   *    on-after-ajax 当配置有url时  ajax返回后的事件
   *    on-page-change 有分页时 切换分页时的事件
   *    on-page-size-change 有分页时  切换每页展示条数时的事件
   *    on-select 当配置有selection或singleSelection时 选中行的事件
   *
   */
  export default {
    mock: mockData(),

    props: {options: Object},

    data: function () {
      return {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        isLoading: true
      }
    },

    ready(){
      this.$emit('on-ready')
      if (this.options.url && this.options.manualLoadData !== true) {
        this._reload()
      }
    },

    methods: {
      _reload(){
        this.isLoading = true
        Utils.post(this.options.url, Object.assign({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        }, this.options.params)).then((res) => {
          this.isLoading = false
          this.total = res.datas.totalSize
          this.$emit('on-after-ajax', res.datas.rows)

          this.$nextTick(function () {
            this.options.listData = res.datas.rows
          })
        })
      },

      reload(){
        this._reload()
      },

      reloadFirstPage(){
        this.pageNumber = 1
        this.reload()
      },

      onChange(pageNumber){
        this.pageNumber = pageNumber
        this.$emit('on-page-change')
        if (this.options.url) {
          this._reload()
        }
      },

      onPageSizeChange(pageSize){
        this.$emit('on-page-size-change')
        this.pageSize = pageSize
        if (this.options.url) {
          this._reload()
        }
      }
    }
  }

  function mockData() {
    return {

    }
  }
</script>
