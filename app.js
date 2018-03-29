import regeneratorRuntime from './libs/regenerator-runtime';
import { getConfigValue, scoreSendRule, userWxappLogin, userCheckToken, userRegisterComplex } from './services/api';

// app.js
App({
  onLaunch () {
    const that = this;
    // 登录
    that.login();

    // 获取商城名称
    that.getConfigValue({key: 'mallName'});

    that.getConfigValue({key: 'recharge_amount_min'});

    that.scoreSendRule({code: 'goodReputation'});
  },
  // 获取商城名称
  async getConfigValue (param) {
    const that = this;
    const res = await getConfigValue(param);
    if (res.data.code == 0) {
      if (param.key == 'mallName') {
        wx.setStorageSync('mallName', res.data.data.value);
      }
      if (param.key == 'recharge_amount_min') {
        that.globalData.recharge_amount_min = res.data.data.value;
      }
    }
    
  },
  // 获取系统中设置的积分赠送规则参数
  async scoreSendRule (param) {
    const that = this;
    const res = await scoreSendRule(param);
    if (res.data.code == 0) {
      that.globalData.order_reputation_score = res.data.data[0].score;
    }
  },
  async login() {
    const that = this;
    const token = that.globalData.token;
    if (token) {
      // 检测登录token是否有效
      const res = await userCheckToken({token: token});
      if (res.data.code != 0) {
        that.globalData.token = null;
        that.login();
      }
      return;
    }
    wx.login({
      async success(result) {
        // 小程序登录获取Token
        const res = await userWxappLogin({code: result.code});
        if (res.data.code == 10000) {
          // 去注册
          that.registerUser();
          return;
        }
        if (res.data.code == 0) {
          that.globalData.token = res.data.data.token;
          that.globalData.uid = res.data.data.uid;
        } else {
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
      }
    })
  },
  registerUser() {
    const that = this;
    wx.login({
      success(resLogin) {
        const code = resLogin.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          async success(resInfo) {
            const iv = resInfo.iv;
            const encryptedData = resInfo.encryptedData;
            // 详细信息注册
            const res = await userRegisterComplex({code: code, encryptedData: encryptedData, iv: iv});
            if (res.data.code == 0) {
              wx.hideLoading();
              that.login();
            }
          }
        })
      }
    })
  },
  getUserInfo(cb) {
    const that = this;
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo);
    } else {
      // 调用登录接口
      wx.login({
        success () {
          wx.getUserInfo({
            success (res) {
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