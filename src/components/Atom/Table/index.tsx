import { useState } from "react";
import AtomCell from "../Cell";
import { Bloc, Atome, atomes, couchesLimit, gazNobles } from "../funct";

function TableauPeriodique({selectedAtomZ}) {
    const [selectedBloc, setSelectedBloc] = useState<Bloc>(null)

    const spaces : [number, number, Bloc?][] = [
        [17, 1],
        [11, 2],
        [11, 2],
        [1, 2],
        [1, 2],
        [1, 2, "f"],
        [1, 2, "f"],
    ]

    function colorByBloc(bloc: Bloc, period: number){ //Change la couleur de la cellule en fcnt de la période et du bloc de l'atome
        let rgb: string = null
        let color: number

        if(bloc === "s"){ //Bloc S
            color = 255 - (((period + 1) ** 1.3) * 16)
            rgb = 'rgb(' + color + ', ' + color + ', 255)';
        }else if(bloc === "p"){ //Bloc P
            color = 255 - (period ** 2.2 * 3)
            rgb = 'rgb(' + color + ', 255, ' + color + ')';
        }else if(bloc === "d"){ //Bloc D
            color = 255 - (period ** 3 /1.8)
            rgb = 'rgb(255 , 255, ' + color + ')';
        }else if(bloc === "f"){ //Bloc F
            color = (255 - (period ** 2.9) + 100)
            rgb = "rgb(255, " + color + ", " + color +")"
        }
        
        return rgb
    }

    const atomCells = (période: number, bloc?: Bloc) => {
        const cells = atomes
        .filter(element => {
            let blocCheck = element.bloc != "f"
            if(bloc){
                blocCheck = element.bloc == bloc
            }

            return element.période == période && blocCheck
        })
        .map((atome, j) => 
            <td key={j}>
                {atome ? <AtomCell
                    atome={atome} 
                    color={colorByBloc(atome.bloc, atome.période)}
                    selected={selectedBloc == atome.bloc || selectedAtomZ == atome.Z}
                    defaultHover={selectedAtomZ == atome.Z}
                    canBeHovered={true}
                ></AtomCell> : ""}
            </td>
        )

        if(spaces[période - 1] && bloc != "f"){
            const space = spaces[période - 1]
            const [spaceCount, index, color] = space
            cells.splice(index, 0, <td key={cells.length} style={{background: color ? colorByBloc(color, période) : ""}} colSpan={spaceCount}></td>)
        }

        return cells
    }

    return ( 
        <table style={{margin: "24px auto"}}>
            <tbody>
                {gazNobles.map((Z) => new Atome(Z)).map((gaz, i) => (
                    <tr key={i}>
                        {atomCells(gaz.période)}
                    </tr>
                ))}
                <tr><td colSpan={2}></td><td>↓</td></tr>
                <tr>{atomCells(6, "f")}</tr>
                <tr>{atomCells(7, "f")}</tr>
            </tbody>
            <tfoot id="legende">
                {(Object.keys(couchesLimit) as Bloc[]).map((bloc, i) => 
                    <tr key={i} onMouseEnter={() => setSelectedBloc(bloc)} onMouseLeave={() => setSelectedBloc(null)}>
                        <td style={{backgroundColor: colorByBloc(bloc, 7)}}></td>
                        <td>Bloc {bloc.toUpperCase()}</td>
                    </tr>
                )}
            </tfoot>
        </table>
    );
}

export default TableauPeriodique;