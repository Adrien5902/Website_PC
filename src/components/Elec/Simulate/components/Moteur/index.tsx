import { type Pos, drawImage } from "../../../../../types/canvas";
import ImageBank from "../../img/bank";
import { ComponentProperty } from "../properties";
import type { Récepteur } from "../types";

export class Moteur implements Récepteur {
	name: string;
	pos: Pos;
	id: number;
	R: number;
	U: number;
	I: number;
	P: number;
	angle: number;
	defaultImage: string;

	static nom = "Moteur";
	static defaultImage = ImageBank.Moteur;

	constructor(id, pos) {
		this.id = id;
		this.pos = pos;
		this.name = Moteur.nom;
		this.I = 0;
		this.R = 3;
		this.U = 0;
		this.P = 0;
		this.angle = 0;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		this.U = this.R * this.I;
		this.P = this.U * this.I;
		this.angle += (this.P * Math.PI) / 360;

		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		drawImage(ctx, ImageBank.Moteur, { x: 0, y: 0 }, size);
		ctx.restore();
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	isPowerSource = () => true;

	properties = () => [
		<ComponentProperty
			component={this}
			property="R"
			suffix="Ω"
			label="Résistance : "
			key={0}
		/>,
		<ComponentProperty
			component={this}
			property="P"
			suffix="W"
			readonly={true}
			label="Puissance : "
			key={1}
		/>,
	];
}
