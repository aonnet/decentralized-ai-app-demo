<template>
	<div class="user">
		<div class="container">
			<div class="ava-con">
				<img class="ava" src="../assets/icons/user.png" mode=""></img>
				<div class="ava-con-r">
					<text class="userId">{{ user_id }}</text>
					<text class="address" v-if="account && account.length">
						{{ account }}
						<img class="copy" src="../assets/icons/copy.png" @click="handleCopy" mode="" />
					</text>
				</div>
			</div>
			<!-- <div @click="goToLinkPage">关联账号</div> -->
			<div class="group_2 flex-col">
				<div class="image-wrapper_1 flex-row">
					<img class="label_2" referrerpolicy="no-referrer" :src="item.lanhuimage0"
						v-for="(item, index) in loopData0" :key="index" @click="setting_click(index)" />
				</div>
			</div>
			<img v-if="task_group && task_group.length" @click="goToComplete" class="person-banner"
				src="../assets/images/personBanner.png" mode=""></img>

			<div class="myWork">
				<text class="tit">My work</text>
				<div class="columns">
					<div class="column-item" v-for="(column, index) in columns" :key="index">
						<img :src="column.url" />
					</div>
				</div>
				<!-- <VirtualWaterfall :items="columns" :gap="waterfallOption.gap"
					:padding="waterfallOption.padding"
					:preload-screen-count="[waterfallOption.topPreloadScreenCount, waterfallOption.bottomPreloadScreenCount]"
					:item-min-width="waterfallOption.itemMinWidth" :max-column-count="waterfallOption.maxColumnCount"
					:min-column-count="waterfallOption.minColumnCount" :calc-item-height="calcItemHeight_user_res">
					<template #default="{ item }">
						<div class="columns">
							<div class="column-item">
								<img :src="item.url" />
							</div>
						</div>
					</template>
</VirtualWaterfall> -->

			</div>
		</div>

		<div class="bottom_btn">
			<button @click="goToCreate">
				Go To Create
			</button>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	toRaw
} from 'vue';
import { useRouter ,useRoute} from 'vue-router'
import { AI, User } from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';
import bus from '../eventBus.js';
// import { VirtualWaterfall } from '@lhlyu/vue-virtual-waterfall'
// import useWaterfall from '../components/useWaterfall.ts'

// const { backTop, waterfallOption, data, calcItemHeight, calcItemHeight_user_res } = useWaterfall()

import { loadAppData, get_task_group } from '../lib/loadApp'


const loopData0 = ref([
	{
		lanhuimage0:
			'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG2bca7c72324f15c434df75d8561b67b3.png',
	},
	{
		lanhuimage0:
			'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG19c07e011b0d6494abe8a9b28f3d7c64.png',
	},
	{
		lanhuimage0:
			'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGdef0a9ca06d4b9c88db80dd25953e38e.png',
	},
	{
		lanhuimage0:
			'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG0dd2c1952f10abec8c126b36a382d715.png',
	},
])


const router = useRouter()
const route = useRoute()

const account = ref('')

const columns = ref([])
const user_id = ref('')
const task_group = ref([])

// const server = ref('http://localhost:8088')
const server = ref(null)


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
		path: '/task-center'
	})
}

function goToLinkPage() {
	router.push({
		path: '/link'
	})
}

async function setting_click(index) {
	if (index == 0) {
		router.push({
			path: '/asset'
		})
	}
	if (index == 1) {
		router.push({
			path: '/ledger'
		})
	}
	if (index == 2) {
		router.push({
			path: '/link'
		})
	}
	if (index == 3) {
		router.push({
			path: '/setting'
		})
	}
}

async function mywork() {
	try {
		let domain = window.location.origin
		let href = window.location.href
		let rawAppData = await loadAppData(domain,href)
		if (!rawAppData) {
			showToast("app config error")
			return
		}
		const aonet = new AI({
			app_key: (rawAppData && rawAppData.id) || import.meta.env.VITE_APPID,
		})
		let user = new User()
		let temp = await user.islogin()
		console.log("temp = ", temp)
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
		// user_id.value = 'user-' + getSubstring(temp.id)
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

const get_userInfo = async () => {
	let user = new User()
	let login_user = await user.userinfo()
	user_id.value = 'user-' + getSubstring(login_user.id)
	if (login_user && login_user.profiles && login_user.profiles.username && login_user.profiles.username.length) {
		user_id.value = login_user.profiles.username
	}
}

const user_get_task_group = async () => {
	let domain = window.location.origin
	let href = window.location.href
	let rawAppData = await loadAppData(domain,href)
	if (!rawAppData) {
		return
	}
	get_task_group().then(res => {
		console.log("user user_get_task_group res = ", res)
		task_group.value = res
	}).catch(error => {
		console.log("user user_get_task_group error = ", error)
	})
}

onMounted(() => {
	login()
	user_get_task_group()
	get_userInfo()
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
	margin: 6vw 0 0;
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
	background: linear-gradient(117deg, #43E8A0 0%, #8AF25F 100%);
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

.group_2 {
	background-image: linear-gradient(270deg,
			rgba(62, 62, 62, 1) 0,
			rgba(120, 120, 120, 1) 100%);
	height: 14.94vw;
	width: 100%;
	margin: 6.4vw 0 0;
	border-radius: 8px;

	.image-wrapper_1 {
		width: 67.2vw;
		height: 6.4vw;
		justify-content: space-between;
		margin: 4.26vw 0 0 11.73vw;

		.label_2 {
			width: 6.4vw;
			height: 6.4vw;
			margin-right: 13.87vw;
		}
	}
}

@media screen and (min-width: 1024px) {
	.ava-con {
		margin-top: 32px;
	}

	.ava-con .ava {
		height: 86px;
		width: 86px;
		margin-right: 16px;
	}

	.ava-con-r {
		width: 225px;
	}

	.ava-con-r text {
		font-size: 14px;
		color: #fff;
		line-height: 21px;
	}

	.ava-con-r .userId {
		font-size: 16px;
		line-height: 16px;
		margin-bottom: 12px;
		margin-top: 14px;
		text-transform: uppercase;
	}

	.copy {
		height: 12px;
		width: 12px;
	}

	.person-banner {
		width: 100%;
		height: 100%;
		margin: 22.5px 0 0;
	}

	.myWork {
		width: 100%;
		margin-top: 30px;
		padding-bottom: 75px;
	}

	.myWork .tit {
		font-size: 16px;
		margin-bottom: 15.5px;
	}

	.columns {
		min-height: 200px;
		column-count: 2;
		column-gap: 24px;
	}

	.column-item {
		width: 150px;
		margin-bottom: 24px;
	}

	button {
		width: 100%;
		height: 34px;
		background: linear-gradient(117deg, #43E8A0 0%, #8AF25F 100%);
		box-shadow: 8px 8px 16px 1px rgba(0, 0, 0, 0.32);

		border-radius: 4px;
		font-size: 16px;
	}

	.group_2 {
		height: 56px;
		margin: 24px 0 0;
		border-radius: 8px;

		.image-wrapper_1 {
			width: 252px;
			height: 24px;
			justify-content: space-between;
			margin: 16px 0 0 44px;

			.label_2 {
				width: 24px;
				height: 24px;
				margin-right: 52px;
			}
		}
	}
}
</style>
