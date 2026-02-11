import {
	isArray,
	isDef,
	isObject,
	isString,
	isUndef,
	isFunction,
} from "./type";
import { isEmpty } from "lodash-es";

/**
 * 验证码校验器，用于验证输入值是否为 6 位长度。
 * @param {string} errorMsg - 当输入值长度不为 6 位时，回调函数返回的错误信息。
 * @returns {function} 一个验证函数，接收三个参数：_（可忽略）、value（待验证的值）和 callback（验证结果回调函数）。
 */
export function CodeValidator(errorMsg: string) {
	return (_: any, value: any, callback: any) => {
		if (value.length !== 6) {
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	};
}

/**
 * 最大值校验器，用于验证输入值是否超过指定的最大值。
 * @param {number} max - 允许的最大值，默认值为 200。
 * @param {string} errorMsg - 当输入值超过最大值时，回调函数返回的错误信息。
 * @returns {function} 一个验证函数，接收三个参数：_（可忽略）、value（待验证的值）和 callback（验证结果回调函数）。
 */
export function MaxValidator(max = 200, errorMsg: string) {
	return (_: any, value: any, callback: any) => {
		if (isDef(value) && value > max) {
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	};
}

/**
 * 最大长度校验器，用于验证输入值的长度是否超过指定的最大长度。
 * @param {number} length - 允许的最大长度，默认值为 32。
 * @param {string} errorMsg - 当输入值长度超过最大长度时，回调函数返回的错误信息。
 * @returns {function} 一个验证函数，接收三个参数：_（可忽略）、value（待验证的值）和 callback（验证结果回调函数）。
 */
export function MaxLengthValidator(length = 32, errorMsg: string) {
	return (_: any, value: any, callback: any) => {
		if (isDef(value) && value.length > length) {
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	};
}

/**
 * 密码校验器，用于验证输入的密码是否符合复杂度要求。
 * 密码需满足以下条件：
 * 1. 不能仅由数字组成
 * 2. 不能仅由字母组成
 * 3. 不能仅由非字母字符组成
 * 4. 长度至少为 8 个字符
 *
 * @param {string} errorMsg - 当输入的密码不符合复杂度要求时，回调函数返回的错误信息。
 * @returns {function} 一个验证函数，可用于检查输入的密码是否符合要求。该函数接收三个参数：
 *                    _（可忽略）、value（待验证的密码值）和 callback（验证结果回调函数）。
 */
export function PasswordValidator(errorMsg: string) {
	return RegexValidator(
		/^(?![0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z]+$).{8,}$/,
		errorMsg,
	);
}

/**
 * 手机号校验器，用于验证输入的值是否为有效的手机号。
 * 手机号格式要求：以 1 开头，第二位为 3、4、5、6、7、8、9 中的任意一个数字，后面接 9 位数字。
 *
 * @param {string} errorMsg - 当输入的值不符合手机号格式要求时，回调函数返回的错误信息。
 * @returns {function} 一个验证函数，可用于检查输入的值是否为有效的手机号。该函数接收三个参数：
 *                    _（可忽略）、value（待验证的值）和 callback（验证结果回调函数）。
 */
export function PhoneValidator(errorMsg: string) {
	return RegexValidator(/^1[3456789]\d{9}$/, errorMsg);
}

/**
 * 正则表达式校验
 * @param {*} regex 正则或正则字符串
 * @param {*} errorMsg 错误提示
 */
export function RegexValidator(regex: RegExp, errorMsg: string) {
	let reg: RegExp;
	if (isString(regex)) {
		reg = new RegExp(regex);
	} else {
		reg = regex;
	}
	return (_: any, value: any, callback: any) => {
		if (!reg.test(value)) {
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	};
}

export function RequiredValidator(errorMsg: string) {
	return (_: any, value: any, callback: any) => {
		if (isUndef(value)) {
			return callback(new Error(errorMsg));
		}
		if (isArray(value) && !value.length) {
			return callback(new Error(errorMsg));
		}
		if (isString(value) && !value) {
			return callback(new Error(errorMsg));
		}
		if (isObject(value) && JSON.stringify(value) === "{}") {
			return callback(new Error(errorMsg));
		}
		return callback();
	};
}

/**
 * 生成统一的验证器
 *
 * @param {string or validaor} type 生成字符串 和 验证器
 * @param {any} message
 * @param {string} [trigger=['blur', 'change']]
 * @returns
 */
export function generateValidator(
	type: string,
	message: string,
	trigger = ["blur", "change"],
) {
	// 生成验证器
	const validator: Record<string, any> = {
		trigger: trigger,
	};
	if (isString(type)) {
		validator.type = type;
		if (type === "required") {
			validator.validator = RequiredValidator(message);
		}
		validator.message = message;
	} else if (isFunction(type)) {
		validator.validator = type;
	}

	return validator;
}

// export function WidgetRequiredValidator(errorMsg: string) {
// 	return (_: any, value: any, callback: any) => {
// 		if (value === undefined || value === null) {
// 			return callback(new Error(errorMsg));
// 		}
// 		if (Array.isArray(value) && !value.length) {
// 			return callback(new Error(errorMsg));
// 		}
// 		if (typeof value === "string" && !value) {
// 			return callback(new Error(errorMsg));
// 		}
// 		if (typeof value === "object" && JSON.stringify(value) === "{}") {
// 			return callback(new Error(errorMsg));
// 		}
// 		return callback();
// 	};
// }

// ==================== 工具函数 ====================
/**
 * 判断值是否为空
 */
// const isEmpty = (value: any): boolean => {
// 	if (value === undefined || value === null) return true;
// 	if (Array.isArray(value)) return value.length === 0;
// 	if (typeof value === "string") return value.trim() === "";
// 	if (typeof value === "object") return Object.keys(value).length === 0;
// 	return false;
// };

/**
 * Widget 必填验证器
 * @param {string} errorMsg 错误提示信息
 */
export const widgetRequiredValidator = (errorMsg: string) => {
	return (_: any, value: any, callback: (error?: Error) => void): void => {
		callback(isEmpty(value) ? new Error(errorMsg) : undefined);
	};
};
