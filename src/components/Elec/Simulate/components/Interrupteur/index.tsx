import { type Pos, drawImage } from "../../../../../types/canvas";
import ImageBank from "../../img/bank";
import { ComponentProperty } from "../properties";
import type { Component } from "../types";

export default class Interrupteur implements Component {
	id: number;
	pos: Pos;
	opened: boolean;
	name: string;

	static nom = "Interrupteur";
	static defaultImage = ImageBank.InterrupteurOpened;

	constructor(id, pos) {
		this.id = id;
		this.pos = pos;
		this.opened = true;
		this.name = Interrupteur.nom;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		const img = this.opened
			? ImageBank.InterrupteurOpened
			: ImageBank.InterrupteurClosed;

		drawImage(ctx, img, this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	properties = () => [
		<ComponentProperty
			label="Ouvert : "
			component={this}
			property="opened"
			key={1}
		/>,
	];
}
