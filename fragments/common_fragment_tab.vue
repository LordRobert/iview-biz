<template>
  <div>
    <Tabs :active-key="options.activeIndex" :animated="options.animated">
      <Tab-pane :label="item.title" v-for="item in innerTabs">
        <component :is="item.component" :options="item.options" :events="item.events"></component>
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
    computed:{
      current:function () {
        return this.options.tabs[this.options.activeIndex || 0].key
      },

      innerTabs:function () {
        this.options.tabs.forEach(function (item) {
          item.key = item.component
        })

        return this.options.tabs
      }
    }
  }
</script>
