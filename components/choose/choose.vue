<template>
  <div class="main">
    <div class="left-container">
      <div class="search-wrap">
        <i-input :value.sync="keyword" :placeholder="placeholder" style="width: 100%" @keyup="search"
                 debounce="500"></i-input>
      </div>
      <pageable-list :url="url" :list-data.sync="listData" :params="requestParams"
                     list-height="220px"
                     @on-after-ajax="afterAjax" v-ref:pageable-list>
        <div v-for="item in listData" class="left-item">
          <Checkbox :checked<template>
          <div>
            <slot :style="listStyles"></slot>
            <slot name="empty" v-if="listData.length == 0 && !isLoading && pageNumber === 1"></slot>
            <div v-else>
              <div style="margin: 10px;overflow: hidden" v-if="pageable !== false">
                <div style="float: right;">
                  <Page :total="total" :current="pageNumber" @on-change="onChange"
                        @on-page-size-change="onPageSizeChange" :show-sizer="showSizer!==false"
                        :page-size="pageSize" :page-size-opts="pageSizeOpts || [10, 20, 30, 40]"
                        :show-elevator="showElevator!==false" :show-total="showTotal!==false"
                        :simple="simple"></Page>
                </div>
              </div>
            </div>
          </div>
        </template>
          <script type="text/ecmascript-6">
            /**
             *
             *    listData 表格数据
             *    pageable 是否有分页
             *    url 请求数据url
             *    pageSizeOpts 每页条数切换的配置
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

              props: {
                manualLoadData: {
                  type: Boolean,
                  default: false
                },

                url:String,

                params:{
                  type:Object,
                  default:function () {
                    return {}
                  }
                },

                listData:{
                  twoWay:true,
                  type:Array,
                  default:function () {
                    return []
                  }
                },

                pageable:{
                  type:Boolean,
                  default:true
                },

                showSizer:{
                  type:Boolean,
                  default:true
                },

                pageSizeOpts:{
                  type:Boolean,
                },

                showElevator:{
                  type:Boolean,
                  default:true
                },

                simple:{
                  type:Boolean,
                  default:true
                },

                showTotal:{
                  type:Boolean,
                  default:true
                },

                listHeight:{
                  type:String,
                  default:'auto'
                }
              },

              computed:{
                listStyles:function () {
                  return {
                    'height':this.listHeight
                  }
                }
              },

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
                if (this.url && this.manualLoadData !== true) {
                  this._reload()
                }
              },

              methods: {
                _reload(){
                  this.isLoading = true
                  Utils.post(this.url, Object.assign({
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
                  }, this.params)).then((res) => {
                    this.isLoading = false
                    this.total = res.datas.totalSize
                    this.$emit('on-after-ajax', res.datas.rows)

                    this.$nextTick(function () {
                      this.listData = res.datas.rows
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
                  if (this.url) {
                    this._reload()
                  }
                },

                onPageSizeChange(pageSize){
                  this.$emit('on-page-size-change')
                  this.pageSize = pageSize
                  if (this.url) {
                    this._reload()
                  }
                }
              }
            }

            function mockData() {
              return {}
            }
          </script>
          .sync="item._selected" @on-change="change(item)"></Checkbox>
          <span>
            {{{realRenderLeft(item)}}}
          </span>
        </div>
        <div slot="empty" style="text-align: center; margin-top: 32px;">
          暂无数据
        </div>
      </pageable-list>
      <Checkbox :checked="selectAllStatus" class="select-all" @on-change="selectAll">全选</Checkbox>
    </div>
    <div class="right-container">
      <div class="selected-tip">已选中{{selectedList.length}}</div>
      <div class="right-selected-wrap">
        <div v-for="item in selectedList" class="selected-item">
          {{{realRenderRight(item)}}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      url:String,

      selectedList: {
        type: Object,
        default: function () {
          return []
        }
      },

      key: {
        type: String,
        default: 'id'
      },

      placeholder: {
        type: String,
        default: '请输入关键字'
      },

      searchKey: {
        type: String,
        default: 'content'
      },

      params: {
        type: String,
        default: function () {
          return {}
        }
      },

      renderRight: {
        type: Function
      },

      renderLeft: {
        type: Function
      }

    },

    data () {
      return {
        listData: [],
        keyword: ''
      }
    },

    mounted(){
      this.$compile(this.$el)
    },

    computed: {
      selectAllStatus: function () {
        var status = true

        this.listData.forEach((item)=> {
          if (!item._selected) {
            status = false
          }
        })

        return status
      },

      requestParams: function () {
        var params = {}

        params[this.searchKey] = this.keyword

        params = Object.assign({}, params, this.params)

        return params
      }
    },

    methods: {
      afterAjax: function (list) {
        list.forEach((item) => {
          item._selected = false

          var row = this._findRightRowById(item[this.key])

          if (row) {
            item._selected = true
          }
        })
      },

      realRenderRight: function (item) {
        var template = this.renderRight(item)

        return template + `<span class="delete" @click="del('${item[this.key]}')">删除</span>`
      },

      realRenderLeft(item){
        var template = this.renderLeft(item)

        return template
      },

      search(){
        this.$refs.pageableList.reloadFirstPage()
      },

      del(id){
        this._deleteRightRowById(id)

        var leftRow = this._findLeftRowById(id)

        if(leftRow){
          leftRow._selected = false
        }
      },

      change(item){
        if (item._selected) {
          this.selectedList.push(item)
        } else {
          this._deleteRightRowById(item[this.key])
        }

        this.$nextTick(function () {
          this.$compile(this.$el)
        })
      },

      getSelected(){
        return this.selectedList
      },

      selectAll(status){
        this.listData.forEach((item) => {
          item._selected = status

          var index = this.selectedList.findIndex((item2) => {
            return item[this.key] == item2[this.key]
          })

          if (status && index == -1) {
            this.selectedList.push(item)
          }

          if (!status && index >= 0) {
            this.selectedList.splice(index, 1)
          }
        })
        this.$nextTick(function () {
          this.$compile(this.$el)
        })
      },

      _findLeftRowById(id){
        return this.listData.find((item) => {
          return item[this.key] == id
        })
      },

      _findRightRowById(id){
        return this.selectedList.find((item) => {
          return item[this.key] == id
        })
      },

      _deleteRightRowById(id){
        var index = this.selectedList.findIndex( (item) => {
          return item[this.key] == id
        })

        this.selectedList.splice(index, 1)
      }
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  .main {
    border: 1px solid #D8DCF0;
  }

  .left-container {
    display: inline-block;
    padding: 16px;
    padding-bottom: 0px;
    width: 50%;
    position: relative;
    height: 325px;

    .left-item {
      padding: 2px 0;
    }

    .search-wrap {
      margin-bottom: 8px;
    }

    .select-all {
      position: absolute;
      bottom: 12px;
    }
  }

  .right-container {
    padding: 16px 16px 16px 32px;
    display: inline-block;
    width: calc(~"100% - 50% - 4px");
    vertical-align: top;
    position: relative;
    background: rgba(63, 81, 181, .04);
    height: 325px;
    border-left: 1px solid #D8DCF0;

    .selected-item{
      position: relative;
    }

    .selected-tip {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 8px;
    }

    &:after, &:before {
      width: 0;
      height: 0;
      content: ' ';
      position: absolute
    }

    &:before {
      border: 44px solid transparent;
      border-left: 14px solid #D8DCF0;
      top: 128px;
      left: 0
    }

    &:after {
      border: 44px solid transparent;
      border-left: 14px solid #fff;
      top: 128px;
      left: -1px;
    }

    .right-selected-wrap {
      height: 270px;
      overflow: auto;
    }


  }
</style>
<style lang="less" rel="stylesheet/less">
  .right-container .selected-item {

    .delete {
      position: absolute;
      display: block;
      right: 0;
      top: 0;
      color: #39f;
      cursor: pointer;
    }

    &:hover .delete {
      display: block;
    }
  }
</style>
