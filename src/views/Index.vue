<template>
	<Loading v-if="showLoading" :showLoading="showLoading" />
	<div>
		<!-- 页面内容 -->
		<div class="container">
			<div class="banner">
				<img src="../assets/images/banner.png" mode=""></img>
				<p>AON 3D Clothing</p>
				<p>Customize your clothing logo and generate a 3D avatar</p>
			</div>
			<div class="uni-form-item uni-column">
				<div class="title">Upload your photos</div>

				<div class="content">
					<div class="upload upload-done" v-if="imageStore.uploadedImageUrl">
						<img class="upload-res" :src="imageStore.uploadedImageUrl" mode=""></img>
						<img class="deleteIcon" @click="deleteImg" src="../assets/icons/delete.png" mode=""></img>
					</div>
					<van-uploader v-else style="width: 100%" :max-size="maxSize" @oversize="onOversize"
						:after-read="afterRead">

						<div class="upload upload-before">
							<img class="uploadIcon" src="../assets/icons/uploadImg.png" mode=""></img>
							<text>limit 30MB per file</text>
						</div>
					</van-uploader>


				</div>

			</div>

			<!-- <div class="uni-form-item uni-column">
				<div class="title">Customize your clothing logo</div>
				<div class="content">
					<input v-model="prompt" name="input" placeholder="Please enter the logo text on your clothes" />
				</div>
			</div> -->

			<div class="uni-form-item uni-column">
				<div class="title">Choose your template</div>
				<div class="templateCon" v-if="templateList.length > 0">
					<div v-for="(item, index) in templateList"
						:class="`template_item ${Number(item.id) === templateId ? 'templateActive' : ''}`"
						@click="selectTemplate(Number(item.id), item.image, item.prompt)" :key="index">
						<img :src="item.image" alt="" />
						<div :class="`isActiveIcon ${Number(item.id) === templateId ? 'active' : ''}`">
							<img src="../assets/icons/selectIcon.png" alt="" v-if="Number(item.id) === templateId">
						</div>
					</div>
				</div>
			</div>

			<div class="uni-form-item error-text" v-if="showError">
				<div class="content">Please Upload your photos</div>
			</div>
			<div class="bottom_btn">
				<div class="spendCount">
					<img class="icon" src="../assets/icons/money.png" mode=""></img>
					<text>-8</text>
				</div>
				<button class="submitBtn" @click="formSubmit">
					<text>Generate img</text>
				</button>
			</div>


		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { useRouter } from 'vue-router'

import { AI, AIOptions, User } from 'aonweb'
import { getTemplate } from '../lib/getTemplate'
import { useImageStore } from '@/store/imageStore';

import 'vant/lib/index.css';
import Loading from '../components/Loading.vue';
import bus from '../eventBus.js';

const router = useRouter()
const imageStore = useImageStore();

const showLoading = ref(false);
const showError = ref(false);
const prompt = ref('');
const templateList = ref([]);
const templateId = ref(1);


const maxSize = 30 * 1024 * 1024;

function goToComplete(url) {
	const query = { url: url }
	router.push({
		path: '/created',
		query
	})
}

const onOversize = (file) => {
	showToast('文件大小不能超过 30MB');
};

function afterRead(file) {
	const formData = new FormData();
	formData.append('file', file.file);

	// 调用上传接口
	uploadFile(formData).then(res => {
		if (res.code == 200 && res.data && res.data.length) {
			imageStore.addImage(res.data);
		}
	}).catch(err => {
		showToast('image upload failed');
		console.log(err);
	});
}
// 上传接口
const uploadFile = async (formData) => {
	const response = await fetch('https://tmp-file.aigic.ai/api/v1/upload?expires=1800&type=image/png', {
		method: 'POST',
		body: formData
	});

	const data = await response.json();
	return data;
};

function deleteImg() {
	if (imageStore.uploadedImageUrl) {
		const formData = new FormData();
		formData.append('file', imageStore.uploadedImageUrl);

		// 删除文件
		formData.delete('file');

		imageStore.removeImage();

		console.log('File deleted:', formData.get('file'));
	} else {
		console.log('No file to delete')
	}
}

const formSubmit = async () => {
	console.log(imageStore.uploadedImageUrl)
	if (!imageStore.uploadedImageUrl) {
		showError.value = true

		setTimeout(() => {
			showError.value = false
		}, 3000)
		return
	}
	showLoading.value = true
	try {
		// AI 使用方法
		const ai_options = new AIOptions({
			appId: 'k3ebyfaSz8b87xJb_VyEGXx_AJ0MM8ngqU7Ym3AKeW8A'
		})

		const aonet = new AI(ai_options)

		const data = {
			input: {
				"prompt": "",
				"cfg_scale": 1.2,
				"num_steps": 4,
				"image_width": 768,
				"num_samples": 1,
				"image_height": 1024,
				"output_format": "webp",
				"identity_scale": 0.8,
				"mix_identities": false,
				"output_quality": 80,
				"generation_mode": "fidelity",
				"main_face_image": imageStore.uploadedImageUrl,
				"negative_prompt": ""
			}
		}
		console.log("formSubmit data", data)
		let price = 8
		let response = await aonet.prediction("/predictions/ai/pulid", data, price)
		console.log("test", response)
		if (response && response.code == 200 && response.data) {
			response = response.data
		}
		if (response.task.exec_code == 200 && response.task.is_success) {
			showLoading.value = false

			let url = response.output
			if (Array.isArray(response.output)) {
				url = response.output && response.output.length && response.output[0]
			}
			if (typeof url == 'object' || typeof url == 'Object') {
				return
			}

			goToComplete(url)
		} else {
			showLoading.value = false
			let task_error = response && response.task && response.task.task_error
			let api_error = response && response.task && response.task.api_error
			let message = response && response.message
			let msg = task_error || api_error || message
			showToast(msg || 'AI processing failed')
		}
	} catch (error) {
		showLoading.value = false
		// showToast('AI processing failed')
		if (error && typeof error == 'string') {
			showToast(error);
		} else {
			showToast(error.message);
		}
	}

}

