import { type Pos, drawImage } from "../canvas";
import { type Component, getElecImagePath } from "./types";

export default class Multimetre implements Component {
	id: number;
	pos: Pos;
	opened: boolean;
	name: string;

	static nom = "Multimetre";
	static defaultImage = getElecImagePath(Multimetre.nom);

	constructor(id: number, pos: Pos) {
		this.id = id;
		this.pos = pos;
		this.opened = true;
		this.name = Multimetre.nom;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		drawImage(ctx, Multimetre.defaultImage, this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	getDefaultImage(): string {
		return Multimetre.defaultImage;
	}

	properties = () => [];
}
