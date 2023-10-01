import { Navigate, useLocation } from "react-router-dom"
import { Atome } from "../funct";
import AtomeCouches from "../Couches";
import AtomCell from "../Cell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faArrowDown19, faAtom, faCubes, faHashtag, faObjectGroup, faWeightHanging } from "@fortawesome/free-solid-svg-icons";

function ViewAtom() {
    const Z = Number(new URLSearchParams(useLocation().search).get("Z"))
    const atome = new Atome(Z)

    return (<>
        {atome ? 
        
        <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "24px"}}>
            <img className="back" onClick={()=>history.go(-1)} src="../assets/back-arrow.png" alt="←"/>

            <div id="atome-name">
                <span>{atome.name}</span>
                <AtomCell defaultHover={true} atome={atome} canBeHovered={false}/>
            </div>
            
            <div className="atome-properties">
                <span><FontAwesomeIcon icon={faHashtag}/> Numéro atomique : {atome.Z}</span>
                <span><FontAwesomeIcon icon={faAddressCard}/> Symbole : {atome.symbol}</span>
                <span><FontAwesomeIcon icon={faArrowDown19}/> Période : {atome.période}</span>
                <span><FontAwesomeIcon icon={faAtom}/> Couches éléctroniques : <AtomeCouches atome={atome}/></span>
                <span><FontAwesomeIcon icon={faCubes}/> Bloc : {atome.bloc}</span>
                <span><FontAwesomeIcon icon={faWeightHanging}/> Masse Molaire : {atome.M} g/mol</span>
                <span><FontAwesomeIcon icon={faObjectGroup}/> Famille : {atome.family}</span>
            </div>
        
        </div>
        
        
        : <Navigate to="./"/>}   
    </>);
}

export default ViewAtom;