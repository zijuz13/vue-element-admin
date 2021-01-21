<template>
  <div :id="id" />
</template>

<script>
// deps for editor
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
// import Editor from 'tui-editor'
import Editor from '@toast-ui/editor'
import defaultOptions from './default-options'
import { uploadImage } from '@/api/upload'
export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'en_US' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      options.hooks = {}
      const that = this
      // 自定义上传钩子设置
      options.hooks['addImageBlobHook'] = function(blob, callback) {
        that.upload(blob, callback)
      }
      return options
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getHtml()) {
        this.editor.setHtml(newValue)
      }
    },
    language(val) {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.editor.height(newValue)
    },
    mode(newValue) {
      this.editor.changeMode(newValue)
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    upload(blob, callback) {
      const isJPG = blob.type === 'image/jpeg'
      const isPNG = blob.type === 'image/png'
      if (!(isJPG || isPNG)) {
        this.$message({
          type: 'warning',
          message: 'The format of images can only be jpeg or png!'
        })
        return
      }
      const form = new FormData()
      form.append('file', blob, 'file')
      uploadImage(form).then(resp => {
        callback(resp.files.file, blob.type)
      })
    },
    initEditor() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        ...this.editorOptions
      })
      if (this.value) {
        this.editor.setValue(this.value)
      }
      this.editor.on('change', () => {
        this.$emit('input', this.getHtml())
      })
    },
    destroyEditor() {
      if (!this.editor) return
      this.editor.off('change')
      this.editor.remove()
    },
    setValue(value) {
      this.editor.setValue(value)
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    }
  }
}
</script>
