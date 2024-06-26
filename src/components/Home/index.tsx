import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCameraRetro, faFillDrip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Page from "../Page";

function Home() {
	return (
		<>
			<p>
				Bonjour et bienvenue sur le site web de Adrien.
				<br />
				Un site dédié sur la physique chimie pour M.Humbert.
			</p>

			<h3>Pages intéressantes : </h3>
			<div id="pages">
				<Page
					href="/atom"
					text="Tableau périodique"
					img="./assets/pages/periodicTable.png"
				/>
				<Page
					href="/elec/simulate"
					text="Simulation de circuits électriques"
					img="./assets/pages/elecSchema.png"
				/>
				<Page
					href="/forces"
					text="Calcul des forces"
					img="./assets/pages/forces.jpg"
				/>
				<Page
					href="/lumiere/lentilles"
					text={
						<span>
							<FontAwesomeIcon icon={faCameraRetro} /> Lentilles convergentes
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
				<Page
					href="/reactions/tableau-avancement"
					img="./assets/pages/tableau_avancement.png"
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

export default Home;
