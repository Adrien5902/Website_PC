import { Route, Routes } from "react-router-dom";
import Page from "../Page";
import MoleculesEquation from "./Equation";

function Molecules() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<div id="pages">
						<Page
							href="/molecules/lewis"
							img="./assets/pages/"
							text="Schéma de Lewis"
						/>
						<Page
							href="/molecules/equation"
							img="./assets/pages/equation_molecules.png"
							text="Equations moléculaires"
						/>
					</div>
				}
			/>

			<Route path="/lewis" />

			<Route path="/equation" element={<MoleculesEquation />} />
		</Routes>
	);
}

export default Molecules;
