import React from "react";
export function toPush(children, index, left, top) {
    var _a;
    if (children && Array.isArray(children)) {
        const cur = children[index];
        if (React.isValidElement(cur)) {
            const originStyle = (_a = cur.props) === null || _a === void 0 ? void 0 : _a.style;
            const mergeStyle = Object.assign(Object.assign({}, originStyle), { position: "absolute", left: left, top: top });
            const cloneElement = React.cloneElement(cur, Object.assign(Object.assign({}, cur.props), { style: mergeStyle }));
            return cloneElement;
        }
        else {
            console.error("this child is invalid type", cur);
            return null;
        }
    }
    else {
        console.error("children should be array,but get", typeof children);
        return null;
    }
}
