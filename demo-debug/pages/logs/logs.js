//logs.js
var app = getApp();

Page({
  data: {
    logs: [],
    icon: '',
    nickName: "",
    avatarUrl: ""
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    }) 
  }
})
