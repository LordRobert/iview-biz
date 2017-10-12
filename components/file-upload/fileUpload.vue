<template>
  <div>
    <div>
      <div class="ivu-upload ivu-upload-drag" v-el:uploadcontainer v-if="!readonly" @click="upload($event)">
        <div v-el:upload>
          <input type="file" class="ivu-upload-input" multiple="">
          <Icon type="plus-circled" size="39" color="#2d8cf0" v-if="!uploading"></Icon>
          <img v-else src="data:image/gif;base64,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" alt="">
          <p class="text">{{title}}</p>
          <div>{{list.length+'/'+max}}</div>
          <div>{{description}}</div>
        </div>
      </div>
      <div v-for="(index, item) in list" class="ivu-uploaded">
        <div class="opt-panel">
          <div class="viewer" @click="delFile(item)" v-if="!readonly">
            <Icon type="trash-a" size="24"></Icon>
            <div>删除</div>
          </div>
          <div class="viewer" @click="showBig(index)" v-if="isImage(item.url)">
            <Icon type="eye" size="24"></Icon>
            <div>预览</div>
          </div>
          <div class="viewer" @click="download(item)">
            <Icon type="ios-cloud-download-outline" size="24"></Icon>
            <div>下载</div>
          </div>
        </div>
        <img :src="item.url" alt="" v-if="isImage(item.url)">
        <img class='file-img' v-else src="data:image/png;base64,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" alt="" >
        <div class="title">{{item.title}}</div>
      </div>
    </div>
    <image-viewer :source="urlList" :thumbnail-show="false" v-ref:image-viewer></image-viewer>
  </div>
  </div>
