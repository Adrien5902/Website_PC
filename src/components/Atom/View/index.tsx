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
                <span id="Z">Numéro atomique : {atome.Z}</span>
                <span id="symbol">Symbole : {atome.symbol}</span>
                <span id="période">Période : {atome.période}</span>
                <span id="couches">Couches éléctroniques : <AtomeCouches atome={atome}/></span>
                <span id="bloc">Bloc : {atome.bloc}</span>
                <span id="M">Masse Molaire : {atome.M} g/mol</span>
            </div>
        
        </div>
        
        
        : <Navigate to="./"/>}

        {/* <script>
            let atome = new atom(params.Z);

            let name = document.querySelector(".atom#name")
            name.innerHTML = atome.name

            let cellParent = document.querySelector(".atom#cell")
            cellParent.innerHTML = atome.cell()

            let properties = document.querySelector(".atom#properties")
            properties.childNodes.forEach((child) => {
                if(child.id == "couches"){
                    child.innerHTML += atome.couchesString()
                }else{
                    let text = atome[child.id]
                    if(child.getAttribute && child.getAttribute("unit")){
                        text += " " + child.getAttribute("unit")
                    }
                    child.innerHTML += text
                }
            })
        </script> */}
    
    </>);
}

export default ViewAtom;