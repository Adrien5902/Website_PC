import {
	faFlaskVial,
	faPlus,
	faTable,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { Equation, EquationError } from "../../../types/equation";
import unites from "./../../../types/unites.json";
import "./style.css";

function SelectEchelle({ echelle, setEchelle }) {
	return (
		<select
			defaultValue={echelle.toString()}
			key={echelle}
			onChange={(e) => setEchelle(Number(e.target.value))}
		>
			{unites.map((u, i) => (
				<option value={u.puissance} key={i}>
					{`${u.prefix}mol`}
				</option>
			))}
		</select>
	);
}

function parseCoef(ceof: number) {
	return ceof > 1 ? ceof.toString() : "";
}

export default function TableauAvancement() {
	const [equation, setEquation] = useState<Equation | null>(null); //Equation de la réaction
	const [echelle, setEchelle] = useState<number>(0); //Ordre de grandeur mol
	const [quantity, setQuantity] = useState<number[]>([]); //Quantités initiales des réactifs    const [error, setError] = useState<EquationError>(null)
	const [error, setError] = useState<Error | null>(null);
	const [intermediaires, setIntermediaires] = useState<number[]>([]); //Valeur de x des états intermédiaires

	const equationInput = useRef<HTMLInputElement>(null);

	const reactifs = equation?.reactifs ?? [];
	const produits = equation?.produits ?? [];

	function changeEquation(e: React.FormEvent) {
		const input = (e.target as HTMLInputElement).value;
		let newEquation: Equation | undefined;
		try {
			newEquation = Equation.parseString(input);
		} catch (err) {
			if (err instanceof EquationError) {
				setError(err);
			} else {
				throw err;
			}
		}

		setEquation(newEquation);

		if (newEquation) {
			const newReactifs = newEquation?.reactifs;
			setQuantity(
				[...quantity, ...new Array(newReactifs.length).fill(10)].slice(
					0,
					newReactifs.length,
				),
			);

			setError(
				newEquation?.checkForBalance()
					? null
					: new EquationError("L'équation ne semble pas être équilibrée"),
			);
		} else if (!input) {
			setError(null);
		}
	}

	const elements = equation?.sides.flat(1).flatMap((s) => s.data) ?? [];

	const xf = Math.min(...reactifs.map((r, i) => quantity[i] / r.count));
	const reactisLimitants =
		reactifs.filter((mol, i) => quantity[i] - mol.count * xf === 0) ?? [];
	const stoechiometrique = reactisLimitants.length === reactifs.length;

	return (
		<>
			{error ? <p className="error">{error.message}</p> : ""}
			<h1>
				<FontAwesomeIcon icon={faFlaskVial} /> Tableau d'avancement{" "}
				<FontAwesomeIcon icon={faTable} /> :
			</h1>
			<table id="avancement-reaction">
				<thead>
					<tr>
						<td colSpan={2}>Equation de la réaction</td>
						<td
							colSpan={elements.length}
							onClick={() => equationInput.current.focus()}
						>
							<input
								ref={equationInput}
								type="text"
								id="equation-input"
								onChange={changeEquation}
							/>
							<div id="equation">
								{equation?.toJSX() ?? (
									<span id="equation-input-message">
										Veuillez saisir l'équation !
									</span>
								)}
							</div>
						</td>
					</tr>
					<tr>
						<td>État</td>
						<td>
							<span>Avancement </span>
							<SelectEchelle echelle={echelle} setEchelle={setEchelle} />
						</td>
						<td colSpan={elements.length}>
							<span>Quantités de matière </span>
							<SelectEchelle echelle={echelle} setEchelle={setEchelle} />
						</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Initial</td>
						<td>x = 0</td>
						{reactifs.map((_mol, i) => (
							<td key={i} className="reaction-quantity">
								<input
									type="number"
									defaultValue={10}
									onChange={(e) => {
										const newQuant = Number(e.target.value);
										setQuantity((q) => {
											const quant = [...q];
											quant[i] = newQuant;
											if (newQuant > xf || newQuant < 0) {
												setError(new EquationError("La quantité de "));
											}
											return quant;
										});
									}}
								/>
							</td>
						))}
						{produits.map((_mol, i) => (
							<td key={i} className="reaction-quantity">
								0
							</td>
						))}
					</tr>
					<tr>
						<td rowSpan={intermediaires.length + 2}>Intermédiaire</td>
						<td>x quelconque</td>
						{reactifs.map((mol, i) => (
							<td key={i}>
								{quantity[i]} - {parseCoef(mol.count)}x
							</td>
						))}
						{produits.map((mol, i) => (
							<td key={i}>{parseCoef(mol.count)}x</td>
						))}
					</tr>
					{intermediaires.map((x, i) => (
						<tr className="rowspan" key={i}>
							<td>
								<span>x = </span>
								<input
									type="number"
									value={x}
									onChange={(e) => {
										setIntermediaires((inter) => {
											const input = e.target as HTMLInputElement;
											const newI = [...inter];
											newI[i] = Number(input.value);
											return newI;
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faXmark}
									className="accent-hover"
									onClick={() => {
										setIntermediaires((inter) => {
											const newI = [...inter];
											newI.splice(i, 1);
											return [...newI];
										});
									}}
								/>
							</td>
							{reactifs.map((mol, i) => (
								<td key={i}>{(quantity[i] - mol.count * x).toFixed(2)}</td>
							))}
							{produits.map((mol, i) => (
								<td key={i}>
									{parseCoef(mol.count)}x = {(mol.count * x).toFixed(2)}
								</td>
							))}
						</tr>
					))}
					<tr className="rowspan">
						<td
							colSpan={elements.length + 1}
							className="add-state"
							onClick={() => {
								setIntermediaires((i) => [...i, 0]);
							}}
						>
							<FontAwesomeIcon icon={faPlus} />
							<span> Ajouter un état intermédiaire</span>
						</td>
					</tr>
					<tr>
						<td>Final</td>
						<td>xf = {xf.toFixed(2)}</td>
						{reactifs.map((mol, i) => (
							<td key={i}>{(quantity[i] - mol.count * xf).toFixed(2)}</td>
						))}
						{produits.map((mol, i) => (
							<td key={i}>
								{parseCoef(mol.count)}xf = {(mol.count * xf).toFixed(2)}
							</td>
						))}
					</tr>
				</tbody>
			</table>
			<p id="info">
				{reactifs.length ? (
					stoechiometrique ? (
						"Le mélange est stoechiometrique tous les réactifs sont entièrement consommés"
					) : (
						<>
							{reactisLimitants.length > 1
								? "Les réactifs limitant sont "
								: "Le réactif limitant est "}
							{reactisLimitants
								.map((mol, i) => mol.mol.toHTML(i))
								.reduce(
									(prev, curr) => [...prev, prev.length ? " et " : "", curr],
									[],
								)}
						</>
					)
				) : (
					""
				)}
			</p>
		</>
	);
}
