<template>
	<div class="page flex-col">
		<div class="block_1 flex-row justify-between">
			<img
				class="label_1"
				referrerpolicy="no-referrer"
				src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGd1824a8f6f10d8ca55d129f60ff453cc.png"
				@click="back"
			/>
			<span class="paragraph_1">Account&nbsp;Binding<br /></span>
	  </div>
	  <div class="list_1 flex-col">
		<div
		  class="list-items_1 flex-row justify-between"
		  v-for="(item, index) in loopData0"
		  :key="index"
		>
		  <div class="group_1 flex-col justify-between">
			<div class="box_1 flex-row justify-between">
			  <img
				class="thumbnail_1"
				referrerpolicy="no-referrer"
				:src="item.lanhuimage0"
			  />
			  <span class="text_1" v-html="item.lanhutext0"></span>
			</div>
			<span class="text_2" v-html="item.lanhutext1"></span>
		  </div>
		  <div v-if="!item.linked" class="image-wrapper_1 flex-col" @click="deal_link(item)">
			<img
			  class="thumbnail_2"
			  referrerpolicy="no-referrer"
			  :src="item.lanhuimage1"
			/>
		  </div>
		  <div v-if="item.linked && item.can_unlink" class="image-wrapper_1 flex-col" @click="un_link(item)">
			<img
				class="thumbnail_4"
				referrerpolicy="no-referrer"
				src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG9036c241f9a4240910858f45e9c8a466.png"
			/>
        </div>
		</div>
	  </div>
	  <div class="box_13 flex-col" v-if="unlink_tip">
		<div class="image-wrapper_6 flex-col">
			<img
			class="label_2"
			referrerpolicy="no-referrer"
			src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGfcb7da88295a8f24b92cc26946bc1a01.png"
			@click="close_unlink_tip"
			/>
		</div>
		<div class="box_14 flex-col">
			<span class="text_11"
			>Unbind&nbsp;the&nbsp;current&nbsp;account,&nbsp;your&nbsp;login&nbsp;may&nbsp;be&nbsp;affected.&nbsp;Are&nbsp;you&nbsp;sure&nbsp;to&nbsp;unbind&nbsp;it?</span
			>
			<div class="block_1 flex-row justify-between">
			<div class="text-wrapper_1 flex-col">
				<span class="text_12" @click="deal_unlink" >Unbind</span>
			</div>
			<div class="text-wrapper_2 flex-col">
				<span class="text_13" @click="close_unlink_tip">cancel</span>
			</div>
			</div>
			<div class="block_2 flex-col"><div class="group_4 flex-col"></div></div>
		</div>
    </div>
	</div>
  </template>

<script setup>
import {
	ref,
	onMounted,
  toRaw
} from 'vue';
import { useRoute,useRouter } from 'vue-router'
import {User} from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';
import { save_session } from '../lib/loadApp'


let loopData0 = ref([
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGa5f238757284a4f1c4c819413220ad6a.png',
          lanhutext0: 'Email',
          lanhutext1: 'Not&nbsp;yet&nbsp;bound',
          lanhuimage1:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG857e3449d143e485f2c2d94d8084e4a3.png',
		  type:'email'
        },
        // {
        //   lanhuimage0:
        //     'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG09dbb60f986fdcea6d507e76e5fa80ec.png',
        //   lanhutext0: 'phone&nbsp;number',
        //   lanhutext1: 'Not&nbsp;yet&nbsp;bound',
        //   lanhuimage1:
        //     'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG857e3449d143e485f2c2d94d8084e4a3.png',
        // },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG15a83e917caa56cfcceac2c3e287c4f4.png',
          lanhutext0: 'Github',
          lanhutext1: 'Not&nbsp;yet&nbsp;bound',
          lanhuimage1:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG857e3449d143e485f2c2d94d8084e4a3.png',
			type:'github',
			can_unlink:true,
			linked:false,
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG7d980bf0de2e93dfc13e9f9cf1991d89.png',
          lanhutext0: 'Twitter',
          lanhutext1: 'Not&nbsp;yet&nbsp;bound',
          lanhuimage1:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG857e3449d143e485f2c2d94d8084e4a3.png',
			type:'twitter',
			can_unlink:true,
			linked:false,
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGcc32a587c0fa0c050777e7430faf8621.png',
          lanhutext0: 'Telegram',
          lanhutext1: 'Not&nbsp;yet&nbsp;bound',
          lanhuimage1:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG857e3449d143e485f2c2d94d8084e4a3.png',
			type:'telegram',
			can_unlink:false,
			linked:false,
        },
      ])


