import { type Pos, drawImage } from "@/types/canvas";
import { ComponentProperty } from "./properties";
import { getElecImagePath, Récepteur } from "./types";

export class Moteur extends Récepteur {
	P = 0;
	angle: number;

	getDefaultImage(): string {
		return getElecImagePath(Moteur.nom);
	}

	static nom = "Moteur";

	constructor(id: number, pos: Pos) {
		super(3, pos, id, Moteur.nom);
		this.angle = 0;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		this.angle += (this.P * Math.PI) / 360;

		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		drawImage(ctx, this.getDefaultImage(), { x: 0, y: 0 }, size);
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
