import { Navigate, useParams } from "react-router-dom"
import { Atome } from "./funct";
import AtomeCouches from "./couches";
import AtomCell from "./cell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faArrowDown19, faAtom, faCircleLeft, faCircleNodes, faCubes, faEye, faEyeSlash, faHashtag, faObjectGroup, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import AtomeSchema from "./Schema";
import { Isotope } from "./isotope";
import { useState } from "react";

function ViewAtom() {
    const [SchemaShown, ToogleSchema] = useState(false)

    let atome: Atome
    const Z = Number(useParams().Z)

    try {
        atome = Z && new Atome(Z)
    } catch (error) {
        return <Navigate to=".." />
    }

    return (<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginTop: "24px" }}>
            <FontAwesomeIcon className="back" onClick={() => history.go(-1)} icon={faCircleLeft} />

            <div id="atome-name">
                <span>{atome.name}</span>
                <AtomCell defaultHover={true} atome={atome} canBeHovered={false} />
            </div>

            <div className="atome-properties">
                <span><FontAwesomeIcon icon={faHashtag} /> Numéro atomique : {atome.Z}</span>
                <span><FontAwesomeIcon icon={faAddressCard} /> Symbole : {atome.symbol}</span>
                <span><FontAwesomeIcon icon={faArrowDown19} /> Période : {atome.période}</span>
                <span><FontAwesomeIcon icon={faAtom} /> Couches éléctroniques : <AtomeCouches atome={atome} /></span>
                <span><FontAwesomeIcon icon={faCircleNodes} /> Électrons de valence : {atome.valence()}</span>
                <span><FontAwesomeIcon icon={faCubes} /> Bloc : {atome.bloc.toUpperCase()}</span>
                <span><FontAwesomeIcon icon={faWeightHanging} /> Masse Molaire : {atome.M} g/mol</span>
                <span><FontAwesomeIcon icon={faObjectGroup} /> Famille : {atome.family}</span>
            </div>

            <br />

        </div>
        <AtomeSchema atome={new Isotope(atome.Z)} />
    </div>);
}

export default ViewAtom;
