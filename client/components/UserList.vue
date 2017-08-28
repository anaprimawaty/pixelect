<template>
<ul class="user-list">
	<li v-for="user in users">
		<a :href="`//www.facebook.com/${user.facebookId}`">
			<img :src="`//graph.facebook.com/v2.10/${user.facebookId}/picture`" />
			<span class="label">{{ user.firstName }} {{ user.lastName }}</span>
		</a>
	</li>
</ul>
</template>

<script>
export default {
  name: 'UserList',
  props: ['users'],
}
</script>

<style lang="css" scoped>
.user-list {
	margin: 2em 0;
}

.user-list li {
	position: relative;
	display: inline-block;
	margin-right: 0.5em;
}

.user-list li img {
	border-radius: 50px;
	border: 2px solid transparent;
	width: 50px;
	height: 50px;
	transition: all 200ms ease-in-out;
}

.user-list li .label {
	position: absolute;
	font-size: 0.8em;
	top: 60px;
	text-align: center;
	left: -75px;
	width: 200px;
	opacity: 0;
	transition: all 200ms ease-in-out;
}

.user-list li:hover img {
	border: 2px solid #404040;
}

.user-list li:hover .label {
	opacity: 1;
}
</style>