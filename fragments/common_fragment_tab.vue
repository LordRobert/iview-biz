<template>
  <div>
    <Tabs :active-key="options.activeIndex" :animated="options.animated" @on-click="select">
      <Tab-pane :label="item.title" v-for="item in options.tabs">
        <component :is="item._component" :options="item.options" :events="item.events"></component>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
  /***
   * @options
   * tabs {Array} [{title:'基本信息', component:'', options:{}, events:{}]
   * activeIndex 当前tab的index
   * animated 是否使用 CSS3 动画
   */

  import fragmentMixin from 'iview-biz/mixins/fragmentMixin'
  export default {
    mixins: [fragmentMixin],
    computed: {
      current: function () {
        return this.options.tabs[this.options.activeIndex || 0].key
      },
    },

    ready(){
      this.options.tabs.forEach((item, index) => {
        this.$set('options.tabs['+index+']._component', '')
      })
      this._showTab(this.options.activeIndex || 0)
    },

    methods: {
      select(item){
        this._showTab(item)
      },

      _showTab(index){
        this.options.tabs[index]._component = this.options.tabs[index].component
      }
    }
  }
</script>
