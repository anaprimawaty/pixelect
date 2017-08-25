<template>
  <div class="box is-paddingless is-clipped">
    <figure :class="{ image: true, animate }" :style="imageStyle" @dblclick="vote">
      <div class="loader" :src="url" />
      <progressive-background :src="url" />
      <svg class="heart" viewBox="0 0 24 24">
        <path
          fill="#f95d55"
          d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
          />
      </svg>
    </figure>
    <div class="meta">
      <span class="likes">
        <a class="icon heart" @click="vote" aria-label="vote">
          <svg viewBox="0 0 24 24">
            <path
              :fill="voted ? '#f95d55' : 'rgba(0,0,0,0)'"
              :stroke="voted ? null : '#404040'"
              :stroke-width="voted ? null : '1.5'"
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
              />
          </svg>
        </a>
        {{ votes }} likes
      </span>
      <a class="icon preview" @click="preview" aria-label="preview">
        <svg viewBox="0 0 24 24">
          <path
            fill="#404040"
            d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z"
            />
        </svg>
      </a>
      <a class="icon download" :href="url" aria-label="download" download>
        <svg viewBox="0 0 24 24">
          <path
            fill="#404040"
            d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
            />
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import store, { VOTE, PREVIEW } from '@/store'

export default {
  props: ['photoId', 'url', 'voted', 'votes', 'width'],
  data() {
    return {
      animate: false,
    }
  },
  computed: {
    imageStyle() {
      const width = `${this.width}px`
      return { width, height: width }
    },
    boxStyle() {
      const width = `${this.width}px`
      return { width, height: width }
    },
  },
  methods: {
    vote(e) {
      this.animate = !this.voted
      store.dispatch(VOTE, {
        fbId: this.fbId,
        photoId: this.photoId,
        isUnvote: this.voted,
      })
    },
    preview(e) {
      store.dispatch(PREVIEW, this.photoId)
    },
  },
}
</script>

<style scoped>
.box {
  transition: all 0.5s ease-in-out;
}

.image > * {
  position: absolute;
  top: 0;
  left: 0;
}

.image .heart {
  opacity: 0;
  z-index: 1;
  transition: opacity 500ms;
}

.image .loader {
  top: 33%;
  left: 33%;
  width: 34%;
  height: 34%;
}

.image.animate .heart { 
  animation: animation 2000ms linear both;
  opacity: 1;
}

.image {
  /* Fix 'overflow: hidden' (https://stackoverflow.com/questions/5736503/how-to-make-css3-rounded-corners-hide-overflow-in-chrome-opera) */
  -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
}

.meta {
  position: relative;
  padding: 5px;
  font-size: 0.8em;
  height: 40px;
}

.meta a {
  user-select: auto;
  cursor: pointer;
}

.icon {
  margin-top: -2px;
  width: 32px;
  height: 32px;
  padding: 5px;
  opacity: 1;
  transition: all 200ms ease-in-out;
}

.icon:hover {
  opacity: 0.5;
}

.preview {
  position: absolute;
  right: 37px;
}

.download {
  position: absolute;
  right: 5px;
}

@keyframes animation { 
  0% { opacity: 1; transform: matrix3d(0.563, 0, 0, 0, 0, 0.563, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  1.7% { transform: matrix3d(0.74, 0, 0, 0, 0, 0.791, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  2.35% { transform: matrix3d(0.815, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.4% { transform: matrix3d(0.933, 0, 0, 0, 0, 1.065, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(1.059, 0, 0, 0, 0, 1.22, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  5.11% { transform: matrix3d(1.092, 0, 0, 0, 0, 1.252, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { transform: matrix3d(1.194, 0, 0, 0, 0, 1.312, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  7.06% { transform: matrix3d(1.204, 0, 0, 0, 0, 1.311, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  8.76% { transform: matrix3d(1.242, 0, 0, 0, 0, 1.26, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.36% { transform: matrix3d(1.244, 0, 0, 0, 0, 1.23, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.66% { transform: matrix3d(1.235, 0, 0, 0, 0, 1.164, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  12.16% { transform: matrix3d(1.21, 0, 0, 0, 0, 1.103, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  12.61% { transform: matrix3d(1.2, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.51% { transform: matrix3d(1.16, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.96% { transform: matrix3d(1.152, 0, 0, 0, 0, 1.068, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.77% { transform: matrix3d(1.113, 0, 0, 0, 0, 1.104, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.37% { transform: matrix3d(1.109, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  20.52% { transform: matrix3d(1.103, 0, 0, 0, 0, 1.137, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  22.22% { transform: matrix3d(1.106, 0, 0, 0, 0, 1.143, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  26.08% { transform: matrix3d(1.12, 0, 0, 0, 0, 1.129, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.128, 0, 0, 0, 0, 1.119, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  31.63% { transform: matrix3d(1.129, 0, 0, 0, 0, 1.121, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  37.64% { transform: matrix3d(1.126, 0, 0, 0, 0, 1.127, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  42.74% { transform: matrix3d(1.124, 0, 0, 0, 0, 1.125, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  45.35% { transform: matrix3d(1.124, 0, 0, 0, 0, 1.124, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  49.9% { transform: matrix3d(1.125, 0, 0, 0, 0, 1.125, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  50% { transform: matrix3d(1.125, 0, 0, 0, 0, 1.125, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(1.877, 0, 0, 0, 0, 1.877, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  54.3% { opacity: 1; transform: matrix3d(2.41, 0, 0, 0, 0, 2.41, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  56.46% { transform: matrix3d(2.664, 0, 0, 0, 0, 2.664, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  58.61% { transform: matrix3d(2.724, 0, 0, 0, 0, 2.724, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  64.16% { transform: matrix3d(2.618, 0, 0, 0, 0, 2.618, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  69.72% { transform: matrix3d(2.578, 0, 0, 0, 0, 2.578, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  80.83% { transform: matrix3d(2.588, 0, 0, 0, 0, 2.588, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  91.99% { transform: matrix3d(2.587, 0, 0, 0, 0, 2.587, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { opacity: 0; transform: matrix3d(2.587, 0, 0, 0, 0, 2.587, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
}
</style>
