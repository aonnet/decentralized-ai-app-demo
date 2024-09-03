<template>
	<Loading v-if="showLoading" :showLoading="showLoading" />
	<div>
		<!-- 页面内容 -->
		<div class="container">
			<div v-for="(value, key) in page_config && page_config.properties" :key="key">
				<!-- {{ key }} -->
				<div
					v-if="value.ui_type && value.ui_type.length && value.ui_type == 'main' && value.show !== 'nodisplay'">
					<div v-for="(form, key1) in value.properties" :key="key1">
						<div v-if="form.ui_type && form.ui_type.length && form.show !== 'nodisplay'"
							class="uni-form-item uni-column">
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
								<!-- <p>AON 3D Clothing</p>
								<p>Customize your clothing logo and generate a 3D avatar</p> -->
							</div>
							<div class="content" v-if="form.ui_type == 'input'">
								<input v-model="appData.params_value.ui[page_config.title][key][key1]" name="input"
									:placeholder="form.placeholder" />
							</div>
							<div class="content" v-if="form.ui_type == 'upload'">
								<van-uploader v-model="appData.params_value.ui[page_config.title][key][key1]"
									:max-size="maxSize" @oversize="onOversize" :after-read="afterRead" :deletable="true"
									:before-delete="deleteImg(key, key1)" :max-count="1" :name="key1"
									:accept="form.accept">

									<div class="upload upload-before">
										<img class="uploadIcon" src="../assets/icons/uploadImg.png" mode=""></img>
										<text>{{ form.placeholder }}</text>
									</div>

								</van-uploader>
							</div>
							<div class="content" v-if="form.ui_type == 'radio'">
								<van-radio-group v-model="appData.params_value.ui[page_config.title][key][key1]"
									direction="row" class="custom-radio-group">
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
									v-if="form.options && form.options.length > 0">
									<div v-for="(item, index) in form.options"
										:class="`template_item ${item.selected ? 'templateActive' : ''}`"
										@click="selectTemplate(item)" :key="index">

										<div class="imgCon">
											<img :src="item.value.image" alt="" />
										</div>
										<div :class="`isActiveIcon ${item.selected ? 'active' : ''}`">
											<img src="../assets/icons/selectIcon.png" alt="" v-if="item.selected">
										</div>
										<!-- <text :class="`text ${item.selected ? 'active' : ''}`">{{item.value.title}}</text> -->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					v-if="value.ui_type && value.ui_type.length && value.ui_type == 'footer' && value.show !== 'nodisplay'">
					<div v-for="(footer, key) in value.properties" :key="key">
						<div
							v-if="footer.ui_type && footer.ui_type.length && footer.show !== 'nodisplay' && footer.ui_type == 'button'">
							<div class="bottom_btn">
								<div class="spendCount">
									<img class="icon" src="../assets/icons/money.png" mode=""></img>
									<text>-{{ price }}</text>
								</div>
								<button :disabled="false" :class="`submitBtn ${false && 'submitBtn_disabled'}`"
									@click="formSubmit">
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
import { ref, onMounted, toRaw } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { useRouter } from 'vue-router'

import { AI, AIOptions, User } from 'aonweb'
import { getTemplate } from '../lib/getTemplate'
import { useImageStore } from '@/store/imageStore';

import 'vant/lib/index.css';
import Loading from '../components/Loading.vue';
import bus from '../eventBus.js';
import { loadAppData,needLoadData,findKey,findParentKey, upload,update_run_count } from '../lib/loadApp'

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

async function afterRead(file, detail) {
	console.log('afterRead = ',file.file,detail)
	const formData = new FormData();
	formData.append('file', file.file);

	// 调用上传接口
	let key = 'watermark/' + new Date().getTime() + file.file.name
	try {
		let url = await upload(key, file.file)
		imageStore.addImage(url);
		file.remote_url = url
	} catch (error) {
		showToast('image upload failed');
		console.log(error);
	}
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
	if (appData.params_value && appData.params_value.ui) {
		appData.params_value.ui.body[key][key1] = []
	}
}

