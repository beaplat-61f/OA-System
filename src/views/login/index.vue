<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">新动文化OA管理系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>

      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="mobile" type="text" v-model="loginForm.mobile" autoComplete="on" placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="code" type="text" v-model="loginForm.code" autoComplete="on" placeholder="验证码" style="width: 70%;" />
        <span v-show="!showSecond" class="show-pwd btn-code" @click="getCode">获取验证码</span>
        <span v-show="showSecond" class="show-pwd btn-code second">{{ second}} s</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { guid } from '@/utils/index'
import { getMobileCode } from '@/api/login'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      const pattern = /^0?(13|14|15|17|18|19)[0-9]{9}$/
      if (!pattern.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      const pattern = /^\d{6}$/
      if (!pattern.test(value)) {
        callback(new Error('验证码必须为6位数字'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'shizhenfeng',
        password: 'admin',
        mobile: '18565659206',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      timer: null,
      showSecond: false,
      second: '',
      uuid: '',
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getCode() {
      getMobileCode({
        uuid: this.uuid,
        mobile: this.loginForm.mobile
      })
        .then(res => {
          console.log(res)
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          })
          // 开始倒计时
          if (!this.timer) {
            this.second = 60
            this.showSecond = true
            this.timer = setInterval(() => {
              if (this.second > 0 && this.second <= 60) {
                this.second--
              } else {
                this.showSecond = false
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        })
        .catch(err => {
          console.log('err:', err)
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const { username, password, mobile, code: captcha } = this.loginForm
          const data = {
            username,
            password,
            captcha,
            mobile,
            uuid: this.uuid
          }
          this.$store.dispatch('Login', data).then(res => {
            console.log(res)
            this.loading = false
            localStorage.setItem('token', res.data.token)
            return this.$store.dispatch('GetInfo', data)
            // this.$router.push({ path: '/' })
          }).then(res => {
            console.log(res)
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.uuid = guid()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .btn-code {
    font-size: 14px;
  }
  .second {
    cursor: not-allowed;
  }
}
</style>
