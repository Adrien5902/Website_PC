import { EquationError } from "../../types/equation";
import elements from "../Atom/elements.json";
import { Isotope } from "../Atom/isotope";

export class Molécule {
	data: { atome: Isotope; count: number }[];

	constructor(data: { atome: Isotope; count: number }[]) {
		this.data = data;
	}

	toHTML = (key?: number) => (
		<span className="molecule-string" key={key}>
			{this.data.map((d, i) => (
				<span key={i}>
					{d.atome.symbol}
					{d.count > 1 && <sub>{d.count}</sub>}
				</span>
			))}
		</span>
	);

	static parseString(input: string) {
		const isotopes = input.split(/(?=[A-Z])/).map((part) => {
			const symbol = part.replace(/\d+/g, "");
			const element = elements.find((a) => symbol === a.symbol);

			if (!element) {
				throw new EquationError(
					`Élément introuvable vérifier que le symbole "${symbol}" existe bien sur le tableau périodique.`,
				);
			}

			const atome = new Isotope(element.Z);

			return {
				atome,
				count: Number(part.match(/\d+/)?.[0]) || 1,
			};
		});
		return new Molécule(isotopes);
	}
}
