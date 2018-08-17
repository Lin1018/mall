<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="static/logo.png">
        </a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!-- <a href="/" class="navbar-link">我的账户</a> -->
          <span class="navbar-link" v-if="nickName">{{nickName}}</span>
          <a href="javascript:void(0)" class="navbar-link" @click="loginModalFlag=true" v-if="!nickName">登录</a>
          <a href="javascript:void(0)" class="navbar-link" @click="logout" v-else>退出</a>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count"></span>
            <a class="navbar-link navbar-cart-link" href="/#/cart">
              <svg class="navbar-cart-logo">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner"> 
        <div class="md-top">
          <div class="md-title">登录</div>
          <button class="md-close" @click="loginModalFlag=false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="login">登  录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
</header>
</template>

<script>
  import axios from 'axios'
  export default{
    data(){
      return{
        userName: 'admin',
        userPwd: '123456',
        errorTip: false,
        loginModalFlag: false,
        nickName: ''
      }
    },
    mounted() {
      this.checkLogin()
    },
    methods: {
      checkLogin() {
        axios({
          method: 'get',
          url: '/api/users/checkLogin'
        }).then(response => {
          let res =response.data
          if (res.status == '0') {
            this.nickName = res.result
            console.log(this.nickName)
          }
        })
      },
      logout() {
        axios({
          method: 'post',
          url: '/api/users/logout'
        }).then((response) => {
          let res = response.data;
          if (res.status == '0') {
            this.nickName = ''
          }
        })
      },
      login() {
        if (!this.userName || !this.userPwd) {
          this.errorTip = true
          return
        }
        axios({
          method: 'post',
          url: '/api/users/login',
          data: {
            userName: this.userName,
            userPwd: this.userPwd
          }
        }).then(response => {
          let res = response.data
          if (res.status == '0') {
            this.loginModalFlag = false
            this.errorTip = false
            this.nickName = res.result.userName
          } else {
            this.errorTip = true
          }
        })
      }
    }
  }
</script>

<style>
  @import '../assets/css/login.css'
</style>