import AtomeCouches from "../Couches";
import AtomCell from "../Cell";
import { atom } from "../funct";

function AtomSearchResult({atome, setSelectedAtomZ}: {atome: atom, setSelectedAtomZ: any}) {
    return ( 
        <div className="atom-search-result">
            <AtomCell setSelectedAtomZ={setSelectedAtomZ} atome={atome} canBeHovered={false}></AtomCell>

            <div style={{display : "grid", margin: "auto 20px"}}>
                <span className="el-name">Nom : {atome.name}</span>
                <span className="el-symbol">Symbole : {atome.symbol}</span>
                <span className="el-z">Numéro atomique : {atome.Z}</span>
                <span className="el-couches">Couches électroniques : {<AtomeCouches shortened={true} atome={atome}/>}</span>
                <span className="el-mol">Masse molaire : {atome.M}</span>
            </div>
        </div>
    );
}

export default AtomSearchResult;