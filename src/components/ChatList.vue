<template>
  <div>
    <section class="chatlist">
      <ul>
        <template v-for="item in records">
          <li class="chat-mine" v-if="item.type == 1">
            <div class="chat-user"><img src="../assets/user.png" /></div>
            <div class="time">
              <cite></cite>
            </div>
            <div class="chat-text" v-html="item.content"></div>
          </li>
          <li v-if="item.type == 2">
            <div class="chat-user"><img src="../assets/default.png" /></div>
            <div class="time">
              <cite></cite>
            </div>
            <div class="chat-text" v-html="item.content"></div>
          </li>
        </template>
      </ul>
    </section>
    <section class="foot">
      <div class="qk-span">
        <span @click="relogin">重新登陆</span>
        <span @click="clearRecords">清空记录</span>
      </div>
      <form submit="return false;">
        <mt-field id="txtContent" :placeholder="placeholder" class="con" :disableClear="disableClear"
          :readonly="readonly" v-model="content" @keyup.enter.native="sendMsg"></mt-field>
        <mt-field style="display: none"></mt-field>
        <span class="btn btn-send" v-on:click="sendMsg">发送</span>
      </form>
    </section>
  </div>
</template>

<script>
import { Toast } from "mint-ui";

export default {
  name: "chatlist",
  data() {
    return {
      content: "",
      topStatus: "",
      baseUrl:
        process.env.NODE_ENV === "development" ? "http://127.0.0.1:5088" : "",
      //聊天记录
      records: [],
      // 表情
      EXPS: [],
      UserId: "",
      disableClear: true,
      placeholder: "请输入消息",
      readonly: false,
      limitSecond: 0
    };
  },
  methods: {
    getEXP: function (pageNow, pageSize) {
      return this.EXPS.slice((pageNow - 1) * pageSize, pageSize * pageNow);
    },
    loadMessage() {
      var t = this;
      setInterval(function () {
        if (t.UserId) {
          t.$http
            .get(t.baseUrl + "/api/Message/" + t.UserId)
            .then((res) => {
              if (res.data && res.data.length > 0) console.log();
              if (res.data) {
                for (var i = 0; i < res.data.length; i++) {
                  var sss = res.data[i]
                    .replace(/\r/g, "<br>")
                    .replace(/\n/g, "<br>");
                  t.quantumMessage(sss);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }, 2000);
    },
    selfMessage(message) {
      this.pushMessage(1, message);
      this.content = "";
    },
    quantumMessage(message) {
      this.pushMessage(2, message);
    },
    pushMessage(type, message) {
      this.records.push({
        type: type,
        content: message,
      });
      this.saveRecords();
      this.scrollToBottom();
    },
    relogin() {
      localStorage.removeItem("CacheUserId");
      window.location.reload();
    },
    clearRecords() {
      localStorage.removeItem("records" + this.UserId);
      this.records = [];
      this.quantumMessage("当前聊天记录已清空！");
    },
    //发送消息
    sendMsg: function () {
      if (this.content == "") {
        Toast("请输入消息");
        return;
      }
      var msg = this.content;
      this.selfMessage(this.content);
      this.placeholder = "5秒后方可再次发起指令";
      this.readonly = true;

      this.limitSecond = 5;
      this.changeLimitInfo();
      if (!this.UserId) {
        window.location.reload();
      }
      this.$http
        .get(
          this.baseUrl +
          "/api/Message?Message=" +
          msg +
          "&userId=" +
          this.UserId
        )
        .then((res) => {
          if (!res.data) {
            this.quantumMessage("您的账号信息异常，请重新登录吧！");
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      return false;
    },
    saveRecords() {
      localStorage.setItem("records" + this.UserId, JSON.stringify(this.records));
    },
    //聚焦输入框
    focusTxtContent: function () {
      document.querySelector("#txtContent input").focus();
    },
    //滚动条滚动到底部
    scrollToBottom: function () {
      setTimeout(function () {
        var chatlist = document.getElementsByClassName("chatlist")[0];
        chatlist.scrollTop = chatlist.scrollHeight;
      }, 100);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    changeLimitInfo() {
      var that = this;
      setTimeout(function () {

        that.limitSecond -= 1;
        that.placeholder = that.limitSecond + "秒后方可再次发起指令";

        if (that.limitSecond > 0) {
          that.changeLimitInfo();
        } else {
          that.placeholder = "请输入消息";
          that.readonly = false;
        }
      }, 1000);
    }
  },
  mounted: function () {
    this.focusTxtContent();
    this.UserId = localStorage.getItem("CacheUserId");
    this.records = JSON.parse(localStorage.getItem("records" + this.UserId)) || [];
    this.loadMessage();
    this.scrollToBottom();
  },
};
</script>

<style>
.chatlist {
  position: absolute;
  bottom: 80px;
  left: 0px;
  right: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
  top: 5px;
}

.chatlist-bottom {
  bottom: 80px;
}

.chatlist-bottom-collapse {
  bottom: 198px;
}

.chatlist ul {
  min-height: 300px;
}

.chatlist ul .chat-mine {
  text-align: right;
  padding-left: 0;
  padding-right: 60px;
}

.chatlist ul li {
  position: relative;
  /*font-size: 0;*/
  margin-bottom: 10px;
  padding-left: 60px;
  min-height: 58px;
}

.chat-mine .chat-user {
  left: auto;
  right: 3px;
}

.qk-span {
  height: 32px;
  line-height: 32px;
  bottom: 48px;
  background-color: #fff;
}

.qk-span span {
  margin-left: 4px;
  border: 1px solid #eeeeee;
  padding: 4px 8px;
  background-color: #33df83;
  color: #fff;
  size: 9px;
  border-radius: 12px;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  /*font-size: 14px;*/
}

.chat-user img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.time {
  width: 100%;
}

cite {
  left: auto;
  right: 60px;
  text-align: right;
}

cite {
  font-style: normal;
  line-height: 24px;
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  text-align: left;
}

cite i {
  font-style: normal;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
}

.chat-mine .chat-text {
  margin-left: 0;
  text-align: left;
  background-color: #33df83;
  color: #fff;
}

.chat-text {
  position: relative;
  line-height: 22px;
  /*margin-top: 25px;*/
  padding: 10px;
  background-color: #eee;
  border-radius: 3px;
  color: #333;
  word-break: break-all;
  max-width: 462px\9;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}

.chat-text img {
  max-width: 100%;
  vertical-align: middle;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text:after {
  content: "";
  position: absolute;
  left: -10px;
  top: 15px;
  width: 0;
  height: 0;
  border-style: solid dashed dashed;
  border-color: #eee transparent transparent;
  overflow: hidden;
  border-width: 10px;
}

.chat-mine .chat-text:after {
  left: auto;
  right: -10px;
  border-top-color: #33df83;
}

.foot {
  width: 100%;
  min-height: 80px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #f8f8f8;
}

.foot .con {
  position: absolute;
  left: 1px;
  right: 60px;
  bottom: 0;
}

.foot .btn-plus {
  width: 28px;
  padding: 9px 3px;
  position: absolute;
  left: 0px;
  border-left: 1px solid #d9d9d9;
}

.foot .btn-plus i {
  font-size: 2em;
  color: #ccc;
}

.foot .btn-face {
  width: 28px;
  padding: 9px 3px 9px 0px;
  position: absolute;
  left: 35px;
  /*border-right: 1px solid #d9d9d9;*/
}

.foot .btn-face i {
  font-size: 2em;
  color: #d9d9d9;
}

.foot .selbox {
  height: 150px;
  margin-top: 60px;
  border-top: 1px solid #d9d9d9;
}

.show {
  display: block;
}

.hide {
  display: none;
}

.face-box {
  /* position: absolute; */
  /* top: 48px; */
  /* left: 0px; */
  /* right: 0px; */
  /* bottom: 0px; */
  padding: 15px 15px 0px 15px;
  overflow: hidden;
  width: 290px;
  margin: 0px auto;
  height: 135px;
}

.face-box li {
  width: 30px;
  float: left;
  padding: 6px 10px 0px 8px;
}

.btn {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  line-height: 32px;
  margin-left: 5px;
  padding: 0 6px;
  background-color: #33df83;
  color: #fff;
  border-radius: 3px;
}

.btn-send {
  position: absolute;
  right: 0px;
  height: 48px;
  line-height: 48px;
  width: 60px;
  text-align: center;
  bottom: 0;
}

.loginButton {
  width: 100%;
}

.card {
  width: 320px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
}

.login {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  min-width: 540px;
  min-height: 618px;

}

.footer {
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0;
  color: #fff;
  text-align: center;
}
</style>