import { Link } from "react-router-dom"
import './style.css'
import { faAtom, faBolt, faCameraRetro, faDna, faMagnet } from "@fortawesome/free-solid-svg-icons";
import HeaderLink from "./links";

function Header() {
    return (
        <header>
            <Link className="unlink" to="/">
                <img src="./assets/logo.png" alt="[Nom du site]"/>
            </Link>
            
            <div id="links">
                <HeaderLink id="atom" name="Atomes" icon={faAtom}/>
                <HeaderLink id="elec" name="Électricité" icon={faBolt}/>
                <HeaderLink id="forces" name="Forces" icon={faMagnet}/>
                <HeaderLink id="molecules" name="Molécules" icon={faDna}/>
                <HeaderLink id="lentilles" name="Lentilles" icon={faCameraRetro}/>
            </div>
        </header>
    );
}

export default Header;