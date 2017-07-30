import {parseURL} from './parseurl';

/**
 * 如果给定的值不是数组，则将其包装在一个数组中
 * @param name
 * @returns {[*]}
 */
export function array_wrap(name) {
	return 'string' === typeof name ? [name] : name;
}

/**
 * 确定给定的两个URL是否相同
 * @param url1
 * @param url2
 * @returns {boolean}
 */
export function isEqualUrl(url1, url2) {
	return parseURL(url1).path === parseURL(url2).path;
}