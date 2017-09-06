<template>
  <div :class="{ modal: true, 'is-active': this.link != null }" @keypress="close">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content" @click="close">
      <div class="preview-image" :style="{ backgroundImage: `url(${link})` }" />
    </div>
    <span class="likes">
      <a class="icon heart" @click="vote" aria-label="vote">
        <svg viewBox="0 0 24 24">
          <path
            :fill="voted ? '#f95d55' : 'rgba(0,0,0,0)'"
            :stroke="voted ? null : '#ffffff'"
            :stroke-width="voted ? null : '1.5'"
            d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
            />
        </svg>
      </a>
    </span>
    <button class="modal-close is-large" @click="close" aria-label="close"></button>
  </div>
</template>

<script>
import store, { PREVIEW, VOTE } from '@/store'

export default {
  props: ['photoId', 'link', 'voted'],
  methods: {
    close(e) {
      store.commit(PREVIEW, null)
    },
    vote(e) {
      // TODO: animations
      store.dispatch(VOTE, {
        photoId: this.photoId,
        isUnvote: this.voted,
      })
    },
  },
}
</script>

<style scoped>
.icon {
  transition: all 200ms ease-in-out;
}

.icon:hover {
  opacity: 0.5;
}

svg path {
  transition: all 0.25s;
}

.modal {
  z-index: 1001;
}

.modal-content {
  width: calc(100vw - 120px);
  height: calc(100vh - 40px);
}

.preview-image {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: auto;
  width: 100%;
  height: 100%;
}

.likes {
  color: #ffffff;
  position: absolute;
  bottom: 1em;
  right: 1em;
}

.likes .icon, .likes svg {
  height: 3em;
  width: 3em;
}
</style>
