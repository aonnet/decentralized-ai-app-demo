<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
import { useRoute, useRouter } from 'vue-router'
import {
	ref,
	onMounted,
	watch,
	nextTick
} from 'vue';
import QRCode from 'qrcode';

const show_header = ref(true)
const route = useRoute()
const canvasRef = ref('')
const is_pc = ref(false)
const pages = ref([
	'/ledger',
	'/task-center',
	'/link',
	'/link-email',
	'/link-error',
	'/link-telegram',
	'/setting',
	'/asset',
])

const generateQRCode = (data, canvas) => {
	data && QRCode.toCanvas(canvas, data, (error) => {
		if (error) console.error(error);
	});
};
watch(
	() => route.path, // 获取当前路由的 path
	(newPath, oldPath) => {
		console.log('Route changed from', oldPath, 'to', newPath);
		show_header.value = true
		if (pages.value.indexOf(newPath) > -1) {
			show_header.value = false
		}
	}
);

onMounted(() => {
	if (window.innerWidth <= 1024) {
		is_pc.value = false
	} else {
		is_pc.value = true
	}
	window.addEventListener('resize', () => {
		if (window.innerWidth <= 1024) {
			is_pc.value = false
		} else {
			is_pc.value = true
		}
	});

	nextTick(() => {
		const code_url = window.location.href;
		console.log(code_url)
		generateQRCode(code_url, canvasRef.value)
	})
});
</script>

<template>
	<div class="h5" v-if="!is_pc">
		<Header v-if="show_header"></Header>

		<RouterView />
	</div>

	<div class="pc" v-else>
		<div class="preview">
			<div class="preview_content">
				<div class="group_4 qr flex-col align-center">
					<div class="section_1 flex-row justify-between">
						<img class="label_2" referrerpolicy="no-referrer" src="./assets/images/logo.png" />
						<span class="text_3">iAON</span>
					</div>
					<div class="image-text_5 flex-col justify-between align-center">
						<canvas class="qrcode-canvas" ref="canvasRef"></canvas>
						<span class="text-group_5">Scan the QR code with your phone for a better user
							experience<br /><br /></span>
					</div>
				</div>

				<div class="app_content">
					<Header v-if="show_header"></Header>

					<RouterView />
				</div>

			</div>

			<div class="border-line"></div>
		</div>

	</div>
</template>

<style lang="scss">
.pc {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-top: 80px;

	.preview {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;


		.preview_content {
			width: 416px;
			height: 692px;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(161, 161, 161, 0.6) 100%);
			border-radius: 32px 32px 32px 32px;
			border: 1px solid #7F7F7F;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.group_4 {
				position: absolute;
				left: -240px;
				width: 200px;
				height: 360px;
				background: linear-gradient(139deg, #1F1F1F 0%, #575757 100%);
				border-radius: 24px 24px 24px 24px;
				border: 1px solid #2DFBFF;

				.section_1 {
					width: 114px;
					height: 40px;
					margin-top: 18px;

					.label_2 {
						width: 40px;
						height: 40px;
					}

					.text_3 {
						width: 62px;
						height: 28px;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 24px;
						font-family: Sansation-Bold;
						font-weight: 700;
						text-align: left;
						white-space: nowrap;
						line-height: 28px;
						margin-top: 6px;
					}
				}

				.image-text_5 {
					width: 160px;
					height: 238px;
					margin-top: 25px;

					.qrcode-canvas {
						border-radius: 8px;
						height: 160px !important;
						width: 160px !important;
					}

					.text-group_5 {
						width: 160px;
						height: 68px;
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 14px;
						font-family: Open Sans Hebrew-Regular;
						font-weight: normal;
						text-align: center;
						line-height: 22px;
						margin-top: 10px;
					}
				}
			}

			.qr {
				position: absolute;
				left: -240px;
				width: 200px;
				height: 360px;
				background: linear-gradient(139deg, #1F1F1F 0%, #575757 100%);
				border-radius: 24px 24px 24px 24px;
				border: 1px solid #2DFBFF;
			}

			.app_content {
				width: 376px;
				height: 640px;
				background: #141414;
				border-radius: 16px 16px 16px 16px;
				border: 1px solid #B9B9B9;
				overflow: scroll;
			}

			.app_content::-webkit-scrollbar {
				width: 8px;
			}

			.app_content::-webkit-scrollbar-thumb {
				background-color: #D8D8D8;
				border-radius: 4px;
			}
		}

		.border-line {
			width: 188px;
			height: 4px;
			background: #000000;
			border-radius: 6px 6px 6px 6px;
			position: absolute;
			bottom: 12px;
		}
	}
}

