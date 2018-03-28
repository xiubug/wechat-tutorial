import { subDomain } from '../../utils/constants';

const fetch = (setting, url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: setting.url,
      method: setting.method || 'GET',
      data: setting.data || {},
      header: setting.header,
      success: resolve,
      fail: reject,
      complete(res) {
        console.log('接口名称：' + setting.url);
      }
    });
  });
};

/**
 * GET 请求
 * 
 * @param {params} 请求的参数
 * @param {url} 开发者服务器接口地址
 * @param {header} 设置请求的 header
 * @param {domain} 域名
 * 
 */
const promiseGet = (params, url, header={}, domain=subDomain) => {
  if (typeof header == 'string') {
    domain = header;
    header = {};
  }
  const setting = {
    url: domain + url, //默认ajax请求地址
    method: 'GET', //请求的方式
    data: params, //发给服务器的数据
    header: header
  };
  return fetch(setting);
};

/**
 * POST 请求
 * 
 * @param {params} 请求的参数
 * @param {url} 开发者服务器接口地址
 * @param {header} 设置请求的 header
 * @param {domain} 域名
 * 
 */
const promisePost = (params, url, header={}, domain=subDomain) => {
  if (typeof header == 'string') {
    domain = header;
    header = {};
  }
  const setting = {
    url: domain + url, //默认ajax请求地址
    method: 'POST', //请求的方式
    data: params, //发给服务器的数据
    header: header
  };
  return fetch(setting);
};

module.exports = {
  promiseGet,
  promisePost
}