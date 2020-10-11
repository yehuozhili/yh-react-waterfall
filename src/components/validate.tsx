export function isCanPush(current: number, total: number, pos: number) {
	return current + 1 < total && pos > 0;
}
export function getFarColumnAndDis(
	dynamicHeight: Array<number>,
	height: number,
	scrollHeight: number
): [number, number] {
	const min = Math.min(...dynamicHeight);
	const minIndex = dynamicHeight.findIndex((v) => v === min);
	const totalHeight = height + scrollHeight;
	const remain = totalHeight - min;
	return [minIndex, remain];
}
