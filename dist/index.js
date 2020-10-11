import React, { useEffect, useMemo, useRef, useState, } from "react";
import { toPush } from "./push";
import { getFarColumnAndDis, isCanPush } from "./validate";
export const defaultWrapperStyle = {
    overflow: "auto",
    width: "800px",
    height: "800px",
    position: "relative",
};
export function Waterfall(props) {
    const { style, classnames, column, itemWidth, forceHeight, scrollCallback, wrapperRefCallback, } = props;
    const [current, setCurrent] = useState(0);
    const [renderChildren, setRenderChildren] = useState([]);
    const [force, forceUpdate] = useState(0);
    const width = useMemo(() => {
        var _a, _b;
        if (forceHeight) {
            return forceHeight;
        }
        else {
            const w = (_b = (_a = style) === null || _a === void 0 ? void 0 : _a.width, (_b !== null && _b !== void 0 ? _b : "800px"));
            if (typeof w === "string") {
                return parseFloat(w);
            }
            else {
                return w;
            }
        }
    }, [forceHeight, style]);
    const height = useMemo(() => {
        var _a, _b;
        const w = (_b = (_a = style) === null || _a === void 0 ? void 0 : _a.height, (_b !== null && _b !== void 0 ? _b : "800px"));
        if (typeof w === "string") {
            return parseFloat(w);
        }
        else {
            return w;
        }
    }, [style]);
    const mergedStyle = useMemo(() => {
        return Object.assign(Object.assign({}, defaultWrapperStyle), style);
    }, [style]);
    //给的宽可能比item*column大，计算每列起始left。
    const leftArr = useMemo(() => {
        const remain = width - itemWidth * column;
        const start = remain / 2;
        //暂时先做居中
        let arr = [];
        for (let i = 0; i < column; i++) {
            arr.push(start + itemWidth * i);
        }
        return arr;
    }, [column, itemWidth, width]);
    const dynamicHeight = useMemo(() => {
        return new Array(column).fill(0);
    }, [column]);
    //渲染后获取对应元素高度
    useEffect(() => {
        const render = toPush(props.children, 0, leftArr[0], 0);
        let timer;
        if (render) {
            setRenderChildren([render]);
            const colN = 0;
            const lastH = dynamicHeight[colN];
            const lastRH = render.props["data-height"];
            if (!lastRH) {
                console.error("you should pass the data-height to specify every children height");
                return;
            }
            dynamicHeight[colN] = lastH + parseFloat(lastRH);
        }
        return () => {
            window.clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leftArr, props.children]);
    const childrenLen = useMemo(() => {
        const children = props.children;
        if (Array.isArray(children)) {
            return children.length;
        }
        else {
            console.error("children must be array");
            return 0;
        }
    }, [props.children]);
    useEffect(() => {
        let timer = window.setTimeout(() => {
            if (renderChildren.length > 0 && wrapperRef.current) {
                const scroll = wrapperRef.current.scrollTop;
                const [minCol, dis] = getFarColumnAndDis(dynamicHeight, height, scroll);
                if (isCanPush(current, childrenLen, dis)) {
                    const newCurrent = current + 1;
                    setCurrent(newCurrent);
                    const left = leftArr[minCol];
                    const top = dynamicHeight[minCol];
                    const render = toPush(props.children, newCurrent, left, top);
                    if (render) {
                        setRenderChildren((prev) => [...prev, render]);
                        const colN = minCol;
                        const lastH = dynamicHeight[colN];
                        const lastRH = render.props["data-height"];
                        if (!lastRH) {
                            console.error("you should pass the data-height to specify every children height");
                            return;
                        }
                        dynamicHeight[colN] = lastH + parseFloat(lastRH);
                    }
                }
            }
        });
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        childrenLen,
        column,
        current,
        dynamicHeight,
        height,
        leftArr,
        props.children,
        renderChildren,
        force,
    ]);
    const wrapperRef = useRef(null);
    useEffect(() => {
        let handler;
        if (wrapperRef.current) {
            handler = () => {
                if (scrollCallback) {
                    scrollCallback(forceUpdate);
                }
                else {
                    forceUpdate((prev) => prev + 1);
                }
            };
            wrapperRef.current.addEventListener("scroll", handler);
        }
        return () => {
            if (wrapperRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                wrapperRef.current.removeEventListener("scroll", handler);
            }
        };
    }, [scrollCallback]);
    useEffect(() => {
        if (wrapperRefCallback) {
            wrapperRefCallback(wrapperRef);
        }
    }, [wrapperRefCallback]);
    return (React.createElement("div", { ref: wrapperRef, style: mergedStyle, className: classnames }, renderChildren));
}
export default Waterfall;
