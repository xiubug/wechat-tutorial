/**
 * index.js
 */
import regeneratorRuntime from '../../libs/regenerator-runtime';
import { getBannerList, shopCategoryAll, shopGoodsList, discountsCoupons, fetchDiscounts, getNoticeList } from '../../services/api';
//获取应用实例
const app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: '0',
    loadingMoreHidden: true,
    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
  },
  tabClick(e) {
    const that = this;
    that.setData({
      activeCategoryId: e.currentTarget.id
    });
    that.getGoodsList(that.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange(e) {
    const that = this;
    that.setData({  
      swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap(e) {
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  scroll(e) {
    //  console.log(e) ;
    const that = this;
    const scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },
  onLoad() {
    const that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    */

    // App Banner管理接口
    that.getBannerList({key: 'mallName'});

    // 商品类别无限级接口
    that.shopCategoryAll({});

    // 优惠券接口
    that.getCoupons({type: ''});

    that.getNotice({pageSize: 5});
  },
  // App Banner管理接口
  async getBannerList(params) {
    const that = this;
    const res = await getBannerList(params);
    if (res.data.code == 404) {
      wx.showModal({
        title: '提示',
        content: '请在后台添加 banner 轮播图片',
        showCancel: false
      })
    } else {
      that.setData({
        banners: res.data.data
      });
    }
  },
  // 商品类别无限级接口
  async shopCategoryAll(params) {
    const that = this;
    const res = await shopCategoryAll(params);
    let categories = [{id:0, name:"全部"}];
    if (res.data.code == 0) {
      for (let i = 0; i < res.data.data.length; i++) {
        categories.push(res.data.data[i]);
      }
    }
    that.setData({
      categories: categories,
      activeCategoryId: 0
    });

    // 商城商品管理接口
    that.getGoodsList(0);
  },
  // 商城商品管理接口
  async getGoodsList (categoryId) {
    if (categoryId == 0) {
      categoryId = '';
    }
    const that = this;
    const res = await shopGoodsList({categoryId: categoryId, nameLike: that.data.searchInput});
    that.setData({
      goods: [],
      loadingMoreHidden: true
    });
    let goods = [];
    if (res.data.code != 0 || res.data.data.length == 0) {
      that.setData({
        loadingMoreHidden: false
      });
      return;
    }
    for(let i = 0; i < res.data.data.length; i++){
      goods.push(res.data.data[i]);
    }
    that.setData({
      goods:goods,
    });
  },
  // 优惠券接口
  async getCoupons (params) {
    const that = this;
    const res = await discountsCoupons(params);
    if (res.data.code == 0) {
      that.setData({
        hasNoCoupons: false,
        coupons: res.data.data
      });
    }
  },
  // 领取优惠券
  async gitCoupon(e) {
    const that = this;
    const res = await fetchDiscounts({id: e.currentTarget.dataset.id, token: app.globalData.token});
    if (res.data.code == 20001 || res.data.code == 20002) {
      wx.showModal({
        title: '错误',
        content: '来晚了',
        showCancel: false
      })
      return;
    }
    if (res.data.code == 20003) {
      wx.showModal({
        title: '错误',
        content: '你领过了，别贪心哦~',
        showCancel: false
      })
      return;
    }
    if (res.data.code == 30001) {
      wx.showModal({
        title: '错误',
        content: '您的积分不足',
        showCancel: false
      })
      return;
    }
    if (res.data.code == 20004) {
      wx.showModal({
        title: '错误',
        content: '已过期~',
        showCancel: false
      })
      return;
    }
    if (res.data.code == 0) {
      wx.showToast({
        title: '领取成功，赶紧去下单吧~',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '错误',
        content: res.data.msg,
        showCancel: false
      })
    }
  },
  onShareAppMessage () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success (res) {
        // 转发成功
      },
      fail(res) {
        // 转发失败
      }
    }
  },
  // 平台公告模块
  async getNotice(params) {
    const that = this;
    const res = await getNoticeList(params);
    if (res.data.code == 0) {
      that.setData({
        noticeList: res.data.data
      });
    }
  },
  listenerSearchInput (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch() {
    this.getGoodsList(this.data.activeCategoryId);
  }
})
