<template>
  <div>
    <div class="container">
      <section class="section">
        <div class="error has-text-centered">
    			<img class="camera" src="/assets/404.png"/>
    			<img class="snap" src="/assets/404-snap.png"/>
    			<h1 class="title">OH, SNAP!</h1>
    			<h2 class="subtitle">This page doesn't exist</h2>
    			<router-link class="button is-primary" :to="`/`">Take me to safety!</router-link>
        </div>
      </section>
    </div>
    <custom-footer/>
  </div>
</template>

<script>
import CustomFooter from '@/components/CustomFooter'

export default {
  name: 'NotFound',
  components: {
    CustomFooter,
  },
}
</script>

<style scoped>

.error {
  margin-top: 2.2rem;
}

.title {
  margin-top:0.5rem;
}

.camera {
  height: 15rem;
	margin-bottom: 1em;
}

@keyframes blink {
	0% { opacity: 1; }
	50% { opacity: 0; }
	100% { opacity: 1; }
}

.snap {
	position: absolute;
	top: 45px;
	left: 0;
	right: 0;
	margin: auto;
	pointer-events: none;
	animation: blink 2s infinite step-start;
  height: 7rem;
}
</style>
