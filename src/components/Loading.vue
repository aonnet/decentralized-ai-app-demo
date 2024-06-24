<template>
	<div class="loading" v-if="showLoading">
		<div class="running-con">
			<img src="../assets/images/running.gif" mode=""></img>
			<p>RUNNING...</p>
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
	}
});

const timeLeft = ref(30);
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
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
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
	background: #FFFFFF;
	opacity: 0.93;
	display: flex;
	justify-content: center;
	align-items: center;
}

.running-con {
	width: 56vw;
	height: 25.07vw;
	background: #000000;
	border-radius: 4.27vw;
	border: .13vw solid #707070;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	position: relative;
	padding: 5.6vw 0;
	box-sizing: border-box;
}

.running-con img {
	width: 22.4vw;
	height: 38.4vw;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -28vw;
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
	/* margin-top: 32rpx; */
}
</style>