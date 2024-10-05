<template>
    <div class="container">
      <h1>Welcome to My App</h1>
      <p>Please log in with Telegram:</p>
  
      <!-- Telegram Login Widget -->
      <div id="telegram-login-container"></div>
  
      <div v-if="user" id="user-info">
        <h3>Logged in successfully!</h3>
        <p>Name: {{ user.first_name }} {{ user.last_name }}</p>
        <p>Telegram ID: {{ user.id }}</p>
        <p>Username: @{{ user.username }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const user = ref(null);
  
  const onTelegramAuth = async (userData) => {
    console.log("onTelegramAuth in",userData);
    let response = await telegram_oauth_provider(userData)
    if (response && response.valid) {
        
    }
    user.value = userData;
    // 在这里发送用户数据到服务器进行验证
    console.log("onTelegramAuth",userData);
  };

  onMounted(() => {
    console.log('onMounted')
    // Telegram Widget 初始化

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'shenliu_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    document.getElementById('telegram-login-container').appendChild(script);

    window.onTelegramAuth = onTelegramAuth;
  });
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
  }
  .container {
    text-align: center;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  #user-info {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>
  