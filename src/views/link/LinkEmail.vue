<template>
  <div class="page flex-col">
    <div class="section_1 flex-row justify-between">
      <img class="label_1" referrerpolicy="no-referrer"
        src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGd1824a8f6f10d8ca55d129f60ff453cc.png" @click="back" />
      <span class="paragraph_1">Account&nbsp;Binding<br /><br /><br /></span>
    </div>
    <div v-if="!is_get_opt_code">
      <span class="text_1">email</span>
      <div class="text-wrapper_1 flex-col">
        <input class="text_2" v-model="email" placeholder="your mail" />
      </div>
      <span class="text_3">password</span>
      <div class="section_2 flex-row">
        <div class="image-text_1 flex-row justify-between">
          <input class="text-group_1" :type="passwrod_type" v-model="password" placeholder="6-16 characters,letters and numbers" />
          <img class="image_1" referrerpolicy="no-referrer" @click="show_password"
            src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG6228e483eafc214b659785bb7b48fcce.png" />
        </div>
      </div>
      <span class="text_4">Repeat&nbsp;password</span>
      <div class="section_3 flex-row">
        <div class="image-text_2 flex-row justify-between">
          <input class="text-group_2" :type="repet_passwrod_type" v-model="comfirm_password" placeholder="Enter your password again" />
          <img class="image_2" referrerpolicy="no-referrer" @click="show_repet_password"
            src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG6228e483eafc214b659785bb7b48fcce.png" />
        </div>
      </div>
      <div class="text-wrapper_2 flex-col" @click="get_opt">
        <span class="text_5">To&nbsp;verify</span>
      </div>
    </div>
    <div v-else>
      <span class="text_1">Code</span>
      <div class="text-wrapper_1 flex-col">
        <input class="text_2" v-model="op_code" placeholder="Enter the verification code in your email" />
      </div>
      <div class="text-wrapper_2 flex-col" @click="linkEmail">
        <span class="text_5">Bind&nbsp;email</span>
      </div>
    </div>
    <div class="group_3 flex-col" v-if="success">
      <div class="image-wrapper_1 flex-col">
        <img class="label_2" referrerpolicy="no-referrer"
          src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGfcb7da88295a8f24b92cc26946bc1a01.png" @click="finish" />
      </div>
      <div class="box_2 flex-col">
        <span
          class="text_8">Your&nbsp;account&nbsp;has&nbsp;been&nbsp;successfully&nbsp;added&nbsp;and&nbsp;bound.&nbsp;You&nbsp;can&nbsp;log&nbsp;in&nbsp;with&nbsp;your&nbsp;current&nbsp;account&nbsp;next&nbsp;time.</span>
        <div class="text-wrapper_4 flex-col">
          <span class="text_9" @click="finish">got&nbsp;it</span>
        </div>
        <img class="image_1" referrerpolicy="no-referrer"
          src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG3edb3b2d46937650d5ec512e6800c241.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { User } from 'aonweb'
import { showToast, showLoadingToast, closeToast } from 'vant';

const router = useRouter()
const email = ref('')
const password = ref('')
const comfirm_password = ref('')
const op_code = ref('')
const success = ref(false)
const passwrod_type = ref('password')
const repet_passwrod_type = ref('password')

const is_get_opt_code = ref(false)

const back = () => {
  router.back();
}

const finish = () => {
  router.back();
}

const show_password = () => {
  if (passwrod_type.value == 'password') {
    passwrod_type.value = 'text'
  } else if (passwrod_type.value == 'text') {
    passwrod_type.value = 'password'
  }
}

const show_repet_password = () => {
  if (repet_passwrod_type.value == 'password') {
    repet_passwrod_type.value = 'text'
  } else if (repet_passwrod_type.value == 'text') {
    repet_passwrod_type.value = 'password'
  }
}


function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validatePassword(password) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
  return passwordPattern.test(password);
}