async function getTemplateList() {
	try {
		const list = await getTemplate()
		templateList.value = list
		prompt.value = list[0].prompt
	} catch (error) {
		console.log(error)
	}
}

function selectTemplate(id, imageUrl, prompt_) {
	templateId.value = id
	prompt.value = prompt_
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
	try {
		let time = new Date().getTime()
		console.log(`demo index login start time = ${time}`)
		let user = new User()
		let temp = await user.islogin()
		console.log(`demo index islogin end time = ${time}, temp = ${temp}`)
		if (!temp) {
			showLoadingToast({
				duration: 0,
				forbidClick: true,
				message: 'Loading...',
			});
			console.log(`demo index showLoadingToast end time = ${time}`)
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
		bus.emit('get_balance', "login");
		console.log(`demo index login end time = ${new Date().getTime() - time}`)
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
	getTemplateList()
	login()
})

</script>

<style scoped>
.banner {
	width: 100%;
	height: 27.73vw;
	margin-top: 8.53vw;
	margin-bottom: 8.53vw;
	position: relative;
	padding: 4.27vw;
}

.banner img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.banner p {
	position: relative;
	z-index: 10;
	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 6.4vw;
	color: #FFFFFF;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.banner p:last-child {
	width: 49.07vw;
	font-family: Roboto-Regular;
	font-weight: 400;
	font-size: 2.4vw;
	color: #FFFFFF;
	line-height: 4.27vw;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.uni-form-item .title {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 3.73vw;
	color: #000000;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-bottom: 2.13vw;
}

.uni-form-item {
	margin-bottom: 8.53vw;
}

.uni-form-item .content {
	width: 100%;
	height: 14.93vw;
	background: #F1F1F1;
	border-radius: 1.07vw;
	display: flex;
	align-items: center;
	padding: 0 3.2vw;
	box-sizing: border-box;

}

.error-text {
	width: 86.67vw;
	position: fixed;
	bottom: 21.6vw;

}

.error-text .content {
	background-color: #F3A32B;
	font-size: 3.2vw;
	color: #fff;
}

.uni-form-item .content input {
	width: 100%;
	font-size: 3.2vw;
	font-family: Roboto-Regular;
	border: none;
	outline: none;
	background-color: #F1F1F1;
}

.upload {
	width: 100%;
	display: flex;
	align-items: center;
}

.upload-before text {
	color: #575757;
	font-size: 3.2vw;
	font-family: Roboto-Regular;
}

.upload-done {
	justify-content: space-between;
}

.uploadIcon {
	width: 6.4vw;
	height: 6.4vw;
	margin-right: 2.13vw;
}

.upload-res {
	width: auto;
	max-height: 8.53vw;
}

.deleteIcon {
	height: 5.07vw;
	width: 5.07vw;
}


.bottom_btn .spendCount {
	width: 19.2vw;
	height: 9.07vw;
	background: #F1F1F1;
	border-radius: 1.07vw;
	display: flex;
	justify-content: center;
	align-items: center;
}

.bottom_btn .spendCount .icon {
	height: 6.4vw;
	width: 6.4vw;
	margin-right: 1.07vw;
}

.bottom_btn .submitBtn {
	width: 64.8vw;
	height: 9.07vw;
	background: #000000;
	box-shadow: 1.07vw 1.07vw 2.13vw .13vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;
	display: flex;
	justify-content: center;
	align-items: center;

}

.bottom_btn .submitBtn text {
	font-size: 3.73vw;
	font-weight: bold;
	background: linear-gradient(182deg, #2F54EB 0%, #FF26A8 100%);
	-webkit-background-clip: text;
	color: transparent;
	background-clip: text;
}

.templateCon {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex-wrap: wrap;
	height: auto;
	background: transparent;
}

.template_item {
	width: 24.8vw;
	height: 44vw;
	background: #F1F1F1;
	border-radius: 1.07vw;
	margin-bottom: 4.53vw;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;

}

.template_item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.templateActive {
	border: .27vw solid #000;

}

.isActiveIcon {
	position: absolute;
	bottom: 1.6vw;
	right: 1.6vw;
	width: 3.2vw;
	height: 3.2vw;
	background: #FFFFFF;
	border: .27vw solid #000000;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.isActiveIcon img {
	height: 2.13vw;
	width: 2.13vw;
}

.active {
	background: #EBCC2F;
}
</style>
