<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from '@/views/example/components/ArticleDetail_md'

export default {
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>

