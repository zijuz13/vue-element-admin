<template>
  <div class="components-container">
    <aside>
      This Rich Text Editor is what I frequently use, I have encapsulated this component so that it can upload images to my Linux Host, and Nginx will help direct the images to users.
      -Zijun Zhou
    </aside>
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>

