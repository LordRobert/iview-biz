<template>
  <div class="lazy-input-container" @keydown.40="_hoverNextItem" @keydown.38="_hoverPrevItem"
       @mouseenter="_mouseEnter"
       , @mouseleave="_mouseLeave" @keydown.enter="_enter">
    <input type="text" class="ivu-input" :placeholder="placeholder" @click="_inputFocus"
           v-model="searchContent" debounce="300" @keydown="keydown" :disabled="disabled"/>
    <div class="lazy-input-list" v-if="expand">
      <div class="lazy-input-loading" v-if="loading && rows.length == 0"></div>
      <div class="lazy-input-empty" v-if="!loading && rows.length == 0">暂无数据</div>
      <div class="list-wrap" v-if="rows.length > 0">
        <div class="list-item lazy-input-index" @click="_select(item)" v-for="(index, item) in rows"
             tabindex="{{index}}"
             :class="{'selected':item._selected}"
             @mouseover="_rowHover(item)">{{_rowShow(item)}}
        </div>
        <div v-if="noMore" class="no-more">没有更多了</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  var ROW_HEIGHT = 28
  var PAGE_SIZE = 9

  /***
   * @property {String} url 请求数据url
   * @property {String} value 值
   * @property {String} valueDisplay 显示值
   * @property {String} [displayMember=name] displayMember
   * @property {String} [valueMember=id] valueMember
   * @property {String} [params] params
   * @property {String} [disabled] 设置禁用状态
   * @property {String} [searchKey] 搜索时传递的关键字字段名称
   * @property {String} [placeholder] placeholder
   * @property {String} [root=datas>rows] root
   * @property {String} [totalRoot=datas>totalSize] totalRoot
   * @property {Function} [rowRender(row)] 自定义行渲染函数
   * @property {Function} [afterSelect(row)] 选中后执行的回调
   * @property {Function} [afterAjax(res)] ajax返回后执行的回调
   */
  export default {
    props: {
      url:{
        type:String
      },

      root: {
        type: String,
        default: 'datas>rows'
      },

      totalRoot: {
        type: String,
        default: 'datas>totalSize'
      },

      value: {
        type: String
      },

      valueDisplay: {
        type: String
      },

      displayMember: {
        type: String,
        default: 'name'
      },

      valueMember: {
        type: String,
        default: 'id'
      },

      disabled: {
        type: Boolean,
        default: false
      },

      placeholder: {
        type: String
      },

      searchKey: {
        type: String,
        default: 'content'
      },

      afterAjax: {
        type: Function
      },

      afterSelect: {
        type: Function
      },

      rowRender:{
        type:Function
      },

      params: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data: function () {
      return {
        expand: false,
        pageNumber: 0,
        pageSize: 10,
        total: 0,
        loading: false,
        hoverItem: null,
        rows: [],
        current: {},
        searchContent: '',
        noMore: false
      }
    },
    ready(){
      this.index = 0
      $(document).on('click', (event) => {
        if ($(event.target).parents('.lazy-input-container').length == 0) {
          this.expand = false
        }
      })

      // 如果初始化时有传值 则赋值给current对象
      if (this.valueDisplay) {
        this.current = {}
        this.current[this.valueMember] = this.value
        this.current[this.displayMember] = this.valueDisplay
      }

      this._load()
    },
    watch: {
      expand: function (newVal) {
        if (newVal) {
          if (this.hoverItem) {
            this._rowHover(this.hoverItem)
          }
          $(this.$el).find('.lazy-input-list').scroll(() => {
            if ($(this.$el).find('.lazy-input-list')[0].scrollTop >= ($(this.$el).find('.lazy-input-list')[0].scrollHeight - $(this.$el).find('.lazy-input-list').height())) {
              this.pageNumber++
              this._load()
            }
          })
        }
      },

      current: function (newVal) {
        this._searchContentChangeFromInner = true
        if (newVal) {
          // 当current改变时，同时改变value和valueDisplay
          this.searchContent = newVal[this.displayMember]
          this.value = newVal[this.valueMember]
          this.valueDisplay = newVal[this.displayMember]
        }
      },

      searchContent: function (newVal) {
        if (this._searchContentChangeFromInner) {
          this._searchContentChangeFromInner = false
          return
        }

        if (!newVal) {
          let emptyValue = {}

          emptyValue[this.valueMember] = ''
          emptyValue[this.displayMember] = ''

          this.current = emptyValue
          this.$emit('on-select', emptyValue)
        }
        this.index = 0
        this.expand = true
        this.noMore = false
        this.pageNumber = 0
        this.rows = []
        this.hoverItem = null
        this._load()
      }
    },

    methods: {
      getValue(){
        return this.current
      },
      setValue(val){
        this.current = val
      },
      setDisabled(){
        this.disabled = true
      },
      setEnable(){
        this.disabled = false
      },
      reload(){
        this.pageNumber = 0
        this.rows = []
        this._load()
      },
      _load(){
        if (this.noMore) {
          return
        }
        var params = $.extend({}, {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber + 1
        }, this.params)
        if (this.searchContent) {
          params[this.searchKey] = this.searchContent
        }
        this.loading = true
        Utils.post(this.url, params).then((res) => {
          this.afterAjax && this.afterAjax(res)
          var root = this.root
          var totalRoot = this.totalRoot
          var rows = this._pickData(res, root)
          this.total = this._pickData(res, totalRoot)
          if (rows.length > 0) {
            rows.forEach((item) => {
              item._selected = false
              item._index = this.index++
            })
            this.rows = this.rows.concat(rows)
            if (!this.hoverItem) {
              this.hoverItem = this.rows[0]
              this._rowHover(this.rows[0])
            }
          } else if (this.rows.length > 9) {
            this.noMore = true
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      _rowShow(row){
        if (this.rowRender) {
          return this.rowRender(row)
        } else {
          return row[this.displayMember]
        }
      },
      _pickData(data, root){
        var tempValue = data
        var rootArray = root.split('>')
        rootArray.forEach(function (item) {
          if (!tempValue[item]) {
            return false
          }
          tempValue = tempValue[item]
        })
        return tempValue
      },
      _select(row){
        this.current = row
        this.hoverItem = row
        this.expand = false
        this.afterSelect && this.afterSelect(row)
        this.$emit('on-select', this.current)
      },
      _inputFocus(){
        fireEvent(document, 'click')
        this.expand = true

        if (this.current && this.current._index !== undefined) {
          this.$nextTick(function () {
            this._arrowScrollTop(this.current._index)
          })
        }
      },
      keydown(event){
        if (event.keyCode == 13) {
          return
        }
        this.expand = true
      },
      /**
       * hover元素添加样式
       */
      _rowHover(row){
        this.hoverItem = row
        this.rows.forEach((item, index) => {
          if (item[this.valueMember] == row[this.valueMember]) {
            item._selected = true
          } else {
            item._selected = false
          }
        })
      },
      /**
       * 按上键选择上一个元素
       */
      _hoverPrevItem(){
        var prevItem = null
        this.rows.forEach((item, index) => {
          if (item[this.valueMember] == this.hoverItem[this.valueMember] && index > 0) {
            let prevIndex = index - 1
            prevItem = this.rows[prevIndex]
            this._arrowScrollTop(prevIndex)
            return false
          }
        })
        prevItem && this._rowHover(prevItem)
      },
      /**
       * 按下键选择下一个元素
       */
      _hoverNextItem(){
        var nextItem = null
        this.rows.forEach((item, index) => {
          if (item[this.valueMember] == this.hoverItem[this.valueMember] && index < this.rows.length) {
            let nextIndex = index + 1
            nextItem = this.rows[nextIndex]
            this._arrowScrollTop(nextIndex)
            return false
          }
        })
        nextItem && this._rowHover(nextItem)
      },
      /**
       * 上下键选择时， hover的元素居中
       * @param itemIndex
       * @private
       */
      _arrowScrollTop(itemIndex){
        var middleIndex = Math.ceil(PAGE_SIZE / 2) - 1
        if (itemIndex > middleIndex) {
          $(this.$el).find('.lazy-input-list').scrollTop((itemIndex - middleIndex) * ROW_HEIGHT)
        } else {
          $(this.$el).find('.lazy-input-list').scrollTop(0)
        }
      },
      /**
       * 鼠标进入组件时，禁止窗口的滚动
       */
      _mouseEnter(){
        document.body.style.overflowY = 'hidden'
      },
      /**
       * 鼠标离开组件时，恢复窗口的滚动
       */
      _mouseLeave(){
        document.body.style.overflowY = 'auto'
      },
      /**
       * 悬浮记录后回车选中
       * 如果没有查询到结果 回车后"暂无数据"不消失
       * @private
       */
      _enter(){
        if (this.rows.length == 0) {
          return
        }
        this.expand = false
        this.current = this.hoverItem
        this.afterSelect && this.afterSelect(this.hoverItem)
        this.$emit('on-select', this.current)
        $(this.$el).find('input').focus()
      }
    }
  }

  var fireEvent = function (element, event) {
    if (document.createEventObject) {
      // IE浏览器支持fireEvent方法
      var evt = document.createEventObject();
      return element.fireEvent('on' + event, evt)
    }
    else {
      // 其他标准浏览器使用dispatchEvent方法
      var evt = document.createEvent('HTMLEvents');
      // initEvent接受3个参数：
      // 事件类型，是否冒泡，是否阻止浏览器的默认行为
      evt.initEvent(event, true, true);
      return !element.dispatchEvent(evt);
    }
  };
</script>
<style scoped>
  .lazy-input-container {
    position: relative;
  }

  .lazy-input-list {
    border: 1px solid #d8dcf0;
    border-top: 0px;
    max-height: 258px;
    overflow: auto;
    position: absolute;
    width: 100%;
    background-color: #fff;
    z-index: 99999;
  }

  .lazy-input-list > div:focus {
    outline: none;
  }

  .list-item {
    height: 28px;
    line-height: 28px;
    padding-left: 4px;
    cursor: default;
  }

  .selected {
    background-color: #d3eafd;
  }

  .lazy-input-loading {
    color: #666;
    width: 16px;
    height: 16px;
    background: url(data:image/gif;base64,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) no-repeat;
  }

  .no-more {
    color: #ccc;
    padding-left: 4px;
    text-align: center;
  }
</style>
