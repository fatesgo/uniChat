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
		url: '/api/user/getUserInfo',
		method: "GET"
	})
}

export const getMsgList = (data) => {
	return http.request({
		url: '/api/chat/getMsgList/',
		method: "GET",
		data: data
	})
}

export const setHaveRead = (data) => {
	return http.request({
		url: '/api/chat/setHaveRead/',
		method: "PUT",
		data: data
	})
}

export const getUserListByUser = (userId) => {
	return http.request({
		url: '/api/chat/getUserListByUser/' + userId,
		method: "GET"
	})
}

export const register = (user) => {
	return http.request({
		url: '/api/register',
		method: "POST",
		data: user
	})
}
