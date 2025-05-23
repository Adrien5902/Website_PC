import { useEffect } from "react";
import { atomes } from "../funct";
import AtomSearchResult from "./result";

interface Props {
	setSelectedAtomZ: React.Dispatch<React.SetStateAction<number | null>>;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	search: string;
}

function AtomSearch({ setSelectedAtomZ, setSearch, search }: Props) {
	const stringToSearch = (s: string) =>
		s
			.normalize("NFD")
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase();

	function handleInput(e: React.FormEvent<HTMLInputElement>) {
		const input = (e.target as HTMLInputElement).value;
		setSearch(stringToSearch(input));
		setSelectedAtomZ(null);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: this breaks the code if array isn't empty
	useEffect(() => {
		setSelectedAtomZ(null);
	}, []);

	return (
		<div id="search">
			<label htmlFor="search-input">Rechercher un atome : </label>
			<input
				id="search-input"
				style={{ fontSize: "1em", width: "40vw" }}
				type="text"
				placeholder="par nom, par symbole ou par numéro atomique..."
				onInput={handleInput}
				defaultValue={search}
			/>

			<div id="search-results">
				{search
					? atomes
							.filter((atome) => {
								const name = stringToSearch(atome.name).includes(search);
								const symbol = stringToSearch(atome.symbol) === search;
								const Z = atome.Z === Number(search);
								return Z || name || symbol;
							})
							.sort((atome) =>
								stringToSearch(atome.symbol) === search ? -1 : 1,
							)
							.map((atome, i) => (
								<AtomSearchResult
									setSelectedAtomZ={setSelectedAtomZ}
									key={i}
									atome={atome}
								/>
							))
							.slice(0, 3)
					: ""}
			</div>
		</div>
	);
}

export default AtomSearch;
