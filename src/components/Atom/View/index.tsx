import { Navigate, useLocation } from "react-router-dom"
import { atom } from "../funct";
import AtomeCouches from "../Couches";
import AtomCell from "../Cell";

function ViewAtom() {
    const Z = Number(new URLSearchParams(useLocation().search).get("Z"))
    const atome = new atom(Z)

    return (<>
        {atome ? 
        
        <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "24px"}}>
            <img className="back" onClick={()=>history.go(-1)} src="../assets/back-arrow.png" alt="←"/>

            <div id="atome-name">
                <span>{atome.name}</span>
                <AtomCell defaultHover={true} atome={atome} canBeHovered={false}/>
            </div>
            
            <div className="atome-properties">
                <span>Numéro atomique : {atome.Z}</span>
                <span>Symbole : {atome.symbol}</span>
                <span>Période : {atome.période}</span>
                <span>Couches éléctroniques : <AtomeCouches atome={atome}/></span>
                <span>Bloc : {atome.bloc}</span>
                <span>Masse Molaire : {atome.M} g/mol</span>
                <span>Famille : {atome.family}</span>
            </div>
        
        </div>
        
        
        : <Navigate to="./"/>}   
    </>);
}

export default ViewAtom;