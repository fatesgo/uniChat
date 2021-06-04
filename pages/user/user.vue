<template>
	<view>
		<view class="header status">
			<view class="userinfo" @tap="gotoLogin()">
				<view class="face"><image :src="user.avatar"></image></view>
				<view class="info">
					<view class="username">{{ user.nickname }}</view>
				</view>
			</view>
			<view class="setting"><text class="icon set"></text></view>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
export default {
	computed: mapState(['user']),
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		gotoLogin() {
			if (!this.user.id) {
				uni.navigateTo({
					url: '../login/login'
				});
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.header {
	&.status {
		padding-top: var(--status-bar-height);
	}
	background-color: #ff6364;
	width: 92%;
	height: 30vw;
	padding: 0 4%;
	display: flex;
	align-items: center;
	.userinfo {
		width: 90%;
		display: flex;
		.face {
			flex-shrink: 0;
			width: 15vw;
			height: 15vw;
			image {
				width: 100%;
				height: 100%;
				border-radius: 100%;
			}
		}
		.info {
			display: flex;
			flex-flow: wrap;
			padding-left: 30upx;
			.username {
				width: 100%;
				color: #fff;
				font-size: 40upx;
			}
		}
	}
	.setting {
		flex-shrink: 0;
		width: 6vw;
		height: 6vw;
	}
}
</style>
