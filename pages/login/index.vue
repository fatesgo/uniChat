<template>
	<view class="content">
		<view class="logo"><image src="/static/images/login/login_bg@2x.png" mode="aspectFill"></image></view>
		<view class="label">
			<view :style="{ color: tabIndex == 0 ? '#4CA8FE' : '' }" @click="tabIndex = 0">登陆</view>
			<view :style="{ color: tabIndex == 1 ? '#4CA8FE' : '' }" @click="tabIndex = 1">注册</view>
		</view>
		<template v-if="tabIndex == 0">
			<Login />
		</template>
		<template v-if="tabIndex == 1">
			<Register />
		</template>
	</view>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';
export default {
	components: {
		Login,
		Register
	},
	data() {
		return {
			tabIndex: 0
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.content {
	.logo {
		text-align: center;
		image {
			width: 750rpx;
			height: 522rpx;
		}
	}
	.label {
		margin-top: 26rpx;
		display: flex;
		justify-content: space-evenly;
		font-size: 34rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #999999;
		line-height: 48rpx;
	}

}
</style>
