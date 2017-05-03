<template>
  <div>
    <div class="wrap">
      <Row v-for="(rowIndex, row) in rows">
        <i-col span="4" v-for="(colIndex, col) in row.cols">
          <div v-for="meta in meta" :class="{'title':col._label}" class="item">
            <span v-if="col._label">{{meta.title}}</span>
            <template v-if="!col._empty">
              <div v-if="!col._label && meta.render">
                {{{meta.render(row.cols, col._index)}}}
              </div>
              <div v-else>
                {{col[meta.key]}}
              </div>
            </template>
            <span v-if="col._empty">-</span>
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>
<script>
  /***
   * @props
   *  meta: 纵向表头信息
   *  dataList: 数据
   *
   * @example
   *
   *  meta: [{
          title: '科类',
          key: 'name'
        }, {
          title: '是否启用',
          key: 'enable',
          render: function (data, index) {
            return `<Switch :checked.sync="dataList[${index}].enable"></Switch>`
          }
        }, {
          title: '志愿数',
          key: 'wishNum',
          render: function (data, index) {
            return `  <Input-number :max="6" :min="0" :value.sync="dataList[${index}].wishNum" v-if="dataList[${index}].enable"></Input-number>`
          }
        }]
   *
   */
  export default {
    props: {
      meta: Array,
      dataList: Array
    },

    data: function () {
      return {
        rows: []
      }
    },

    ready(){
      this._format()
    },

    watch: {
      'dataList': function () {
        this._format()
      }
    },

    methods: {
      _format(){
        var length = this.dataList.length
        var scoreTmp = []
        this.dataList.forEach(function (item, index) {
          scoreTmp.push(Object.assign({_index: index}, _.cloneDeep(item)))
        })

        var last = 5 - (length % 5 || 5)

        for (var i = 0; i < last; i++) {
          scoreTmp.push({_empty: true})
        }

        var rowLength = scoreTmp.length / 5
        var res = []


        for (var i = 0; i < rowLength; i++) {
          var piece = _.slice(scoreTmp, i * 5, i * 5 + 5)
          res.push({cols: [{_label: true}].concat(piece)})
        }

        this.rows = res

        this.$nextTick(function () {
          this.$compile(this.$el)
        })
      }
    }
  }
</script>
<style scoped>
  .wrap {
    border-left: 1px solid rgba(216, 220, 240, 1);
    border-top: 1px solid rgba(216, 220, 240, 1);
  }

  .item {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    border-right: 1px solid rgba(216, 220, 240, 1);
    border-bottom: 1px solid rgba(216, 220, 240, 1);
  }

  .title {
    font-weight: 700;
    background-color: #F4F6F8;
  }
</style>
