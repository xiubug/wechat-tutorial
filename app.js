import { getConfigValue } from './services/api';
import regeneratorRuntime from './libs/regenerator-runtime';

// app.js
App({
  onLaunch: function () {
    const that = this;
    // 登录
    that.login();
    that.getConfigValue({key: 'mallName'});
    // 获取商城名称
    getConfigValue({key: 'mallName'}).then((res) => {
      if (res.data.code == 0) {
        wx.setStorageSync('mallName', res.data.data.value);
      }
    });
    getConfigValue({key: 'recharge_amount_min'}).then((res) => {
      if (res.data.code == 0) {
        that.globalData.recharge_amount_min = res.data.data.value;
      }
    });
    that.scoreSendRule({code: 'goodReputation'});
  },
  async getConfigValue (param) {

  },
  /**
   * 获取系统中设置的积分赠送规则参数 https://www.it120.cc/apis/112
   * @param {code} 编码
   * @returns {confine: 满足该条件才赠送, score: 赠送的积分数量}
   */
  scoreSendRule (param) {
    const that = this;
    wx.request({
      url: that.globalData.subDomain + '/score/send/rule',
      data: param,
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.order_reputation_score = res.data.data[0].score;
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
        /**
         * 小程序登录获取Token https://www.it120.cc/apis/20
         * 小程序登录，获取到 token 后可保存到本地存储，以后用该 token 进行相关用户授权接口的调用
         * @param {code} 微信登录接口返回的 code 参数数据
         * @param {type} 1 服务号 2 小程序，不传默认为2
         */
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
              wx.hideLoading(); // 隐藏 loading 提示框
              // 显示模态弹窗
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
            /**
             * 详细信息注册 https://www.it120.cc/apis/19
             * 对接微信小程序，实现用户简单注册、详细注册、登录获取token功能；配套的后台用户管理列表，
             * 免除您开发接口及后台管理的工作量
             * @param {code} 微信登录接口返回的 code 参数数据
             * @param {encryptedData} 微信登录接口返回的 加密用户信息
             * @param {iv} 微信登录接口返回的加密偏移数据
             * @param {postJsonString} 注册用户的扩展数据，必须是 json 格式
             */
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