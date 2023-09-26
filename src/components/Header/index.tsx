import { Link, useLocation } from "react-router-dom"
import './style.css'

function Header() {
    return (
        <header>
            <Link className="unlink" to="/">
                <img src="/assets/logo.png" alt="[Nom du site]"/>
            </Link>
            
            <div id="links">
            {[
                {id: "atom", name: "Atomes"},
                {id: "elec", name: "Électricité"},
                {id: "forces", name: "Forces"},
                {id: "molecules", name: "Molécules"},
            ].map((page, i) => (
                <Link
                    to={"/"+page.id} 
                    key={i}
                    className={useLocation().pathname.split("/")[1] == page.id ? "underlined" : ""}
                >{page.name}</Link>
            ))}
            </div>
        </header>
    );
}

export default Header;