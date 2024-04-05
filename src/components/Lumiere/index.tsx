import {
	faCameraRetro,
	faFillDrip,
	faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Route, Routes } from "react-router-dom";
import Page from "../Page";
import Lentilles from "./Lentilles";
import SpectreCouleur from "./Synthese";

function Lumiere() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<>
						<h1>
							<FontAwesomeIcon icon={faLightbulb} /> Lumière :{" "}
						</h1>
						<div id="pages">
							<Page
								href="/lumiere/lentilles"
								text={
									<span>
										<FontAwesomeIcon icon={faCameraRetro} /> Lentilles
										convergentes
									</span>
								}
								img="./assets/pages/lentilles_convergentes.png"
							/>
							<Page
								href="/lumiere/synthese"
								text={
									<span>
										<FontAwesomeIcon icon={faFillDrip} /> Synthèse des couleurs
									</span>
								}
								img="./assets/pages/synthese.png"
							/>
						</div>
					</>
				}
			/>
			<Route path="/synthese" element={<SpectreCouleur />} />
			<Route path="/lentilles" element={<Lentilles />} />
		</Routes>
	);
}

export default Lumiere;
