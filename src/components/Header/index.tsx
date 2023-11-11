import { Link } from "react-router-dom"
import './style.css'
import { faAtom, faBolt, faCameraRetro, faChartLine, faDna, faFillDrip, faFlask, faFlaskVial, faMagnet, faSlash } from "@fortawesome/free-solid-svg-icons";
import HeaderLink from "./links";
import HeaderDropDown from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Header() {
    const [experiments, setExperiments] = useState(false)

    return (
        <header>
            <Link className="unlink" to="/">
                <img src="./assets/logo.png" alt="[Nom du site]"/>
            </Link>
            
            <div id="links">
                <HeaderDropDown name="Physique">
                    <HeaderLink id="forces" name="Forces" icon={faMagnet}/>
                    <HeaderLink id="elec" name="Électricité" icon={faBolt}/>
                    <HeaderLink id="lentilles" name="Lentilles" icon={faCameraRetro}/>
                    <HeaderLink id="lumiere/couleur" name="Spectres de couleur" icon={faFillDrip}/>
                </HeaderDropDown>

                <HeaderDropDown name="Chimie">
                    <HeaderLink id="atom" name="Atomes" icon={faAtom}/>
                    {
                        experiments ?
                        <>
                        <HeaderLink id="molecules" name="Molécules" icon={faDna}/>
                        <HeaderLink id="reactions" name="Réactions chimique" icon={faFlaskVial}/>
                        </>
                        : <></>
                    }
                </HeaderDropDown>

                {
                    experiments ?
                    <HeaderDropDown name="Autres">
                        <HeaderLink id="graph" name="Graphiques" icon={faChartLine}/>
                    </HeaderDropDown>
                    : ""
                }
            </div>
            <div id="experiments" onClick={() => setExperiments(e => !e)}>
                <FontAwesomeIcon icon={faFlask}/>
                <FontAwesomeIcon className="slash" icon={faSlash} style={{display: experiments ? "none" : "block"}}/>
            </div>
        </header>
    );
}

export default Header;