import { drawImage, type Pos } from "@/types/canvas";
import { ComponentProperty } from "./properties";
import { getElecImagePath, PowerSource } from "./types";

export default class Générateur extends PowerSource {
	id: number;
	pos: Pos;
	name: string;

	getDefaultImage(): string {
		return getElecImagePath(`${Générateur.nom}Off`);
	}

	static nom = "Générateur";

	constructor(id: number, pos: Pos) {
		super(10);
		this.id = id;
		this.pos = pos;
		this.on = true;
		this.name = Générateur.nom;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		const { x, y } = this.pos;
		const img = this.on
			? getElecImagePath(`${Générateur.nom}On`)
			: getElecImagePath(`${Générateur.nom}Off`);

		ctx.fillText("+", x + size / 2, y - size / 2);
		ctx.fillText("-", x - size / 2, y - size / 2);
		drawImage(ctx, img, this.pos, size);
		ctx.fillText(this.name, this.pos.x + size / 2, this.pos.y + size / 2);
	};

	properties = () => [
		<ComponentProperty
			label="Activé : "
			property="on"
			component={this}
			key={1}
		/>,
		<ComponentProperty
			label="Force électromotrice (E) : "
			type="range"
			suffix="V"
			property="U"
			component={this}
			key={2}
		/>,
	];
}
