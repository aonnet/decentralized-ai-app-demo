<template>
	<div class="">
		<div class="container created">
			<div class="resCon">
				<img class="res_img" :src="imageUrl" mode=""></img>
			</div>


			<div class="handles">
				<div class="download">
					<img src="../assets/icons/download.png" @click="downloadImage" mode=""></img>
				</div>
				<!-- <div class="download share">
					<img src="../assets/icons/share.png" mode=""></img>
				</div> -->
			</div>
		</div>

		<div class="bottom_btn">
			<button class="personalCenter" @click="goUser">Personal Center</button>
			<button class="createMore" @click="goToCreate">Generate More</button>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted
} from 'vue';
import { useRoute, useRouter } from 'vue-router'
import bus from '../eventBus.js';
const router = useRouter()
const route = useRoute()

const imageUrl = ref('')

function goToCreate() {
	router.push({
		path: '/'
	})
}
const goUser = () => {
	router.push('/user')
};




async function downloadImage() {
	if (!imageUrl.value) return;
	try {
		// Fetch the image as a blob
		const response = await fetch(imageUrl.value);
		const blob = await response.blob();

		// Create a link element and set the URL using the blob
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'downloaded-image.jpg'; // 设置下载的文件名

		// Append the link to the body and click it to trigger the download
		document.body.appendChild(link);
		link.click();

		// Clean up by removing the link element
		document.body.removeChild(link);
	} catch (error) {
		console.error('Error downloading the image:', error);
	}
}

onMounted(() => {
	imageUrl.value = route.query.url;
	bus.emit('get_balance', "prediction");
})
</script>

<style scoped>
.created {
	padding-top: 8.53vw;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.resCon {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	min-height: 121.07vw;
	background: #3D3D3D;
}

.resCon div {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.resCon p {
	width: 100%;
	padding: 6.4vw 6.93vw;
	font-family: Roboto-Bold;
	font-weight: 700;
	font-size: 5.33vw;
	color: #FFFFFF;
	line-height: 6.13vw;
	text-align: left;
	font-style: normal;
	text-transform: none;
	background-color: #141414;
	word-wrap: break-word;
}

.res_img {
	width: auto;
	max-width: 100%;
	height: auto;
	max-height: 153.6vw;
}

.handles {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: flex-end;
}

.download {
	/* position: fixed;
	bottom: 23.73vw;
	left: 50%;
	transform: translateX(-50%); */
	width: 8.53vw;
	height: 8.53vw;
	border-radius: 100%;
	background: linear-gradient(180deg, #141414 0%, #3D3D3D 100%);
	border: 2px solid #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 6.4vw;
	margin-left: 5.33vw;
}

.download img {
	height: 5.33vw;
	width: 5.33vw;
}

.bottom_btn {
	padding: 2.67vw 4.53vw;
}

button {
	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 4.27vw;
	color: #1C1C20;
	text-align: center;
	font-style: normal;
	text-transform: none;

	width: 42.67vw;
	height: 8.53vw;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.createMore {
	background: linear-gradient(117deg, #43E8A0 0%, #8AF25F 100%);
	box-shadow: 2.13vw 2.13vw 4.27vw .27vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;
}

.personalCenter {

	background: linear-gradient(117deg, #36CFC9 0%, #EF81FF 100%);
	box-shadow: 2.13vw 2.13vw 4.27vw .27vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;
}

@media screen and (min-width: 1024px) {
	.created {
		padding-top: 32px;
		position: relative;
	}

	.resCon {
		min-height: 454px;
	}

	.res_img {
		max-height: 576px;
	}

	.handles {
		padding-bottom: 75px;
	}

	.download {
		width: 32px;
		height: 32px;
		border: 1px solid #FFFFFF;
		margin-top: 24px;
		margin-left: 20px;
	}

	.download img {
		height: 20px;
		width: 20px;
	}

	.bottom_btn {
		padding: 10px 17px;
	}

	button {
		font-size: 16px;
		width: 160px;
		height: 32px;
	}

	.createMore {
		background: linear-gradient(117deg, #43E8A0 0%, #8AF25F 100%);
		box-shadow: 8px 8px 16px 1px rgba(0, 0, 0, 0.32);
		border-radius: 4px;
	}

	.personalCenter {
		background: linear-gradient(117deg, #36CFC9 0%, #EF81FF 100%);
		box-shadow: 8px 8px 16px 1px rgba(0, 0, 0, 0.32);
		border-radius: 4px;
	}
}
</style>