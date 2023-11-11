import { Route, Routes } from "react-router-dom";
import Lentilles from "./Lentilles";
import SpectreCouleur from "./Synthese";
import Page from "../Page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro, faFillDrip, faLightbulb } from "@fortawesome/free-solid-svg-icons";

function Lumiere() {
    return <Routes>
        <Route path="/" element={<>
            <h1><FontAwesomeIcon icon={faLightbulb}/> Lumière : </h1>
            <div id="pages">
                <Page 
                    href="/lumiere/lentilles" 
                    text={<span><FontAwesomeIcon icon={faCameraRetro}/> Lentilles convergentes</span>} 
                    img="./assets/pages/lentilles_convergentes.png"
                ></Page>
                <Page
                    href="/lumiere/synthese" 
                    text={<span><FontAwesomeIcon icon={faFillDrip}/> Synthèse des couleurs</span>} 
                    img="./assets/pages/synthese.png"
                ></Page>
            </div>
        </>}/>
        <Route path="/synthese" element={<SpectreCouleur/>}/>
        <Route path="/lentilles" element={<Lentilles/>}/>
    </Routes>
}

export default Lumiere;