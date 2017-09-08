<template>
  <ul class="photo-list" ref="photoList" :style="{ height: `${height}px` }">
    <transition-group name="slide-fade">
      <li class="photo" :style="photoStyle(0)" key="dropzone">
        <dropzone :group-id="groupId" :width="width" :columnCount="columnCount" />
      </li>
      <li
        class="photo"
        v-for="photo in Object.values(sortedPhotos)"
        :key="photo.photoId"
        :style="photoStyle(photo.index + 1)"
      >
        <photo
          :photo-id="photo.photoId"
          :url="photo.link"
          :voted="photo.voted"
          :votes="photo.votes"
          :is-new="photo.isNew"
          :width="width"
          :columnCount="columnCount"
        />
      </li>
    </transition-group>
    <resize-observer @notify="handleResize" />
  </ul>
</template>

<script>
import Photo from '@/components/Photo'
import Dropzone from '@/components/Dropzone'

const PADDING = 20
const PANE_HEIGHT = 40
const DROPZONE_HEIGHT = 150

export default {
  mounted() {
    this.handleResize()
  },
  props: ['photos', 'groupId'],
  components: { Photo, Dropzone },
  data() {
    return {
      photoStyle: i => {},
      width: 0,
      height: 0,
      columnCount: 0,
      photoCount: 0,
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
  updated() {
    const photoCount = Object.keys(this.photos).length
    if (photoCount !== this.photoCount) {
      this.handleResize()
      this.photoCount = photoCount
    }
  },
  methods: {
    handleResize() {
      if (!this.$refs.photoList) {
        return
      }

      const width = this.$refs.photoList.clientWidth
      const columnCount =
        width < 600 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 4
      const columnWidth = (width - (columnCount - 1) * PADDING) / columnCount
      const columnHeight = columnWidth + PANE_HEIGHT + PADDING

      this.columnCount = columnCount
      this.photoStyle = i => {
        const x = i % columnCount * (columnWidth + PADDING)
        let y = Math.floor(i / columnCount) * columnHeight
        if (columnCount === 1 && i !== 0) {
          y = Math.max(
            DROPZONE_HEIGHT + PADDING,
            y - columnHeight + DROPZONE_HEIGHT + PADDING
          )
        }
        return { transform: `translate(${x}px, ${y}px` }
      }

      this.width = columnWidth
      this.height =
        Math.floor(Object.keys(this.photos).length / columnCount + 1) *
        columnHeight
      if (columnCount === 1) {
        this.height += DROPZONE_HEIGHT - columnHeight
      }
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

.onboard {
  background-image: url(/assets/onboard.png);
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  height: 644px;
}
</style>
