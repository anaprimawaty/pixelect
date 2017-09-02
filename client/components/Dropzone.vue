<template>
  <dropzone id="imageDropzone" ref="imageDropzone" url="/photos/create" :dropzone-options="customOptionsObject" :use-custom-dropzone-options="true" @vdropzone-sending="sending" @vdropzone-success="showSuccess">
  </dropzone>
</template>

<script>
import Dropzone from 'vue2-dropzone'

export default {
  data() {
    return {
      customOptionsObject: {
        acceptedFileTypes: 'image/jpeg,image/png',
      },
    }
  },
  props: ['groupId'],
  components: {
    Dropzone,
  },
  methods: {
    sending(file, xhr, formData) {
      formData.append('ext', '.' + file.type.split('/')[1])
      formData.append('groupHash', this.groupId)
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