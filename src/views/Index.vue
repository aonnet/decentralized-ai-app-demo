<template>
	<Loading v-if="showLoading" :showLoading="showLoading" />
	<div>
		<!-- 页面内容 -->
		<div class="container">
			<div v-for="(value, key) in page_config && page_config.properties"
				:key="key">
				<!-- {{ key }} -->
				<div v-if="value.ui_type && value.ui_type.length && value.ui_type == 'main' && value.show !== 'nodisplay'">
					<div v-for="(form, key1) in value.properties" :key="key1">
						<div v-if="form.ui_type && form.ui_type.length && form.show !== 'nodisplay'" class="uni-form-item uni-column">
							<!-- {{ key1 }}: {{ form }} -->
							<div class="title">{{ form.title }}</div>
							<div :class="`content ${form.ui_type == 'banner' && 'banner'}`"
								v-if="form.ui_type == 'banner'">
								<img :src="appData &&
								appData.params_value &&
								appData.params_value.ui &&
								appData.params_value.ui[page_config.title] &&
								appData.params_value.ui[page_config.title][key] &&
								appData.params_value.ui[page_config.title][key][key1]"></img>
								<p>AON 3D Clothing</p>
								<p>Customize your clothing logo and generate a 3D avatar</p>
							</div>
							<div class="content" v-if="form.ui_type == 'input'">
								<input v-model="appData.params_value.ui[page_config.title][key][key1]" name="input"
									:placeholder="form.placeholder" />
							</div>
							<div class="content" v-if="form.ui_type == 'upload'">
								<van-uploader v-model="appData.params_value.ui[page_config.title][key][key1]" :max-size="maxSize" @oversize="onOversize"
									:after-read="afterRead" :deletable="true" :before-delete="deleteImg(key, key1)"
									:max-count="1" :name="key1" :accept="form.accept">

									<div class="upload upload-before">
										<img class="uploadIcon" src="../assets/icons/uploadImg.png" mode=""></img>
										<text>{{form.placeholder}}</text>
									</div>

								</van-uploader>
							</div>
							<div class="content" v-if="form.ui_type == 'radio'">
								<van-radio-group v-model="appData.params_value.ui[page_config.title][key][key1]" direction="row"
									class="custom-radio-group">
									<van-radio v-for="(value, index) in form.enum" :key="index" :name="index"
										checked-color="#2EE9D0" class="custom-radio">{{ value }}</van-radio>
								</van-radio-group>
							</div>
							<div class="content" v-if="form.ui_type == 'select_nomal'">
								<van-dropdown-menu>
									<van-dropdown-item v-model="appData.params_value.ui[page_config.title][key][key1]"
										:options="form.enum" />
								</van-dropdown-menu>
							</div>
							<div class="content" v-if="form.ui_type == 'texteara'">
								<van-field rows="3" autosize type="textarea"
									v-model="appData.params_value.ui[page_config.title][key][key1]" label=""
									:placeholder="form.placeholder" />
							</div>
							<div v-if="form.ui_type == 'select'">
								<div class="templateCon"
									v-if="appData.params_value.ui[page_config.title][key][key1] && appData.params_value.ui[page_config.title][key][key1].length > 0">
									<div v-for="(item, index) in appData.params_value.ui[page_config.title][key][key1]"
										:class="`template_item ${item.selected ? 'templateActive' : ''}`"
										@click="selectTemplate(item)" :key="index">
										<img :src="item.value.image" alt="" />
										<div :class="`isActiveIcon ${item.selected  ? 'active' : ''}`">
											<img src="../assets/icons/selectIcon.png" alt="" v-if="item.selected ">
										</div>
										<!-- <text :class="`text ${item.selected ? 'active' : ''}`">{{item.value.title}}</text> -->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="value.ui_type && value.ui_type.length && value.ui_type == 'footer' && value.show !== 'nodisplay'">
					<div v-for="(footer, key) in value.properties" :key="key">
						<div v-if="footer.ui_type && footer.ui_type.length && footer.show !== 'nodisplay' && footer.ui_type == 'button'">
							<div class="bottom_btn">
								<div class="spendCount">
									<img class="icon" src="../assets/icons/money.png" mode=""></img>
									<text>-{{price}}</text>
								</div>
								<button :disabled="false" :class="`submitBtn ${false && 'submitBtn_disabled'}`" @click="formSubmit">
									<text>{{ footer.title }}</text>
								</button>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted ,toRaw} from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { useRouter } from 'vue-router'

import { AI, AIOptions, User } from 'aonweb'
import { getTemplate } from '../lib/getTemplate'
import { useImageStore } from '@/store/imageStore';

