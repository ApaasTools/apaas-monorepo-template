<template>
  <div class="x-comment-input">
    <quill-editor
      class="comment-editor"
      ref="quillEditor"
      :content="formValue"
      :editor="editor"
      :options="{
      placeholder: '请输入评论',
      modules: {
        toolbar: []
      }
    }"
      @change="onChange($event)"
    ></quill-editor>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'x-comment-input',
    components: {
      quillEditor
    },
    data() {
      return {
        editor: null,
        formValue: ''
      }
    },
    computed: {
    },
    methods: {
      onChange(event) {
        // console.log(event)
        this.formValue = this.content = event.html
        // this.formValue = this.$refs.quillEditor.quill.innerHTML
        event.quill.deleteText('200',1,this.formValue)
        this.$emit('onChange',this.formValue)
      },
      handleImageClick() {
        this.$refs
      },
      getEditor() {
        return this.$refs.quillEditor
      },
      addAtPeople(data) {
        var Quill = require('quill/dist/quill.js')
        let quill = this.$refs.quillEditor.quill
        var span = Quill.import('formats/link');
        class FileBlot extends span {  // 继承Link Blot
          static create(value) {
            let node = undefined
            if (value&&!value.id){  // 适应原本的Link Blot
              node = super.create(value);
            }
            else{  // 自定义Link Blot
              node = super.create(value);
              node.id = value.id;
              node.setAttribute('contenteditable', 'false');
              // node.contenteditable = value.contenteditable;
              node.innerText = value.innerText;
            }
            return node;
          }
        }
        FileBlot.blotName = 'span';
        FileBlot.className = 'editor-comment-mention';
        FileBlot.tagName = 'SPAN';
        Quill.register(FileBlot);

        // console.log(data, '@')
        // console.log(this.content, 'Neirong')
        Quill.register(FileBlot);
        quill.insertEmbed(this.content ? quill.container.innerText.length : 0 ,'span',{contenteditable:'false', id:data.id, innerText:`@${data.username}`})

      },
      clearContent(){
        this.formValue = ''
      }
    },
    mounted() {

    }

  }
</script>

<style lang="scss">
  .x-comment-input {
    .comment-editor{
      padding-right: 0.928571rem;
      text-align: justify;
      -webkit-user-select:text;
      .ql-toolbar.ql-snow {
        display: none;
      }
      .quill-editor {
        padding: 0;
      }
      .quill-editor {
        border: 0;
      }
      .ql-container.ql-snow {
        border: none;
        .ql-editor {
          padding: 0;
          .editor-comment-mention {
            color: $--app-primary-color;
            pointer-events: none;
          }
        }
        .ql-tooltip {
          display: none;
        }
        .ql-editor.ql-blank::before {
          font-size: 14px;
          color: #B2B2B2;
          left: 0;
          font-style: normal;
        }
      }
    }
  }
</style>