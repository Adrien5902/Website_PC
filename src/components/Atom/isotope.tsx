import { Atome } from "./funct";

export class Isotope extends Atome {
	electrons: number;
	A: number;

	constructor(Z: number, A?: number, electrons?: number) {
		super(Z);
		this.A = A ?? Math.round(new Atome(Z).M);
		this.electrons = electrons ?? Z;
	}

	getN = () => this.A - this.Z;
}
