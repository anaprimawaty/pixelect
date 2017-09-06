<template>
<ul class="user-list">
	<li v-for="user in users.slice(0, 4)">
		<a :href="`//www.facebook.com/${user.facebookId}`">
			<img :src="`//graph.facebook.com/v2.10/${user.facebookId}/picture`" />
			<span class="label">{{ user.firstName }}</span>
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
	position: absolute;
	right: 0;
	top: 0;
}

.user-list li {
	position: relative;
	display: inline-block;
	margin-right: 0.5em;
}

.user-list li img, .user-list li svg {
	border: 2px solid transparent;
	border-radius: 2.8rem;
	width: 2.8rem;
	height: 2.8rem;
	transition: all 200ms ease-out;
}

.user-list li:hover img, .user-list li:hover svg {
	border: 2px solid #404040;
}

.user-list li .label {
	position: absolute;
	font-size: 0.8em;
	top: 60px;
	text-align: center;
	left: -75px;
	width: 200px;
	opacity: 0;
	visibility: hidden;
	transition: all 200ms ease-out;
}

.user-list li:hover .label {
	opacity: 1;
	visibility: visible;
}
</style>