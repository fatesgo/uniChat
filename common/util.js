import emoji_List from '../common/emojiList.js';
import online_Emoji from '../common/onlineEmoji.js';

export function newDate() {
	let data = new Date();
	let y = data.getFullYear();
	let m = data.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	let d = data.getDate();
	d = d < 10 ? '0' + d : d;
	let h = data.getHours();
	h = h < 10 ? '0' + h : h;
	let minute = data.getMinutes();
	minute = minute < 10 ? '0' + minute : minute;
	let second = data.getSeconds();
	second = second < 10 ? '0' + second : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
export function latelyDate(time) {
	if (!time) {
		return
	}
	let oldDate = new Date(time)
	let newDate = new Date()
	let dayNum = "";
	let getTime = (newDate.getTime() - oldDate.getTime()) / 1000;

	if (getTime < 60 * 5) {
		dayNum = "刚刚";
	} else if (getTime >= 60 * 5 && getTime < 60 * 60) {
		dayNum = parseInt(getTime / 60) + "分钟前";
	} else if (getTime >= 3600 && getTime < 3600 * 24) {
		dayNum = parseInt(getTime / 3600) + "小时前";
	} else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
		dayNum = parseInt(getTime / 3600 / 24) + "天前";
	} else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
		dayNum = parseInt(getTime / 3600 / 24 / 30) + "个月前";
	} else if (time >= 3600 * 24 * 30 * 12) {
		dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + "年前";
	}
	let year = oldDate.getFullYear();
	let month = oldDate.getMonth() + 1;
	let day = oldDate.getDate();
	let hour = oldDate.getHours();
	let minute = oldDate.getMinutes();
	let second = oldDate.getSeconds();
	if (dayNum) {
		return dayNum;
	} else {
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}

}


export function richText(msg) {
	let content = msg.content;
	if (msg.type == 'img') {
		content = '[图片]';
	} else if (msg.type == 'voice') {
		content = '[语音]';
	}
	return content;
}
//替换表情符号为图片
export function replaceEmoji(content) {
	let replacedStr = content.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
		for (let i = 0; i < emoji_List.length; i++) {
			let row = emoji_List[i];
			for (let j = 0; j < row.length; j++) {
				let EM = row[j];
				if (EM.alt == item) {
					//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
					//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
					let onlinePath = 'https://s2.ax1x.com/2019/04/12/';
					let imgstr = '<img src="' + onlinePath + online_Emoji[EM.url] + '">';
					return imgstr;
				}
			}
		}
	});
	return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
}
//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
export function setPicSize(content) {
	// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
	let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
	let maxH = uni.upx2px(350); //350是定义消息图片最大高度
	if (content.w > maxW || content.h > maxH) {
		let scale = content.w / content.h;
		content.w = scale > 1 ? maxW : maxH * scale;
		content.h = scale > 1 ? maxW / scale : maxH;
	}
	return content;
}