const router = useRouter()
const route = useRoute()

const unlink_tip = ref(false)
let select_item = null

let userinfo = null



const back = () => {
	router.back();
}

const close_unlink_tip = () => {
	select_item = null
	unlink_tip.value = false
}

const un_link = (item) => {
	console.log('deal_link = ',item)
	unlink_tip.value = true
	select_item = item
}

const deal_unlink = async () => {
	if (!select_item) {
		unlink_tip.value = false
		return
	}
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});
	if (select_item.type == 'twitter') {
		try {
			// let id = userinfo.identities.find(e => e.provider == 'twitter')
			await unlinkTwitter()
			await get_userInfo()
			unlink_tip.value = false
		} catch (error) {
			showToast(error.message)
		}
	}
	// if (item.type == 'telegram') {
	// 	linkTelegram()
	// }
	if (select_item.type == 'github') {
		try {
			// let id = userinfo.identities.find(e => e.provider == 'github')
			await unlinkGithub()
			await get_userInfo()
			unlink_tip.value = false
		} catch (error) {
			showToast(error.message)
		}
	}
	closeToast()
}

const deal_link = async (item) => {
	console.log('deal_link = ',item)
	if (item.type == 'email') {
		linkEmail()
		return
	}
	showLoadingToast({
		duration: 0,
		forbidClick: true,
		message: 'Loading...',
	});

	if (item.type == 'twitter') {
		await linkTwitter()
	}
	if (item.type == 'telegram') {
		await linkTelegram()
	}
	if (item.type == 'github') {
		await linkGithub()
	}
	closeToast()
}

const linkEmail = () => {
    router.push({
		path: '/link-email'
	})
}

const linkTwitter = async () => {
    try {
        let user = new User()  
		let link = await user.islinkTwitter()
        if (link){
            showToast('Twitter already link')
            return
        }
        // let sb_api_auth_token = localStorage.getItem('sb-api-auth-token')
	      // localStorage.setItem('sb_api_auth_token_backup',sb_api_auth_token)
        let data = await user.linkTwitter(window.location.href)
        console.log('linkTwitter data = ',data)
		// get_userInfo()
    } catch (error) {
        console.log('linkTwitter error = ',error)
        showToast(error.message || 'linkTwitter error')
    }
}

const unlinkTwitter = async () => {
    try {
        let user = new User()  
        let data = await user.unlinkTwitter()
        console.log('unlinkTwitter data = ',data)
		get_userInfo()
    } catch (error) {
        console.log('unlinkTwitter error = ',error)
        showToast(error.message || 'unlinkTwitter error')
    }
}

const linkTelegram = async () => {
    try {
        let user = new User()  
		let link = await user.islinkTelegram()
        if (link){
            showToast('Telegram already link')
            return
        }
		if (user.isTelegramMiniAPP()) {
			let data = await user.linkTelegramMiniAPP()
			console.log('linkTelegram data = ',data)
		} else {
			let data = await user.linkTelegram(window.location.href)
			console.log('linkTelegram data = ',data)
		}
		get_userInfo()
    } catch (error) {
        console.log('linkTelegram error = ',error)
        showToast(error.message || 'linkTelegram error')
    }

    // let session = await get_session()
    // if (!(session && session.access_token && session.access_token.length)) {
	// 	showToast('Please login first')
	// 	return
	// }
    // console.log('linkTelegram =',window.location)
    // let url = 'https://ai.ubeibi.com/telegram.html?data=' + session.access_token + '&redirectTo=' + window.location.href 
    // const encodedUrl = encodeURI(url);
    // window.location.href = encodedUrl
    // window.open("https://ai.ubeibi.com" + '/telegram.html',"_blank")
    // router.push({
	// 	path: '/link-telegram'
	// })
}



const unlinkGithub = async () => {
    try {
        let user = new User()  
        let data = await user.unlinkGithub()
        console.log('unlinkGithub data = ',data)
		// get_userInfo()
    } catch (error) {
        console.log('unlinkGithub error = ',error)
        showToast(error.message || 'unlinkGithub error')
    }
}

const linkGithub = async () => {
    try {
        let user = new User()  
		let link = await user.islinkGithub()
        if (link){
            showToast('Github already link')
            return
        }
        // let sb_api_auth_token = localStorage.getItem('sb-api-auth-token')
	      // localStorage.setItem('sb_api_auth_token_backup',sb_api_auth_token)
        let data = await user.linkGithub(window.location.href)
        console.log('linkGithub data = ',data)
		get_userInfo()
    } catch (error) {
        console.log('linkGithub error = ',error)
        showToast(error.message || 'linkGithub error')
    }
}

