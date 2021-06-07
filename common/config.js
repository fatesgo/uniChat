let BASE_URL = "http://127.0.0.1:8001";
let SOCKET_URL = "ws://127.0.0.1:8001";
if (process.env.NODE_ENV === 'production') {
	BASE_URL = "https://www.fatesgo.com";
	SOCKET_URL = "wss://www.fatesgo.com";
}
export {
	BASE_URL,
	SOCKET_URL
}
