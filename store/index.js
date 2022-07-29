import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		user: {
			id: 0
		},
		token: null,
		userChatList: [],
		currentMsg: null,

	},
	actions: {

	},
	mutations: {
		SetToken(state, token){
			state.token = token;
			uni.setStorageSync('token', token);
		},
		SetUser(state, user)  {
			state.user = user;
			uni.setStorageSync('user', user);
		},
		SetUserClientid(state, clientid)  {
			state.user.clientid = clientid;
		},
		SetMessages(state, msg) {
			state.currentMsg = msg;
		},
		SetUserChatList(state, list) {
			state.userChatList = list;
		}
	}
});

export default store;
