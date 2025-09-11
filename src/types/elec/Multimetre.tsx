import { type Pos, drawImage } from "../canvas";
import { Component, getElecImagePath } from "./types";

export default class Multimetre extends Component {
	opened: boolean;

	static nom = "Multimetre";
	static defaultImage = getElecImagePath(Multimetre.nom);

	constructor(id: number, pos: Pos) {
		super(0, pos, id, Multimetre.nom);
		this.opened = true;
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
