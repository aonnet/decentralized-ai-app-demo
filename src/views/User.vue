<template>
	<div class="user">
		<div class="container">
			<div class="ava-con">
				<img class="ava" src="../assets/icons/user.png" mode=""></img>
				<div class="ava-con-r">
					<text class="userId">user-125482</text>
					<text class="address">
						{{ account }}
						<img class="copy" src="../assets/icons/copy.png" @click="handleCopy" mode="" />
					</text>
				</div>
			</div>
			<img @click="goToComplete" class="person-banner" src="../assets/images/personBanner.png" mode=""></img>

			<!-- <div class="myWork">
				<text>My work</text>
				<div class="waterfall">
					<div class="waterfall-column" v-for="(column, index) in columns" :key="index">
						<img v-for="item in column" :key="item.id" :src="item.src" class="waterfall-item" />
					</div>
				</div>
			</div> -->

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
import { Options, User, detectEthereumProvider } from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';
import bus from '../eventBus.js';

const router = useRouter()

const account = ref('')

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
	try {
		let time = new Date().getTime()
		console.log(`demo user login start time = ${time}`)
		let user = new User()
		let temp = await user.islogin()
		if (!temp) {
			showLoadingToast({
				duration: 0,
				forbidClick: true,
				message: 'Loading...',
			});
			for (let i = 0; i < 5; i++) {
			// console.log("getOwnedUsers i = ",i)
				let result = await user.getOwnedUsers()
				let userid = result && result._userIds && result._userIds.length && result._userIds[0]
				if (userid && userid.length) {
					break
				}
				await sleep(300)       
			}
			closeToast();
			temp = await user.islogin()
			if (!temp) {
				showToast("login failed,please try again later");
				return
			}
		}
		let ethereum = await detectEthereumProvider()
		let get_account = await ethereum.request({ method: 'eth_requestAccounts' })
		get_account = get_account[0]
		account.value = get_account
		bus.emit('get_balance', "login");
		console.log(`demo user login end time = ${new Date().getTime() - time}`)
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
	color: #000000;
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
	height: 36.27vw;
	margin: 6.4vw 0;
}

.myWork text {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 3.73vw;
	color: #000000;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-bottom: 4.27vw;
}

button {
	width: 100%;
	height: 9.07vw;
	background: #000000;
	box-shadow: 1.07vw 1.07vw 2.13vw .13vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;

	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 3.73vw;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
	text-transform: none;
}
</style>
