import http from "./request.js"

export const getCode = () => {
	return http.request({
		url: '/api/defaultKaptcha',
		method: "GET"
	})
}
export const login = (data) => {
	return http.request({
		url: '/api/login',
		data: data
	})
}
export const getUserInfo = (data) => {
	return http.request({
		url: '/api/getUserInfoByToken',
		method: "GET"
	})
}

export const getMsgList = (data) => {
	return http.request({
		url: '/api/getMsgList/',
		method: "GET",
		data: data
	})
}

export const getUserListByUser = (userId) => {
	return http.request({
		url: '/api/getUserListByUser/' + userId,
		method: "GET"
	})
}
