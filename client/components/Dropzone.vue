<template>
  <dropzone id="imageDropzone" ref="myDropzone" :url="url" :dropzone-options="options" :use-custom-dropzone-options="true" @vdropzone-success="showSuccess" @vdropzone-sending="sending">
  </dropzone>
</template>

<script>
import Dropzone from 'vue2-dropzone'

export default {
  data() {
    return {
      options: {
        method: 'put',
        acceptedFileTypes: 'image/jpeg,image/png',
      },
      url: '#',
    }
  },
  components: {
    Dropzone,
  },
  methods: {
    showSuccess() {
      console.log('uploaded!')
    },
    sending(file, xhr, formData) {
      xhr.abort()
      xhr.open('POST', 'https://httpbin.org/post')
      console.log('intercepted!')
    },
  },
}
</script>

<style>
#imageDropzone {
  margin-bottom: 1.5em;
}
</style>