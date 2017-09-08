<template>
  <div :class="{
    'box': true,
    'is-paddingless': true,
    'is-clipped': true,
    'new': isNew,
  }" @mouseenter="seenPhoto">
    <figure :class="{ image: true, animate }" :style="imageStyle">
      <div class="loader" v-if="!loaded" />
      <img v-if="columnCount > 1" v-img:photos :src="url" :style="imageStyle" @load="loaded = true" />
      <v-touch v-else tag="img" @doubletap="vote" :src="url" :style="imageStyle" @load="loaded = true" />
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
        {{ votes }} like{{ votes === 1 ? '' : 's' }}
      </span>
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
import { mapState } from 'vuex'
import store, { VOTE, SEEN_PHOTO } from '@/store'

export default {
  props: ['photoId', 'url', 'voted', 'votes', 'width', 'columnCount', 'isNew'],
  data() {
    return {
      animate: false,
      loaded: false,
    }
  },
  computed: {
    ...mapState({
      facebookId: state => state.facebookId,
    }),
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
        photoId: this.photoId,
        isUnvote: this.voted,
      })
      e.preventDefault()
    },
    seenPhoto() {
      store.dispatch(SEEN_PHOTO, this.photoId)
    },
  },
}
</script>

<style scoped>
.box {
  transition: all 0.5s ease-in-out;
}

.box.new {
  animation: bounce 2s 1 ease-in-out;
}

@keyframes bounce {
  0% { transform: translateY(0px); }
  80% {
    transform: translateY(0px);
    box-shadow: 0 2px 5px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  }
  90% {
    transform: translateY(-15px);
    box-shadow: 0 5px 10px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  }
}

.image img {
  object-fit: cover;
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
  pointer-events: none;
}

.image .loader {
  top: 33%;
  left: 33%;
  width: 34%;
  height: 34%;
}

.image.animate .heart {
  animation: animation 1500ms linear both;
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

.meta .likes {
  user-select: none;
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
  transform: translateY(-1px);
  opacity: 0.5;
}

svg path {
  transition: all 0.25s;
}

.download {
  position: absolute;
  right: 5px;
}

/* Generated with Bounce.js. Edit at https://goo.gl/HJPaM5 */
@keyframes animation {
  0% { transform: matrix3d(0.309, -0.083, 0, 0, 0.083, 0.309, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  2.27% { transform: matrix3d(0.445, -0.065, 0, 0, 0.07, 0.416, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.14% { transform: matrix3d(0.509, -0.049, 0, 0, 0.054, 0.461, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.54% { transform: matrix3d(0.605, -0.015, 0, 0, 0.017, 0.531, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.27% { transform: matrix3d(0.693, 0.027, 0, 0, -0.031, 0.602, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { transform: matrix3d(0.711, 0.037, 0, 0, -0.042, 0.62, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.08% { transform: matrix3d(0.744, 0.059, 0, 0, -0.065, 0.677, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.743, 0.059, 0, 0, -0.064, 0.683, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  11.68% { transform: matrix3d(0.715, 0.044, 0, 0, -0.045, 0.705, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  12.48% { transform: matrix3d(0.699, 0.035, 0, 0, -0.034, 0.707, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.21% { transform: matrix3d(0.662, 0.013, 0, 0, -0.012, 0.703, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  16.22% { transform: matrix3d(0.627, -0.007, 0, 0, 0.007, 0.688, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  16.82% { transform: matrix3d(0.62, -0.011, 0, 0, 0.01, 0.683, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  19.35% { transform: matrix3d(0.607, -0.018, 0, 0, 0.016, 0.66, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  19.95% { transform: matrix3d(0.607, -0.017, 0, 0, 0.016, 0.655, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  23.69% { transform: matrix3d(0.628, -0.006, 0, 0, 0.006, 0.633, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.49% { transform: matrix3d(0.633, -0.003, 0, 0, 0.004, 0.631, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  27.36% { transform: matrix3d(0.647, 0.004, 0, 0, -0.004, 0.627, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.63% { transform: matrix3d(0.65, 0.005, 0, 0, -0.005, 0.629, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  34.77% { transform: matrix3d(0.642, 0.001, 0, 0, -0.001, 0.637, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  39.91% { transform: matrix3d(0.637, -0.002, 0, 0, 0.002, 0.642, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  42.18% { transform: matrix3d(0.638, -0.001, 0, 0, 0.001, 0.642, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  50.18% { transform: matrix3d(0.641, 0.001, 0, 0, -0.001, 0.64, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  56.99% { transform: matrix3d(0.64, 0, 0, 0, 0, 0.64, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  60.46% { transform: matrix3d(0.64, 0, 0, 0, 0, 0.64, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  66.57% { transform: matrix3d(0.64, 0, 0, 0, 0, 0.64, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  66.67% { opacity: 1; transform: matrix3d(0.512, 0, 0, 0, 0, 0.512, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  67.73% { transform: matrix3d(0.346, 0, 0, 0, 0, 0.346, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  68.77% { transform: matrix3d(0.237, 0, 0, 0, 0, 0.237, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  70.84% { transform: matrix3d(0.11, 0, 0, 0, 0, 0.11, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  72.94% { transform: matrix3d(0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.01% { transform: matrix3d(0.023, 0, 0, 0, 0, 0.023, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  79.18% { opacity: 0; transform: matrix3d(0.005, 0, 0, 0, 0, 0.005, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  83.35% { transform: matrix3d(0.001, 0, 0, 0, 0, 0.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(0.001, 0, 0, 0, 0, 0.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}
</style>