</template>
<script>
  import upload from './upload.js'
  import imageViewer from './imageViewer.vue'

  var ossFileUrlSettingDefault = {
    'filePathKey':'filePath',
    'fullPathKey':'datas'
  }

  export default {
    components:{imageViewer},
    props: {
      /**
       * 是否只读
       *
       */
      readonly: {
        type: Boolean,
        default: false
      },


      /**
       * policyUrl接口传的参数
       */
      params:{
        type:Object
      },

      /**
       * 上传文件列表
       *
       * 例如：[{title:'', url:'http://kdlsfjslfjk'}]
       */
      list: {
        type:Array,
        default:function () {
          return []
        }
      },

      /**
       * 上传文件个数限制
       */
      max: {
        type: Number,
        default: 2
      },

      /**
       * 上传文件大小限制
       *
       * 例如：10mb
       */
      maxFileSize: {
        type: String,
        default: ''
      },

      /**
       * 上传按钮标题
       *
       * 例如：上传照片
       */
      title:{
        type:String,
        default:''
      },

      /**
       * 上传按钮描述文字
       *
       * 例如：仅支持3.0M以内的JPEG、PNG文件
       */
      description:{
        type:String,
        default:''
      },

      /**
       * 允许上传文件的格式
       *
       * 例如：jpg,png,jpeg,html,zip
       */
      extensions:{
        type:String,
        default:''
      },

      /**
       * 获取上传policy的接口
       * 接口返回实例
       *  {
       *    "datas":{
       *      "accessid":"LTAI7iYVGqI46iFV",
       *      "dir":"examinee/1018650047507463/attachimage/28",
       *      "host":"http://ir-cr-file-test.oss-cn-hangzhou.aliyuncs.com",
       *      "policy":"eyJleHBpcmF0aW9uIjoiMjAxNy0xMC0xMVQxMDo0MDozMi4yODFaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJleGFtaW5lZS8xMDE4NjUwMDQ3NTA3NDYzL2F0dGFjaGltYWdlLzI4Il1dfQ==",
       *      "signature":"kooIJ5hCf3Jm/ackzykKkbS7lvQ=","fileName":"examinee/1018650047507463/attachimage/28/28_5e0adbe9410f4efebf3face066770f18"
       *    },
       *    "code":"0",
       *    "message":null
       *   }
       */
      policyUrl:{
        type:String,
        default:''
      },

      /**
       * 获取上传到oss后的文件可访问路径接口
       *
       * 接口传参：fileName: "examinee/1018650047507463/attachimage/28/28_5e0adbe9410f4efebf3face066770f18.jpeg"
       *
       * 接口返回：
       *  {
       *    "datas":"http://ir-cr-file-test.oss-cn-hangzhou.aliyuncs.com/examinee/1018650047507463/attachimage/28/28_5e0adbe9410f4efebf3face066770f18.jpeg?Expires=1823078392&OSSAccessKeyId=LTAI7iYVGqI46iFV&Signature=ruAlJ3sG9wzUxlcgY0nqKvX6sbc%3D",
       *    "code":"0",
       *    "message":null
       *  }
       */
      ossFileUrl:{
        type:String,
        default:''
      },

      /**
       * ossFileUrl接口key值配置
       * {
       *    'filePathKey':'filePath',
       *    'fullPathKey':'datas'
       * }
       *
       */
      ossFileUrlSetting:{
        type:Object
      }
    },

    data:function () {
      return {
        uploading:false,
        ossFileUrlSettingInner:{}
      }
    },

    watch: {
      readonly(newVal){
        if (!newVal) {
          this.$nextTick(function () {
            this.initUpload()
          })
        }
      },
      ossFileUrlSetting(newVal){
        this.ossFileUrlSettingInner = Object.assign({}, ossFileUrlSettingDefault,this.ossFileUrlSetting)
      }
    },

    created(){
      this.ossFileUrlSettingInner = Object.assign({}, ossFileUrlSettingDefault,this.ossFileUrlSetting)
    },

    computed: {
      urlList(newVal){
        var res = _.map(this.list,  (item)=> {
          return this.isImage(item.url)?item.url:''
        })

        debugger
        return  res?_.compact(res):[]
      }
    },
    ready () {
      if (!this.readonly) {
        this.initUpload()
      }
    },

    methods: {
      isImage(url){
        if(url){
          url = url.replace(/\?.*/, '')
        }
        return _.endsWith(url,'png') || _.endsWith(url, 'jpg') || _.endsWith(url,'jpeg')
      },
      upload(e){
        if(this.uploading){
          e.preventDefault()
          return
        }
        if (this.list.length >= this.max) {
          e.preventDefault()
          this.$Message.warning('上传数目超过限制！')
        }
      },
      showBig(index){
        this.$refs.imageViewer.viewImage(index)
      },

      download(item){
        window.open(item.url)
      },

      delFile(item){
        this.list = this.list.filter(function (item2) {
          return item.fileName != item2.fileName
        })
        this.$emit('on-del', item)
      },

      initUpload(){
        this.uploader = upload.init({
          buttonElement: this.$els.upload,
          containerElement: this.$els.uploadcontainer,
          url: this.policyUrl,
          maxFileSize: this.maxFileSize,
          extensions:this.extensions,
          params: this.params || {},
          callbacks: {
            BeforeUpload:()=>{
              this.uploading = true
            },
            FileUploaded: (res)=> {
              this.uploading = false
              var params = {}
              params[this.ossFileUrlSettingInner.filePathKey] = res.filePath+'.'+res.ext
              Utils.post(this.ossFileUrl, params).then((res2)=> {
                this.list.push({
                  title: res.fileName,
                  url: res2[this.ossFileUrlSettingInner.fullPathKey],
                  fileName: res.filePath + '.' + res.ext,
                  filePath:res.filePath,
                  ext:res.ext,
                })
                this.$emit('file-uploaded', res)
              })
            },
            Error:(a, err)=>{
              this.uploading = false
              if (err.code == -600) {
                this.$Message.warning('上传大小不能超过'+this.maxFileSize)
              }
            }
          }
        });
        this.uploader.files = []
      }
    }
  }

  function pickData(data, root){
    var tempValue = data
    var rootArray = root.split('>')
    rootArray.forEach(function (item) {
      if (!tempValue[item]) {
        return false
      }
      tempValue = tempValue[item]
    })
    return tempValue
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  .ivu-upload {
    width: 180px;
    height: 150px;
    line-height: 16px;
    color: #ccc;
    padding: 16px;
    display: inline-block;

    .text {
      margin-top: 8px;
      color: #2d8cf0;
      margin-bottom: 8px;
    }
  }

  .ivu-uploaded {
    display: inline-block;
    width: 180px;
    height: 150px;
    margin-left: 16px;
    border: 1px solid #d7dde4;
    position: relative;
    vertical-align: top;

    .opt-panel {
      padding: 24px;
      text-align: center;
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(100, 100, 100, 0.6);

      .viewer {
        height: 50px;
        line-height: 18px;
        color: #ddd;
        text-align: center;
        cursor: pointer;
        width: 60px;
        display: inline-block;

        &:hover {
          color: #fff;
        }
      }
    }

    &:hover .opt-panel {
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .title {
      bottom: -30px;
      width: 100%;
      text-align: center;
      position: absolute;
      overflow: hidden;

    }

    .del {
      position: absolute;
      display: none;
      right: 8px;
      bottom: 0px;
      color: #fff;
      cursor: pointer;
    }

    &:hover .del {
      display: block;
    }
  }

  .file-img{
    width: 100px!important;
    margin-left: 39px;
    margin-top: 10px;
    height: auto!important;
  }
</style>
