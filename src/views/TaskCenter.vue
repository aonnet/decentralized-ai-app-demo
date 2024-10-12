<template>
	<div class="page flex-col">
		<div class="block_22 flex-row justify-between">
			<img class="label_1" referrerpolicy="no-referrer"
				src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGd1824a8f6f10d8ca55d129f60ff453cc.png"
				@click="back" />
			<span class="paragraph_1">Task&nbsp;Center<br /></span>
		</div>
		<!-- <van-nav-bar class="nav-bar_1 NavBar">
			<template #left>
				<img class="icon_1" referrerpolicy="no-referrer"
					src="https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG72433b025d5f5647133dd221bbe9f226.png"
					@click="back"
				 />
			</template>
<template #title>
				<span class="text_1">Task Center</span>
			</template>
<template #right>
				<img class="single-avatar_1" referrerpolicy="no-referrer"
					src="https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG5dd24eb3197845f254e1e5279e78eb0d.png" />
			</template>
</van-nav-bar> -->
		<div class="box_1 flex-col container">
			<div class="uni-form-item tab-con">
				<van-tabs class="tabs_1 Tabs" v-model:active="Tabs_tabs_1" @change="tab_change">
					<van-tab v-for="(item, index) in ['Daily Tasks', 'Reward Tasks']" :key="index"
						:title="item"></van-tab>
				</van-tabs>
			</div>

			<div v-for="(item, index) in current_tasks" :key="index">
				<div class="section_1 flex-col justify-between">
					<div v-if="item.status === 'todo' || item.status === 'retry'" class="box_4 flex-col">
						<div class="group_1 flex-row justify-between">
							<div class="section_2 flex-row">
								<div class="image-text_1 flex-row justify-between">
									<img class="thumbnail_1" referrerpolicy="no-referrer"
										src="https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNGbcd57f0c45b508ad281e49e6606f1b93.png" />
									<span class="text-group_1">+{{ item.reward }}</span>
								</div>
							</div>
							<span class="text_4">{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
						<div class="group_2 flex-row justify-between">
							<span class="text_5">{{ item.description }}</span>
							<button class="button_1 flex-col" @click="onClick_1(item)">
								<span v-if="item.status === 'todo'" class="text_6">Go</span>
								<span v-if="item.status === 'retry'" class="text_6">Retry</span>
							</button>
						</div>
					</div>
					<div v-if="item.status === 'pending'" class="box_4 flex-col">
						<div class="group_1 flex-row justify-between">
							<div class="section_2 flex-row">
								<div class="image-text_1 flex-row justify-between">
									<img class="thumbnail_1" referrerpolicy="no-referrer"
										src="https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNGbcd57f0c45b508ad281e49e6606f1b93.png" />
									<span class="text-group_1">+{{ item.reward }}</span>
								</div>
							</div>
							<span class="text_4">{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
						<div class="group_2 flex-row justify-between">
							<span class="text_5">{{ item.description }}</span>
							<button class="button_2 flex-col" @click="onClick_1(item)">
								<span class="text_9">Inspect</span>
							</button>
						</div>

						<!-- <div class="group_3 flex-row justify-between">
							<div class="block_1 flex-row">
								<div class="image-text_2 flex-row justify-between">
									<img class="thumbnail_2" referrerpolicy="no-referrer"
										src="https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNGbcd57f0c45b508ad281e49e6606f1b93.png" />
									<span class="text-group_2">+{{ item.reward }}</span>
								</div>
							</div>
							<span class="text_7">{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
						<div class="group_4 flex-row justify-between">
							<span class="text_8">{{ item.description }}</span>
							<button class="button_2 flex-col" @click="onClick_1(item)">
								<span class="text_9">Inspect</span>
							</button>
						</div> -->
					</div>
					<div v-if="item.status === 'success'" class="box_6 flex-col">
						<div class="box_7 flex-row justify-between">
							<div class="text-wrapper_2 flex-col">
								<span class="paragraph_1">Completed<br /></span>
							</div>
							<span class="text_10">{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
						<span class="text_11">{{ item.description }}</span>
					</div>
				</div>

			</div>
		</div>

		<div class="modal-con flex-col justify-center" v-if="go_tip">
			<div class="content">
				<img class="close-icon" src="../assets/icons/close.png" alt="" @click="close_go_tip">
				<img class="tips-icon" src="../assets/icons/tipsIcon.png" alt="">
				<p class="desc">
					After completing the task requirements, please return to the task center to verify the task. If the
					verification is successful, you will receive a reward.
				</p>

				<div class="btn flex-row justify-center align-center" @click="submitTask">Go</div>
			</div>

			<div class="check-con flex-row justify-between">
				<input type="checkbox" class="image-wrapper_1" v-model="notShowTips" id="check" />
				<label for="check" class="text_7">Do not display this prompt again</label>
			</div>
		</div>

		<div class="modal-con flex-col justify-center" v-if="complete_tip">
			<div class="content">
				<img class="close-icon" src="../assets/icons/close.png" alt="" @click="close_complete_tip">
				<img class="tips-icon" src="../assets/icons/tipsIcon2.png" alt="">
				<p class="desc">
					Your task has been completed and the reward has been issued to your account.
				</p>

				<div class="btn flex-row justify-center align-center" @click="close_complete_tip">Complete</div>
			</div>
		</div>

		<div class="modal-con flex-col justify-center" v-if="redo_tip">
			<div class="content">
				<img class="close-icon" src="../assets/icons/close.png" alt="" @click="close_redo_tip">
				<img class="tips-icon" src="../assets/icons/tipsIcon3.png" alt="">
				<p class="desc">
					Your task verification failed. Please check if you have completed the required actions for the task.
				</p>

				<div class="btn flex-row justify-center align-center" @click="submitTask">Redo This Task</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loadAppData, get_task_group, get_session,save_session } from '../lib/loadApp'
import { showToast, showLoadingToast, closeToast } from 'vant';
import moment from 'moment'
import { User, supabase } from 'aonweb'
import { useRoute, useRouter } from 'vue-router'


const router = useRouter()
const route = useRoute()



const Tabs_tabs_1 = ref(0)
const constants = ref({})
const notShowTips = ref(false)
const go_tip = ref(false)
const complete_tip = ref(false)
const redo_tip = ref(false)
const task_group = ref([])
const daily_tasks = ref([])
const reward_tasks = ref([])
const current_tasks = ref([])
const task_host = ref('')
let selected_task = null

async function back() {
	router.back()
}

async function onClick_1(item) {
	console.log('onClick_1 = ', item)
	let sb_api_auth_token = localStorage.getItem('sb-api-auth-token')
	// console.log('onClick_1 sb_api_auth_token = ',sb_api_auth_token)
	localStorage.setItem('sb_api_auth_token_backup',sb_api_auth_token)
	// let sb_api_auth_token_backup = localStorage.getItem('sb_api_auth_token_backup')
	// console.log('onClick_1 sb_api_auth_token_backup = ',sb_api_auth_token_backup)

	let session = await get_session()
	if (!(session && session.access_token && session.access_token.length)) {
		showToast('Please login first')
		return
	}
	let anon_user = session.user
	console.log('login_user:', anon_user);
	let redirectTo = window.location.href
	if (redirectTo.indexOf('?') > -1) {
		let temp = redirectTo.split('?')
		redirectTo = temp && temp.length && temp[0]
	}
	if (item.platform && item.platform === 'twitter') {
		try {
			let user = new User()
			let link = await user.islinkTwitter()
			console.log('islinkTwitter = ', link)
			if (!link) {
				let data = await user.linkTwitter(redirectTo)
				console.log('linkTwitter data = ', data)
				return
			}
		} catch (error) {
			console.log('linkTwitter error = ', error)
			showToast(error.message || 'Check twitter link error')
			return
		}
	}
	if (item.platform && item.platform === 'telegram') {
		try {
			let user = new User()
			let link = await user.islinkTelegram()
			console.log('islinkTelegram = ', link)
			if (!link) {
				if (user.isTelegramMiniAPP()) {
					try {
						let data = await user.linkTelegramMiniAPP()
						console.log('linkTelegram data = ', data)
						if (!data) {
							showToast("linkTelegramMiniAPP failed")
							return
						}
					} catch (error) {
						showToast(`linkTelegramMiniAPP ${error.message}`)
						return
					}
				} else {
					// const { data, error } = await supabase.auth.getSession()
					// if (error) {
					// 	throw error
					// }
					// if (!data.session) {
					// 	throw new Error('user is not login')
					// }
					// let session = data.session
					// console.log("data.session = ",data.session)
					// let url = 'https://ai.ubeibi.com/telegram.html?data=' + session.access_token + '&redirectTo=' + redirectTo

					// // let url = 'https://ai.ubeibi.com/index.html?data=' + session.access_token + '&redirectTo=' + redirectTo
					// const encodedUrl = encodeURI(url);
					// window.location.assign(encodedUrl)
					// window.open(encodedUrl,"_blank")
					let data = await user.linkTelegram(redirectTo)
					console.log('linkTelegram data = ', data)
					return
				}
			}
		} catch (error) {
			console.log('linkTelegram error = ', error)
			showToast(error.message || 'Check telegram link error')
			return
		}
	}
	if (item.platform && item.platform === 'github') {
		try {
			let user = new User()
			let link = await user.islinkGithub()
			console.log('islinkGithub = ', link)
			if (!link) {
				let data = await user.linkGithub(redirectTo)
				console.log('linkGithub data = ', data)
				return
			}
		} catch (error) {
			console.log('linkGithub error = ', error)
			showToast(error.message || 'Check github link error')
			return
		}
	}

	selected_task = item
	console.log('notShowTips', notShowTips)
	if (notShowTips.value) {
		if (item.status == 'todo' || item.status == 'retry') {
			let flag = await sumit_task(selected_task)
			console.log('sumit_task back = ', flag)
			if (flag) {
				window.location.href = item.url
			}
			return
		}
	} else {
		if (item.status == 'todo' || item.status == 'retry') {
			go_tip.value = true
			return
		}
	}
	if (item.status == 'pending') {
		await check_task(item)
	}

	// window.location.href = item.url
	// window.open(item.url, "_blank");

}
async function submitTask() {
	console.log('submitTask = ', selected_task, selected_task.url)
	localStorage.setItem('notShowTips', notShowTips.value)
	if (!selected_task) {
		return
	}
	if (selected_task.status == 'todo' || selected_task.status == 'retry') {
		let flag = await sumit_task(selected_task)
		console.log('submitTask sumit_task back = ', flag, selected_task.url)
		if (flag) {
			window.location.href = selected_task.url
		}
		return
	}
}

async function close_go_tip() {
	console.log('close_go_tip')
	selected_task = null
	go_tip.value = false
}

async function close_complete_tip() {
	console.log('close_complete_tip')
	selected_task = null
	complete_tip.value = false
}

async function close_redo_tip() {
	console.log('close_redo_tip')
	selected_task = null
	redo_tip.value = false
}

async function sumit_task(task) {
	let session = await get_session()
	if (!(session && session.access_token && session.access_token.length)) {
		showToast('Please login first')
		return false
	}
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});
	let task_id = BigInt(task.taskId)
	console.log('sumit_task = ', task, task_id)
	let url = task_host.value + `/api/v1/task/submit/${task_id}`
	try {
		let response = await fetch(url, {
			method: "POST",
			headers: {
				authorization: "Bearer " + session.access_token
			}
		})
		closeToast()
		console.log('task_detail fetch = ', response)
		if (response && response.status == 200) {
			let responseData = await response.json()
			console.log('responseData =', responseData)
			if (responseData && responseData.code == 0) {
				go_tip.value = false
				return true
			} else {
				showToast((responseData && responseData.msg) || (responseData && responseData.error) || 'submit task error')
				return false
			}
		} else {
			console.log('task_detail fetch error = ', response.statusText)
			return false
		}
	} catch (error) {
		closeToast()
		console.log('fetch task detail error = ', group.task_group_id, error)
		return false
	}
}

async function check_task(task) {
	let session = await get_session()
	if (!(session && session.access_token && session.access_token.length)) {
		showToast('Please login first')
		return
	}
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});
	let task_id = BigInt(task.taskId)
	console.log('check_task = ', task, task_id)
	let url = task_host.value + `/api/v1/task/check/${task_id}`
	try {
		let response = await fetch(url, {
			headers: {
				authorization: "Bearer " + session.access_token
			}
		})
		console.log('task_detail fetch = ', response)
		closeToast()
		if (response && response.status == 200) {
			let responseData = await response.json()
			console.log('responseData =', responseData)
			if (responseData && responseData.code == 0) {
				selected_task.status = responseData.data.status
				if (responseData.data && responseData.data.status && responseData.data.status == 'success') {
					complete_tip.value = true
				} else if (responseData.data && responseData.data.status && responseData.data.status == 'retry') {
					redo_tip.value = true
				}
			} else {
				showToast((responseData && responseData.msg) || 'submit task error')
			}
		} else {
			console.log('task_detail fetch error = ', response.statusText)
		}
	} catch (error) {
		closeToast()
		console.log('fetch task detail error = ', group.task_group_id, error)
	}
}

