import { ReactNode } from "react";

type Props = {
    children: ReactNode;
}

const TILE_BG = "rgba(18, 18, 18, 0.2)";

export default function ServingDish({ children }: Props) {
    return (
        <div className="rounded-lg p-[1em] border-2 border-solid border-green-800/10" style={{ background: TILE_BG }}>
            { children }
        </div>
    )
}