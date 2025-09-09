"use client";
import { useState } from "react";
import {
	Atome,
	type Bloc,
	atomes,
	colorByBloc,
	couchesLimit,
	familles,
	gazNobles,
	getColorByElectronegativite,
} from "./funct";
import SectionSelector from "../SectionSelector";
import AtomCell from "./Cell";

interface Props {
	selectedAtomZ: number | null;
}

export function PeriodicTable({ selectedAtomZ }: Props) {
	const [selectedBloc, setSelectedBloc] = useState<Bloc | null>(null);
	const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

	const spaces: [number, number, Bloc?][] = [
		[17, 1],
		[11, 2],
		[11, 2],
		[1, 2],
		[1, 2],
		[1, 2, "f"],
		[1, 2, "f"],
	];

	const defaultSection = 0;
	const sections = [
		{
			label: "Blocs",
			content: (
				<>
					{(Object.keys(couchesLimit) as Bloc[]).map((bloc, i) => (
						<div
							className="block"
							key={i}
							onMouseEnter={() => setSelectedBloc(bloc)}
							onMouseLeave={() => setSelectedBloc(null)}
						>
							<div style={{ backgroundColor: colorByBloc(bloc, 7) }} />
							<span>Bloc {bloc}</span>
						</div>
					))}
				</>
			),
		},
		{
			label: "Électronégativité",
			content: (
				<div>
					<div
						style={{
							width: "100%",
							height: "1.5em",
							background: `linear-gradient(90deg, ${getColorByElectronegativite(
								0.7,
							)} 0%, ${getColorByElectronegativite(
								2.3,
							)} 50%, ${getColorByElectronegativite(4)} 100%)`,
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<span>0.7</span>
						<span>4</span>
					</div>
				</div>
			),
		},
		{
			label: "Famille",
			content: (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
					}}
				>
					{familles.map((famille, i) => (
						<div
							key={famille}
							onMouseEnter={() => setSelectedFamily(famille)}
							onMouseLeave={() => setSelectedFamily(null)}
							className="block"
						>
							<div
								style={{
									background: `hsl(${
										(360 / familles.length) * i
									}deg, 100%, 50%)`,
								}}
							/>
							<span>{famille}</span>
						</div>
					))}
				</div>
			),
		},
	];

	const [selectedSection, setSelectedSection] = useState(
		sections[defaultSection].label,
	);

	function color(atome: Atome): string {
		switch (selectedSection) {
			case "Blocs":
				return colorByBloc(atome.bloc, atome.période);
			case "Électronégativité":
				return getColorByElectronegativite(atome?.electronegativite);
			case "Famille":
				return `hsl(${
					(360 / familles.length) * familles.indexOf(atome.family)
				}deg, 100%, 50%)`;
			default:
				return "transparent";
		}
	}

	const atomCells = (période: number, bloc?: Bloc) => {
		const cells = atomes
			.filter((element) => {
				let blocCheck = element.bloc !== "f";
				if (bloc) {
					blocCheck = element.bloc === bloc;
				}

				return element.période === période && blocCheck;
			})
			.map((atome, j) => (
				<td key={j}>
					{atome ? (
						<AtomCell
							atome={atome}
							color={color(atome)}
							selected={
								selectedBloc === atome.bloc ||
								selectedAtomZ === atome.Z ||
								selectedFamily === atome.family
							}
							defaultHover={selectedAtomZ === atome.Z}
							canBeHovered={true}
						/>
					) : (
						""
					)}
				</td>
			));

		// Empty spaces pointing to table overflow for last two rows
		if (spaces[période - 1] && bloc !== "f") {
			const space = spaces[période - 1];
			const [spaceCount, index, bloc] = space;
			cells.splice(
				index,
				0,
				<td
					key={cells.length}
					style={{
						background: bloc
							? (() => {
									switch (selectedSection) {
										case "Blocs":
											return colorByBloc(bloc, période);
										case "Électronégativité":
											return getColorByElectronegativite(undefined);
										case "Famille":
											return "var(--gray)";
										default:
											break;
									}
								})()
							: "",
					}}
					colSpan={spaceCount}
					className={bloc && "atom-cell"}
				/>,
			);
		}

		return cells;
	};

	return (
		<>
			<table>
				<tbody>
					{gazNobles
						.map((Z) => new Atome(Z))
						.map((gaz, i) => (
							<tr key={i}>{atomCells(gaz.période)}</tr>
						))}
					<tr>
						<td colSpan={2} />
						<td>↓</td>
					</tr>
					<tr>{atomCells(6, "f")}</tr>
					<tr>{atomCells(7, "f")}</tr>
				</tbody>
			</table>
			<SectionSelector
				id="legende"
				{...{ defaultSection, sections }}
				onSelection={(sectionLabel) => {
					setSelectedSection(sectionLabel);
				}}
			/>
		</>
	);
}

export default PeriodicTable;
