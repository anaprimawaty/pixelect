<template>
  <div class="box is-paddingless">
    <figure class="image">
      <progressive-img :src="url" />
    </figure>
    <div class="meta">
      <span class="likes">
        <a class="icon heart">
          <svg  viewBox="0 0 24 24">
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
      <a class="icon download">
        <svg viewBox="0 0 24 24">
          <path fill="#404040" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['url', 'voted', 'votes'],
}
</script>

<style scoped>
.image {
  width: 256px;
  height: 256px;
}

.meta {
  position: relative;
  padding: 5px;
  font-size: 0.8em;
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
}

.download {
  position: absolute;
  right: 5px;
}
</style>
