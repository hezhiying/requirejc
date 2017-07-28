/**
 * 如果给定的值不是数组，则将其包装在一个数组中
 * @param name
 * @returns {[*]}
 */
function array_wrap(name) {
	return 'string' === typeof name ? [name] : name;
}