function onClick_2() {
	alert(1);
}

function tab_change(name, title) {
	console.log('tab_change = ', name, title)
	if (name == 0) {
		current_tasks.value = daily_tasks.value
		return
	}
	current_tasks.value = reward_tasks.value
}

async function check_telegram_bind() {

}

async function task_detail(task_center_host) {
	console.log("task_detail in = ", task_center_host)
	// if (!(task_center_host && task_center_host.length)) {
	// 	return
	// }
	let temp_daily_tasks = []
	let temp_reward_tasks = []
	let host = task_center_host
	task_host.value = task_center_host

	// let session = await get_session()
	// if (!(session && session.access_token && session.access_token.length)) {
	// 	showToast('Please login first')
	// 	return
	// }
	let user = new User()
	let access_token = await user.access_token()
	console.log('access_token = ', access_token)
	if (!(access_token && access_token.length)) {
		showToast('Please login first')
		return
	}
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});
	let promises = []
	for (let i = 0; i < task_group.value.length; i++) {
		let temp = new Promise((resolve, reject) => {
			let group = task_group.value[i]
			let task_group_id = BigInt(group.task_group_id)
			console.log('task_detail = ', group, task_group_id)
			let url = host + `/api/v1/group/${task_group_id}`
			try {
				fetch(url, {
					headers: {
						authorization: "Bearer " + access_token
					}
				}).then(res => {
					console.log('task_detail res = ', res)
					res.json().then(jsonData => {
						console.log('task_detail data = ', jsonData)
						let data = jsonData.data
						resolve(data && data.tasks || [])
					}).catch(error => {
						console.log('task_detail error = ', error)
						resolve([])
					})
				}).catch(error => {
					console.log('task_detail error = ', error)
					resolve([])
				})
			} catch (error) {
				console.log('fetch task detail error = ', group.task_group_id, error)
				resolve([])
			}
		})
		promises.push(temp)
	}
	Promise.all(promises).then(res => {
		res = res && res.length && res.reduce((l, r) => {
			return l.concat(r);
		})

		for (let m = 0; m < res.length; m++) {
			let task = res[m]
			task.start_time = ''
			if (task.start) {
				task.start_time = moment(task.start * 1000).format('YYYY-MM-DD');
			}
			task.end_time = ''
			if (task.end) {
				task.end_time = moment(task.end * 1000).format('YYYY-MM-DD');
			}
			if (task.daily) {
				temp_daily_tasks.push(task)
			} else {
				temp_reward_tasks.push(task)
			}
		}
		closeToast()
		daily_tasks.value = temp_daily_tasks
		reward_tasks.value = temp_reward_tasks
		current_tasks.value = temp_daily_tasks
		console.log("task_detail out = ", daily_tasks.value, reward_tasks.value, current_tasks.value)
	}).catch(error => {
		closeToast()
		console.log('fetch all task detail error = ', error)
		showToast(error.message)
	})
}