const get_opt = async () => {
  try {
    if (!(email && email.value && email.value.length)) {
      showToast('email can not be null')
      return
    }
    if (!validateEmail(email.value)) {
      showToast('Invalid email format')
      return
    }
    if (!(password && password.value && password.value.length)) {
      showToast('password can not be null')
      return
    }
    if (!validatePassword(password.value)) {
      showToast('Invalid password format')
      return
    }
    if (password.value !== comfirm_password.value) {
      showToast('The two password entries do not match')
      return
    }
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: 'Loading...',
    });
    let user = new User()
    let data = await user.bindEmail(email.value, password.value)
    closeToast()
    console.log('get_opt = ', data)
    let anon_user = data && data.user
    if (!anon_user) {
      showToast('user is not exist')
      return
    }
    if (anon_user.is_anonymous && anon_user.new_email && anon_user.new_email.length) {
      showToast('Please check your email to obtain the OTP code.')
      is_get_opt_code.value = true
    }
  } catch (error) {
    showToast(error.message)
    closeToast()
  }
}

const linkEmail = async () => {
  if (!(email && email.value && email.value.length)) {
    showToast('email can not be null')
    return
  }
  if (!(op_code && op_code.value && op_code.value.length)) {
    showToast('otp_code can not be null')
    return
  }
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: 'Loading...',
  });
  let user = new User()
  let data = await user.verifyOtp(email.value, op_code.value, "email_change")
  console.log('linkEmail = ', data)
  closeToast()
  let anon_user = data && data.user
  if (!anon_user) {
    showToast('user is not exist')
    return
  }
  let find = anon_user.identities.find(e => e.provider == 'email')
  if (find) {
    // showToast('email link success')
    success.value = true
  } else {
    closeToast()
    showToast('email link failed')
  }
}

</script>

