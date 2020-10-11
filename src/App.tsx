import React, { useState } from "react";
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
	const [num, setNum] = useState(3);

	return (
		<div style={{ display: "flex" }}>
			<Waterfall
				style={{
					border: "1px solid black",
				}}
				column={num}
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
			<button
				onClick={() => setNum(3)}
				style={{ height: "50px", width: "50px" }}
			>
				切换3栏
			</button>
			<button
				onClick={() => setNum(2)}
				style={{ height: "50px", width: "50px" }}
			>
				切换2栏
			</button>
			<button
				onClick={() => setNum(1)}
				style={{ height: "50px", width: "50px" }}
			>
				切换1栏
			</button>
		</div>
	);
}

export default App;
