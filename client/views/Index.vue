<template>
	<div class="container">
		<div class="card" v-for="group in groups">
			<router-link :to="`/group/${group.id}`">
				<div class="card-image" style="background-image: url(https://s3-ap-southeast-1.amazonaws.com/pixelectstaging/c23eef979bff27aa896f49095c99bfa1)" />
				<div class="card-content">
					<router-link :to="`/group/${group.id}`">{{ group.name }}</router-link>
				</div>
		</router-link>
			</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import store, { FETCH_GROUP_LIST } from '@/store'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP_LIST)
  },
  computed: mapState({
    groups: state => state.groups,
  }),
}
</script>

<style scoped>
.card {
	margin-bottom: 2em;
}

.card-image {
	width: 100%;
	height: 400px;
	background-position: 50% 50%;
	background-size: cover;
}
</style>
