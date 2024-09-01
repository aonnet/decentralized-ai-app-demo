<template>
	<div>
		<div v-for="(value,key) in page_config && page_config.properties" :key="key">
			<div v-if="value.ui_type && value.ui_type.length && value.ui_type == 'header'">
				<div class="custom-navbar">
					<div class="left">
						<div v-for="(header,key1) in value.properties" :key="key1">
						<div v-if="header.ui_type && header.ui_type.length && header.ui_type == 'image'">
							<img :src="appData && 
							appData.params_value && 
							appData.params_value.ui && 
							appData.params_value.ui[page_config.title] && 
							appData.params_value.ui[page_config.title][key] &&
							appData.params_value.ui[page_config.title][key][key1]" class="logo" @click="goIndex"></img>
						</div>
						<div v-if="header.ui_type && header.ui_type.length && header.ui_type == 'label'">
							<div class="title">{{appData && 
							appData.params_value && 
							appData.params_value.ui && 
							appData.params_value.ui[page_config.title] && 
							appData.params_value.ui[page_config.title][key] &&
							appData.params_value.ui[page_config.title][key][key1]}}</div>
						</div>
					</div>
					</div>
					

					<div class="right">
						<div class="right_count">
							<img src="../assets/icons/money.png" class="moneyIcon"></img>
							<span class="count">{{ balanceValue }}</span>
						</div>
						<img src="../assets/icons/user.png" v-if="!isUserPage" class="userIcon" @click="goUser"></img>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	defineProps,
	ref,
	onMounted,
	computed
} from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { User } from 'aonweb'

import bus from '../eventBus.js';
import { showToast, showLoadingToast, closeToast } from 'vant';
import {loadAppData } from '../lib/loadApp'


const router = useRouter()
const route = useRoute()
const isUserPage = ref(false);

const balanceValue = ref(0);
const appData = ref({})
const page_config = ref({})

let page = ''


const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	showBackIcon: {
		type: Boolean,
		default: true
	}
});

const goIndex = () => {
	router.push('/')

};

const goUser = () => {
	router.push('/user')
};


const balance = async () => {
	// console.log("balance in----")
	try {
		let user = new User()
		let result = await user.balance()
		// console.log("Header balance ", result)
		if (result && result.code == 200 && result.data && result.data.length) {
			let asset = result.data[0]
			balanceValue.value = asset.balance / asset.unit
		}
		// console.log("Header balanceValue.value ", balanceValue.value)
		localStorage.setItem("aon_balance",balanceValue.value)
		// closeToast();
	} catch (error) {
		console.log(error, "balance error")
		if (error && typeof error == 'string'){
			showToast(error);
		} else {
			showToast(error.message);
		}
	} finally {
		
	}

};


bus.on('get_balance', (data) => {
	console.log("get_balance", data)
	balance()
});

const checkIfUserPage = () => {
	isUserPage.value = route.path === '/user'
};

async function load() {
	let temp = await loadAppData(window.location.origin)
	let temp_ = JSON.parse(JSON.stringify({ ...temp }));
	console.log("index load = ", temp_)
	// temp = sortObjectByIndex(temp)
	// console.log("index load 1111 = ",JSON.stringify(temp))
	temp_ && temp_.template_params &&  temp_.template_params.ui && temp_.template_params.ui.pages && temp_.template_params.ui.pages.forEach(element => {
		console.log("index load 1111 = ",element)
		if (element && element.sort == 0) {
			page = element.title
			page_config.value = element
		}
	});
	appData.value = temp_
}

onMounted(() => {
	load()
	checkIfUserPage();
	let balance = localStorage.getItem("aon_balance")
	balanceValue.value = balance
	
	// balance()
});

</script>

<style scoped>
.custom-navbar {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	min-height: 13.33vw;
	padding: 3.73vw 6.4vw;
	background-color: #1C1C1C;
}

.left{
	display: flex;
	flex-direction: row;
	align-items: center;
}

.left div{
	display: flex;
	align-items: center;
}

.logo {
	/* width: 7.47vw;
	height: 7.47vw; */
	width: 7.47vw;
	height: 7.47vw;
	margin-right: 2.13vw;
	border-radius: 50%;
}


.title {
	/* flex: 1; */
	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 4.8vw;
	color: #fff;
	text-align: left;
	font-style: normal;
	text-transform: none;
	/* margin-left: 2.13vw; */
}

.right {
	min-width: 16.8vw;
	height: 6.4vw;
	padding: 0 1.07vw;
	background: linear-gradient( 147deg, #8AF25F 0%, #F7FFF0 100%);
	border-radius: 10.67vw;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.right_count {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.right .right_count .moneyIcon,
.right .userIcon {
	height: 4.27vw;
	width: 4.27vw;
	margin-right: 1.07vw;
}

.right .userIcon {
	border-radius: 100%;
	margin-right: 0;
	margin-left: 1.07vw;
}

.right .count {
	font-family: Roboto, Roboto;
	font-weight: bold;
	font-size: 2.67vw;
	color: #141414;
	text-align: left;
	font-style: normal;
	text-transform: none;
}
</style>
