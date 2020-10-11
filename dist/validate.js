export function isCanPush(current, total, pos) {
    return current + 1 < total && pos > 0;
}
export function getFarColumnAndDis(dynamicHeight, height, scrollHeight) {
    const min = Math.min(...dynamicHeight);
    const minIndex = dynamicHeight.findIndex((v) => v === min);
    const totalHeight = height + scrollHeight;
    const remain = totalHeight - min;
    return [minIndex, remain];
}
