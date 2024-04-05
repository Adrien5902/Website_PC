import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SearchAtom from "./Search";
import "./style.css";
import TableauPeriodique from "./table";
import ViewAtom from "./view";

function Atom() {
	const [selectedAtomZ, setSelectedAtomZ] = useState<number>(null);
	const [search, setSearch] = useState<string>("");

	return (
		<>
			<Routes>
				<Route path="/view/" element={<Navigate to="../" />} />

				<Route path="/view/:Z" element={<ViewAtom />} />

				<Route
					path="/"
					element={
						<>
							<SearchAtom
								search={search}
								setSearch={setSearch}
								setSelectedAtomZ={setSelectedAtomZ}
							/>
							<TableauPeriodique selectedAtomZ={selectedAtomZ} />
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default Atom;
