// app.js
App({
  onLaunch: function () {
    var that = this;
    // 登录
    that.login();
    // 获取商城名称
    that.getConfigValue({key: 'mallName'});
    that.getConfigValue({key: 'recharge_amount_min'});
    /**
     * 获取系统中设置的积分赠送规则参数 https://api.it120.cc/jfapi/score/send/rule
     * @param {code} 编码
     * @returns {confine: 满足该条件才赠送, score: 赠送的积分数量}
     */
    wx.request({
      url: that.globalData.subDomain + '/score/send/rule',
      data: {
        code: 'goodReputation'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.order_reputation_score = res.data.data[0].score;
        }
      }
    })
  },
  getConfigValue (param) {
    const that = this;
    /**
     * 系统参数设置 (https://www.it120.cc/apis/5)
     * 
     * @param {key} 设置的系统参数编码
     * @returns {value: 该系统参数的值, remark: 该系统参数的备注说明}
     * 
     */
    wx.request({
      url: that.globalData.domain + '/config/get-value',
      data: param,
      success: function (res) {
        if (res.data.code == 0) {
          if (param.key == 'mallName') {
            wx.setStorageSync('mallName', res.data.data.value);
          }
        }
      }
    })
  },
  login: function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {
      wx.request({
        url: that.globalData.subDomain + '/user/check-token',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: that.globalData.domain + '/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            that.globalData.token = res.data.data.token;
            that.globalData.uid = res.data.data.uid;
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: that.globalData.subDomain + '/user/wxapp/register/complex',
              data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv
              },
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo);
    } else {
      // 调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == 'function' && cb(that.globalData.userInfo);
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo: null,
    domain: "https://api.it120.cc/jfapi",
    subDomain: "https://api.it120.cc/tz",
    version: "1.9.SNAPSHOT",
    shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
  }
})