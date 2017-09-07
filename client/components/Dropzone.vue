<template>
  <div class="box is-paddingless is-clipped">
    <dropzone
      id="imageDropzone"
      ref="imageDropzone"
      :url="`/photos/create?_csrf=${_csrf}`"
      :style="dropzoneStyle"
      :dropzone-options="customOptionsObject"
      :use-custom-dropzone-options="true"
      :language="language"
      @vdropzone-sending="sending"
      @vdropzone-success="showSuccess"
    />
  </div>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import { mapState } from 'vuex'
import store, { ADD_PHOTO } from '@/store'

export default {
  data() {
    return {
      customOptionsObject: {
        acceptedFileTypes: 'image/jpeg,image/png',
        maxFileSizeInMB: '5',
      },
      styleObject: {
        width: this.width,
      },
      language: {
        dictDefaultMessage: '<br />Drop image or<br />click here to upload',
      },
    }
  },
  computed: {
    dropzoneStyle() {
      if (this.columns == 1) {
        return { height: '50px', width: `${this.width}px` }
      } else {
        return { height: `${this.width + 40}px`, width: `${this.width}px` }
      }
    },
    ...mapState({
      _csrf: state => state._csrf,
    }),
  },
  props: ['groupId', 'width', 'columns'],
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
      const json = JSON.parse(response)
      store.dispatch(ADD_PHOTO, {
        photoId: json.Success.id,
        link: json.Success.link,
      })
    },
  },
}
</script>

<style>
@media screen and (max-width: 500px) {
  #imageDropzone {
    height: 30px
  }
}

#imageDropzone {
  border: none;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

#imageDropzone .material-icons {
  font-size: 5rem;
}
</style>
