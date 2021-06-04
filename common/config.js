let BASE_URL = "http://127.0.0.1:8001";
let SOCKET_URL = "ws://127.0.0.1:8001";
if (process.env.NODE_ENV === 'production') {
	BASE_URL = "http://www.fatesgo.com:8001";
	SOCKET_URL = "ws://www.fatesgo.com:8001";
}
export {
	BASE_URL,
	SOCKET_URL
}
