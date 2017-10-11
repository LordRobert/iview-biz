const init = function (options) {
  var url = options.url
  var params = options.params
  var callbacks = options.callbacks

  var accessid = ''
  var host = ''
  var policyBase64 = ''
  var signature = ''
  var filename = ''
  var key = ''
  var expire = 0
  var g_object_name = ''
  var g_object_name_type = 'back_name'
  var timestamp = Date.parse(new Date()) / 1000;
  var now = timestamp;
  var maxFileSize = options.maxFileSize || '10mb';
  var dir = '';
  var backFilename = '';

  function send_request() {
    return $.ajax({
      url: url,
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      async: false,
      data: JSON.stringify(params || {})
    });
  };

  function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
      var body = send_request();

      // debugger;
      var obj = body.responseJSON.datas;

      host = obj['host']
      policyBase64 = obj['policy']
      accessid = obj['accessid']
      signature = obj['signature']
      dir = key = obj['dir']
      expire = parseInt(obj['expire'] || 1493949383)
      // callbackbody = obj['callback']
      backFilename = obj['fileName'];
      return true;
    }
    return false;
  };

  function random_string(len) {
    var len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  function get_suffix(filename) {
    var pos = filename.lastIndexOf('.');
    var suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }

  function calculate_object_name(filename) {
    var suffix = get_suffix(filename)
    if (g_object_name_type == 'local_name') {
      g_object_name += "${filename}"
    }
    else if (g_object_name_type == 'back_name') {
      g_object_name = backFilename + suffix
    }
    else if (g_object_name_type == 'random_name') {
      g_object_name = key + random_string(10) + suffix
    }
    return ''
  }

  function get_uploaded_object_name(filename) {
    if (g_object_name_type == 'local_name') {
      var tmp_name = g_object_name
      tmp_name = tmp_name.replace("${filename}", filename);
      return tmp_name
    }
    else if (g_object_name_type == 'random_name') {
      return g_object_name
    }
  }

  function set_upload_param(up, filename, ret) {
    // debugger;
    if (ret == false) {
      ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
      var suffix = get_suffix(filename);
      calculate_object_name(filename);
    }
    var new_multipart_params = {
      'dir': dir,
      'key': g_object_name,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'success_action_status': '200', //让服务端返回200,不然，默认会返回204
      'signature': signature,
    };

    up.setOption({
      'url': host,
      'multipart_params': new_multipart_params
    });
    up.start();
  }

  const uploader = new plupload.Uploader({
    // runtimes : 'html5,html4',
    browse_button: options.buttonElement,
    multi_selection: false,
    container: options.containerElement,
    url: 'http://oss.aliyuncs.com',

    filters: {
      mime_types: [ //只允许上传excel和zip,rar文件
        {title: "", extensions: options.extensions}
      ],

      max_file_size: maxFileSize, //最大只能上传10mb的文件
      prevent_duplicates: true //不允许选取重复文件
    },

    init: {
      PostInit: function () {
        callbacks && callbacks.PostInit && callbacks.PostInit()
      },

      FilesAdded: function (up, files) {
        callbacks && callbacks.FilesAdded && callbacks.FilesAdded(up, file)
        set_upload_param(up, '', false);
      },

      BeforeUpload: function (up, file) {
        callbacks && callbacks.BeforeUpload && callbacks.BeforeUpload(up, file)
        set_upload_param(up, file.name, true);
      },

      UploadProgress: function (up, file) {
        callbacks && callbacks.UploadProgress && callbacks.UploadProgress(up, file)
      },

      FileUploaded: function (up, file, info) {
        var ext = file.name.replace(/(.*)\.([a-z0-1A-Z]*)$/, '$2')
        if (info.status == 200) {
          callbacks && callbacks.FileUploaded && callbacks.FileUploaded({
            fileName: file.name,
            dir: dir,
            ext: ext,
            filePath:backFilename
          })
        }
        else {
          console.error('上传出错：');
          console.error(info.responseText);
        }
      },

      /*
       * err.code:
       *  -600 -- 压缩包大小超出${maxFileSize}限制，请重新选择压缩包！
       *  -601 -- 文件格式不对，请上传zip文件
       *  -602 -- 此文件已上传过
       *
       * */
      Error: function (up, err) {
        callbacks && callbacks.Error && callbacks.Error(up, err)
      }
    }
  });
  uploader.init();

  return uploader;
}

export default {
  'init': init
};
