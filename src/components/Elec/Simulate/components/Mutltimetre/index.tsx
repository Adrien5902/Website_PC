import { type Pos, drawImage } from "../../../../../types/canvas";
import ImageBank from "../../img/bank";
import { ComponentProperty } from "../properties";
import type { Component } from "../types";

export default class Multimetre implements Component {
	id: number;
	pos: Pos;
	opened: boolean;
	name: string;

	static nom = "Multimetre";
	static defaultImage = ImageBank.Multimetre;

	constructor(id, pos) {
		this.id = id;
		this.pos = pos;
		this.opened = true;
		this.name = Multimetre.nom;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		drawImage(ctx, ImageBank.Multimetre, this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	properties = () => [];
}
