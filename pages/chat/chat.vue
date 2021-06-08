<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view
				class="msg-list"
				scroll-y="true"
				:scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollToView"
				@scrolltoupper="loadHistory"
				upper-threshold="50"
			>
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="!page.end">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + row.id">
					<!-- 系统消息 -->
					<block v-if="row.type == 'system'">
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.content.type == 'text'" class="text">{{ row.content }}</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block else>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.from_userId == user.id">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble"><rich-text :nodes="replaceEmoji(row.content)"></rich-text></view>
								<!-- 语言消息 -->
								<view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id ? 'play' : ''">
									<view class="length">{{ row.content.length }}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row)">
									<image :src="row.content.url" :style="{ width: row.content.w + 'px', height: row.content.h + 'px' }"></image>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right"><image :src="user.avatar"></image></view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.from_userId != user.id">
							<!-- 左-头像 -->
							<view class="left"><image :src="toUser.avatar"></image></view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{ toUser.nickname }}</view>
									<view class="time">{{ latelyDate(row.time) }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble"><rich-text :nodes="replaceEmoji(row.content)"></rich-text></view>
								<!-- 语音消息 -->
								<view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id ? 'play' : ''">
									<view class="icon other-voice"></view>
									<view class="length">{{ row.content.length }}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row)">
									<image :src="row.content.url" :style="{ width: row.content.w + 'px', height: row.content.h + 'px' }"></image>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="null">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
				<swiper-item v-for="(page, pid) in emojiList" :key="pid">
					<view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)"><image mode="widthFix" :src="'/static/img/emoji/' + em.url"></image></view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{ hidden: hideMore }">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard" :style="[{ 'margin-bottom': inputHight + 'px' }]">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice"><view class="icon" :class="isVoice ? 'jianpan' : 'yuyin'" @tap="switchVoice"></view></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="textbox">
				<view
					class="voice-mode"
					:class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
					@touchstart="voiceBegin"
					@touchmove.stop.prevent="voiceIng"
					@touchend="voiceEnd"
					@touchcancel="voiceCancel"
				>
					{{ voiceTis }}
				</view>
				<view class="text-mode" :class="isVoice ? 'hidden' : ''">
					<view class="box"><textarea auto-height="true" :adjust-position="false" v-model="textMsg" @focus="textareaFocus" /></view>
					<view class="em" @tap="chooseEmoji"><view class="icon biaoqing"></view></view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText"><view class="btn">发送</view></view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording ? '' : 'hidden'">
			<view class="ing" :class="willStop ? 'hidden' : ''"><view class="icon luyin2"></view></view>
			<view class="cancel" :class="willStop ? '' : 'hidden'"><view class="icon chehui"></view></view>
			<view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
import emoji_List from '@/common/emojiList.js';
import online_Emoji from '@/common/onlineEmoji.js';
import { getMsgList, setHaveRead } from '@/common/api.js';
import { latelyDate, replaceEmoji, setPicSize, newDate } from '@/common/util.js';

