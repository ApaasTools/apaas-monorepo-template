/**
 * @description: 判断类型
 * @param {type} 类型
 * @return: 判断类型
 */
const isType = (type: string) => {
	return (
		obj:
			| string
			| number
			| boolean
			| symbol
			| bigint
			| object
			| null
			| undefined,
	) => {
		return Object.prototype.toString.call(obj) === `[object ${type}]`;
	};
};

/** 判断是否为字符串 */
export const isString = isType("String");
/** 判断是否为数组 */
export const isArray = isType("Array");
/** 判断是否为对象 */
export const isObject = isType("Object");
/** 判断是否为布尔值 */
export const isBoolean = isType("Boolean");
/** 判断是否为函数 */
export const isFunction = isType("Function");
/** 判断是否为数字 */
export const isNumber = isType("Number");
/** 判断是否为Promise */
export const isPromise = isType("Promise");
/** 判断是否为undefined或null */
export const isUndef = (v: any) => v === undefined || v === null;
/** 判断是否为定义 */
export const isDef = (v: any) => v !== undefined && v !== null;
