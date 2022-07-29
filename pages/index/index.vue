<template>
	<view class="content">
		<view v-for="(item, index) in userChatList" :key="index">
			<view class="user-row" @tap="goToChat(item)">
				<view class="user-item">
					<view class="item-left">
						<image class="image" :src="item.avatar"  />
						<view class="count" v-if="item.unreadCount>0"></view>
					</view>
					<view class="item-right">
						<view class="item-right-line">
							<view class="title">{{ item.nickname }}</view>
							<view class="time">{{ latelyDate(item.time) }}</view>
						</view>
						<view class="item-right-line">
							<view class="introduce">{{ richText(item) }}</view>
							<view class="count" v-if="item.unreadCount>0">{{item.unreadCount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { latelyDate, richText } from '@/common/util.js';
export default {
	computed: mapState(['user', 'userChatList']),
	data() {
		return {
			latelyDate: latelyDate,
			richText: richText
		};
	},
	onLoad() {},

	methods: {
		goToChat(user) {
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
			.count {
				position: absolute;
				right: 2rpx;
				background: red;
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				display: inline-block;
				box-sizing: border-box;
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
			.count {
				border-radius: 15rpx;
				background: red;
				color: #fff;
				min-width: 30rpx;
				line-height: 30rpx;
				text-align: center;
				padding: 0 10rpx;
				font-size: 20rpx;
				display: inline-block;
				box-sizing: border-box;
			}
			.time {
				display: block;
				color: #808080;
				text-align: center;
				font-size: 24rpx;
				line-height: 45rpx;
			}
			.introduce {
				width: 100%;
				color: #808080;
				height: 50rpx;
				line-height: 36rpx;
				font-size: 24rpx;
				overflow: hidden; /**自动隐藏文字*/
				text-overflow: ellipsis; /**文字隐藏后添加省略号*/
				white-space: nowrap; /**强制不换行*/
			}
		}
	}
}
</style>
