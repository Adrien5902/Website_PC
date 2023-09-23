import { Link } from "react-router-dom";
import { atom, couchesList } from "../funct"

function AtomeCouches({atome = new atom(1), shortened = true}) {
    return (
        <span>
            {(shortened && atome.lastGazNoble) ? 
                <>
                    <span>[</span>
                    <Link to={"/atom/view?Z="+atome.lastGazNoble.Z} className="cyan unlink tooltip">
                        {atome.lastGazNoble.symbol}
                        <span className="tooltip-text">
                            {<AtomeCouches atome={atome.lastGazNoble} shortened={false}/>}
                        </span>
                    </Link>
                    <span>]</span>
                </>
                : ""
            }

            {
                couchesList
                .filter(couche => atome.couches[couche] && (!shortened  || (atome.lastGazNoble && atome.couches[couche] != atome.lastGazNoble.couches[couche])))
                .map((couche, i) => <span key={i}>
                    ({couche}<sup>{atome.couches[couche]}</sup>)
                </span>)
            }
        </span>
    );
}

export default AtomeCouches;