import { promiseGet } from './xhr/fetch';
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
const userWxappLogin = (params) => promiseGet(params, '/user/wxapp/login', subDomain1); 

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
const userRegisterComplex = (params) => promiseGet(params, '/user/wxapp/register/complex');

module.exports = {
  getConfigValue,
  scoreSendRule,
  userWxappLogin,
  userCheckToken,
  userRegisterComplex
};