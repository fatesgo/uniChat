<template>
	<view><video id="myVideo" @error="playError" :src="currentPlayUrl" class="video"></video></view>
</template>

<script>
export default {
	data() {
		return {
			currentPlayUrl:null,
			videoContext: null,
			broadcastRoom:null
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title:option.broadcastRoom
		})
		this.broadcastRoom=option.broadcastRoom;
		this.currentPlayUrl = 'rtmp://114.132.199.32:1935/live/'+this.broadcastRoom;
		this.$nextTick(() => {
			this.videoContext = uni.createVideoContext('myVideo', this);
			this.videoContext.play();
		});
	},
	methods: {
		playError(err){
			console.log(err)
		}
	}
};
</script>

<style lang="scss" scoped>
	.video{
		width: 100vw;
		height: 780rpx;
	}
</style>
