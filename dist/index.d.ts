import React, { CSSProperties, PropsWithChildren, RefObject } from "react";
interface WaterfallProps {
    style?: CSSProperties;
    classnames?: string;
    column: number;
    itemWidth: number;
    forceHeight?: number;
    scrollCallback?: (v: React.Dispatch<React.SetStateAction<number>>) => void;
    wrapperRefCallback?: (v: RefObject<HTMLDivElement>) => void;
}
export declare const defaultWrapperStyle: CSSProperties;
export declare function Waterfall(props: PropsWithChildren<WaterfallProps>): JSX.Element;
export default Waterfall;
