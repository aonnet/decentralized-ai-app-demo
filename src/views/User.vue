<template>
	<div class="user">
		<div class="container">
			<div class="ava-con">
				<img class="ava" src="../assets/icons/user.png" mode=""></img>
				<div class="ava-con-r">
					<text class="userId">user-125482</text>
					<text class="address" v-if="account && account.length">
						{{ account }}
						<img class="copy" src="../assets/icons/copy.png" @click="handleCopy" mode="" />
					</text>
				</div>
			</div>
			<img @click="goToComplete" class="person-banner" src="../assets/images/personBanner.png" mode=""></img>

			<div class="myWork">
				<text>My work</text>
				<div class="columns">
					<div class="column-item" v-for="(column, index) in columns" :key="index">
						<img :src="column.url" />
					</div>
				</div>
			</div>

			<div class="bottom_btn">
				<button @click="goToCreate">
					Go To Create
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted
} from 'vue';
import { useRouter } from 'vue-router'
import { AI, User } from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';
import bus from '../eventBus.js';
import {loadAppData} from '../lib/loadApp'

const router = useRouter()

const account = ref('')
const columns = ref([])
const user_id = ref('')

const handleCopy = async () => {
	try {
		await navigator.clipboard.writeText(account.value);
		showToast('复制成功');
	} catch (err) {
		showToast('复制失败');
	}
};

function goToCreate() {
	router.push({
		path: '/'
	})
}

function goToComplete() {
	router.push({
		path: '/complete'
	})
}

async function mywork() {
	try {
		let rawAppData = await loadAppData(window.location.origin)
		// if (!rawAppData) {
		// 	showToast("app config error")
		// 	return
		// }

		const aonet = new AI({
			app_key: (rawAppData && rawAppData.id) || import.meta.env.VITE_APPID,
		})
		let user = new User()
		let temp = await user.islogin()
		console.log("temp = ",temp)
		if (!temp) {
			return []
		}

		let response = await aonet.list()
		console.log("mywork response = ", response)
		let returnData = []
		if (response && response.length) {
			let data = response
			if (data instanceof Array) {
				for (let i = 0; i < data.length; i++) {
					let task = data[i]
					if (task.result && task.result instanceof Array) {
						for (let m = 0; m < task.result.length; m++) {
							let temp = task.result[m]
							returnData.push(temp)
						}
					}
					if (task.result && typeof task.result == 'string') {
						returnData.push(task.result)
					}
				}
			}
		}
		columns.value = returnData.map((item, index) => {
			const widthStart = item.indexOf('width=') + 6;
			const widthEnd = item.indexOf('&');
			const width = parseInt(item.substring(widthStart, widthEnd)) || 680;

			const heightStart = item.indexOf('height=') + 7;
			const height = parseInt(item.substring(heightStart)) || 732;
			let obj = {
				url: item,
				width,
				height
			}

			console.log("mywork obj = ", obj)
			return obj
		})
	} catch (error) {
		console.log("mywork error = ", error)
	}
}

async function login() {
	try {
		let time = new Date().getTime()
		console.log(`demo index login start time = ${time}`)
		let user = new User()
		let temp = await user.islogin()
		console.log(`demo index islogin end time = ${time}, temp =`, temp)
		if (!temp) {
			showLoadingToast({
				duration: 0,
				forbidClick: true,
				message: 'Loading...',
			});
			console.log(`demo index showLoadingToast end time = ${time}`)
			temp = await user.login()
			console.log(`demo index login end time = ${time}`)
			closeToast();
			if (!temp) {
				showToast("login failed,please try again later");
				return
			}
		}
		user_id.value = 'user-' + getSubstring(temp.id)
		account.value = temp.profiles && temp.profiles.account
		bus.emit('get_balance', "login");
		console.log(`demo index login end time = ${new Date().getTime() - time}`)
		mywork()
	} catch (error) {
		console.log("index demo error", error)
		closeToast();
		if (error && typeof error == 'string') {
			showToast(error);
		} else {
			showToast(error.message);
		}
	} finally {
	}
}

function getSubstring(str) {
	if (str.length > 6) {
		return str.substring(0, 6);
	} else {
		return str;
	}
}


onMounted(() => {
	login()
})

</script>

<style scoped>
.ava-con {
	width: 100%;
	margin-top: 8.53vw;
	display: flex;
	flex-direction: row;
	box-sizing: border-box;
}

.ava-con .ava {
	height: 22.93vw;
	width: 22.93vw;
	margin-right: 4.27vw;
}

.ava-con-r {
	width: 60vw;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
}

.ava-con-r text {
	word-wrap: break-word;
	font-family: Roboto-Regular;
	font-weight: 400;
	font-size: 3.73vw;
	color: #fff;
	line-height: 5.6vw;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.ava-con-r .userId {
	font-weight: bold;
	font-size: 4.27vw;
	line-height: 4.27vw;
	margin-bottom: 3.2vw;
	margin-top: 3.73vw;
	text-transform: uppercase;
}

.copy {
	height: 3.2vw;
	width: 3.2vw;
}

.ava-con-r text {
	width: 100%;
}

.person-banner {
	width: 100%;
	height: 100%;
	margin: 9.6vw 0 0;
}

.myWork {
	width: 100%;
	margin-top: 8vw;
}

.myWork .tit {
	display: inline-flex;
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 4.27vw;
	color: #fff;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-bottom: 4.13vw;
}

/* .waterfall {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(40vw, 1fr));
	grid-auto-rows: 2.67vw;
	grid-gap: 2.67vw;
}

.waterfall .waterfall-column {
	width: 40vw;
	height: max-content;
	margin-bottom: 6.4vw;

	display: flex;
	flex-direction: column;
	grid-row: span 10;
}

.waterfall .waterfall-column img {
	width: 100%;
	height: auto;
	object-fit: cover;
} */

.columns {
  column-count: 2;
  column-gap: 6.4vw;
}

.column-item {
  width: 40vw;
  break-inside: avoid;
  overflow: hidden;
  margin-bottom: 6.4vw;
}

.column-item img {
  width: 100%;
  display: block;
  object-fit: cover;
}

button {
	width: 100%;
	height: 9.07vw;
	background: linear-gradient( 117deg, #43E8A0 0%, #8AF25F 100%);
	box-shadow: 2.13vw 2.13vw 4.27vw .27vw rgba(0, 0, 0, 0.32);

	border-radius: 1.07vw;

	font-family: Roboto-Black;
	font-size: 4.27vw;
	font-weight: bold;
	color: #1C1C20;
	text-align: center;
	font-style: normal;
	text-transform: none;
}
</style>
