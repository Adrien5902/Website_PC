import { Link } from "react-router-dom"
import './style.css'
import { faAtom, faBolt, faCameraRetro, faChartLine, faDna, faFillDrip, faFlaskVial, faMagnet } from "@fortawesome/free-solid-svg-icons";
import HeaderLink from "./links";
import HeaderDropDown from "./dropdown";

function Header() {
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
                        import.meta.env.DEV ? //Uncomment when done
                        <>
                        <HeaderLink id="molecules" name="Molécules" icon={faDna}/>
                        <HeaderLink id="reactions" name="Réactions chimique" icon={faFlaskVial}/>
                        </>
                        : <></>
                    }
                </HeaderDropDown>

                {
                    import.meta.env.DEV ? //Uncomment when done
                    <HeaderDropDown name="Autres">
                        <HeaderLink id="graph" name="Graphiques" icon={faChartLine}/>
                    </HeaderDropDown>
                    : ""
                }
            </div>
        </header>
    );
}

export default Header;