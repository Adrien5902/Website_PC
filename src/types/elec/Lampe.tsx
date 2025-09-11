import { type Pos, drawImage } from "@/types/canvas";
import { ComponentProperty } from "./properties";
import { getElecImagePath, Récepteur } from "./types";

export default class Lampe extends Récepteur {
	P = 0;

	getDefaultImage(): string {
		return getElecImagePath(Lampe.nom);
	}

	static nom = "Lampe";

	constructor(id: number, pos: Pos) {
		super(3, pos, id, Lampe.nom);
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		const lightnessRatio = this.P / 50;
		const lightness =
			lightnessRatio > 1 ? 1 : lightnessRatio < 0 ? 0 : lightnessRatio;

		if (lightness > 0) {
			if (lightnessRatio > 1) {
				ctx.beginPath();
				ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
				ctx.arc(
					this.pos.x,
					this.pos.y,
					size / 2 + ((lightnessRatio - 1) * size) / 2,
					0,
					Math.PI * 2,
				);
				ctx.fill();
			}

			ctx.fillStyle = `rgba(255,255,0, ${lightness})`;
			ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, size / 2, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.fillStyle = "black";

		ctx.save();
		drawImage(ctx, this.getDefaultImage(), this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	properties = () => [
		<ComponentProperty
			label="Allumée : "
			component={this}
			property="P"
			key={1}
			readonly={true}
			type="boolean"
		/>,
		<ComponentProperty
			label="Résistance : "
			suffix=" Ω"
			component={this}
			property="R"
			key={2}
		/>,
		<ComponentProperty
			label="Puissance : "
			suffix=" W"
			component={this}
			property="P"
			key={3}
			readonly={true}
		/>,
		// <ComponentProperty label="Tension : " suffix=" V" component={this} property="U" key={4} readonly={true}/>,
		// <ComponentProperty label="Intensité : " suffix=" A" component={this} property="I" key={5} readonly={true}/>,
	];
}
