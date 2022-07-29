<template>
	<view>
		<input v-model="broadcastRoom" placeholder="这里输入直播间号" type="number" />
		<button @click="goToPlay()">进入直播间</button>
		<button @click="goToPusher()">开播</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			broadcastRoom: ''
		};
	},
	onLoad() {},
	methods: {
		goToPlay() {
			uni.navigateTo({
				url: '/pages/live/play?broadcastRoom=' + this.broadcastRoom
			});
		},
		goToPusher(){
			uni.navigateTo({
				url: '/pages/live/pusher?broadcastRoom=' + this.broadcastRoom
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
