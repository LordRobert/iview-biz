<template>
  <div class="image-viewer"> 
    <div class="image-item" v-for="(index, item) in source" @click="viewImage(index)" v-show="thumbnailShow && mode === 'thumbnail'">
      <img :src="item"> 
    </div> 
    <div transition="fade">
      <div class="modal-view" v-show="mode === 'view'" @click="closeViewer"> 
        <div class="modal-wrapper" @click.stop=""> 
          <img :src="source[index]"> 
          <div class="arrow arrow-left" :class="{disabled: index <= 0}" @click.stop="prev">
            <Icon type="chevron-left" size="64"></Icon>
          </div> 
          <div class="arrow arrow-right" :class="{disabled: index >= source.length - 1}" @click.stop="next">
            <Icon type="chevron-right" size="64"></Icon>
          </div> 
          <div class="close" @click.stop="closeViewer"><Icon type="close" size="20"></Icon></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      source: Array,
      thumbnailShow:{
        type:Boolean,
        default:true
      },
    },
    data: function() {
      return {
        mode: 'thumbnail',
        index: 0,
      }
    },
    methods: {
      prev: function() {
        this.viewImage(this.index - 1)
      },
      next: function() {
        this.viewImage(this.index + 1)
      },
      viewImage: function(index) {
        if (index < 0) {
          this.index = 0
        } else if (index >= this.source.length) {
          this.index = this.source.length - 1
        } else {
          this.index = index
        }
        this.mode = 'view'
      },
      closeViewer: function() {
        this.mode = 'thumbnail'
      }
    }
  }
</script>
<style scoped>
  .image-viewer .image-item {
    width: 102px;
    height: 62px;
    margin-right: 8px;
    border: 1px solid #dddddd;
    background: white;
    position: relative;
    cursor: pointer;
    display: inline-block;
    z-index: 1;
  }
  .image-viewer .image-item img {
    max-width: 100px;
    max-height: 60px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  .image-viewer .modal-view {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(33,33,33,.6);
    z-index: 2;
  }
  .image-viewer .modal-view .modal-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: rgba(33,33,33,.7);
  }
  .image-viewer .modal-view .modal-wrapper img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    max-height: calc(100vh - 30px);
    max-width: calc(100vw - 100px);
  }

  .image-viewer .modal-view .modal-wrapper .close {
    position: absolute;
    right: 16px;
    top: 16px;
    color: rgba(255,255,255,.5);
    cursor: pointer;
  }
  .image-viewer .modal-view .modal-wrapper .close .iconfont {
    font-size: 21px;
  }

  .modal-wrapper .arrow {
    position: absolute;
    top: calc(50% - 8px);
    cursor: pointer;
    opacity: 0;
    transition: opacity .3s;
    color: white;
  }
  .modal-wrapper .arrow.disabled {
    cursor: not-allowed;
    color: #1e1e1e;
  }
  .modal-wrapper:hover .arrow {
    opacity: .8;
  }
  .modal-wrapper .arrow .iconfont {
    font-size: 100px !important;
  }
  .arrow-left {
    left: 30px;
  }
  .arrow-right {
    right: 30px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