import 'vant/lib/index.css';
import Loading from '../components/Loading.vue';
import bus from '../eventBus.js';
import {loadAppData } from '../lib/loadApp'

const router = useRouter()
const imageStore = useImageStore();

const showLoading = ref(false);
const showError = ref(false);
const prompt = ref('');
const templateList = ref([]);
const templateId = ref(1);
const appData = ref({})
const page_config = ref({})

let page = ''
let price = ref(10)


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

function afterRead(file,detail) {
	const formData = new FormData();
	formData.append('file', file.file);

	// 调用上传接口
	uploadFile(formData).then(res => {
		if (res.code == 200 && res.data && res.data.length) {
			imageStore.addImage(res.data);
			// let data = rawAppData.params_value.ui[page_config.title].main[detail.name]
			// let deal = data && data.length && data[0]
			file.remote_url = res.data
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
	// if (imageStore.uploadedImageUrl) {
	// 	const formData = new FormData();
	// 	formData.append('file', imageStore.uploadedImageUrl);

	// 	// 删除文件
	// 	formData.delete('file');

	// 	imageStore.removeImage();

	// 	console.log('File deleted:', formData.get('file'));
	// } else {
	// 	console.log('No file to delete')
	// }
	if (appData.params_value && appData.params_value.ui) {
		appData.params_value.ui.body[key][key1] = []
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
	
	try {
		// AI 使用方法
		let rawAppData = toRaw(appData.value)
		if (!rawAppData || !rawAppData.params_value) {
			return
		}
		if (!rawAppData || !rawAppData.template_params) {
			return
		}
		let page_config_temp = toRaw(page_config.value)
		console.log('rawAppData.params_value.ui[page_config.title] = ',rawAppData.params_value.ui[page_config_temp.title],page_config_temp)
		let images = rawAppData.params_value.ui[page_config_temp.title].main.image
		let image_url = null
		if (images && images.length) {
			let img = images[0]
			img = toRaw(img)
			image_url = img.remote_url
		}
		if (!(image_url && image_url.length)) {
			showToast('Please uplaod a photo')
			return
		}
		// let male = await male_or_famale()
		
		let select_item = null
		let clothings = rawAppData.params_value.ui[page_config_temp.title].main.clothing
		clothings.forEach((item => {
			if (item.selected) {
				select_item = item
				return false
			}
		}))
		let prompt_input = (select_item && select_item.value.prompt) || ''
		console.log("prompt_input = ", prompt_input)
		prompt_input = 'use the face in  main_face_image and use the clothing in auxiliary_face_image1,' + prompt_input

		showLoading.value = true

		const ai_options = new AIOptions({
			appId: 'k3ebyfaSz8b87xJb_VyEGXx_AJ0MM8ngqU7Ym3AKeW8A',
			// ai_server:'http://localhost:8088'
		})

		const aonet = new AI(ai_options)

		let ai_config = rawAppData.params_value && rawAppData.params_value.ai && rawAppData.params_value.ai['pulid']
		console.log('ai_config =',ai_config)
		const data = {
			input: {
				"prompt": prompt_input,
				"cfg_scale": ai_config.cfg_scale,
				"num_steps": ai_config.num_steps,
				"image_width": ai_config.image_width,
				"num_samples": ai_config.num_samples,
				"image_height": ai_config.image_height,
				"output_format": ai_config.output_format,
				"identity_scale": ai_config.identity_scale,
				"mix_identities": ai_config.mix_identities,
				"output_quality": ai_config.output_quality,
				"generation_mode": ai_config.generation_mode,
				"main_face_image": image_url,
				"auxiliary_face_image1":select_item && select_item.value && select_item.value.image,
				"negative_prompt": ai_config.negative_prompt
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
		console.log('formSubmit error = ',error)
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

function selectTemplate(item) {
	console.log("selectTemplate = ", item)
	let rawAppData = toRaw(appData.value)
	if (!rawAppData) {
		return
	}
	let page_config_temp = toRaw(page_config.value)
	for (const key in page_config_temp.properties) {
		let value = page_config_temp.properties[key]
		if (value && value.ui_type == 'main') {
			for (const key1 in value.properties) {
				let form = value.properties[key1]
				if (form && form.ui_type == 'select') {
					let temp = rawAppData.params_value.ui[page_config_temp.title][key][key1]
					for (let i = 0; i < temp.length; i++) {
						let loaction = temp[i]
						loaction.selected = false
					}
				}
			}
		}
	}
	item.selected = true
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
