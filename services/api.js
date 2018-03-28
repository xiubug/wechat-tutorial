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

module.exports = {
  getConfigValue
};