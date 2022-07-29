<template>
	<view>
		<view class="from">
			<view class="input-box">
				<image src="/static/images/login/zh@2x.png"></image>
				<input placeholder="账号" v-model="loginForm.username" />
			</view>
			<view class="input-box">
				<image src="/static/images/login/mm@2x.png"></image>
				<input placeholder="密码" v-model="loginForm.password" />
			</view>
			<view class="forget">忘记密码</view>
			<view class="btn"><view class="purple" @click="login">登陆</view></view>
		</view>
		<view class="bottom">
			<view class="tag">其他方式登录</view>
			<view class="rests">
				<image src="/static/images/login/wecat@2x.png" class="icon" mode=""></image>
				<image src="/static/images/login/qq@2x.png" class="icon" mode=""></image>
				<image src="/static/images/login/weibo@2x.png" class="icon" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
import { login, getUserInfo } from '@/common/api.js';
export default {
	data() {
		return {
			loginForm: {
				username: 'test',
				password: '123456'
			}
		};
	},
	methods: {
		login() {
			const username = this.loginForm.username.trim();
			const password = this.loginForm.password.trim();
			const code = this.loginForm.code;
			const uuid = this.loginForm.uuid;
			login({
				username,
				password,
				code,
				uuid
			})
				.then(data => {
					this.$store.commit('SetToken', data.token);
					this.getUserInfo();
				})
				.catch(() => {
				});
		},
		getUserInfo() {
			getUserInfo().then(data => {
				this.$store.commit('SetUser', data.user);
				uni.$emit('sign_in', data.user.id);
				uni.reLaunch({
					url: '../index/index'
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.from {
	width: 100%;
	margin-top: 45rpx;
	.input-box {
		width: 576rpx;
		height: 102rpx;
		display: flex;
		align-items: center;
		background-color: #f2f8ff;
		border-radius: 48rpx;
		margin: 20rpx auto;
		border: solid 1rpx #83b5ff;
		image {
			width: 30rpx;
			height: 30rpx;
			padding: 0 23rpx 0 38rpx;
		}
	}
	.forget {
		text-align: right;
		padding-right: 100rpx;
		color: #4faffe;
		text-decoration: underline;
		margin-bottom: 18rpx;
	}
	.btn {
		width: 623rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 42rpx;
		margin: 0 auto;
		text-align: center;
		background: linear-gradient(270deg, #358bff, #3be3fc);
		color: white;
	}
}
.bottom {
	margin-top: 50rpx;
	.tag {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 22rpx;
		font-family: Adobe Heiti Std;
		font-weight: normal;
		color: #9f9f9f;
		line-height: 34rpx;

		&::before {
			content: '';
			display: block;
			width: 160rpx;
			height: 1px;
			background: #d8d8d8;
			opacity: 0.86;
		}

		&::after {
			content: '';
			display: block;
			width: 160rpx;
			height: 1px;
			background: #d8d8d8;
			opacity: 0.86;
		}
	}

	.rests {
		margin-top: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		.icon {
			width: 73rpx;
			height: 73rpx;
		}
	}
}
</style>
