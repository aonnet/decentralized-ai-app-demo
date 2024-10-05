<template>
	<div class="user">

		<div class="container complete">
			<div>
                <input v-model="email" />
                <input v-model="password" />
                <button @click="login_email" >login</button>
			</div>
            <div>
				<text class="back" @click="loginTwitter">Twitter</text>
			</div>
            <div>
				<text class="back" @click="login">匿名</text>
			</div>
            <div>
				<text class="back" @click="loginGithub">Link Github</text>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
} from 'vue';
import { useRoute,useRouter } from 'vue-router'
import {User} from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';


const router = useRouter()

const email = ref('')
const password = ref('')

const goBack = () => {
	router.back();
}

const login = async () => {
    let user = new User()
    let login_user = await user.login()
}

const login_email = async () => {
    let user = new User()
    let login_user = await user.email_login(email.value,password.value)
}

const loginTwitter = async () => {
    let user = new User()
    let login_user = await user.third_party_login('twitter')
}

const loginGithub = async () => {
    let user = new User()
    let login_user = await user.third_party_login('github')
}

</script>

<style scoped>
.complete {
	padding-top: 4.27vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.back {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 3.2vw;
	color: #ffffff;
	text-align: left;
	font-style: normal;
	text-decoration-line: underline;
	text-transform: none;
}

.completeIcon {
	width: 67.2vw;
	height: 49.6vw;
	margin: 0 auto;
	margin-top: 16.53vw;
	margin-bottom: 18.13vw;
}

.p1 {
	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 6.4vw;
	color: #000000;
	line-height: 9.07vw;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-bottom: 4.27vw;
}

.p2 {

	font-family: Roboto-Regular;
	font-weight: 400;
	font-size: 3.2vw;
	color: #000000;
	line-height: 4.8vw;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

button {
	width: 65.07vw;
	height: 9.07vw;
	line-height: 9.07vw;
	background: #2F54EB;
	box-shadow: 1.07vw 1.07vw 2.13vw .13vw rgba(47, 84, 235, 0.32);
	border-radius: 1.07vw;

	font-family: Roboto-Black;
	font-weight: 900;
	font-size: 3.73vw;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
	text-transform: none;
	margin: 0 auto;
	margin-top: 14.4vw;
	border: none;
}

@media screen and (min-width: 1024px) {
	.complete {
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.back {
    font-family: Roboto-Bold;
    font-weight: bold;
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-decoration-line: underline;
    text-transform: none;
}

.completeIcon {
    width: 252px;
    height: 186px;
    margin: 0 auto;
    margin-top: 61px;
    margin-bottom: 67px;
}

.p1 {
    font-family: Roboto-Black;
    font-weight: 900;
    font-size: 24px;
    color: #000000;
    line-height: 34px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 16px;
}

.p2 {
    font-family: Roboto-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

button {
    width: 243px;
    height: 34px;
    line-height: 34px;
    background: #2F54EB;
    box-shadow: 4px 4px 8px rgba(47, 84, 235, 0.32);
    border-radius: 4px;

    font-family: Roboto-Black;
    font-weight: 900;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    font-style: normal;
    text-transform: none;
    margin: 0 auto;
    margin-top: 54px;
    border: none;
}
}
</style>
