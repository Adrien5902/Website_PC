import { type Pos, drawImage } from "@/types/canvas";
import { ComponentProperty } from "./properties";
import { getElecImagePath, Component } from "./types";

export default class Interrupteur extends Component {
	opened: boolean;

	static nom = "Interrupteur";

	getDefaultImage(): string {
		return getElecImagePath(`${Interrupteur.nom}Opened`);
	}

	constructor(id: number, pos: Pos) {
		super(0, pos, id, Interrupteur.nom);
		this.opened = true;
	}

	draw = (ctx: CanvasRenderingContext2D, size: number) => {
		const img = this.opened
			? getElecImagePath(`${Interrupteur.nom}Opened`)
			: getElecImagePath(`${Interrupteur.nom}Closed`);

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
