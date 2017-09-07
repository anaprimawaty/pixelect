<template>
	<div class="error">
		<span>
			<img src="/assets/404.png"/>
			<span class="text">OH, SNAP! 404</span>
			<router-link :to="`/`"><span class="redirect">Take me to safety!</span></router-link>
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
	padding-top: 50px;
	text-align: center;
}
.text {
	font-size: 50px;
	display:block;
	padding-bottom: 30px;
}
.redirect {
	font-size: 20px;
	border-radius: 5px;
	border: 1px solid;
	padding: 6px;
}
</style>