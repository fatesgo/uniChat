<script>
import { getUserInfo } from '@/common/api.js';
import { SOCKET_URL } from '@/common/config.js';
export default {
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef APP-PLUS
		plus.push.getClientInfoAsync(
			info => {
				console.log('Success', JSON.stringify(info.clientid));
				this.$store.commit('SetUserClientid', info.clientid);
			},
			e => {
				console.log('Failed', JSON.stringify(e));
			}
		);
		plus.push.addEventListener('click', message => {
			plus.nativeUI.toast(JSON.stringify(message));
		});
		plus.push.addEventListener('receive', message => {
			plus.nativeUI.toast(JSON.stringify(message));
		});
		// #endif
		uni.$on('sign_in', userId => {
			console.log('监听到事件来自登陆页面登入记录，userId' + userId);
			if (userId) {
				this.connectSocket(userId);
			}
		});
		try {
			const token = uni.getStorageSync('token');
			if (token) {
				this.$store.commit('SetToken', token);
				this.getUserInfo();
			} else {
				uni.reLaunch({
					url: '/pages/login/index'
				});
			}
		} catch (e) {
			uni.reLaunch({
				url: '/pages/login/index'
			});
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	onUnload() {
		uni.closeSocket();
	},
	methods: {
		getUserInfo() {
			getUserInfo()
				.then(data => {
					this.$store.commit('SetUser', data.user);
					this.connectSocket(data.user.id);
					uni.reLaunch({
						url: '/pages/index/index'
					});
				})
				.catch(err => {
					uni.reLaunch({
						url: '/pages/login/index'
					});
				});
		},
		connectSocket(userId) {
			uni.connectSocket({
				url: SOCKET_URL + `/api/webSocket/` + userId,
				success: res => {
					uni.onSocketOpen(() => {
						console.log('WebSocket连接已打开！');
					});
					uni.onSocketMessage(result => {
						console.log('服务器接收内容');
						let data = JSON.parse(result.data);
						console.log(data);
						if (typeof data.msg !== 'undefined') {
							this.$store.commit('SetMessages', data.msg);
						}
						this.$store.commit('SetUserChatList', data.userList);
					});
					uni.onSocketError(err => {
						uni.showToast({
							title: 'WebSocket连接发生错误！',
							icon: 'none',
							duration: 2000
						});
						console.log(err);
					});
					uni.onSocketClose(close => {
						uni.showToast({
							title: 'webSocket 已关闭！',
							icon: 'none',
							duration: 2000
						});
						console.log('WebSocket 已关闭！');
					});
				},
				fail: () => {
					uni.showToast({
						title: 'WebSocket连接失败，请检查网络',
						icon: 'none',
						duration: 2000
					});
				}
			});
		}
	}
};
</script>

<style>
/*每个页面公共css */
</style>
