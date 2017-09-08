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
      @vdropzone-queue-complete="queueComplete"
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
        maxNumberOfFiles: 50,
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
      if (this.columnCount == 1) {
        return { height: '50px', width: `${this.width}px` }
      } else {
        return { height: `${this.width + 40}px`, width: `${this.width}px` }
      }
    },
    ...mapState({
      _csrf: state => state._csrf,
    }),
  },
  props: ['groupId', 'width', 'columnCount'],
  components: {
    Dropzone,
  },
  methods: {
    sending(file, xhr, formData) {
      formData.append('ext', '.' + file.type.split('/')[1])
      formData.append('groupHash', this.groupId)
    },
    queueComplete() {
      this.$scrollTo('footer')
    },
    showSuccess(file, response) {
      this.$refs.imageDropzone.dropzone.removeFile(file)
      const json = JSON.parse(response)
      store.dispatch(ADD_PHOTO, {
        photoId: json.Success.id,
        link: json.Success.link,
      })
      this.$toast.open({
        message: 'Photo uploaded!',
        type: 'is-success',
      })
    },
  },
}
</script>

<style>
#imageDropzone {
  border: none;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  overflow-y: scroll;
}

#imageDropzone .dz-preview {
  overflow-x: hidden;
}

#imageDropzone .dz-image,
#imageDropzone .dz-image img {
  width: 100% !important;
  height: 100% !important;
}

#imageDropzone .dz-message {
  transition: all 0.3s;
}

#imageDropzone:hover .dz-message {
  transform: translateY(-1px);
}

#imageDropzone .dz-message::before {
  text-align: center;
  content: 'add';
  font-family: Material Icons;
  font-size: 8rem;
  line-height: 4rem;
}

#imageDropzone .dz-error-message {
  top: 20px;
  left: unset;
  right: 20px;
}

#imageDropzone .dz-error-message::after {
  display: none;
}

#imageDropzone .dz-preview {
  min-height: 200px;
}

#imageDropzone .material-icons {
  display: none;
  font-size: 5rem;
}

@media screen and (max-width: 650px) {
  #imageDropzone .dz-message::before {
    font-size: 3rem;
    line-height: 3rem;
  }
}

</style>
