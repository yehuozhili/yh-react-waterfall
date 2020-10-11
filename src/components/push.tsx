import React, { ReactNode } from "react";

export function toPush(
	children: ReactNode,
	index: number,
	left: number,
	top: number
) {
	if (children && Array.isArray(children)) {
		const cur = children[index];
		if (React.isValidElement(cur)) {
			const originStyle = cur.props?.style;
			const mergeStyle = {
				...originStyle,
				position: "absolute",
				left: left,
				top: top,
			};
			const cloneElement = React.cloneElement(cur, {
				...cur.props,
				style: mergeStyle,
			});
			return cloneElement;
		} else {
			console.error("this child is invalid type", cur);
			return null;
		}
	} else {
		console.error("children should be array,but get", typeof children);
		return null;
	}
}
