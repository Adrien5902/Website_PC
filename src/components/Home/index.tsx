import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Page from "../Page";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Home() {
    return ( <>
    <p>
        Bonjour et bienvenue sur le site web de Adrien.
        <br/>Un site dédié sur la physique chimie pour M.Humbert.
    </p>

    <h3>Pages intéressantes : </h3>
    <div id="pages">
        <Page href="/atom" text="Tableau périodique" img='/assets/pages/periodicTable.png'></Page>
        <Page href="/elec/simulate" text="Simulation de circuits électriques" img='/assets/pages/elecSchema.png'></Page>
        <Page href="/forces" text="Calcul des forces" img="/assets/pages/forces.jpg"></Page>
        <Page href="/lentilles" text="Lentilles convergentes" img="/assets/pages/lentilles_convergentes.png"></Page>
    </div>

    <a 
        href="https://github.com/Adrien5902/Website_PC" 
        target="_blank" 
        className="cyan unlink"
    >
        <span>Vers le github du projet </span>
        <FontAwesomeIcon icon={faGithub}/>
    </a>
    </>);
}

export default Home;