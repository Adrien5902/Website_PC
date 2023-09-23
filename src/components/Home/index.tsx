import Page from "../Page";

function Home() {
    return ( <>
    <p>
        Bonjour et bienvenue sur le site web de Adrien.
        <br/>Un site dédié sur la physique chimie pour M.Humbert.
    </p>

    <h3>Pages intéressantes : </h3>
    <div id="pages">
        <Page href="/atom" text="Tableau périodique" img='./../../assets/pages/periodicTable.png'></Page>
        <Page href="/elec/simulate" text="Simulation de circuit électrique" img='./../../assets/pages/elecSchema.png'></Page>
        <Page href="/forces" text="Calcul des forces" img="./../../assets/pages/forces.jpg"></Page>
    </div>

    <a href="https://github.com/Adrien5902/Website_PC" target="_blank" className="cyan unlink">Vers le github du projet</a>
    </>);
}

export default Home;