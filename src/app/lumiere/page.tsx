"use client";
import {
	faCameraRetro,
	faFillDrip,
	faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Page from "@/components/Page";

function Lumiere() {
	return (
		<>
			<h1>
				<FontAwesomeIcon icon={faLightbulb} /> Lumière :{" "}
			</h1>
			<div id="pages">
				<Page
					href="/lumiere/lentilles"
					text={
						<span>
							<FontAwesomeIcon icon={faCameraRetro} /> Lentilles optiques
						</span>
					}
					img="/assets/pages/lentilles_convergentes.png"
				/>
				<Page
					href="/lumiere/synthese"
					text={
						<span>
							<FontAwesomeIcon icon={faFillDrip} /> Synthèse des couleurs
						</span>
					}
					img="/assets/pages/synthese.png"
				/>
			</div>
		</>
	);
}

export default Lumiere;
