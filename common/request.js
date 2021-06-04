import {
	BASE_URL
} from './config.js';
import store from '@/store';
export default {
	request(options) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: BASE_URL + options.url,
				data: options.data,
				method: options.method || "POST",
				header: {
					"token": store.state.token
				},
				success: response => {
					if (response.statusCode === 200) {
						if (response.data.code === 1) {
							resolve(response.data.data)
						} else {
							uni.showToast({
								title: response.data.msg || "服务器内部错误！",
								icon: "none"
							})
							reject(response.data)
						}
					} else {
						uni.showToast({
							title: response.data.error || "服务器内部错误！",
							icon: "none"
						})
						reject(response.data)
					}
				},
				fail: err => {
					console.log(err);
					uni.showToast({
						title: JSON.stringify(err),
						icon: "none"
					})
					reject(err)
				},
			});
		});
	}
}
