import { drawArrow, drawCircleAround, drawIndiceText, drawLine, setColor, type Pos } from "@/types/canvas";


export class Rayon {
    label: string;
    id: string;
    color: string;
    enabled: boolean;

    constructor(id: string, label: string, color: string) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.enabled = true;
    }
}

export type Moving = React.MutableRefObject<{
    type: "focalLength" | "object";
    object: Lentille | Miroir | null;
} | null>;

export type Direction = 1 | -1

export abstract class System {
    pos: number;
    imagePoint: Pos;
    virtualImage?: boolean;
    id: number;

    constructor(id: number, pos: number) {
        this.id = id;
        this.pos = pos;
        this.imagePoint = { x: 0, y: 0 };
    }

    abstract getSymbol(): string
    abstract getOutputDirection(): Direction
    abstract draw(ctx: CanvasRenderingContext2D, size: number, moving: Moving, originY: number, isMouseNear: (pos: Pos) => boolean, objectPos: React.MutableRefObject<Pos>): void
}

export class Lentille extends System {
    focalLength: number;
    focalRayonHitPoint?: Pos;
    gamma: number;

    constructor(id: number, pos: number, focalLength: number) {
        super(id, pos)
        this.focalLength = focalLength;
        this.imagePoint = { x: 0, y: 0 };
        this.gamma = 0;
    }

    draw(ctx: CanvasRenderingContext2D, size: number, moving: Moving, originY: number, isMouseNear: (pos: Pos) => boolean, objectPos: React.MutableRefObject<Pos>): void {
        setColor(ctx, "#000");

        ctx.fillText("L", this.pos + size / 3, originY + size);
        drawIndiceText(
            ctx,
            this.id.toString(),
            {
                x: this.pos + size * 0.8,
                y: originY + size * 1.2
            },
            size,
        );

        const FPos = { x: this.pos - this.focalLength, y: originY };
        const _FPos = { x: this.pos + this.focalLength, y: originY }; //_F = F'

        if (moving.current?.object === this) {
            drawCircleAround(
                ctx,
                moving.current.type === "focalLength" ? _FPos.x : this.pos,
                originY,
                size,
            );
        }

        if (!moving.current) {
            if (isMouseNear(_FPos)) {
                drawCircleAround(ctx, _FPos.x, originY, size);
            } else if (isMouseNear({ x: this.pos, y: originY })) {
                drawCircleAround(ctx, this.pos, originY, size);
            }
        }

        drawLine(
            ctx,
            { x: FPos.x, y: FPos.y - size / 5 },
            { x: FPos.x, y: FPos.y + size / 5 },
        );
        ctx.fillText("F", FPos.x, FPos.y + size);
        drawIndiceText(
            ctx,
            this.id.toString(),
            {
                x: FPos.x + size * 0.5,
                y: FPos.y + size * 1.2
            },
            size
        );
        drawLine(
            ctx,
            { x: _FPos.x, y: _FPos.y - size / 5 },
            { x: _FPos.x, y: _FPos.y + size / 5 },
        );
        ctx.fillText("F'", _FPos.x, _FPos.y + size);
        drawIndiceText(
            ctx,
            this.id.toString(),
            {
                x: _FPos.x + size * 0.5,
                y: _FPos.y + size * 1.2
            },
            size
        );

        const LSize = Math.max(
            Math.abs(objectPos.current.y),
            this.imagePoint ? Math.abs(this.imagePoint.y - originY) : 0,
            size,
        );

        const LTop = { x: this.pos, y: originY - LSize - size };
        const LBottom = { x: this.pos, y: originY + LSize + size };

        drawLine(ctx, LTop, LBottom);
        drawArrow(ctx, LTop, this.focalLength > 0 ? Math.PI / 2 : -Math.PI / 2, size);
        drawArrow(ctx, LBottom, this.focalLength < 0 ? Math.PI / 2 : -Math.PI / 2, size);
    }

    getSymbol(): string {
        return "L";
    }

    getOutputDirection(): Direction {
        return 1
    }
}

export interface Rayons {
    delta: Rayon;
    O: Rayon;
    F: Rayon;
    others: Rayon[];
}

export class Miroir extends System {
    angle: number;
    wrapping: number

    constructor(id: number, pos: number) {
        super(id, pos)
        this.virtualImage = true;
        this.angle = 0;
        this.wrapping = 0;
    }

    draw(ctx: CanvasRenderingContext2D, size: number, moving: Moving, originY: number, isMouseNear: (pos: Pos) => boolean, objectPos: React.MutableRefObject<Pos>): void {
        setColor(ctx, "#00a");

        const topPos: Pos = { x: this.pos, y: 0 };
        const bottomPos: Pos = { x: this.pos, y: ctx.canvas.height };
        const midPos: Pos = { x: this.pos, y: originY };

        ctx.fillText("M", this.pos + size / 2, originY + size);
        drawIndiceText(
            ctx,
            this.id.toString(),
            {
                x: midPos.x + size * 1.2,
                y: midPos.y + size * 1.2
            },
            size,
        );

        if (!moving.current) {
            if (isMouseNear(midPos)) {
                drawCircleAround(ctx, midPos.x, originY, size);
            }
        }

        drawLine(ctx, topPos, bottomPos);
        for (let i = 0; i < ctx.canvas.height / size; i++) {
            const step = i * size;
            drawLine(ctx, { x: this.pos + size / 2, y: step }, { x: this.pos, y: step + size / 2 });
        }
    }

    getSymbol(): string {
        return "M"
    }

    getOutputDirection(): Direction {
        return -1
    }
}
