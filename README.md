## yh-react-waterfall 瀑布流布局

轻松实现瀑布流布局

### 简介

-   瀑布流布局总归会有要用到的时候，于是自己写了个。
-   一开始我觉得我写的这个应该可以自动获取每个元素宽高，实际写一遍才发现不行，因为如果是图片，外层 div 没定高，则图片未加载时只能获取错误的高度。但是瀑布流必须要继续走，不能等着它加载完，所以仍需要规定每个元素的高度。

### 快速上手

-   需要 react 支持 hook 即可。
-   将 waterfall 包裹 map 的列表即可使用。
-   必传 column 列数 、 itemWidth 每个元素宽度 、data-height 每个元素高度

```tsx
import React from "react";
import Waterfall from "./components";

//模拟数据
const imglist = [
	"http://dummyimage.com/200x100",
	"http://dummyimage.com/200x200",
	"http://dummyimage.com/200x100",
	"http://dummyimage.com/200x500",
	"http://dummyimage.com/200x800",
];
let arr: Array<string> = [];
for (let i = 0; i < 100; i++) {
	arr = arr.concat(imglist);
}
///////////////////////
function App() {
	return (
		<Waterfall
			style={{
				border: "1px solid black",
			}}
			column={3}
			//220是200宽，左右padding 10
			itemWidth={220} //瀑布流需要每个宽度相等，高度可以不相等 单位px 如果rem自行换算
		>
			{arr.map((v, i) => {
				const height = parseFloat(v.slice(v.length - 3, v.length));
				return (
					<div
						key={i}
						style={{
							padding: "10px",
							boxSizing: "content-box",
						}}
						//这个是图片高度+上下padding 20  必传项！！！！
						data-height={height + 20} //高度必须固定，因为图片异步加载，会导致div塌缩，从而高度计算错误
					>
						<img src={v} alt=""></img>
					</div>
				);
			})}
		</Waterfall>
	);
}

export default App;
```

### 传递参数

```tsx
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
```

### 注意！！

-   必须为数组的 react 元素才可以工作！目前暂时非数组无法工作。也就是一般使用 map 或者用 Array 包一下。

-   不满意外层容器宽高，通过 style 进行设置。

-   column \* itemWidth 需要 < 外层容器宽
