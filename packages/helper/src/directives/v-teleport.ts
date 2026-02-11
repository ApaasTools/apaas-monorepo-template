/**
 * v-teleport 指令实现
 * 将元素传送到指定的DOM容器中
 */

import type { DirectiveBinding, ObjectDirective, VNode } from "vue";

// 存储传送信息的属性名
const TELEPORT_PROPERTY = "__v-teleport";

/**
 * 指令配置接口
 */
interface TeleportConfig {
	to: string | Element;
	disabled: boolean;
}

/**
 * 传送信息接口
 */
interface TeleportInfo {
	placeholder: Comment;
	target: Element;
	originalParent: Node | null;
}

/**
 * 扩展的元素接口，包含传送信息
 */
interface TeleportElement extends HTMLElement {
	[TELEPORT_PROPERTY]?: TeleportInfo;
}

/**
 * 扩展的注释节点接口
 */
interface TeleportComment extends Comment {
	__teleportOriginal?: Element;
}

/**
 * 指令绑定值类型
 */
type TeleportBindingValue = string | Partial<TeleportConfig> | undefined;

/**
 * 处理指令参数
 * @param {string|Object} bindingValue 指令绑定值
 * @returns {Object} 处理后的配置对象
 */
function processDirectiveArguments(
	bindingValue: TeleportBindingValue,
): TeleportConfig {
	if (typeof bindingValue === "string") {
		return {
			to: bindingValue,
			disabled: false,
		};
	}

	if (typeof bindingValue === "object" && bindingValue !== null) {
		return {
			to: bindingValue.to || "body",
			disabled: bindingValue.disabled || false,
		};
	}

	return {
		to: "body",
		disabled: false,
	};
}

/**
 * 获取目标容器元素
 * @param {string|Element} target 目标选择器或元素
 * @returns {Element|null} 目标元素
 */
function getTargetElement(target: string | Element): Element | null {
	if (typeof target === "string") {
		if (target === "body") {
			return document.body;
		}
		return document.querySelector(target);
	}

	if (target instanceof Element) {
		return target;
	}

	return null;
}

/**
 * 创建占位符注释节点
 * @param {Element} el 原始元素
 * @returns {Comment} 注释节点
 */
function createPlaceholder(el: Element): TeleportComment {
	const comment = document.createComment(
		"v-teleport placeholder",
	) as TeleportComment;
	comment.__teleportOriginal = el;
	return comment;
}

/**
 * 传送元素到目标容器
 * @param {Element} el 要传送的元素
 * @param {string|Element} target 目标容器
 */
function teleportElement(el: TeleportElement, target: string | Element): void {
	const targetElement = getTargetElement(target);

	if (!targetElement) {
		console.warn(`v-teleport: Target "${target}" not found`);
		return;
	}

	// 如果元素已经在目标容器中，不需要移动
	if (el.parentNode === targetElement) {
		return;
	}

	// 如果元素已经被传送过，先恢复
	if (el[TELEPORT_PROPERTY]) {
		restoreElement(el);
	}

	// 创建占位符
	const placeholder = createPlaceholder(el);

	// 在原位置插入占位符
	if (el.parentNode) {
		el.parentNode.insertBefore(placeholder, el);
	}

	// 移动元素到目标容器
	try {
		targetElement.appendChild(el);
	} catch (error) {
		console.error("v-teleport: Failed to move element to target", error);
		return;
	}

	// 保存传送信息
	const teleportInfo = {
		placeholder,
		target: targetElement,
		originalParent: placeholder.parentNode,
	};

	el[TELEPORT_PROPERTY] = teleportInfo;
}

/**
 * 恢复元素到原位置
 * @param {Element} el 要恢复的元素
 */
function restoreElement(el: TeleportElement): void {
	const teleportInfo = el[TELEPORT_PROPERTY];
	if (!teleportInfo) {
		return;
	}

	const { placeholder, originalParent } = teleportInfo;

	// 如果占位符还在原位置，将元素移回
	if (placeholder && placeholder.parentNode) {
		try {
			placeholder.parentNode.insertBefore(el, placeholder);
			placeholder.parentNode.removeChild(placeholder);
		} catch (error) {
			console.error("v-teleport: Error during element restoration", error);
		}
	} else if (originalParent) {
		try {
			originalParent.appendChild(el);
		} catch (error) {
			console.error("v-teleport: Error restoring to original parent", error);
		}
	}

	// 清理传送信息
	delete el[TELEPORT_PROPERTY];
}

/**
 * 指令绑定时的处理
 * @param {Element} el 绑定的元素
 * @param {Object} binding 指令绑定对象
 */
function bind(
	el: TeleportElement,
	binding: DirectiveBinding<TeleportBindingValue>,
): void {
	if (!binding.value) return;
	const config = processDirectiveArguments(binding.value);
	const { to, disabled } = config;

	if (!disabled) {
		// 使用 setTimeout 确保DOM更新完成后再执行传送
		setTimeout(() => {
			teleportElement(el, to);
		}, 0);
	}
}

/**
 * 指令更新时的处理
 * @param {Element} el 绑定的元素
 * @param {Object} binding 指令绑定对象
 * @param {Object} vnode 虚拟节点
 * @param {Object} oldVnode 旧虚拟节点
 */
function update(
	el: TeleportElement,
	binding: DirectiveBinding<TeleportBindingValue>,
	_vnode?: VNode,
	_oldVnode?: VNode,
): void {
	const oldConfig = processDirectiveArguments(binding.oldValue ?? undefined);
	const newConfig = processDirectiveArguments(binding.value);

	// 如果配置没有变化，不需要处理
	if (JSON.stringify(oldConfig) === JSON.stringify(newConfig)) {
		return;
	}

	// 先恢复元素到原位置
	restoreElement(el);

	// 如果新配置没有禁用，重新传送
	if (!newConfig.disabled) {
		setTimeout(() => {
			teleportElement(el, newConfig.to);
		}, 0);
	}
}

/**
 * 指令解绑时的处理
 * @param {Element} el 绑定的元素
 */
function unbind(el: TeleportElement): void {
	restoreElement(el);
}

/**
 * 组件更新时的处理
 * @param {Element} el 绑定的元素
 * @param {Object} binding 指令绑定对象
 */
function componentUpdated(
	el: TeleportElement,
	binding: DirectiveBinding<TeleportBindingValue>,
): void {
	const { disabled } = processDirectiveArguments(binding.value);

	// 如果元素被传送了，但现在被禁用，需要移回原位置
	if (disabled && el[TELEPORT_PROPERTY]) {
		restoreElement(el);
	} else if (!disabled && !el[TELEPORT_PROPERTY]) {
		// 如果元素没有被传送，但现在启用了，需要传送
		const { to } = processDirectiveArguments(binding.value);
		setTimeout(() => {
			teleportElement(el, to);
		}, 0);
	}
}

export const VTeleport: ObjectDirective<TeleportElement, TeleportBindingValue> =
	{
		bind,
		update,
		unbind,
		componentUpdated,
	};

export type { TeleportConfig, TeleportBindingValue };
