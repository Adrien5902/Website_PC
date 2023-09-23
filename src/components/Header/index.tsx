import { Link, useLocation } from "react-router-dom"

function Header() {
    return (
        <header>
            <Link className="unlink" to="/">
                <img src="' + scriptSrc + '/../../assets/logo.png" alt="[Nom du site]"/>
            </Link>
            
            {[
                {id: "/atom", name: "Atomes"},
                {id: "/elec", name: "Électricité"},
                {id: "/forces", name: "Forces"},
            ].map((page, i) => (
                <Link
                    to={page.id} 
                    key={i}
                    className={useLocation().pathname.split("/")[0] == page.id ? "underlined" : ""}
                >{page.name}</Link>
            ))}
        </header>
    );
}

export default Header;