const get_userInfo = async () => {
	let user = new User()  
	let login_user = await user.userinfo()
	console.log('get_userInfo =',login_user,loopData0)
	userinfo = login_user
	
	for (let i = 0; i < loopData0.value.length; i++) {
		let item = loopData0.value[i]
		if (item.type == 'telegram') {
			let link = await user.islinkTelegram()
			if (link) {
				item.linked = link
				link.lastName = (link.lastName && link.lastName.length) ? link.lastName : ''
				item.lanhutext1 = link.username || (link.lastName + ' ' + link.firstName)
			} else {
				item.linked = false
				item.lanhutext1 = 'Not&nbsp;yet&nbsp;bound'
			}		
			continue
		}
		let find = login_user.identities.find(e => e.provider == item.type)
		console.log('find =',find)
		if (find) {
			item.lanhutext1 = find.email || find.phone
			item.linked = true
		} else {
			item.linked = false
			item.lanhutext1 = 'Not&nbsp;yet&nbsp;bound'
		}
	}
	let temp = toRaw(loopData0.value)
	console.log('get_userInfo = temp',temp)
	if (temp && temp.length) {
		localStorage.setItem('loopData0',JSON.stringify(temp))
	}
}

onMounted(async () => {
	let temp = localStorage.getItem('loopData0')
	console.log('onMounted loopData0 =',temp)
	if (temp && temp.length) {
		temp = JSON.parse(temp)
		loopData0.value = temp
	}
  // let sb_api_auth_token_backup = localStorage.getItem('sb_api_auth_token_backup')
  // let sb_api_auth_token = localStorage.getItem('sb-api-auth-token')

	// if (sb_api_auth_token_backup && !sb_api_auth_token) {
	// 	let session = JSON.parse(sb_api_auth_token_backup)
	// 	await save_session(session)
	// }
  // if (sb_api_auth_token_backup) {
	// 	localStorage.removeItem('sb_api_auth_token_backup')
	// }
	get_userInfo()
	let error_code = route.query.error_code;
  let error_description = route.query.error_description;
	if (error_description && error_description.length && error_description.indexOf('+') > -1) {
		error_description = decodeURIComponent(error_description && error_description.replace(/\+/g, ' '));
	} 
  else if (error_code == 421) {
    error_description = 'Current user has already link Telegram'
	} else if (error_code == 423) {
    error_description = 'Telegram account already been used'
	}
  if (error_description && error_description.length) {
		showToast(error_description)
	}
})



</script>