async function load() {
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});
	let domain = window.location.origin
	let href = window.location.href
	let rawAppData = await loadAppData(domain,href)
	if (!rawAppData) {
		closeToast()
		showToast("app config error")
		return
	}
	try {
		let gruops = await get_task_group()
		console.log("task center get_task_group gruops = ", gruops)
		task_group.value = gruops
		closeToast()
		task_detail(rawAppData.params_value.task_center_host)

	} catch (error) {
		closeToast()
		console.log("task center get_task_group error = ", error)
	}
}

onMounted(async () => {
	notShowTips.value = localStorage.getItem('notShowTips')
	console.log('onMounted notShowTips', notShowTips)
	let sb_api_auth_token_backup = localStorage.getItem('sb_api_auth_token_backup')
	// console.log('onMounted notShowTips', notShowTips,sb_api_auth_token_backup)
	if (sb_api_auth_token_backup) {
		let session = JSON.parse(sb_api_auth_token_backup)
		await save_session(session)
		localStorage.removeItem('sb_api_auth_token_backup')
		// localStorage.setItem('sb-api-auth-token',sb_api_auth_token_backup)
		// let sb_api_auth_token = localStorage.getItem('sb-api-auth-token')

		
		// console.log('onMounted sb_api_auth_token', sb_api_auth_token)
		// localStorage.removeItem('sb_api_auth_token_backup')
	}
	load()
	console.log('onMounted route.query', route.query)
	let error_code = route.query.error_code;
	let error_description = route.query.error_description;
	if (error_description && error_description.length && error_description.indexOf('+') > -1) {
		error_description = decodeURIComponent(error_description && error_description.replace(/\+/g, ' '));
	} 
  	else if (error_code == 421) {
    	error_description = 'Current user has already link Telegram'
	} else if (error_code == 423) {
    	error_description = 'Telegram account already been used'
	}
	if (error_description && error_description.length) {
		showToast(error_description)
	}
})
</script>
<style lang="scss" scoped>
.page {
	background-color: rgba(20, 20, 20, 1);
	position: relative;
	width: 100vw;
	overflow: hidden;

	.block_22 {
		width: 80vw;
		height: 7.47vw;
		margin: 2.13vw 0 0 4.8vw;

		.label_1 {
			width: 7.47vw;
			height: 7.47vw;
		}

		.paragraph_1 {
			width: 69.34vw;
			height: 7.47vw;
			overflow-wrap: break-word;
			color: rgba(255, 255, 255, 1);
			font-size: 5.33vw;
			font-family: Roboto Flex-Bold;
			font-weight: 700;
			text-align: center;
			white-space: nowrap;
			line-height: 7.47vw;
		}
	}

	.modal-con {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 80vh;
		background: rgba(20, 20, 20, 0.93);
		display: flex;
		align-items: center;
		z-index: 999;

		padding: 0 5.07vw;

		.content {
			width: 100%;
			height: auto;
			background: #3D3D3D;
			border-radius: 4.27vw;
			border: .1vw solid #707070;
			position: relative;
			padding: 21.33vw 3.2vw 5.33vw;

			.close-icon {
				position: absolute;
				right: 2.13vw;
				top: -7.47vw;
				height: 6.4vw;
				width: 6.4vw;
			}

			.tips-icon {
				position: absolute;
				top: -17.07vw;
				left: 50%;
				transform: translateX(-50%);
				height: 32vw;
				width: 32vw;
			}

			p {
				font-family: Roboto, Roboto;
				font-weight: 400;
				font-size: 3.73vw;
				color: #FFFFFF;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.btn {
				width: 100%;
				height: 8.53vw;
				background: linear-gradient(180deg, #43E8A0 0%, #8AF25F 100%);
				border-radius: 21.33vw;
				border: .27vw solid #141414;
				margin-top: 6.4vw;

				font-family: Roboto, Roboto;
				font-weight: 900;
				font-size: 4.27vw;
				color: #141414;
				text-align: center;
				font-style: normal;
				text-transform: none;
			}
		}

		.check-con {
			margin-top: 6.4vw;

			.image-wrapper_1 {
				height: 4.27vw;
				width: 4.27vw;
				border-radius: 50%;
				margin-right: 1.07vw;
			}

			input:checked {
				background-color: #2196F3;
				border-color: #2196F3;
			}

			.text_7 {
				font-family: Roboto, Roboto;
				font-weight: 400;
				font-size: 3.2vw;
				color: #FFFFFF;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
		}
	}

	.nav-bar_1 {
		background-color: rgba(255, 255, 255, 0);
		width: 100vw;
		height: 13.74vw;

		.icon_1 {
			width: 5.34vw;
			height: 5.34vw;
			margin-top: 3.2vw;
		}

		.text_1 {
			overflow-wrap: break-word;
			color: rgba(255, 255, 255, 1);
			font-size: 5.33vw;
			font-family: Roboto-Black;
			font-weight: normal;
			text-align: center;
			white-space: nowrap;
		}

		.single-avatar_1 {
			width: 7.47vw;
			height: 7.47vw;
			margin-top: 2.14vw;
			margin-right: 0;
		}

		.van-nav-bar__content {
			height: 100%;
		}

		.van-nav-bar__title {
			line-height: 6.14vw;
		}

		.van-nav-bar__left {
			padding: 0 0 0 5.33vw;
			align-items: start;
		}

		.van-nav-bar__right {
			padding: 0 5.06vw 0 0;
			align-items: start;
		}
	}

	.box_1 {
		width: 100vw;
		height: 184.27vw;
		margin-bottom: 0.27vw;

		.tab-con {
			margin: 6.4vw 0;
		}

		.tabs_1 {
			background-color: rgba(255, 255, 255, 0);
			position: relative;
			width: 89.6vw;
			height: 11.74vw;

			.text-wrapper_1 {
				width: 72.54vw;
				height: 4.8vw;
				margin: 2.13vw 0 0 8.53vw;

				.text_2 {
					width: 27.74vw;
					height: 3.74vw;
					overflow-wrap: break-word;
					color: rgba(138, 135, 135, 1);
					font-size: 3.2vw;
					font-family: Roboto-Regular;
					font-weight: normal;
					text-align: center;
					white-space: nowrap;
					line-height: 3.74vw;
					margin-top: 0.54vw;
				}

				.text_3 {
					width: 27.74vw;
					height: 4.8vw;
					overflow-wrap: break-word;
					color: rgba(255, 255, 255, 1);
					font-size: 3.73vw;
					font-family: Roboto-Bold;
					font-weight: 700;
					text-align: center;
					white-space: nowrap;
					line-height: 4.27vw;
				}
			}

			.box_2 {
				background-color: rgba(61, 61, 61, 1);
				width: 89.6vw;
				height: 0.27vw;
				margin-top: 4.54vw;
			}

			.box_3 {
				background-color: rgba(67, 232, 160, 1);
				position: absolute;
				left: 44.8vw;
				top: 10.67vw;
				width: 44.8vw;
				height: 1.07vw;
			}

			.van-tab {
				flex: auto;
				font-size: 14px;
			}

			.van-tabs__wrap {
				height: 11.74vw;
			}

			.van-tabs__nav {
				padding-left: 0;
				padding-right: 0;
			}

			.van-tab--active {
				font-size: 12px;
			}
		}

		.section_1 {
			width: 100%;
			padding-bottom: 10px;

			.box_4 {
				background-color: rgba(61, 61, 61, 1);
				border-radius: 8px;
				height: 28.8vw;
				border: 1px solid rgba(67, 232, 160, 1);

				.group_1 {
					background-color: rgba(85, 79, 79, 1);
					border-radius: 8px 8px 0px 0px;
					width: 100%;
					height: 8.54vw;
					border: 1px solid rgba(67, 232, 160, 1);

					.section_2 {
						width: 36.27vw;
						height: 8.54vw;
						background: url(https://api.iaon.ai/storage/v1/object/public/app_resource/common_res/task_back.png) 100% no-repeat;
						background-size: 100% 100%;

						.image-text_1 {
							height: 5.34vw;
							margin: 1.6vw 0 0 3.2vw;

							.thumbnail_1 {
								min-width: 5.34vw;
								height: 5.34vw;
							}

							.text-group_1 {
								width: 10.4vw;
								height: 4.27vw;
								overflow-wrap: break-word;
								color: rgba(20, 20, 20, 1);
								font-size: 3.73vw;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 4.27vw;
								margin-top: 0.54vw;
							}
						}
					}

					.text_4 {
						height: 3.74vw;
						overflow-wrap: break-word;
						color: rgba(191, 191, 191, 1);
						font-size: 2.66vw;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: right;
						white-space: nowrap;
						line-height: 3.2vw;
						margin: 2.4vw 3.2vw 0 8.53vw;
					}
				}

				.group_2 {
					height: 12.8vw;
					margin: 3.73vw 3.2vw;

					.text_5 {
						width: 60.8vw;
						height: 12.8vw;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 3.73vw;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: left;
						line-height: 4.27vw;
					}

					.button_1 {
						background-image: linear-gradient(180deg,
								rgba(67, 232, 160, 1) 0,
								rgba(138, 242, 95, 1) 100%);
						border-radius: 80px;
						height: 6.4vw;
						border: 1px solid rgba(20, 20, 20, 1);
						width: 19.2vw;

						.text_6 {
							width: 14.94vw;
							height: 4.8vw;
							overflow-wrap: break-word;
							color: rgba(20, 20, 20, 1);
							font-size: 3.73vw;
							font-family: Roboto-Bold;
							font-weight: 700;
							text-align: center;
							white-space: nowrap;
							line-height: 4.27vw;
						}
					}

					.button_2 {
						background-image: linear-gradient(180deg,
								rgba(232, 210, 67, 1) 0,
								rgba(138, 242, 95, 1) 100%);
						border-radius: 80px;
						height: 6.4vw;
						border: 1px solid rgba(20, 20, 20, 1);
						width: 19.2vw;

						.text_9 {
							width: 14.94vw;
							height: 4.8vw;
							overflow-wrap: break-word;
							color: rgba(20, 20, 20, 1);
							font-size: 3.73vw;
							font-family: Roboto-Bold;
							font-weight: 700;
							text-align: center;
							white-space: nowrap;
							line-height: 4.27vw;
						}
					}
				}
			}

			.box_5 {
				background-color: rgba(61, 61, 61, 1);
				border-radius: 8px;
				height: 28.8vw;
				border: 1px solid rgba(67, 232, 160, 1);
				margin-top: 6.4vw;

				.group_3 {
					background-color: rgba(85, 79, 79, 1);
					border-radius: 8px 8px 0px 0px;
					height: 8.54vw;
					border: 1px solid rgba(67, 232, 160, 1);

					.block_1 {
						width: 36.27vw;
						height: 8.54vw;
						background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG4f85640e4913bbd651d91af0f5b887b3.png) 100% no-repeat;
						background-size: 100% 100%;

						.image-text_2 {
							width: 16.27vw;
							height: 5.34vw;
							margin: 1.6vw 0 0 3.2vw;

							.thumbnail_2 {
								width: 5.34vw;
								height: 5.34vw;
							}

							.text-group_2 {
								width: 10.4vw;
								height: 4.27vw;
								overflow-wrap: break-word;
								color: rgba(20, 20, 20, 1);
								font-size: 3.73vw;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 4.27vw;
								margin-top: 0.54vw;
							}
						}
					}

					.text_7 {
						height: 3.74vw;
						overflow-wrap: break-word;
						color: rgba(191, 191, 191, 1);
						font-size: 2.66vw;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: right;
						white-space: nowrap;
						line-height: 3.2vw;
						margin: 2.4vw 3.2vw 0 8.53vw;
					}
				}

				.group_4 {
					height: 12.8vw;
					margin: 3.73vw 3.2vw;

					.text_8 {
						width: 60.8vw;
						height: 12.8vw;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 3.73vw;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: left;
						line-height: 4.27vw;
					}

					.button_2 {
						background-image: linear-gradient(180deg,
								rgba(232, 210, 67, 1) 0,
								rgba(138, 242, 95, 1) 100%);
						border-radius: 80px;
						height: 6.4vw;
						border: 1px solid rgba(20, 20, 20, 1);
						width: 19.2vw;

						.text_9 {
							width: 14.94vw;
							height: 4.8vw;
							overflow-wrap: break-word;
							color: rgba(20, 20, 20, 1);
							font-size: 3.73vw;
							font-family: Roboto-Bold;
							font-weight: 700;
							text-align: center;
							white-space: nowrap;
							line-height: 4.27vw;
						}
					}
				}
			}

			.box_6 {
				background-color: rgba(61, 61, 61, 1);
				border-radius: 8px;
				height: 28.8vw;
				border: 1px solid rgba(67, 232, 160, 1);
				margin-top: 6.4vw;

				.box_7 {
					background-color: rgba(85, 79, 79, 1);
					border-radius: 8px 8px 0px 0px;
					height: 8.54vw;
					border: 1px solid rgba(67, 232, 160, 1);

					.text-wrapper_2 {
						height: 8.54vw;
						background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG0267cc97c22d4889ff4fff57a7d36a0e.png) 100% no-repeat;
						background-size: 100% 100%;
						width: 36.27vw;

						.paragraph_1 {
							width: 21.07vw;
							height: 4.27vw;
							overflow-wrap: break-word;
							color: rgba(67, 232, 160, 1);
							font-size: 3.73vw;
							font-family: Roboto-Bold;
							font-weight: 700;
							text-align: center;
							white-space: nowrap;
							line-height: 4.27vw;
							margin: 2.13vw 0 0 3.2vw;
						}
					}

					.text_10 {
						height: 3.74vw;
						overflow-wrap: break-word;
						color: rgba(191, 191, 191, 1);
						font-size: 2.66vw;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: right;
						white-space: nowrap;
						line-height: 3.2vw;
						margin: 2.4vw 3.2vw 0 8.53vw;
					}
				}

				.text_11 {
					height: 12.8vw;
					overflow-wrap: break-word;
					color: rgba(255, 255, 255, 1);
					font-size: 3.73vw;
					font-family: Roboto-Regular;
					font-weight: normal;
					text-align: left;
					line-height: 4.27vw;
					margin: 3.73vw 3.2vw;
				}
			}
		}
	}
}

@media screen and (min-width: 1024px) {
	.page {
		width: 100%;

		.block_22 {
			width: 300px;
			height: 28px;
			margin: 8px 0 0 18px;

			.label_1 {
				width: 28px;
				height: 28px;
			}

			.paragraph_1 {
				width: 260px;
				height: 28px;
				overflow-wrap: break-word;
				color: rgba(255, 255, 255, 1);
				font-size: 20px;
				font-family: 'Roboto Flex-Bold';
				font-weight: 700;
				text-align: center;
				white-space: nowrap;
				line-height: 28px;
			}
		}

		.modal-con {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 80vh;
			background: rgba(20, 20, 20, 0.93);
			display: flex;
			align-items: center;
			z-index: 999;
			padding: 0 19px;

			.content {
				width: 100%;
				height: auto;
				background: #3D3D3D;
				border-radius: 16px;
				border: 1px solid #707070;
				position: relative;
				padding: 80px 12px 20px;

				.close-icon {
					position: absolute;
					right: 8px;
					top: -28px;
					height: 24px;
					width: 24px;
				}

				.tips-icon {
					position: absolute;
					top: -64px;
					left: 50%;
					transform: translateX(-50%);
					height: 120px;
					width: 120px;
				}

				p {
					font-family: 'Roboto', 'Roboto';
					font-weight: 400;
					font-size: 14px;
					color: #FFFFFF;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.btn {
					width: 100%;
					height: 32px;
					background: linear-gradient(180deg, #43E8A0 0%, #8AF25F 100%);
					border-radius: 80px;
					border: 1px solid #141414;
					margin-top: 24px;

					font-family: 'Roboto', 'Roboto';
					font-weight: 900;
					font-size: 16px;
					color: #141414;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}
			}

			.check-con {
				margin-top: 24px;

				.image-wrapper_1 {
					height: 16px;
					width: 16px;
					border-radius: 50%;
					margin-right: 4px;
				}

				input:checked {
					background-color: #2196F3;
					border-color: #2196F3;
				}

				.text_7 {
					font-family: 'Roboto', 'Roboto';
					font-weight: 400;
					font-size: 12px;
					color: #FFFFFF;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}
		}

		.nav-bar_1 {
			background-color: rgba(255, 255, 255, 0);
			width: 100vw;
			height: 51.6px;

			.icon_1 {
				width: 20px;
				height: 20px;
				margin-top: 12px;
			}

			.text_1 {
				overflow-wrap: break-word;
				color: rgba(255, 255, 255, 1);
				font-size: 20px;
				font-family: 'Roboto-Black';
				font-weight: normal;
				text-align: center;
				white-space: nowrap;
			}

			.single-avatar_1 {
				width: 28px;
				height: 28px;
				margin-top: 8px;
				margin-right: 0;
			}

			.van-nav-bar__content {
				height: 100%;
			}

			.van-nav-bar__title {
				line-height: 23px;
			}

			.van-nav-bar__left {
				padding: 0 0 0 20px;
				align-items: start;
			}

			.van-nav-bar__right {
				padding: 0 19px 0 0;
				align-items: start;
			}
		}

		.box_1 {
			width: 100%;
			height: 691px;
			margin-bottom: 1px;

			.tab-con {
				margin: 24px 0;
			}

			.tabs_1 {
				background-color: rgba(255, 255, 255, 0);
				position: relative;
				width: 336px;
				height: 44px;

				.text-wrapper_1 {
					width: 272px;
					height: 18px;
					margin: 8px 0 0 32px;

					.text_2 {
						width: 104px;
						height: 14px;
						overflow-wrap: break-word;
						color: rgba(138, 135, 135, 1);
						font-size: 12px;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: center;
						white-space: nowrap;
						line-height: 14px;
						margin-top: 2px;
					}

					.text_3 {
						width: 104px;
						height: 18px;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 14px;
						font-family: Roboto-Bold;
						font-weight: 700;
						text-align: center;
						white-space: nowrap;
						line-height: 16px;
					}
				}

				.box_2 {
					background-color: rgba(61, 61, 61, 1);
					width: 336px;
					height: 1px;
					margin-top: 17px;
				}

				.box_3 {
					background-color: rgba(67, 232, 160, 1);
					position: absolute;
					left: 168px;
					top: 40px;
					width: 168px;
					height: 4px;
				}

				.van-tab {
					flex: auto;
					font-size: 14px;
				}

				.van-tabs__wrap {
					height: 44px;
				}

				.van-tabs__nav {
					padding-left: 0;
					padding-right: 0;
				}

				.van-tab--active {
					font-size: 12px;
				}
			}

			.section_1 {
				width: 100%;
				padding-bottom: 10px;

				.box_4 {
					background-color: rgba(61, 61, 61, 1);
					border-radius: 8px;
					height: 108px;
					border: 1px solid rgba(67, 232, 160, 1);

					.group_1 {
						background-color: rgba(85, 79, 79, 1);
						border-radius: 8px 8px 0px 0px;
						width: 100%;
						height: 32px;
						border: 1px solid rgba(67, 232, 160, 1);

						.section_2 {
							width: 136px;
							height: 32px;
							background: url(https://api.iaon.ai/storage/v1/object/public/app_resource/common_res/task_back.png) 100% no-repeat;
							background-size: 100% 100%;

							.image-text_1 {
								height: 20px;
								margin: 6px 0 0 12px;

								.thumbnail_1 {
									min-width: 20px;
									height: 20px;
								}

								.text-group_1 {
									width: 39px;
									height: 16px;
									overflow-wrap: break-word;
									color: rgba(20, 20, 20, 1);
									font-size: 14px;
									font-family: Roboto-Bold;
									font-weight: 700;
									text-align: center;
									white-space: nowrap;
									line-height: 16px;
									margin-top: 2px;
								}
							}
						}

						.text_4 {
							height: 14px;
							overflow-wrap: break-word;
							color: rgba(191, 191, 191, 1);
							font-size: 12px;
							font-family: Roboto-Regular;
							font-weight: normal;
							text-align: right;
							white-space: nowrap;
							line-height: 12px;
							margin: 9px 12px 0 32px;
						}
					}

					.group_2 {
						height: 48px;
						margin: 14px 12px;

						.text_5 {
							width: 228px;
							height: 48px;
							overflow-wrap: break-word;
							color: rgba(255, 255, 255, 1);
							font-size: 14px;
							font-family: Roboto-Regular;
							font-weight: normal;
							text-align: left;
							line-height: 16px;
						}

						.button_1 {
							background-image: linear-gradient(180deg,
									rgba(67, 232, 160, 1) 0,
									rgba(138, 242, 95, 1) 100%);
							border-radius: 80px;
							height: 24px;
							border: 1px solid rgba(20, 20, 20, 1);
							width: 72px;

							.text_6 {
								width: 56px;
								height: 18px;
								overflow-wrap: break-word;
								color: rgba(20, 20, 20, 1);
								font-size: 14px;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 16px;
							}
						}

						.button_2 {
							background-image: linear-gradient(180deg,
									rgba(232, 210, 67, 1) 0,
									rgba(138, 242, 95, 1) 100%);
							border-radius: 80px;
							height: 24px;
							border: 1px solid rgba(20, 20, 20, 1);
							width: 72px;

							.text_9 {
								width: 56px;
								height: 18px;
								overflow-wrap: break-word;
								color: rgba(20, 20, 20, 1);
								font-size: 14px;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 16px;
							}
						}
					}
				}

				.box_5 {
					background-color: rgba(61, 61, 61, 1);
					border-radius: 8px;
					height: 108px;
					border: 1px solid rgba(67, 232, 160, 1);
					margin-top: 24px;

					.group_3 {
						background-color: rgba(85, 79, 79, 1);
						border-radius: 8px 8px 0px 0px;
						height: 32px;
						border: 1px solid rgba(67, 232, 160, 1);

						.block_1 {
							width: 136px;
							height: 32px;
							background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG4f85640e4913bbd651d91af0f5b887b3.png) 100% no-repeat;
							background-size: 100% 100%;

							.image-text_2 {
								width: 61px;
								height: 20px;
								margin: 6px 0 0 12px;

								.thumbnail_2 {
									width: 20px;
									height: 20px;
								}

								.text-group_2 {
									width: 39px;
									height: 16px;
									overflow-wrap: break-word;
									color: rgba(20, 20, 20, 1);
									font-size: 14px;
									font-family: Roboto-Bold;
									font-weight: 700;
									text-align: center;
									white-space: nowrap;
									line-height: 16px;
									margin-top: 2px;
								}
							}
						}

						.text_7 {
							height: 14px;
							overflow-wrap: break-word;
							color: rgba(191, 191, 191, 1);
							font-size: 12px;
							font-family: Roboto-Regular;
							font-weight: normal;
							text-align: right;
							white-space: nowrap;
							line-height: 12px;
							margin: 9px 12px 0 32px;
						}
					}

					.group_4 {
						height: 48px;
						margin: 14px 12px;

						.text_8 {
							width: 228px;
							height: 48px;
							overflow-wrap: break-word;
							color: rgba(255, 255, 255, 1);
							font-size: 14px;
							font-family: Roboto-Regular;
							font-weight: normal;
							text-align: left;
							line-height: 16px;
						}

						.button_2 {
							background-image: linear-gradient(180deg,
									rgba(232, 210, 67, 1) 0,
									rgba(138, 242, 95, 1) 100%);
							border-radius: 80px;
							height: 24px;
							border: 1px solid rgba(20, 20, 20, 1);
							width: 72px;

							.text_9 {
								width: 56px;
								height: 18px;
								overflow-wrap: break-word;
								color: rgba(20, 20, 20, 1);
								font-size: 14px;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 16px;
							}
						}
					}
				}

				.box_6 {
					background-color: rgba(61, 61, 61, 1);
					border-radius: 8px;
					height: 108px;
					border: 1px solid rgba(67, 232, 160, 1);
					margin-top: 24px;

					.box_7 {
						background-color: rgba(85, 79, 79, 1);
						border-radius: 8px 8px 0px 0px;
						height: 32px;
						border: 1px solid rgba(67, 232, 160, 1);

						.text-wrapper_2 {
							height: 32px;
							background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/MasterDDSSlicePNG0267cc97c22d4889ff4fff57a7d36a0e.png) 100% no-repeat;
							background-size: 100% 100%;
							width: 136px;

							.paragraph_1 {
								width: 79px;
								height: 16px;
								overflow-wrap: break-word;
								color: rgba(67, 232, 160, 1);
								font-size: 14px;
								font-family: Roboto-Bold;
								font-weight: 700;
								text-align: center;
								white-space: nowrap;
								line-height: 16px;
								margin: 8px 0 0 12px;
							}
						}

						.text_10 {
							height: 14px;
							overflow-wrap: break-word;
							color: rgba(191, 191, 191, 1);
							font-size: 12px;
							font-family: Roboto-Regular;
							font-weight: normal;
							text-align: right;
							white-space: nowrap;
							line-height: 12px;
							margin: 8px 12px 0 32px;
						}
					}

					.text_11 {
						height: 48px;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 14px;
						font-family: Roboto-Regular;
						font-weight: normal;
						text-align: left;
						line-height: 16px;
						margin: 14px 12px;
					}
				}
			}
		}
	}
}
</style>