function find_prompt(paths,obj) {
	console.log('find_prompt = ',paths,obj)
	let path = paths.shift()
	console.log('find_prompt path = ',path)
	let ref_data = obj[path]
	console.log('find_prompt ref_data = ',ref_data)
	if (path == paths[paths.length - 1] || (ref_data && !(ref_data instanceof Object))){
		return  ref_data
	}
	return find_prompt(paths,ref_data)
}

function findWatermarkKey(obj) {
    const keys= [];

    function recurse(currentObj, parentKey) {
        if (typeof currentObj === 'object' && currentObj !== null) {
            for (let key in currentObj) {
                if (key === 'watermark' && currentObj[key]) {
                    keys.push(parentKey);
                } else if (typeof currentObj[key] === 'object') {
                    recurse(currentObj[key], key);
                }
            }
        }
    }

    recurse(obj, null);
    return keys;
}

const formSubmit = async () => {
	console.log(imageStore.uploadedImageUrl)
	let rawAppData = toRaw(appData.value)
	if (!rawAppData) {
		showToast("app config error")
		return
	}
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
		// console.log('rawAppData.params_value.ui[page_config.title] = ', rawAppData.params_value.ui[page_config_temp.title], page_config_temp)
		let main = rawAppData.params_value.ui[page_config_temp.title].main
		// let image_url = null
		// if (images && images.length) {
		// 	let img = images[0]
		// 	img = toRaw(img)
		// 	image_url = img.remote_url
		// }
		// if (!(image_url && image_url.length)) {
		// 	showToast('Please uplaod a photo')
		// 	return
		// }

		let find_data = main
		console.log("find_data = ",find_data)
		let keys = Object.keys(find_data)
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i]
			let temp =  findKey(rawAppData.template_params,key)
			console.log("formSubmit Object findKey = ",key,temp)
			if (temp.ui_type == 'upload' && temp.show != 'nodisplay') {
				if (!find_data[key] || !(find_data[key] && find_data[key].length)) {
					if (temp.toast && temp.toast.length) {
						showToast(temp.toast)
						return
					}
				}
			}
			if (!find_data[key] && temp.show != 'nodisplay') {
				if (temp.toast && temp.toast.length) {
					showToast(temp.toast)
					return
				}
			}
		}
		// let male = await male_or_famale()

		const aonet = new AI({
			app_key: rawAppData.id || import.meta.env.VITE_APPID,
		})
		let ui = rawAppData.params_value.ui
		console.log("ui = ",ui)
		
		let current_ai = rawAppData.params_value.ai
		let models = Object.keys(current_ai)
		console.log("models = ",models)
		let data = {}
		for (let i = 0; i < models.length; i++) {
			let model = models[i]
			data[model] = current_ai[model]
			let keys = Object.keys(data[model])
			console.log("keys = ",keys)
			for (let m = 0; m < keys.length; m++){
				let key = keys[m]
				console.log("key = ",key)
				let temp = data[model][key]
				console.log("temp = ",temp)
				if (temp && temp instanceof Object) {
					let key_data = null
					let ref_raw = temp['$ref']
					if (ref_raw) {
						if (ref_raw.indexOf("$") > -1) {
							key_data = eval(ref_raw)
						} else {
							let ref = ref_raw.split('/')
							console.log("ref = ",ref)
							let ref_data = find_prompt(ref,rawAppData.params_value)
							console.log("ref_data = ",ref_data)
							key_data = ref_data
							if (ref_data && ref_data.indexOf('$') > -1) {
								key_data = eval(ref_data)
							}
						} 
					}
					console.log("key_data = ",key_data)
					data[model][key] = key_data
				}
			}
		}

		showLoading.value = true

		console.log("formSubmit data", data)
		let price = 8
		update_run_count()
		let response = await aonet.prediction(models, data)
		console.log("test", response)
		showLoading.value = false
		let responseData = null
		if (response && response.code == 200 && response.data) {
			responseData = response.data[0]
		}
		if (responseData && responseData.result) {
			let url = responseData.result && responseData.result.length && responseData.result[0]
			console.log('responseData.result = ',responseData.result)
			goToComplete(url)
		} else {
			showLoading.value = false
			let message = response && response.message
			let msg = responseData && responseData.error
			let show = message || msg
			showToast(show || 'AI processing failed')
		}
	} catch (error) {
		showLoading.value = false
		// showToast('AI processing failed')
		console.log('formSubmit error = ', error)
		if (error && typeof error == 'string') {
			showToast(error);
		} else {
			showToast(error.message);
		}
	}

}

