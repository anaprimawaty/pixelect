<template>
  <dropzone id="imageDropzone" ref="imageDropzone" :url="url" :dropzone-options="customOptionsObject" :use-custom-dropzone-options="true" @vdropzone-sending="sending" @vdropzone-success="showSuccess">
  </dropzone>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import store from '@/store'

export default {
  data() {
    return {
      customOptionsObject: {
        acceptedFileTypes: 'image/jpeg,image/png',
      },
      url: '/photos/create',
    }
  },
  components: {
    Dropzone,
  },
  methods: {
    sending(file, xhr, formData) {
      formData.append('facebookId', store.state.fbId)
    },
    showSuccess(file, response) {
      this.$refs.imageDropzone.dropzone.removeFile(file)
    },
  },
}
</script>

<style>
#imageDropzone {
  margin-bottom: 1.5em;
}
</style>