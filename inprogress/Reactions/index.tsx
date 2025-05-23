import { Route, Routes } from "react-router-dom";
import Page from "../../src/components/Page";
import TableauAvancement from "./TableauAvancement";

export default function ReactionsChimique() {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<div id="pages">
							<Page
								href="/reactions/tableau-avancement"
								img="/assets/pages/tableau_avancement.png"
								text="Tableau d'Avancement"
							/>
						</div>
					}
				/>
				<Route path="tableau-avancement" element={<TableauAvancement />} />
			</Routes>
		</>
	);
}
