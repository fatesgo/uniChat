<template>
	<view class="content">
		<view class="logo"><image src="../../static/logo.jpg" mode=""></image></view>
		<view class="uni-form-item uni-column"><input class="uni-input" placeholder="请输入用户名" v-model="loginForm.username" /></view>
		<view class="uni-form-item uni-column column-with-btn">
			<input type="text" class="uni-input" placeholder="请输入图片验证码" v-model="loginForm.code" />
			<image :src="codeUrl" class="captcha" @click="getCode()"></image>
		</view>
		<view class="uni-form-item uni-column"><input type="password" class="uni-input" placeholder="请输入密码" v-model="loginForm.password" /></view>
		<view class="login"><view class="purple" @click="login">登陆</view></view>
	</view>
</template>

<script>
import { getCode, login, getUserInfo, appPush } from '@/common/api.js';
export default {
	data() {
		return {
			codeUrl: null,
			loginForm: {
				username: 'hwj',
				password: '123456',
				code: null,
				uuid: null
			}
		};
	},
	onLoad() {
		this.getCode();
	},
	methods: {
		getCode() {
			getCode().then(data => {
				this.codeUrl = 'data:image/jpg;base64,' + data.img.replace(/[\r\n]/g, '');
				this.loginForm.uuid = data.uuid;
			});
		},
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
					this.getCode();
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
		},
	
	}
};
</script>

<style lang="scss" scoped>
$color-primary: #b49950;
.content {
	padding: 60rpx 100rpx 100rpx;
}
.logo {
	text-align: center;
	image {
		height: 200rpx;
		width: 200rpx;
		border-radius: 50%;
	}
}
.uni-form-item {
	margin-bottom: 40rpx;
	padding: 0;
	border-bottom: 1px solid #e3e3e3;
	.uni-input {
		font-size: 30rpx;
		padding: 7px 0;
	}
}
.column-with-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	button {
		font-size: 24rpx;
		margin: 0;
		width: 180rpx;
		text-align: center;
		&:after {
			border: none;
		}
		&.active {
			background-color: $color-primary;
			color: $uni-text-color-inverse;
		}
	}
}
.captcha {
	width: 150rpx;
	height: 60rpx;
}
.login {
	width: 100%;
	text-align: center;
	.purple {
		background-color: #1890ff;
		width: 320rpx; //515
		height: 88rpx;
		opacity: 0.95;
		border-radius: 44rpx;
		line-height: 88rpx;
		font-size: 34rpx;
		color: #ffffff;
		margin: 0 auto;
	}
}
</style>
