import React, {
	CSSProperties,
	PropsWithChildren,
	ReactElement,
	RefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toPush } from "./push";
import { getFarColumnAndDis, isCanPush } from "./validate";

interface WaterfallProps {
	//外层容器样式 ，需要自己定外层容器宽高，默认宽高800px
	style?: CSSProperties;
	//外层容器类名
	classnames?: string;
	//列数 必传
	column: number;
	//每个子元素宽度，需要定宽 必传
	itemWidth: number;
	//容器虚拟渲染高度，需要大于容器高度，用于在用户没滚到最底层时加载
	forceHeight?: number;
	//监听滚动函数，参数是强制刷新，使得可以继续对滚动进行判断
	scrollCallback?: (v: React.Dispatch<React.SetStateAction<number>>) => void;
	//拿到外层容器的ref
	wrapperRefCallback?: (v: RefObject<HTMLDivElement>) => void;
}

export const defaultWrapperStyle: CSSProperties = {
	overflow: "auto",
	width: "800px",
	height: "800px",
	position: "relative",
};

export function Waterfall(props: PropsWithChildren<WaterfallProps>) {
	const {
		style,
		classnames,
		column,
		itemWidth,
		forceHeight,
		scrollCallback,
		wrapperRefCallback,
	} = props;
	const [current, setCurrent] = useState(0);
	const [renderChildren, setRenderChildren] = useState<ReactElement[]>([]);
	const [force, forceUpdate] = useState(0);
	const width = useMemo(() => {
		if (forceHeight) {
			return forceHeight;
		} else {
			const w = style?.width ?? "800px";
			if (typeof w === "string") {
				return parseFloat(w);
			} else {
				return w;
			}
		}
	}, [forceHeight, style]);

	const height = useMemo(() => {
		const w = style?.height ?? "800px";
		if (typeof w === "string") {
			return parseFloat(w);
		} else {
			return w;
		}
	}, [style]);

	const mergedStyle = useMemo(() => {
		return { ...defaultWrapperStyle, ...style };
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

	const dynamicHeight: Array<number> = useMemo(() => {
		return new Array(column).fill(0);
	}, [column]);

	//渲染后获取对应元素高度

	useEffect(() => {
		const render = toPush(props.children, 0, leftArr[0], 0);
		let timer: number;
		if (render) {
			setRenderChildren([render]);
			const colN = 0;
			const lastH = dynamicHeight[colN];
			const lastRH = render.props["data-height"];
			if (!lastRH) {
				console.error(
					"you should pass the data-height to specify every children height"
				);
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
		} else {
			console.error("children must be array");
			return 0;
		}
	}, [props.children]);

	useEffect(() => {
		let timer = window.setTimeout(() => {
			if (renderChildren.length > 0 && wrapperRef.current) {
				const scroll = wrapperRef.current.scrollTop;
				const [minCol, dis] = getFarColumnAndDis(
					dynamicHeight,
					height,
					scroll
				);
				if (isCanPush(current, childrenLen, dis)) {
					const newCurrent = current + 1;
					setCurrent(newCurrent);
					const left = leftArr[minCol];
					const top = dynamicHeight[minCol];
					const render = toPush(
						props.children,
						newCurrent,
						left,
						top
					);
					if (render) {
						setRenderChildren((prev) => [...prev, render]);
						const colN = minCol;
						const lastH = dynamicHeight[colN];
						const lastRH = render.props["data-height"];

						if (!lastRH) {
							console.error(
								"you should pass the data-height to specify every children height"
							);
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

	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let handler: (e: Event) => void;
		if (wrapperRef.current) {
			handler = () => {
				if (scrollCallback) {
					scrollCallback(forceUpdate);
				} else {
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

	return (
		<div ref={wrapperRef} style={mergedStyle} className={classnames}>
			{renderChildren}
		</div>
	);
}

export default Waterfall;
