<template>
	<div class="error">
		<span>
			<img class="camera" src="/assets/404.png"/>
			<img class="snap" src="/assets/404-snap.png"/>
			<h1 class="title">OH, SNAP!</h1>
			<h2 class="subtitle">This page doesn't exist</h2>
			<router-link class="button is-primary is-large" :to="`/`">Take me to safety!</router-link>
		</span>
	</div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>
.error {
	position: relative;
	padding-top: 70px;
	text-align: center;
}

.camera {
	margin-bottom: 1em;
}

@keyframes blink {
	0% { opacity: 1; }
	50% { opacity: 0; }
	100% { opacity: 1; }
}

.snap {
	position: absolute;
	top: 20px;
	left: 0;
	right: 0;
	margin: auto;
	pointer-events: none;
	animation: blink 2s infinite step-start;
}

.title {
	font-size: 3em;
	margin-bottom: 1em;
}

.subtitle {
	font-size: 2em;
	margin-bottom: 1em;
}
</style>