export default {
	computed: mapState(['user', 'currentMsg']),
	data() {
		return {
			toUser: null,
			msgList: [],
			page: {
				pageNo: 0,
				pageSize: 10,
				end: false,
				isHistoryLoading: false
			},
			inputHight: null,
			latelyDate: latelyDate,
			replaceEmoji: replaceEmoji,
			//文字消息
			textMsg: '',
			//消息列表

			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			msgImgList: [],
			//录音相关参数
			// #ifndef H5
			//H5不能录音
			RECORDER: uni.getRecorderManager(),
			// #endif
			isVoice: false,
			voiceTis: '按住 说话',
			recordTis: '手指上滑 取消发送',
			recording: false,
			willStop: false,
			initPoint: { identifier: 0, Y: 0 },
			recordTimer: null,
			recordLength: 0,
			//播放语音相关参数
			AUDIO: uni.createInnerAudioContext(),
			playMsgid: null,
			VoiceTimer: null,
			// 抽屉参数
			popupLayerClass: '',
			// more参数
			hideMore: true,
			//表情定义
			hideEmoji: true,
			emojiList: emoji_List
		};
	},
	onLoad(option) {
		uni.onKeyboardHeightChange(res => {
			this.inputHight = res.height;
		});
		this.toUser = JSON.parse(option.user);
		uni.setNavigationBarTitle({
			title: this.toUser.nickname
		});
		this.loadHistory();
		this.setHaveRead();
		//语音自然播放结束
		this.AUDIO.onEnded(res => {
			this.playMsgid = null;
		});
		// #ifndef H5
		//录音开始事件
		this.RECORDER.onStart(e => {
			this.recordBegin(e);
		});
		//录音结束事件
		this.RECORDER.onStop(e => {
			this.recordEnd(e);
		});
		// #endif
	},
	watch: {
		currentMsg: {
			deep: true,
			handler(newMsg) {
				if ((newMsg.to_userId == this.toUser.id && newMsg.from_userId == this.user.id) || (newMsg.to_userId == this.user.id && newMsg.from_userId == this.toUser.id)) {
					this.msgList.push(newMsg);
					this.$nextTick(function() {
						// 滚动到底
						this.scrollToView = 'msg' + newMsg.id;
					});
				}
			}
		}
	},
	methods: {
		//触发滑动到顶部(加载历史信息记录)
		loadHistory() {
			if (this.page.isHistoryLoading) {
				return;
			}
			this.page.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
			this.scrollAnimation = false; //关闭滑动动画
			let viewId = this.msgList.length > 0 ? this.msgList[0].id : 0; //记住第一个信息ID
			getMsgList({
				userId: this.user.id,
				toUserId: this.toUser.id,
				pageNo: this.page.pageNo,
				pageSize: this.page.pageSize
			}).then(list => {
				for (let i = 0; i < list.length; i++) {
					if (list[i].type == 'img') {
						list[i].content = setPicSize(list[i].content);
						this.msgImgList.push(list[i].content.url);
					}
				
				}
				if (this.page.pageNo === 0) {
					this.msgList=list;
					// 滚动到底部
					this.$nextTick(() => {
						//进入页面滚动到底部
						this.scrollTop = 9999;
						this.$nextTick(() => {
							this.scrollAnimation = true;
						});
					});
				} else {
					this.msgList.unshift(...list);
					this.$nextTick(function() {
						this.scrollToView = 'msg' + viewId; //跳转上次的第一行信息位置
						this.$nextTick(function() {
							this.scrollAnimation = true; //恢复滚动动画
						});
					});
				}
				if (list.length === this.page.pageSize) {
					this.page.pageNo++;
					this.page.isHistoryLoading = false;
				} else {
					this.page.end = true;
				}
			});
		},
		setHaveRead() {
			setHaveRead({
				to_userId: this.user.id,
				from_userId: this.toUser.id
			}).then(res => {
				if (res > 0) {
					let message = {
						type: 'reading',
						to_userId: this.user.id,
						from_userId: this.user.id,
						content: '已经阅读',
						time: newDate(),
						state: 1
					};
					uni.sendSocketMessage({
						data: JSON.stringify(message)
					});
				}
			});
		},
		screenMsg(msg, type) {
			if (type == 'voice') {
			} else if (type == 'img') {
				msg = setPicSize(msg);
				this.msgImgList.push(msg);
			}
			let message = {
				type: type,
				to_userId: this.toUser.id,
				from_userId: this.user.id,
				content: msg,
				time: newDate(),
				state: 1
			};

			uni.sendSocketMessage({
				data: JSON.stringify(message)
			});
		},
		// 发送文字消息
		sendText() {
			this.hideDrawer(); //隐藏抽屉
			if (this.textMsg == '') {
				return;
			}
			this.screenMsg(this.textMsg, 'text');
			this.textMsg = ''; //清空输入框
		},

		//更多功能(点击+弹出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
		},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		//拍照发送
		camera() {
			this.getImage('camera');
		},
		//选照片 or 拍照
		getImage(type) {
			this.hideDrawer();
			new Promise((resolve, reject) => {
				uni.chooseImage({
					sourceType: [type],
					count: 1,
					success: res => {
						const path = res.tempFilePaths[0];
						let ext;
						// #ifdef H5
						ext = res.tempFiles[0].name.split('.').pop();
						const options = {
							filePath: path,
							cloudPath: Date.now() + '.' + ext
						};
						resolve(options);
						// #endif
						// #ifndef H5
						uni.getImageInfo({
							src: path,
							success(info) {
								const options = {
									filePath: path,
									cloudPath: Date.now() + '.' + info.type.toLowerCase()
								};
								resolve(options);
							},
							fail(err) {
								reject(new Error(err.errMsg || '未能获取图片类型'));
							}
						});
						// #endif
					},
					fail: () => {
						reject(new Error('Fail_Cancel'));
					}
				});
			})
				.then(options => {
					uni.showLoading({
						title: '文件上传中...'
					});
					return uniCloud.uploadFile({
						...options,
						onUploadProgress(e) {
							console.log(e);
						}
					});
				})
				.then(res => {
					uni.hideLoading();
					console.log(res);
					// 腾讯云需要获取临时链接
					uniCloud.getTempFileURL({
						fileList: [res.fileID],
						success: ret => {
							uni.getImageInfo({
								src: ret.fileList[0].tempFileURL,
								success: image => {
									console.log(image.width);
									console.log(image.height);
									let msg = { url: ret.fileList[0].tempFileURL, w: image.width, h: image.height };
									this.screenMsg(msg, 'img');
								}
							});
						},
						fail: () => {
							uni.showModal({
								content: '获取临时链接失败',
								showCancel: false
							});
						}
					});
				})
				.catch(err => {
					uni.hideLoading();
					console.log(err);
					if (err.message !== 'Fail_Cancel') {
						uni.showModal({
							content: `图片上传失败`,
							showCancel: false
						});
					}
				});
		},
		// 选择表情
		chooseEmoji() {
			this.hideMore = true;
			if (this.hideEmoji) {
				this.hideEmoji = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		//添加表情
		addEmoji(em) {
			this.textMsg += em.alt;
		},

		//获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus() {
			if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
				this.hideDrawer();
			}
		},
		// 预览图片
		showPic(msg) {
			uni.previewImage({
				indicator: 'none',
				current: msg.content.url,
				urls: this.msgImgList
			});
		},
		// 播放语音
		playVoice(msg) {
			this.playMsgid = msg.id;
			this.AUDIO.src = msg.content.url;
			this.$nextTick(function() {
				this.AUDIO.play();
			});
		},
		// 录音开始
		voiceBegin(e) {
			if (e.touches.length > 1) {
				return;
			}
			this.initPoint.Y = e.touches[0].clientY;
			this.initPoint.identifier = e.touches[0].identifier;
			this.RECORDER.start({ format: 'mp3' }); //录音开始,
		},
		//录音开始UI效果
		recordBegin(e) {
			this.recording = true;
			this.voiceTis = '松开 结束';
			this.recordLength = 0;
			this.recordTimer = setInterval(() => {
				this.recordLength++;
			}, 1000);
		},
		// 录音被打断
		voiceCancel() {
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.willStop = true; //不发送录音
			this.RECORDER.stop(); //录音结束
		},
		// 录音中(判断是否触发上滑取消发送)
		voiceIng(e) {
			if (!this.recording) {
				return;
			}
			let touche = e.touches[0];
			//上滑一个导航栏的高度触发上滑取消发送
			if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
				this.willStop = true;
				this.recordTis = '松开手指 取消发送';
			} else {
				this.willStop = false;
				this.recordTis = '手指上滑 取消发送';
			}
		},
		// 结束录音
		voiceEnd(e) {
			if (!this.recording) {
				return;
			}
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.RECORDER.stop(); //录音结束
		},
		//录音结束(回调文件)
		recordEnd(e) {
			clearInterval(this.recordTimer);
			if (!this.willStop) {
				console.log('e: ' + JSON.stringify(e));
				let msg = {
					length: 0,
					url: e.tempFilePath
				};
				let min = parseInt(this.recordLength / 60);
				let sec = this.recordLength % 60;
				min = min < 10 ? '0' + min : min;
				sec = sec < 10 ? '0' + sec : sec;
				msg.length = min + ':' + sec;
				uniCloud
					.uploadFile({
						filePath: e.tempFilePath,
						cloudPath: Date.now() + '.mp3',
						onUploadProgress(e) {
							console.log(e);
						}
					})
					.then(res => {
						uniCloud.getTempFileURL({
							fileList: [res.fileID],
							success: result => {
								msg.url = result.fileList[0].tempFileURL;
								this.screenMsg(msg, 'voice');
							},
							fail: () => {
								uni.showModal({
									content: '获取语音临时链接失败',
									showCancel: false
								});
							}
						});
					})
					.catch(err => {
						console.log(err);
						if (err.message !== 'Fail_Cancel') {
							uni.showModal({
								content: `语音上传失败，错误信息为：${err.message}`,
								showCancel: false
							});
						}
					});
			} else {
				console.log('取消发送录音');
			}
			this.willStop = false;
		},
		// 切换语音/文字输入
		switchVoice() {
			this.hideDrawer();
			this.isVoice = this.isVoice ? false : true;
		}
	}
};
</script>
<style lang="scss">
@import '@/common/css/chat.scss';
</style>
