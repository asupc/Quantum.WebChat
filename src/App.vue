<template>
  <div id="app">
    <ChatList> </ChatList>
    <Modal :footer-hide="true" :mask-closable="false" :closable="false" v-model="loginModal.show" :fullscreen="true"
      style="overflow:hidden">
      <div class="login" style="overflow:hidden">
        <div class="card" :padding="30">
          <img style="width:auto;height:70px;display:block;margin:0 auto" alt="logo" src="./assets/default.png">
          <div v-if="!loginModal.isRegister" style="font-size: 14px;color: #808695;text-align:center;padding:20px">用户登录
          </div>
          <div v-if="loginModal.isRegister" style="font-size: 14px;color: #808695;text-align:center;padding:20px">用户注册
          </div>
          <Form ref="loginForm" :model="loginModal.formItem" :rules="loginModal.ruleValidate" :label-width="0">
            <FormItem prop="UserId">
              <Input size="large" placeholder="请输入QQ号码或用户名" v-model="loginModal.formItem.UserId">
              <Icon type="ios-contact" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="Password">
              <Input size="large" placeholder="请输入密码" type="password" password v-model="loginModal.formItem.Password">
              <Icon type="ios-lock" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem v-if="loginModal.isRegister" prop="rePassword">
              <Input size="large" placeholder="请再次输入密码" type="password" password
                v-model="loginModal.formItem.rePassword">
              <Icon type="ios-lock" slot="prefix" />
              </Input>
            </FormItem>
          </Form>
          <div class="flexBetween">
            <p v-if="!loginModal.isRegister" size="large" @click="register" type="text">没账号？注册一个？</p>
            <p v-if="loginModal.isRegister" size="large" @click="loginModal.isRegister=false" type="text">有账号，去登录</p>
            <p v-if="!loginModal.isRegister" size="large" @click="forgetPassword" type="text">忘记密码？</p>
          </div>
          <Button v-if="!loginModal.isRegister" type="primary" size="large" @click="handleSubmit('loginForm')"
            class="loginButton">登录</Button>
          <Button v-if="loginModal.isRegister" type="primary" size="large" @click="submitRegister('loginForm')"
            class="loginButton">注册</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import ChatList from "./components/ChatList";

export default {
  data() {
    return {
      baseUrl: process.env.NODE_ENV === "development" ? "http://127.0.0.1:5088" : "",
      loginModal: {
        show: false,
        isRegister: false,
        formItem: {
          UserId: "",
          Password: "",
          rePassword: ""
        },
        // 校验规则
        ruleValidate: {
          UserId: [{
            required: true,
            message: "输入用户名",
            trigger: "blur",
          },],
          Password: [{
            required: true,
            message: "输入密码",
            trigger: "blur",
          },],
        },
      }
    }
  },
  methods: {
    register() {
      this.loginModal.isRegister = true;
    },
    forgetPassword() {
      this.$Modal.info({
        title: "忘记密码？",
        content: "忘记密码请使用QQ机器人设置，<br>或者联系管理员重置。"
      });
    },
    // 提交表单
    handleSubmit(name) {
      var that = this;
      // 校验表单数据
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.$http
            .post(that.baseUrl + "/api/user/login", this.loginModal.formItem)
            .then((res) => {
              if (res.data.Code == 500) {
                this.$Message["error"]({
                  background: true,
                  content: res.data.Message
                });
                return;
              }
              localStorage.setItem("CacheUserId", res.data.Data);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    submitRegister(name) {

      var that = this;
      // 校验表单数据
      that.$refs[name].validate((valid) => {
        if (valid) {
          if (this.loginModal.formItem.rePassword != this.loginModal.formItem.Password) {

            this.$Message["error"]({
              background: true,
              content: "你行不行啊，两次密码都不一样！"
            });
            return false;
          }
          that.$http
            .post(that.baseUrl + "/api/user/Register", this.loginModal.formItem)
            .then((res) => {
              if (res.data.Code == 500) {
                this.$Message["error"]({
                  background: true,
                  content: res.data.Message
                });
                return;
              }
              localStorage.setItem("CacheUserId", res.data.Data);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  },
  name: "app",
  components: {
    ChatList,
  },
  mounted() {
    if (!localStorage.getItem("CacheUserId")) {
      this.loginModal.show = true;
    }
  }
};
</script>

<style>
@import "../node_modules/iview/dist/styles/iview.css";
@import "../node_modules/font-awesome/css/font-awesome.min.css";


.ivu-modal-fullscreen .ivu-modal-content .ivu-modal-body {
  overflow: hidden !important;
}

body {
  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  overflow: hidden;
}

blockquote,
body,
button,
dd,
div,
dl,
dt,
form,
h1,
h2,
h3,
h4,
h5,
h6,
input,
li,
ol,
p,
pre,
td,
textarea,
th,
ul {
  margin: 0;
  margin-top: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

ul,
li {
  list-style: none;
}

a {
  color: #666;
}


::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f8f8f8;
}


::-webkit-scrollbar-track {
  background-color: #f8f8f8;
}

::-webkit-scrollbar-thumb {
  background-color: #e2e2e2;
}

#app {
  overflow: hidden;
}

.flexBetween {
  height: 6vh;
  line-height: 6vh;
}

.flexBetween p {
  float: left;
}

.flexBetween p:last-child {
  text-align: right;
  float: right;
}
</style>