function selectTemplate(item) {
	console.log("selectTemplate = ", item)
	let rawAppData = toRaw(appData.value)
	if (!rawAppData) {
		return
	}
	let keys = needLoadData(rawAppData)
	let key = keys && keys.length && keys[0]
	

	let key_data = findKey(rawAppData.template_params,key)
	console.log("selectTemplate options = ",key_data)
	for (let i = 0; i < key_data.options.length; i++) {
		let loaction = key_data.options[i]
		loaction.selected = false
	}
	item.selected = true

	let data = findParentKey(rawAppData.params_value,key)
	console.log("selectTemplate findParentKey = ",data)

	let temp_selected_item = toRaw(item)
	let selected_item = JSON.parse(JSON.stringify(temp_selected_item))
	console.log("selectTemplate selected_item = ",selected_item)
	data[key] = selected_item

	if (!selected_item.value) {
		showToast('material data is error: value is null')
		return
	}
	let ui = rawAppData.params_value.ui
	console.log("ui = ",ui)
	let material_value = selected_item.value
	let material_value_keys = Object.keys(material_value)
	for (let i = 0; i < material_value_keys.length; i++) {
		let key = material_value_keys[i]
		console.log('selected_item[key] = ',key,typeof material_value[key],material_value[key])
		if (material_value[key] && typeof material_value[key] == 'string' && material_value[key].indexOf("${") > -1) {
			const regex = /\${(\w+)}/;
			const match = material_value[key].match(regex);
			material_value[key] = eval(material_value[key])
		}
		console.log('selected_item[key] 1111 = ',material_value[key])
	}
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
			temp = await user.login()
			closeToast();
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

function recursiveSortProperties(obj) {
  // Check if the current object has properties
  if (obj && typeof obj === 'object' && obj.hasOwnProperty('properties')) {
    // Step 1: Convert the properties object to an array of key-value pairs
    const entries = Object.entries(obj.properties);

    // Step 2: Sort the array based on the 'index' of each property
    const sortedEntries = entries.sort(([, a], [, b]) => (a['index'] || 0) - (b['index'] || 0));

    // Step 3: Convert the sorted array back into an object
    obj.properties = Object.fromEntries(sortedEntries);
  }

  // Recursively call the function on all nested objects
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
      recursiveSortProperties(obj[key]);
    }
  }
}

async function load() {
	let temp = await loadAppData(window.location.origin)
	recursiveSortProperties(temp.template_params.ui)
	let temp_ = JSON.parse(JSON.stringify({ ...temp }));
	console.log("index load = ", temp_)
	// temp = sortObjectByIndex(temp)
	// console.log("index load 1111 = ",JSON.stringify(temp))
	temp_ && temp_.template_params && temp_.template_params.ui && temp_.template_params.ui.pages && temp_.template_params.ui.pages.forEach(element => {
		console.log("index load 1111 = ", element)
		if (element && element.sort == 0) {
			page = element.title
			page_config.value = element
		}
	});
	appData.value = temp_
	let title = temp_ && temp_.params_value && temp_.params_value.ui && temp_.params_value.ui.head && temp_.params_value.ui.head.title
	document.title = title ? title : document.title
}


onMounted(() => {
	load()
	login()
})

</script>

