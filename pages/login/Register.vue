<template>
	<view>
		<view class="from">
			<view class="input-box">
				<image src="/static/images/login/zh@2x.png"></image>
				<input placeholder="账号/手机号码" maxlength="11" v-model="registerForm.username" />
			</view>
			<view class="input-box">
				<image src="/static/images/login/zh@2x.png"></image>
				<input placeholder="短信验证码" maxlength="6" v-model="registerForm.code" />
				<view class="smsBtn" @click="sendSms">{{ codeText }}</view>
			</view>
			<view class="input-box">
				<image src="/static/images/login/mm@2x.png"></image>
				<input placeholder="密码" type="password" v-model="registerForm.password" />
			</view>
			<view class="btn"><view class="purple" @click="register">注册</view></view>
		</view>

		<uni-popup ref="popup" type="center">
			<view class="popup-box">
				<view class="sms-box">
					<input placeholder="请输入右侧验证码" maxlength="6" v-model="codeObj.code" />
					<image src="../../static/images/tabBar/user-on.png"></image>
				</view>
				<view class="btn"><view class="purple" @click="register">发送短信验证码</view></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getCode, register } from '@/common/api.js';
export default {
	data() {
		return {
			codeObj: {
				code: '',
				codeUrl: null,
				uuid: ''
			},
			codeText: '获取验证码',
			registerForm: {
				username: '',
				password: '',
				code: null
			}
		};
	},
	mounted() {
		this.$refs.popup.open();
	},
	methods: {
		sendSms() {
			if (this.registerForm.username == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号码!'
				});
				return;
			} else if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.registerForm.username)) {
				uni.showToast({
					icon: 'none',
					title: '手机号码格式错误!'
				});
				return;
			}
			this.$refs.popup.open();
		},
		getCode() {
			getCode().then(data => {
				this.codeUrl = 'data:image/jpg;base64,' + data.img.replace(/[\r\n]/g, '');
				this.loginForm.uuid = data.uuid;
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
		.smsBtn {
			padding-left: 55rpx;
			width: 180rpx;
			height: 102rpx;
			line-height: 102rpx;
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
.popup-box {
	background-color: white;
	width: 85vw;
	height: 50vh;
	.sms-box {
		display: flex;
		align-items: center;
		width: 500rpx;
		height: 102rpx;
		display: flex;
		align-items: center;
		background-color: #f2f8ff;
		border-radius: 48rpx;
		border: solid 1rpx #83b5ff;
		input {
			padding-left: 25rpx;
			width: 400rpx;
			height: 102rpx;
		}
		image {
			width: 30rpx;
			height: 30rpx;
			padding: 0 23rpx 0 20rpx;
		}
	}
}
</style>
