<template>
  <ul class="photo-list" ref="photoList" :style="{ height: `${height}px` }">
    <transition-group name="slide-fade">
      <li class="photo" v-for="photo in Object.values(sortedPhotos)" :key="photo.photoId" :style="photoStyle(photo.index)">
        <photo :photo-id="photo.photoId" :url="photo.link" :voted="photo.voted" :votes="photo.votes" :width="width" />
      </li>
    </transition-group>
    <resize-observer @notify="handleResize" />
  </ul>
</template>

<script>
import Photo from '@/components/Photo'

const PADDING = 20
const PANE_HEIGHT = 40

export default {
  mounted() {
    this.handleResize()
  },
  props: ['photos'],
  components: { Photo },
  data() {
    return {
      photoStyle: i => {},
      width: 0,
      height: 0,
    }
  },
  computed: {
    sortedPhotos: state => {
      const sorted = Object.entries(state.photos).sort(
        (a, b) =>
          a[1].votes < b[1].votes ? 1 : a[1].votes === b[1].votes ? 0 : -1
      )
      const sortedPhotos = {}
      for (let i of sorted.keys()) {
        const photoId = sorted[i][0]
        const photo = sorted[i][1]
        sortedPhotos[photoId] = { ...photo, index: i }
      }
      return sortedPhotos
    },
  },
  methods: {
    handleResize() {
      const width = this.$refs.photoList.clientWidth
      const columns = width < 600 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 4
      const columnWidth = (width - (columns - 1) * PADDING) / columns
      this.photoStyle = i => ({
        transform: `translate(${i %
          columns *
          (columnWidth + PADDING)}px,${Math.floor(i / columns) *
          (columnWidth + PANE_HEIGHT + PADDING)}px`,
      })
      this.width = columnWidth
      this.height =
        Math.floor((Object.keys(this.photos).length - 1) / columns + 1) *
        (columnWidth + PANE_HEIGHT + PADDING)
    },
  },
}
</script>

<style scoped>
.photo-list {
  position: relative;
  width: 100%;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  transition: all 0.5s ease-in-out;
}
</style>
