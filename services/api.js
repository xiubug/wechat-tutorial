import { promiseGet, promisePost } from './xhr/fetch';
import { subDomain1 } from '../utils/constants';

/**
 * 系统参数设置 (https://www.it120.cc/apis/5)
 * 
 * @param {key} 设置的系统参数编码
 * @returns {value: 该系统参数的值, remark: 该系统参数的备注说明}
 * 
 */
const getConfigValue = (params) => promiseGet(params, '/config/get-value', subDomain1);

/**
 * 获取系统中设置的积分赠送规则参数 https://www.it120.cc/apis/112
 * @param {code} 编码
 * @returns {confine: 满足该条件才赠送, score: 赠送的积分数量}
 */
const scoreSendRule = (params) => promiseGet(params, '/score/send/rule');

/**
 * 小程序登录获取Token https://www.it120.cc/apis/20
 * 小程序登录，获取到 token 后可保存到本地存储，以后用该 token 进行相关用户授权接口的调用
 * @param {code} 微信登录接口返回的 code 参数数据
 * @param {type} 1 服务号 2 小程序，不传默认为2
 */
const userWxappLogin = (params) => promisePost(params, '/user/wxapp/login', subDomain1); 

/**
 * 检测登录token是否有效 https://www.it120.cc/apis/62
 * 检测token是否有效接口
 * @param {token} 登录token
 * 
 */
const userCheckToken = (params) => promiseGet(params, '/user/check-token');

/**
 * 详细信息注册 https://www.it120.cc/apis/19
 * 对接微信小程序，实现用户简单注册、详细注册、登录获取token功能；配套的后台用户管理列表，
 * 免除您开发接口及后台管理的工作量
 * @param {code} 微信登录接口返回的 code 参数数据
 * @param {encryptedData} 微信登录接口返回的 加密用户信息
 * @param {iv} 微信登录接口返回的加密偏移数据
 * @param {postJsonString} 注册用户的扩展数据，必须是 json 格式
 */
const userRegisterComplex = (params) => promisePost(params, '/user/wxapp/register/complex');

/**
 * App Banner管理接口 https://www.it120.cc/apis/28
 * 后台维护管理Banner，APP通过改接口进行展示；可自定义设置Banner类型，以便灵活设置 banner 的跳转以及链接方式。
 * @param {type} Banner类型，后台自定义
 */
const getBannerList = (params) => promiseGet(params, '/banner/list');

/**
 * 商品类别无限级接口 https://www.it120.cc/apis/36
 * 接口获取后台维护的商品分类数据，支持无限级分类
 */
const shopCategoryAll = (params) => promiseGet(params, '/shop/goods/category/all');

/**
 * 商城商品管理接口 https://www.it120.cc/apis/37
 * 获取后台维护的商品列表，用于 app 展示
 */
const shopGoodsList = (params) => promiseGet(params, '/shop/goods/list');

/**
 * 优惠券接口 https://www.it120.cc/apis/70
 * 获取当前可领用的优惠券数据列表，针对每个优惠券用户可做领取操作，查看并管理自己领取到的优惠券
 * @param {type} 优惠券类型
 * @param {refId} 优惠券使用对象
 */
const discountsCoupons = (params) => promiseGet(params, '/discounts/coupons');

/**
 * 领取优惠券 https://www.it120.cc/apis/71
 * 获取当前可领用的优惠券数据列表，针对每个优惠券用户可做领取操作，查看并管理自己领取到的优惠券
 * @param {id} 优惠券ID
 * @param {pwd} 口令红包必须传
 * @param {token} 调用登录接口获取的登录凭证
 * @param {detect} 如果传了该参数，并且是 true ，则不获取优惠券，而是检测当前用户是否可以获取
 */
const fetchDiscounts = (params) => promiseGet(params, '/discounts/fetch');

/**
 * 平台公告模块 https://www.it120.cc/apis/6
 * 公告管理模块，用于客户端调用公告数据进行展示
 * @param {page} 获取第几页的数据，不填写默认取第一页
 * @param {pageSize} 每页显示的条数，不填写默认获取50条
 * @param {type} 公告类型
 */
const getNoticeList = (params) => promiseGet(params, '/notice/list');

module.exports = {
  getConfigValue,
  scoreSendRule,
  userWxappLogin,
  userCheckToken,
  userRegisterComplex,
  getBannerList,
  shopCategoryAll,
  shopGoodsList,
  discountsCoupons,
  fetchDiscounts,
  getNoticeList
};