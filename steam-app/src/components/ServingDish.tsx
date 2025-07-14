import { ReactNode } from "react";
import { GLASS_COLOR, GLASS_COLOR_DARKER, TILE_BG } from "../constants";

type Props = {
    children: ReactNode;
    color?: string;
}

export default function ServingDish({ children, color }: Props) {
    const bgColor = color || TILE_BG
    return (
        <div className="rounded-lg p-[1em] border-[4px] border-solid w-fit" style={{ background: GLASS_COLOR, borderColor: GLASS_COLOR_DARKER }}>
            { children }
        </div>
    )
}