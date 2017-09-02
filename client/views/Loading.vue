<template>
	<div>
		<navigation />
    <b-loading active />
	</div>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'Loading',
  components: {
    Navigation,
  },
}
</script>

<style scoped>
</style>