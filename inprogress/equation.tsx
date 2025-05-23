import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Isotope } from "../src/components/Atom/isotope";
import { Molécule } from "./Molecules/molecules";

export class EquationError extends Error {}

type EquationSideData = {
	mol: Molécule;
	count: number;
}[];

type EquationSide = {
	data: EquationSideData;
	counts: { atome: Isotope; count: number }[];
};

export class Equation {
	sides: EquationSide[];
	reactifs: EquationSideData;
	produits: EquationSideData;

	constructor(sides: EquationSideData[]) {
		if (sides.length !== 2) {
			throw new EquationError(
				'La réaction doit contenir des réactifs et des produits délémitez les avec "->"',
			);
		}

		this.sides = sides.map(
			(data) =>
				({
					data,
					counts: data
						.flatMap((mol) =>
							mol.mol.data.map((a) => ({
								atome: a.atome,
								count: a.count * mol.count,
							})),
						)
						.reduce((prev, curr) => {
							const otherSameAtomIndex = (
								prev as { atome: Isotope; count: number }[]
							).findIndex((v) => v.atome.Z === curr.atome.Z);
							if (otherSameAtomIndex >= 0) {
								prev[otherSameAtomIndex].count += curr.count;
								return prev;
							}
							return [...prev, curr];
						}, []),
				}) as EquationSide,
		);

		this.reactifs = this.sides[0].data ?? [];
		this.produits = this.sides[1].data ?? [];

		const types = ["réactif", "produit"];
		for (const i in types) {
			const nextI = (Number(i) + 1) % types.length;
			const type = types[nextI];
			for (const mol of this.sides[i].counts) {
				const other = (this.sides[nextI] as EquationSide).counts.find(
					(m) => m.atome.Z === mol.atome.Z,
				);
				if (!other) {
					throw new EquationError(
						`Aucun ${type} trouvé pour l'élément ${mol.atome.name} (${mol.atome.symbol})`,
					);
				}
			}
		}
	}

	static parseString(input: string) {
		const sides = input.split("->");

		const data = sides.map(
			(side) =>
				side
					.split("+")
					.map((m) => m.replaceAll(" ", ""))
					.filter((m) => m)
					.map((m) => ({
						mol: Molécule.parseString(
							m.replace(m.match(/^\d+/)?.[0] ?? "", "").replaceAll(" ", ""),
						),
						count: m.match(/^\d+/)?.[0] ?? 1,
					})) as EquationSideData,
		);

		return new Equation(data);
	}

	checkForBalance() {
		const réactifs = this.sides[0].counts;
		const produits = this.sides[1].counts;

		return réactifs
			.map(
				(atome) =>
					(produits.find((a) => a.atome.Z === atome.atome.Z)?.count ?? 0) ===
					atome.count,
			)
			.reduce((prev, curr) => prev && curr, true);
	}

	toJSX() {
		return this.sides
			.map((side, i) =>
				side.data
					.map((mol, j) => (
						<span key={`mol${i}${j}`}>
							{mol.count > 1 ? mol.count : ""}
							{mol.mol.toHTML()}
						</span>
					))
					.reduce(
						(prev, current, j) => [
							...prev,
							prev.length ? <span key={`plus${i}${j}`}> + </span> : "",
							current,
						],
						[],
					),
			)
			.reduce(
				(prev, current, k) => [
					...prev,
					prev.length ? (
						<FontAwesomeIcon
							style={{ margin: ".5em" }}
							key={`arrow${k}`}
							icon={faArrowRight}
						/>
					) : (
						""
					),
					current,
				],
				[],
			) as JSX.Element[];
	}
}
