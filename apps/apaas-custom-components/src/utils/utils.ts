/**
 * 判断当前设备是否为移动端
 * @returns {boolean} 是否为移动端
 */
export function isMobile(): boolean {
	// 检查 User Agent 中的移动设备标识
	const userAgent = navigator.userAgent.toLowerCase();
	const mobileKeywords = [
		"mobile",
		"android",
		"iphone",
		"ipad",
		"ipod",
		"blackberry",
		"windows phone",
		"opera mini",
		"iemobile",
	];

	const isMobileUA = mobileKeywords.some((keyword) =>
		userAgent.includes(keyword),
	);

	// 检查是否支持触摸
	const hasTouchScreen =
		"ontouchstart" in window || navigator.maxTouchPoints > 0;

	// 检查屏幕宽度（小于 768px 通常认为是移动端）
	const screenWidth = window.innerWidth || document.documentElement.clientWidth;
	const isSmallScreen = screenWidth < 768;

	// 综合判断：User Agent 匹配 或 (支持触摸且屏幕较小)
	return isMobileUA || (hasTouchScreen && isSmallScreen);
}
