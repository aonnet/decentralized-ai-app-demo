<template>
	<div class="loading" v-if="showLoading">
		<div class="running-con">
			<img src="../assets/images/running.png" mode=""></img>
			<p>{{loadingText}}</p>
			<p>ETA: {{ formatTime(timeLeft) }}</p>

		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
	showLoading: {
		type: Boolean,
		default: false
	},
	loadingText: {
		type: String,
		default: 'Generating speech'
	}
});

const timeLeft = ref(30 * 1.2);
let timer;

const startCountdown = () => {
	timer = setInterval(() => {
		if (timeLeft.value > 0) {
			timeLeft.value--;
		} else {
			clearInterval(timer);
		}
	}, 1000);
};

const formatTime = (seconds) => {
	let ceil_seconds = Math.ceil(seconds)
	const hours = Math.floor(ceil_seconds / 3600);
	const minutes = Math.floor((ceil_seconds % 3600) / 60);
	const secs = ceil_seconds % 60;
	return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
};

const padZero = (num) => {
	return num.toString().padStart(2, '0');
};


onMounted(() => {
	startCountdown()
})

onUnmounted(() => {
	clearInterval(timer);
})



</script>

<style>
.loading {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	height: 100%;
	width: 100%;
	background: #141414;
	opacity: 0.93;
	display: flex;
	justify-content: center;
	align-items: center;
}

.running-con {
	width: 58.67vw;
	height: 48vw;
	background: #3D3D3D;
	border-radius: 5.33vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	padding: 21.07vw 0 5.6vw;
	box-sizing: border-box;
}

.running-con img {
	width: 30.93vw;
	height: 25.6vw;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -9.6vw;
}

.running-con p {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 3.73vw;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
	text-transform: none;
	display: flex;
	line-height: 8.53vw;
	/* margin-bottom: 4.27vw; */
}
</style>