<style scoped>
.page {
  background-color: rgba(20, 20, 20, 1);
  position: relative;
  width: 100vw;
  height: 195.74vw;
  overflow: hidden;

  .section_1 {
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

  .text_1 {
    width: 90.67vw;
    height: 6.4vw;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 4.26vw;
    font-family: Roboto Flex-Bold;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 6.4vw;
    margin: 8.53vw 0 0 4.8vw;
  }

  .text-wrapper_1 {
    background-color: rgba(85, 79, 79, 1);
    height: 11.74vw;
    width: 90.67vw;
    margin: 2.13vw 0 0 4.8vw;

    .text_2 {
      width: 84.27vw;
      height: 6.4vw;
      overflow-wrap: break-word;
      color: rgba(191, 191, 191, 1);
      font-size: 4.26vw;
      font-family: Roboto Flex-Regular;
      font-weight: normal;
      text-align: left;
      white-space: nowrap;
      line-height: 6.4vw;
      margin: 2.66vw 0 0 3.2vw;
    }
  }

  .text_3 {
    width: 90.67vw;
    height: 6.4vw;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 4.26vw;
    font-family: Roboto Flex-Bold;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 6.4vw;
    margin: 6.4vw 0 0 4.8vw;
  }

  .section_2 {
    background-color: rgba(85, 79, 79, 1);
    width: 90.67vw;
    height: 11.74vw;
    margin: 2.13vw 0 0 4.8vw;

    .image-text_1 {
      width: 84.27vw;
      height: 6.4vw;
      margin: 2.66vw 0 0 3.2vw;

      .text-group_1 {
        width: 75.2vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(191, 191, 191, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Regular;
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        line-height: 6.4vw;
      }

      .image_1 {
        width: 5.34vw;
        height: 6.4vw;
      }
    }
  }

  .text_4 {
    width: 90.67vw;
    height: 6.4vw;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 4.26vw;
    font-family: Roboto Flex-Bold;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 6.4vw;
    margin: 6.4vw 0 0 4.8vw;
  }

  .section_3 {
    background-color: rgba(85, 79, 79, 1);
    width: 90.67vw;
    height: 11.74vw;
    margin: 2.13vw 0 0 4.8vw;

    .image-text_2 {
      width: 84.27vw;
      height: 6.4vw;
      margin: 2.66vw 0 0 3.2vw;

      .text-group_2 {
        width: 75.2vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(191, 191, 191, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Regular;
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        line-height: 6.4vw;
      }

      .image_2 {
        width: 5.34vw;
        height: 6.4vw;
      }
    }
  }

  .text-wrapper_2 {
    background-image: linear-gradient(270deg,
        rgba(67, 232, 160, 1) 0,
        rgba(138, 242, 95, 1) 100%);
    border-radius: 4px;
    height: 10.67vw;
    width: 90.67vw;
    margin: 9.6vw 0 83.73vw 4.8vw;

    .text_5 {
      width: 17.6vw;
      height: 6.4vw;
      overflow-wrap: break-word;
      color: rgba(20, 20, 20, 1);
      font-size: 4.26vw;
      font-family: Roboto Flex-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 6.4vw;
      margin: 2.13vw 0 0 36.53vw;
    }
  }

  .group_3 {
    background-color: rgba(20, 20, 20, 0.96);
    height: 195.74vw;
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0;

    .image-wrapper_1 {
      width: 100vw;
      height: 51.74vw;

      .label_2 {
        width: 6.4vw;
        height: 6.4vw;
        margin: 41.86vw 0 0 88.53vw;
      }
    }

    .box_2 {
      background-image: linear-gradient(180deg,
          rgba(61, 61, 61, 1) 0,
          rgba(31, 31, 31, 0) 100%);
      position: absolute;
      left: 5.34vw;
      top: 51.47vw;
      width: 89.6vw;
      height: 62.4vw;
      border: 1px solid rgba(112, 112, 112, 1);

      .text_8 {
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

      .text-wrapper_4 {
        background-image: linear-gradient(270deg,
            rgba(67, 232, 160, 1) 0,
            rgba(138, 242, 95, 1) 100%);
        border-radius: 32px;
        height: 8.54vw;
        border: 1px solid rgba(20, 20, 20, 1);
        width: 76.8vw;
        margin: 8.53vw 0 6.4vw 6.4vw;

        .text_9 {
          width: 10.94vw;
          height: 6.4vw;
          overflow-wrap: break-word;
          color: rgba(20, 20, 20, 1);
          font-size: 4.26vw;
          font-family: Roboto Flex-Bold;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 6.4vw;
          margin: 1.06vw 0 0 33.06vw;
        }
      }

      .image_1 {
        position: absolute;
        left: 29.07vw;
        top: -16vw;
        width: 32vw;
        height: 32.27vw;
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
  /* background-color: rgba(20, 20, 20, 1); */
  /* position: relative; */
  width: 100%;
  /* height: 195.74vw; */
  /* overflow: hidden; */

  .section_1 {
    width: 300px;
    height: 28px;
    margin: 8px 0 0 18px;

    .label_1 {
      width: 28px;
      height: 28px;
    }

    .paragraph_1 {
      width: 260px;
      height: 28px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 20px;
      font-family: 'Roboto Flex-Bold';
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 28px;
    }
  }

  .text_1 {
    width: 340px;
    height: 24px;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 16px;
    font-family: 'Roboto Flex-Bold';
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 24px;
    margin: 32px 0 0 18px;
  }

  .text-wrapper_1 {
    background-color: rgba(85, 79, 79, 1);
    height: 44px;
    width: 340px;
    margin: 8px 0 0 18px;

    .text_2 {
      width: 315px;
      height: 24px;
      overflow-wrap: break-word;
      color: rgba(191, 191, 191, 1);
      font-size: 16px;
      font-family: 'Roboto Flex-Regular';
      font-weight: normal;
      text-align: left;
      white-space: nowrap;
      line-height: 24px;
      margin: 10px 0 0 12px;
    }
  }

  .text_3 {
    width: 340px;
    height: 24px;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 16px;
    font-family: 'Roboto Flex-Bold';
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 24px;
    margin: 32px 0 0 18px;
  }

  .section_2 {
    background-color: rgba(85, 79, 79, 1);
    width: 340px;
    height: 44px;
    margin: 8px 0 0 18px;

    .image-text_1 {
      width: 315px;
      height: 24px;
      margin: 10px 0 0 12px;

      .text-group_1 {
        width: 282px;
        height: 24px;
        overflow-wrap: break-word;
        color: rgba(191, 191, 191, 1);
        font-size: 16px;
        font-family: 'Roboto Flex-Regular';
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        line-height: 24px;
      }

      .image_1 {
        width: 20px;
        height: 24px;
      }
    }
  }

  .text_4 {
    width: 340px;
    height: 24px;
    overflow-wrap: break-word;
    color: rgba(191, 191, 191, 1);
    font-size: 16px;
    font-family: 'Roboto Flex-Bold';
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 24px;
    margin: 32px 0 0 18px;
  }

  .section_3 {
    background-color: rgba(85, 79, 79, 1);
    width: 340px;
    height: 44px;
    margin: 8px 0 0 18px;

    .image-text_2 {
      width: 315px;
      height: 24px;
      margin: 10px 0 0 12px;

      .text-group_2 {
        width: 282px;
        height: 24px;
        overflow-wrap: break-word;
        color: rgba(191, 191, 191, 1);
        font-size: 16px;
        font-family: 'Roboto Flex-Regular';
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        line-height: 24px;
      }

      .image_2 {
        width: 20px;
        height: 24px;
      }
    }
  }

  .text-wrapper_2 {
    background-image: linear-gradient(
      270deg,
      rgba(67, 232, 160, 1) 0,
      rgba(138, 242, 95, 1) 100%
    );
    border-radius: 4px;
    height: 40px;
    width: 340px;
    margin: 36px 0 84px 18px;

    .text_5 {
      width: 66px;
      height: 24px;
      overflow-wrap: break-word;
      color: rgba(20, 20, 20, 1);
      font-size: 16px;
      font-family: 'Roboto Flex-Bold';
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 24px;
      margin: 8px 0 0 137px;
    }
  }

  .group_3 {
    background-color: rgba(20, 20, 20, 0.96);
    height: 195.74vw;
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0;

    .image-wrapper_1 {
      width: 375px;
      height: 691px;

      .label_2 {
        width: 24px;
        height: 24px;
        margin: 100px 0 0 332px;
      }
    }

    .box_2 {
      background-image: linear-gradient(
        180deg,
        rgba(61, 61, 61, 1) 0,
        rgba(31, 31, 31, 0) 100%
      );
      position: absolute;
      left: 20px;
      top: 135px;
      width: 336px;
      height: 235px;
      border: 1px solid rgba(112, 112, 112, 1);
      border-radius: 24px;

      .text_8 {
        width: 288px;
        height:auto;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        font-family: 'Roboto Flex-Regular';
        font-weight: normal;
        text-align: left;
        line-height: 30px;
        margin: 80px 0 0 24px;
      }

      .text-wrapper_4 {
        background-image: linear-gradient(
          270deg,
          rgba(67, 232, 160, 1) 0,
          rgba(138, 242, 95, 1) 100%
        );
        border-radius: 32px;
        height: 34px;
        border: 1px solid rgba(20, 20, 20, 1);
        width: 288px;
        margin: auto 0 auto 24px;

        .text_9 {
          width: 41px;
          height: 24px;
          overflow-wrap: break-word;
          color: rgba(20, 20, 20, 1);
          font-size: 16px;
          font-family: 'Roboto Flex-Bold';
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 24px;
          margin: 4px auto;
        }
      }

      .image_1 {
        position: absolute;
        left: 109px;
        top: -60px;
        width: 120px;
        height: 120px;
      }
    }
  }
}

.complete {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.back {
  font-family: 'Roboto-Bold';
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
  height: 198px;
  margin: 0 auto;
  margin-top: 62px;
  margin-bottom: 68px;
}

.p1 {
  font-family: 'Roboto-Black';
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
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 12px;
  color: #000000;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

button {
  width: 244px;
  height: 34px;
  line-height: 34px;
  background: #2F54EB;
  box-shadow: 4px 4px 8px 1px rgba(47, 84, 235, 0.32);
  border-radius: 4px;

  font-family: 'Roboto-Black';
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
