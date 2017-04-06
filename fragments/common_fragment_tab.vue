<template>
  <div>
    <Tabs>
      <Tab-pane :label="item.title" v-for="item in options.tabs">
        <component :is="item.component" :options="item.options" :events="item.events"></component>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
  /***
   * @options
   * tabs {Array} [{component:'', options:{}, events:{}]
   */

  import fragmentMixin from 'iview-biz/mixins/fragmentMixin'
  export default {
    mixins: [fragmentMixin],
  }
</script>
