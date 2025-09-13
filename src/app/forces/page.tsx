"use client";

import {
	faArrowsLeftRight,
	faDownLeftAndUpRightToCenter,
	faEarth,
	faSquareRootVariable,
	faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import "./style.css";

function Forces() {
	const [result, setResult] = useState<string | null>(null);
	const [decimals, setDecimals] = useState(2);
	const [astre, setAstre] = useState<string | null>(null);

	const getInputNumber = (
		ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>,
	) => {
		const value = ref.current?.value;
		const num = value?.trim().replaceAll(" ", "");
		return Number(num);
	};

	const G = 6.67 * 10 ** -11;
	const calcForceGrav = (mA: number, mB: number, d: number) =>
		((G * (mA * mB)) / d ** 2).toFixed(decimals);

	const mA = useRef<HTMLInputElement>(null);
	const mAe = useRef<HTMLInputElement>(null);
	const mB = useRef<HTMLInputElement>(null);
	const mBe = useRef<HTMLInputElement>(null);
	const d = useRef<HTMLInputElement>(null);
	const de = useRef<HTMLInputElement>(null);

	function handleForceGrav() {
		let mAr = getInputNumber(mA);
		mAr *= 10 ** getInputNumber(mAe);

		let mBr = getInputNumber(mB);
		mBr *= 10 ** getInputNumber(mBe);

		let dr = getInputNumber(d);
		dr *= 10 ** getInputNumber(de);

		setResult(calcForceGrav(mAr, mBr, dr));
	}

	const mObj = useRef<HTMLInputElement>(null);
	const gAstre = useRef<HTMLSelectElement>(null);
	const gOther = useRef<HTMLInputElement>(null);

	const calcPoidsSurAstre = (mObj: number, gAstre: number) =>
		(mObj * gAstre).toFixed(decimals);

	function handlePoidsSurAstre() {
		const g = getInputNumber(gAstre) || getInputNumber(gOther);
		setAstre(gAstre.current?.value ?? "Terre");
		setResult(calcPoidsSurAstre(getInputNumber(mObj), g));
	}

	const values = [
		{ value: 9.807, name: "Terre", emoji: "🌍" },
		{ value: 1.62, name: "Lune", emoji: "🌕" },
		{ value: 274, name: "Soleil", emoji: "☀️" },
		{ value: 3.721, name: "Mars", emoji: "☄️" },
		{ value: 10.44, name: "Saturne", emoji: "🪐" },
	];

	return (
		<>
			<div className="formulas">
				<form>
					<h2>
						<FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} /> Calculer la
						force d'interaction gravitationelle entre 2 objets :
					</h2>

					<label htmlFor="1objm">
						<FontAwesomeIcon icon={faWeightHanging} /> Masse du 1<sup>er</sup>{" "}
						objet (en kg) :
					</label>
					<div>
						<input
							id="1objm"
							type="text"
							ref={mA}
							onInput={handleForceGrav}
							placeholder="ex. 12kg..."
						/>
						x10^
						<input
							type="text"
							className="e"
							ref={mAe}
							onInput={handleForceGrav}
							defaultValue="0"
						/>
					</div>

					<br />

					<label htmlFor="2objm">
						<FontAwesomeIcon icon={faWeightHanging} /> Masse du 2<sup>ème</sup>{" "}
						objet (en kg) :
					</label>
					<div>
						<input
							id="2objm"
							type="text"
							ref={mB}
							onInput={handleForceGrav}
							placeholder="ex. 25kg..."
						/>
						x10^
						<input
							type="text"
							className="e"
							ref={mBe}
							onInput={handleForceGrav}
							defaultValue="0"
						/>
					</div>

					<br />

					<label htmlFor="distance">
						<FontAwesomeIcon icon={faArrowsLeftRight} /> Distance entre les deux
						objets (en m) :
					</label>
					<div>
						<input
							id="distance"
							type="text"
							ref={d}
							onInput={handleForceGrav}
							placeholder="ex. 5m..."
						/>
						x10^
						<input
							type="text"
							className="e"
							ref={de}
							onInput={handleForceGrav}
							defaultValue="0"
						/>
					</div>
					<p>
						<FontAwesomeIcon icon={faSquareRootVariable} /> Formule : F
						<sub>A/B</sub> = G x (m<sub>A</sub> x m<sub>B</sub>) / d²
					</p>
				</form>

				<form>
					<h2>
						<FontAwesomeIcon icon={faWeightHanging} /> Calculer le poids d'un
						objet sur un astre :
					</h2>

					<label htmlFor="poids-sur-astre">
						<FontAwesomeIcon icon={faWeightHanging} /> Masse de l'objet (en kg)
						:
					</label>
					<input
						type="text"
						onInput={handlePoidsSurAstre}
						ref={mObj}
						placeholder="ex. 20kg..."
						id="poids-sur-astre"
					/>

					<br />

					<label htmlFor="select-astre">
						<FontAwesomeIcon icon={faEarth} /> Astre :
					</label>
					<select id="select-astre" onInput={handlePoidsSurAstre} ref={gAstre}>
						{values.map((v, i) => (
							<option value={v.value} key={i}>
								{`${v.name} ${v.emoji}`}
							</option>
						))}

						<option value="other">Autre...</option>
					</select>
					<input
						className={astre === "other" ? "" : "hide"}
						onChange={handlePoidsSurAstre}
						type="text"
						ref={gOther}
						placeholder="Valeur de la gravité sur l'astre... ex: 9.8"
					/>

					<p>
						<FontAwesomeIcon icon={faSquareRootVariable} /> Formule : P
						<sub>objet</sub> = m<sub>objet</sub> x g<sub>astre</sub>
					</p>

					<span>Valeurs :</span>
					<ul>
						<li>
							G = 6.67 x 10<sup>-11</sup> N • m<sup>2</sup> • kg <sup>-2</sup>
						</li>

						{values.map((v) => (
							<li key={v.name}>
								g<sub>{v.name}</sub> = {v.value} N • kg<sup>-1</sup>
							</li>
						))}
					</ul>
				</form>
			</div>

			{result ? (
				<div id="formula-result">
					<span>Résultat : {result} N</span>
				</div>
			) : (
				""
			)}
		</>
	);
}

export default Forces;
