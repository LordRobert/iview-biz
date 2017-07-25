<template>
  <div>
    <slot>

    </slot>
    <div v-if="rows.length > 0 && !loading">
      <div style="margin: 12px 0 12px;" v-show="loadMore.shown">
        <div style="text-align: center">
          <a href="javascript:void(0);" @click="_loadMore" v-show="loadMore.hasMore">{{{moreText}}}</a>
          <span v-show="!loadMore.hasMore">{{{noMoreText}}}</span>
        </div>
      </div>
    </div>
    <slot name="empty" v-if="rows.length == 0 && !loading">

    </slot>
  </div>
</template>
<script type="application/ecmascript">
  /***
   * @options
   *
   * url 地址
   * rows.sync 列表数据
   * pageSize 页面大小
   * params 传入参数
   * moreText 查看更多文本
   * noMoreText 没有更多文本
   *
   * @events
   *
   * ready
   *
   * @methods
   *
   * reload 刷新 返回promise
   *
   * @example
   *
   * <lazy-load-list :rows.sync="options.tplList" :url="options.templateUrl" :page-size="30" v-ref:list :params="options.params" @ready="$emit('on-ready')">
   <div v-for="item in options.tplList">
   <div class="catalog-item"
   :class="{active: !hasNew && options.currentTpl && item.wid === options.currentTpl.wid}"
   @click="view(item)">
   <div class="head" title="{{item.name}}">
   <div class="vertical-center">
   <div>
   <Icon class="tag" type="stop" :color="item.type=='1'?'#5DDD92':'#FCBD49'"></Icon>
   </div>
   <div class="tpl-text">
   <span>{{ item.name }}</span>
   </div>
   </div>
   </div>
   <div class="tail">
   <a href="javascript:void(0);" @click.stop="edit(item)">编辑</a>
   |
   <a href="javascript:void(0);" @click.stop="del(item)">删除</a>
   </div>
   </div>
   </div>
   </lazy-load-list>
   */

  import DataAdapter from '../../utils/dataAdapter'

  export default {
    props: {
      'url': {
        type:String
      },

      'rows': {
        type: Array,
        twoWay: true
      },

      'loading': {
        type: Boolean,
        twoWay: true,
        default: false
      },

      'pageSize': {
        type: Number,
        default: 10
      },

      'params': {
        type: Object,
        default: function () {
          return {}
        }
      },

      moreText: {
        type: String,
        default: '查看更多 &gt;'
      },

      noMoreText: {
        type: String,
        default: '没有更多了...'
      },

      pageableSetting: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },

    data: function () {
      return {
        pageNumber: 1,
        total: 0,
        userParams: {},
        prevPageSize: null,
        prevPageNumber: null,
        loadMore: {
          shown: false,
          hasMore: false
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
      this._load().then(() => {
        this.$emit('ready')
      })
    },

    methods: {
      _load(isLoadMore){
        var params = Object.assign({}, this.params, this.userParams)
        this.loading = true

        return this.dataAdapter.load(this.pageSize, this.pageNumber + 1, this.params).then((res) => {
          this.loading = false
          this.pageSize = this.prevPageSize || this.pageSize
          this.pageNumber = this.prevPageNumber || this.pageNumber
          this.prevPageSize = null
          this.prevPageNumber = null
          this.total = res.total
          this.rows = isLoadMore ? this.rows.concat(res.list) : res.list

          this.loadMore.hasMore = this.rows.length < res.total

          if (!this.loadMore.hasMore && this.pageNumber == 1) {
            this.loadMore.shown = false
          } else {
            this.loadMore.shown = true
          }
        }).catch(() => {
          this.loading = false
        })
      },

      /**
       * 刷新方法
       * @param {Object} 传入的参数
       */
      reload(params){
        this.prevPageSize = this.pageSize
        this.prevPageNumber = this.pageNumber
        this.pageSize = this.pageNumber * this.pageSize
        this.pageNumber = 1

        this.userParams = params
        return this._load()
      },

      _loadMore(){
        if (!this.loadMore.hasMore) {
          return
        }
        this.pageNumber += 1

        this._load(true)
      }
    }
  }
</script>
