import { type Pos, drawImage } from "@/types/canvas";
import { getElecImagePath, PowerSource } from "./types";

export default class Pile extends PowerSource {
	properties?: (() => JSX.Element[]) | undefined;
	id: number;
	pos: Pos;
	name: string;

	getDefaultImage(): string {
		return getElecImagePath(`${Pile.nom}Off`);
	}

	static nom = "Pile";

	constructor(id: number, pos: Pos) {
		super(5);
		this.id = id;
		this.pos = pos;
		this.name = Pile.nom;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		const { x, y } = this.pos;

		ctx.fillText("+", x + size / 2, y - size / 2);
		ctx.fillText("-", x - size / 2, y - size / 2);
		drawImage(ctx, getElecImagePath(`${Pile.nom}On`), this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};
}