<style scoped>
.page {
  background-color: rgba(20, 20, 20, 1);
  position: relative;
  width: 100vw;
  height: 195.74vw;
  overflow: hidden;
  .block_1 {
    width: 80vw;
    height: 7.47vw;
    margin: 2.13vw 0 0 4.8vw;
    .label_1 {
      width: 7.47vw;
      height: 7.47vw;
    }
    .paragraph_1 {
      width: 69.34vw;
      height: 7.47vw;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 5.33vw;
      font-family: Roboto Flex-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 7.47vw;
    }
  }
  .list_1 {
    width: 90.67vw;
    height: 101.87vw;
    justify-content: space-between;
    margin: 8.53vw 0 75.73vw 4.8vw;
    .list-items_1 {
      width: 90.67vw;
      height: 18.67vw;
      border: 1px solid rgba(41, 41, 41, 1);
      margin-bottom: 2.14vw;
      .group_1 {
        width: 68.8vw;
        height: 14.4vw;
        margin: 2.13vw 0 0 4.8vw;
        .box_1 {
          width: 17.6vw;
          height: 6.4vw;
          .thumbnail_1 {
            width: 4.27vw;
            height: 4.27vw;
            margin-top: 1.07vw;
          }
          .text_1 {
            width: 29.87vw;
            height: 6.4vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 4.26vw;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: left;
            white-space: nowrap;
            line-height: 6.4vw;
          }
        }
        .text_2 {
          width: 68.8vw;
          height: 5.87vw;
          overflow-wrap: break-word;
          color: rgba(141, 141, 141, 1);
          font-size: 3.73vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: left;
          white-space: nowrap;
          line-height: 5.87vw;
          margin-top: 2.14vw;
        }
      }
      .image-wrapper_1 {
        background-image: linear-gradient(
          270deg,
          rgba(67, 232, 160, 1) 0,
          rgba(138, 242, 95, 1) 100%
        );
        height: 6.4vw;
        width: 6.4vw;
        margin: 6.13vw 4.8vw 0 0;
		border-radius: 50%;
        .thumbnail_2 {
          width: 4.27vw;
          height: 4.27vw;
          margin: 1.06vw 0 0 1.06vw;
        }
		.thumbnail_4 {
          width: 4.27vw;
          height: 4.27vw;
          margin: 1.06vw 0 0 1.06vw;
        }
      }
    }
  }
  .box_13 {
    background-color: rgba(20, 20, 20, 0.96);
    height: 195.74vw;
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0;
    .image-wrapper_6 {
      width: 100vw;
      height: 55.2vw;
      .label_2 {
        width: 6.4vw;
        height: 6.4vw;
        margin: 45.33vw 0 0 88.53vw;
      }
    }
    .box_14 {
      background-image: linear-gradient(
        180deg,
        rgba(61, 61, 61, 1) 0,
        rgba(31, 31, 31, 0) 100%
      );
      position: absolute;
      left: 5.34vw;
      top: 54.94vw;
      width: 89.6vw;
      height: 62.4vw;
      border: 1px solid rgba(112, 112, 112, 1);
      .text_11 {
        width: 76.8vw;
        height: 17.6vw;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 3.73vw;
        font-family: Roboto Flex-Regular;
        font-weight: normal;
        text-align: left;
        line-height: 5.87vw;
        margin: 21.33vw 0 0 6.4vw;
      }
      .block_1 {
        width: 77.07vw;
        height: 8.54vw;
        margin: 8.53vw 0 6.4vw 6.4vw;
        .text-wrapper_1 {
          background-image: linear-gradient(
            270deg,
            rgba(62, 62, 62, 1) 0,
            rgba(120, 120, 120, 1) 100%
          );
          border-radius: 32px;
          height: 8.54vw;
          border: 1px gradient;
          width: 28.8vw;
          .text_12 {
            width: 14.4vw;
            height: 6.4vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 4.26vw;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            line-height: 6.4vw;
            margin: 1.06vw 0 0 7.2vw;
          }
        }
        .text-wrapper_2 {
          background-image: linear-gradient(
            270deg,
            rgba(67, 232, 160, 1) 0,
            rgba(138, 242, 95, 1) 100%
          );
          border-radius: 32px;
          height: 8.54vw;
          border: 1px solid rgba(20, 20, 20, 1);
          width: 42.94vw;
          .text_13 {
            width: 13.87vw;
            height: 6.4vw;
            overflow-wrap: break-word;
            color: rgba(20, 20, 20, 1);
            font-size: 4.26vw;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            line-height: 6.4vw;
            margin: 1.06vw 0 0 14.66vw;
          }
        }
      }
      .block_2 {
        height: 32.27vw;
        background: url(https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG358277c07c45ba9c76629924ae3e3da2.png)
          100% no-repeat;
        background-size: 100% 100%;
        width: 32vw;
        position: absolute;
        left: 29.07vw;
        top: -16vw;
        .group_4 {
          width: 32vw;
          height: 32vw;
        }
      }
    }
  }
}

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
  .page {
  background-color: rgba(20, 20, 20, 1);
  position: relative;
  width: 375px;
  height: 734.775px;
  overflow: hidden;

  .block_1 {
    width: 300px;
    height: 28.0525px;
    margin: 7.9875px 0 0 18px;

    .label_1 {
      width: 28.0525px;
      height: 28.0525px;
    }

    .paragraph_1 {
      width: 260.175px;
      height: 28.0525px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 20.4975px;
      font-family: Roboto Flex-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 28.0525px;
    }
  }

  .list_1 {
    width: 340.125px;
    height: 382.3025px;
    justify-content: space-between;
    margin: 32.1125px 0 284.2375px 18px;

    .list-items_1 {
      width: 340.125px;
      height: 70.125px;
      border: 1px solid rgba(41, 41, 41, 1);
      margin-bottom: 8.025px;

      .group_1 {
        width: 258.5px;
        height: 54px;
        margin: 7.9875px 0 0 18px;

        .box_1 {
          width: 66px;
          height: 24px;

          .thumbnail_1 {
            width: 16.0125px;
            height: 16.0125px;
            margin-top: 4.0125px;
          }

          .text_1 {
            width: 112.3875px;
            height: 24px;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 15.975px;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: left;
            white-space: nowrap;
            line-height: 24px;
          }
        }

        .text_2 {
          width: 258.5px;
          height: 22.0125px;
          overflow-wrap: break-word;
          color: rgba(141, 141, 141, 1);
          font-size: 13.9875px;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: left;
          white-space: nowrap;
          line-height: 22.0125px;
          margin-top: 7.9875px;
        }
      }

      .image-wrapper_1 {
        background-image: linear-gradient(
          270deg,
          rgba(67, 232, 160, 1) 0,
          rgba(138, 242, 95, 1) 100%
        );
        height: 24px;
        width: 24px;
        margin: 22.9625px 18px 0 0;
        border-radius: 50%;

        .thumbnail_2 {
          width: 16.0125px;
          height: 16.0125px;
          margin: 3.975px 0 0 3.975px;
        }

        .thumbnail_4 {
          width: 16.0125px;
          height: 16.0125px;
          margin: 3.975px 0 0 3.975px;
        }
      }
    }
  }

  .box_13 {
    background-color: rgba(20, 20, 20, 0.96);
    height: 734.775px;
    width: 375px;
    position: absolute;
    left: 0;
    top: 0;

    .image-wrapper_6 {
      width: 375px;
      height: 207.75px;

      .label_2 {
        width: 24px;
        height: 24px;
        margin: 169.4875px 0 0 331.9875px;
      }
    }

    .box_14 {
      background-image: linear-gradient(
        180deg,
        rgba(61, 61, 61, 1) 0,
        rgba(31, 31, 31, 0) 100%
      );
      position: absolute;
      left: 20.025px;
      top: 206.025px;
      width: 336px;
      height: 234px;
      border: 1px solid rgba(112, 112, 112, 1);

      .text_11 {
        width: 288px;
        height: 66.0px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 13.9875px;
        font-family: Roboto Flex-Regular;
        font-weight: normal;
        text-align: left;
        line-height: 22.0125px;
        margin: 80.4875px 0 0 24px;
      }

      .block_1 {
        width: 288.375px;
        height: 32.025px;
        margin: 32.1125px 0 24px 24px;

        .text-wrapper_1 {
          background-image: linear-gradient(
            270deg,
            rgba(62, 62, 62, 1) 0,
            rgba(120, 120, 120, 1) 100%
          );
          border-radius: 32px;
          height: 32.025px;
          border: 1px gradient;
          width: 108.0px;

          .text_12 {
            width: 54.0px;
            height: 24px;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 15.975px;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            line-height: 24px;
            margin: 4.175px 0 0 27.0px;
          }
        }

        .text-wrapper_2 {
          background-image: linear-gradient(
            270deg,
            rgba(67, 232, 160, 1) 0,
            rgba(138, 242, 95, 1) 100%
          );
          border-radius: 32px;
          height: 32.025px;
          border: 1px solid rgba(20, 20, 20, 1);
          width: 161.125px;

          .text_13 {
            width: 52.6875px;
            height: 24px;
            overflow-wrap: break-word;
            color: rgba(20, 20, 20, 1);
            font-size: 15.975px;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            line-height: 24px;
            margin: 4.175px 0 0 55.5px;
          }
        }
      }

      .block_2 {
        height: 121.3125px;
        background: url(https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG358277c07c45ba9c76629924ae3e3da2.png)
          100% no-repeat;
        background-size: 100% 100%;
        width: 120px;
        position: absolute;
        left: 108.7875px;
        top: -60px;

        .group_4 {
          width: 120px;
          height: 120px;
        }
      }
    }
  }
}

.complete {
  padding-top: 16.0125px;
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
  width: 252.0px;
  height: 186.0px;
  margin: 0 auto;
  margin-top: 61.9875px;
  margin-bottom: 67.2375px;
}

.p1 {
  font-family: Roboto-Black;
  font-weight: 900;
  font-size: 24.0px;
  color: #000000;
  line-height: 34.1875px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 16.0125px;
}

.p2 {
  font-family: Roboto-Regular;
  font-weight: 400;
  font-size: 12.0px;
  color: #000000;
  line-height: 18.0px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

button {
  width: 243.525px;
  height: 34.125px;
  line-height: 34.125px;
  background: #2F54EB;
  box-shadow: 4.0125px 4.0125px 7.9875px 0.4875px rgba(47, 84, 235, 0.32);
  border-radius: 4.0125px;

  font-family: Roboto-Black;
  font-weight: 900;
  font-size: 13.9875px;
  color: #FFFFFF;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin: 0 auto;
  margin-top: 54.0px;
  border: none;
}
}
</style>
