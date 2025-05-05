<script setup>
import { RouterLink, RouterView } from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
  <div id="app">
    <LoginView
      v-if="!isLoggedIn"
      @login-success="handleLoginSuccess"
      @login-failed="handleLoginFailed"
    />
    <HomeView v-else @logout="handleLogout" :username="username" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    LoginView,
    HomeView,
  },
  data() {
    return {
      isLoggedIn: false,
      username: '',
      // Kredensial untuk login sederhana
      validCredentials: {
        username: 'user',
        password: '123',
      },
    };
  },
  created() {
    // Cek jika sudah login sebelumnya (dari localStorage)
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');

    if (savedLoginState === 'true' && savedUsername) {
      this.isLoggedIn = true;
      this.username = savedUsername;
    }
  },
  methods: {
    handleLoginSuccess(credentials) {
      // Cek apakah kredensial cocok dengan yang sudah ditentukan
      if (
        credentials.username === this.validCredentials.username &&
        credentials.password === this.validCredentials.password
      ) {
        // Login berhasil
        this.isLoggedIn = true;
        this.username = credentials.username;

        // Simpan state login ke localStorage (opsional)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', credentials.username);

        // Tampilkan pesan sukses
        alert('Login berhasil! Selamat datang, ' + credentials.username);
      } else {
        // Login gagal, panggil handler kegagalan
        this.handleLoginFailed();
      }
    },
    handleLoginFailed() {
      alert('Login gagal! Username atau password salah.');
    },
    handleLogout() {
      // Reset state login
      this.isLoggedIn = false;
      this.username = '';

      // Hapus data dari localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');

      alert('Anda telah keluar dari sistem.');
    },
  },
};
</script>

<style>
/* Style global untuk aplikasi */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