<style scoped>
.custom-radio-group {
	display: flex;
	justify-content: flex-start;
	/* 确保 radio 组内项目从左对齐 */
}

.custom-radio {
	display: flex;
	align-items: center;
	/* 确保 radio 和文字在垂直方向居中 */
	justify-content: flex-start;
	/* 确保内容在水平方向左对齐 */
	margin-right: 16px;
	/* 添加间距 */
	flex: none;
	/* 防止 radio 项目拉伸 */
}

.custom-radio .van-radio__icon--checked .van-icon {
	background-color: #000;
	border-color: #000;
}

.custom-radio .van-radio__label {
	text-align: left;
	/* 强制标签文本左对齐 */
	color: #fff !important;
}

.uni-form-item .title {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 4.27vw;
	color: #fff;
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
	min-height: 14.93vw;
	background: #3B3939;
	border-radius: 1.07vw;
	display: flex;
	align-items: center;
	padding: 0 3.2vw;
	box-sizing: border-box;

}

.uni-form-item .banner {
	width: 100%;
	height: 27.73vw;
	margin-top: 2.13vw;
	/* margin-bottom: 8.53vw; */
	position: relative;
	padding: 4.27vw;
	background: transparent;
}

.uni-form-item .banner img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.uni-form-item .banner p {
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

.uni-form-item .banner p:last-child {
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

.uploadCon {
	min-height: 38.67vw;
	display: flex;
	background: #554F4F;
	flex-direction: column;
	justify-content: center;
}

.uploadCon .upload {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.upload-before {
	width: 100%;
	display: flex;
	align-items: center;
}

.upload-before text {
	color: #fff;
	font-size: 3.73vw;
	font-family: Roboto-Regular;
}

.upload-done {
	justify-content: space-between;
	position: relative;
}

.uploadIcon {
	width: 8.53vw;
	height: 8.53vw;
	margin-right: 2.4vw;
}

.upload-res {
	width: 100%;
	height: 29.87vw;
	object-fit: cover;
}

.deleteIcon {
	height: 5.07vw;
	width: 5.07vw;
	position: absolute;
	right: 2.13vw;
	top: 2.13vw;
}


.bottom_btn .spendCount {
	width: 19.2vw;
	height: 9.07vw;
	background: #3B3939;
	border-radius: 1.07vw;
	display: flex;
	z-index: 9;
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
	background: linear-gradient(117deg, #43E8A0 0%, #36CFC9 100%);
	box-shadow: 2.13vw 2.13vw 4.27vw .27vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;
	display: flex;
	justify-content: center;
	align-items: center;
}

.bottom_btn .submitBtn text {
	font-family: Roboto-Black;
	font-size: 4.27vw;
	font-weight: bold;
	color: #1C1C20;
}

.bottom_btn .submitBtn_disabled {
	background: #434343;

}

.templateCon {
	height: auto;
	background: transparent;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	/* column-count: 2;
	column-gap: 6.4vw; */
}

.template_item {
	/* width: 100%; */
	height: auto;
	width: 40vw;
	/* min-height: 38.67vw; */
	border-radius: 1.07vw;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	z-index: 0;
	display: flex;
	flex-direction: column;
	align-items: center;

	break-inside: avoid;
	overflow: hidden;
	margin-bottom: 6.4vw;
}

.template_item .imgCon {
	width: 100%;
	height: 100%;
}

.template_item .imgCon img {
	display: inline-block;
	height: 100%;
	min-height: 29.87vw;
	width: 100%;
	object-fit: cover;
}

.template_item .text {
	width: 100%;
	height: 8.53vw;
	line-height: 8.53vw;
	background: #3B3939;
	justify-content: flex-start;
	align-items: center;
	font-size: 3.2vw;
	font-family: Roboto-Bold;
	color: #FFFFFF;
	padding: 0 2.13vw;

	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.templateActive {
	border: .27vw solid #2EE9D0;
	color: #1C1C1C;
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

.template_item .active {
	background: #2EE9D0;
	color: #1C1C1C;
}
</style>