.container {
	padding: 0 6.4vw 18.4vw;
	margin: 0;
}

.bottom_btn {
	width: 100%;
	position: fixed;
	/* bottom: 4.27vw; */
	bottom: 0;
	left: 0;
	padding: 2.67vw 6.4vw;
	height: 13.87vw;
	background: #1C1C1C;
	box-shadow: 0px -1.07vw 4.27vw .27vw rgba(87, 87, 87, 0.18);
	box-sizing: border-box;
	z-index: 9;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.bottom_btn uni-button {
	margin: 0;
}

button {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	border: none;
}

.uni-form-item .van-uploader__wrapper,
.uni-form-item .van-uploader__input-wrapper {
	width: 100%;
	height: 100%;
}

.uni-form-item .content input {
	width: 100%;
	height: 100%;
	font-size: 3.73vw;
	font-family: Roboto-Regular;
	border: none;
	outline: none;
	background-color: transparent;
}

.uni-form-item .content .van-cell {
	padding-left: 0;
	padding-right: 0;
}

.uni-form-item .content .van-field {
	width: 100%;
	height: 100%;

	font-family: Roboto-Regular;
	border: none;
	outline: none;
	background-color: transparent;
}

.uni-form-item .content .van-cell__value {
	color: #fff;
	font-size: 3.73vw;
}

.uni-form-item .content .van-cell__value .van-field__control {
	color: #fff;
}

.uni-form-item .content .van-dropdown-menu .van-dropdown-menu__bar {
	height: 14.93vw;
}

.uni-form-item .content .van-dropdown-menu {
	width: 100%;
}

.uni-form-item .content .van-dropdown-menu__bar {
	background: transparent;
}

.uni-form-item .content .van-dropdown-menu__title {
	width: 100%;
	color: #fff;
}

.uni-form-item .content .van-dropdown-menu__title:after {
	right: 0;
}

.uni-form-item .content .van-dropdown-item__content {
	background: #1C1C1C;
	padding: 0 6.4vw;
	left: 50%;
	transform: translateX(-50%);
}

.uni-form-item .content .van-dropdown-item__option {
	background-color: #554F4F;
	padding-left: 3.2vw;
	padding-right: 3.2vw;
	color: #BFBFBF;
}

.uni-form-item .content .van-dropdown-item__option--active {
	color: #fff;
}

.uni-form-item .content .van-picker {
	background: #554F4F;
}

.uni-form-item .content .van-picker__confirm,
.van-picker-column__item {
	color: #fff;
}

.uni-form-item .content .van-picker__mask {
	background-image: none;
}

.uni-form-item .content .van-hairline-unset--top-bottom:after {
	border: none;
	box-shadow: 0px -5px 16px 2px rgba(237, 233, 233, 0.28);
}

.uni-form-item .content .van-cell:after {
	border: none;
}

.van-uploader {
	width: 100%;
}

.content .van-uploader__file {
	width: 100%;
	max-width: 90.67vw;
}

.content .van-uploader__file {
	background: transparent;
	color: #fff;
}

.content .van-uploader__file-icon,
.content .van-uploader__file-name {
	color: #fff;
	max-width: 77.33vw;
}

.uni-form-item .van-tabs__wrap {
	margin-bottom: 6.4vw;
}

.uni-form-item .van-tabs__nav {
	background: transparent;
}

.uni-form-item .van-tab--active {
	color: #36CFC9;
}

.uni-form-item .van-tabs__line {
	/* background: #36CFC9; */
	/* width: 100%; */
	display: none;
	transform: translateX(85px) translateX(-50%);
	transition-duration: 0.3s;
}

input:-internal-autofill-selected {
	background-color: #3B3939 !important;
}

.van-tab__text--ellipsis {
	padding-bottom: 2.67vw;
	border-bottom: .53vw solid transparent;

	font-family: Roboto-Regular;
	font-weight: 400;
	font-size: 3.73vw;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
	text-transform: none;

}

.van-tab--active .van-tab__text--ellipsis {
	width: 100%;
	text-align: center;
	border-bottom: .53vw solid #36CFC9;
	font-family: Roboto-Bold;
	color: #36CFC9;
}

.tab-con .van-tab--active .van-tab__text--ellipsis {
	width: 100%;
	text-align: center;
	border-bottom: .53vw solid #43E8A0;
	font-family: Roboto-Bold;
	color: #fff;
}

input::placeholder {
	color: #fff !important;
}

.el-select__wrapper {
	background-color: transparent;
	box-shadow: none;
	height: 14.93vw;
	padding: 0;
}

.el-select__wrapper.is-focused,
.el-select__wrapper.is-hovering:not(.is-focused) {
	box-shadow: none;
}

.el-select__caret,
.el-select__placeholder,
.el-select-dropdown__item {
	color: #fff;
	;
}

.el-popper.is-light,
.el-popper.is-light>.el-popper__arrow:before {
	background: #3B3939;
	border: none;
}

.el-select-dropdown__item.is-selected {
	color: #36CFC9;
}

.el-select-dropdown__item.is-hovering {
	background-color: transparent;
}


@media screen and (min-width: 1024px) {
	.container {
		padding: 0 24px;
		margin: 0;
	}

	.bottom_btn {
		width: 100%;
		position: sticky;
		bottom: 0;
		left: 0;
		padding: 9px 12px;
		height: 50px;
		background: #1C1C1C;
		box-shadow: 0px -3px 3px 1px rgba(87, 87, 87, 0.28);
	}

	.bottom_btn uni-button {
		margin: 0;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		border: none;
	}

	.uni-form-item .van-uploader__wrapper,
	.uni-form-item .van-uploader__input-wrapper {
		width: 100%;
		height: 100%;
	}

	.uni-form-item .content input {
		width: 100%;
		height: 100%;
		font-size: 14px;
		font-family: Roboto-Regular;
		border: none;
		outline: none;
		background-color: transparent;
	}

	.uni-form-item .content .van-cell {
		padding-left: 0;
		padding-right: 0;
	}

	.uni-form-item .content .van-field {
		width: 100%;
		height: 100%;
		font-family: Roboto-Regular;
		border: none;
		outline: none;
		background-color: transparent;
	}

	.uni-form-item .content .van-cell__value {
		color: #fff;
		font-size: 14px;
	}

	.uni-form-item .content .van-cell__value .van-field__control {
		color: #fff;
	}

	.uni-form-item .content .van-dropdown-menu .van-dropdown-menu__bar {
		height: 56px;
	}

	.uni-form-item .content .van-dropdown-menu {
		width: 100%;
	}

	.uni-form-item .content .van-dropdown-menu__bar {
		background: transparent;
	}

	.uni-form-item .content .van-dropdown-menu__title {
		width: 100%;
		color: #fff;
	}

	.uni-form-item .content .van-dropdown-menu__title:after {
		right: 0;
	}

	.uni-form-item .content .van-dropdown-item__content {
		background: #1C1C1C;
		padding: 0 24px;
		left: 50%;
		transform: translateX(-50%);
	}

	.uni-form-item .content .van-dropdown-item__option {
		background-color: #554F4F;
		padding-left: 12px;
		padding-right: 12px;
		color: #BFBFBF;
	}

	.uni-form-item .content .van-dropdown-item__option--active {
		color: #fff;
	}

	.uni-form-item .content .van-picker {
		background: #554F4F;
	}

	.uni-form-item .content .van-picker__confirm,
	.van-picker-column__item {
		color: #fff;
	}

	.uni-form-item .content .van-picker__mask {
		background-image: none;
	}

	.uni-form-item .content .van-hairline-unset--top-bottom:after {
		border: none;
		box-shadow: 0px -5px 16px 2px rgba(237, 233, 233, 0.28);
	}

	.uni-form-item .content .van-cell:after {
		border: none;
	}

	.van-uploader {
		width: 100%;
	}

	.content .van-uploader__file {
		width: 100%;
		max-width: 340px;
		background: transparent;
		color: #fff;
	}

	.content .van-uploader__file-icon,
	.content .van-uploader__file-name {
		color: #fff;
		max-width: 290px;
	}

	.uni-form-item .van-tabs__wrap {
		margin-bottom: 24px;
	}

	.van-tab__text--ellipsis {
		padding-bottom: 10px;
		border-bottom: 2px solid transparent;
		font-size: 14px;

	}

	.van-tab--active .van-tab__text--ellipsis {
		border-bottom: 2px solid #36CFC9;
	}

	.tab-con .van-tab--active .van-tab__text--ellipsis {
		border-bottom: 2px solid #43E8A0;
	}

	.el-select__wrapper {
		height: 48px;
	}
}
</style>
