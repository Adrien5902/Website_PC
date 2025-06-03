"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Page from "@/components/Page";
import { faCameraRetro, faFillDrip } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
	return (
		<>
			<p>
				Bonjour et bienvenue sur le site web de physique-chimie de Adrien
				Monneret.
			</p>

			<h3>Pages intéressantes : </h3>
			<div id="pages">
				<Page
					href="/atom"
					text="Tableau périodique"
					img="/assets/pages/periodicTable.png"
				/>
				<Page
					href="/elec/simulate"
					text="Simulation de circuits électriques"
					img="/assets/pages/elecSchema.png"
				/>
				<Page
					href="/forces"
					text="Calcul des forces"
					img="/assets/pages/forces.jpg"
				/>
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
				<Page
					href="/reactions/tableau-avancement"
					img="/assets/pages/tableau_avancement.png"
					text="Tableau d'Avancement"
				/>
			</div>

			<a
				href="https://github.com/Adrien5902/Website_PC"
				target="_blank"
				className="cyan unlink"
				rel="noreferrer"
			>
				<span>Vers le github du projet </span>
				<FontAwesomeIcon icon={faGithub} />
			</a>
		</>
	);
}
