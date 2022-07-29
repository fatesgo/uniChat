let BASE_URL = "https://www.fatesgo.com";
let SOCKET_URL = "wss://www.fatesgo.com";
if(process.env.NODE_ENV === 'development'){
   BASE_URL = "http://192.168.53.206:8001";
   SOCKET_URL = "ws://192.168.53.206:8001";
}else{
  BASE_URL = "";
  SOCKET_URL = "wss://www.fatesgo.com";
}
export {
	BASE_URL,
	SOCKET_URL
}
