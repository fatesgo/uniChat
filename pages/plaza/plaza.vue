<template>
	<view class="content">
		<view v-for="(item, index) in userList" :key="index">
			<view class="user-row" @tap="goToChat(item)">
				<view class="user-item">
					<view class="item-left"><img class="image" :src="item.avatar" /></view>
					<view class="item-right">
						<view class="item-right-line">
							<view class="title">{{ item.nickname }}</view>
						</view>
						<view class="item-right-line">
							<view class="introduce">{{ richText(item) }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { getUserListByUser } from '@/common/api.js';
import { richText } from '@/common/util.js';
export default {
	computed: mapState(['user']),
	data() {
		return {
			userList: [],
			richText: richText
		};
	},
	onLoad() {
		getUserListByUser(this.user.id).then(data => {
			this.userList=data;
		});
	},
	methods: {
		goToChat(user) {
			if (!this.user.id) {
				uni.navigateTo({
					url: '../login/login'
				});
			}
			uni.navigateTo({
				url: '../chat/chat?user=' + JSON.stringify(user)
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.user-row {
	width: 100vw;
	display: flex;
	align-items: center;
	//justify-content: space-between;
	box-sizing: border-box;
	padding: 10rpx 20rpx;
	border-bottom: 2rpx solid rgb(243, 243, 243);
	.user-item {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10rpx 16rpx;
		background-color: #fff;
		.item-left {
			position: relative;
			flex: none;
			width: 100rpx;
			height: 100rpx;
			.image {
				width: 100%;
				height: 100%;
				border-radius: 50rpx;
				background-color: #eee;
			}
		}
		.item-right {
			overflow-x: hidden;
			width: 100%;
			padding-left: 15rpx;
			display: flex;
			flex-direction: column;
			.item-right-line {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.title {
				display: block;
				color: #000;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 45rpx;
				text-overflow: ellipsis; /*文字隐藏后添加省略号*/
			}
			.introduce {
				width: 100%;
				//font-family: '微软雅黑';
				color: #808080;
				//height: 50rpx;
				line-height: 36rpx;
				font-size: 24rpx;
				//overflow: hidden; /**自动隐藏文字*/
				text-overflow: ellipsis; /**文字隐藏后添加省略号*/
				//white-space: nowrap; /**强制不换行*/
			}
		}
	}
}
</style>
