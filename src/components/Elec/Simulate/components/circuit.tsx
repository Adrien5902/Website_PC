import { Connection, PowerSource, Récepteur } from "./types";

export function Circuit(connections: Connection[]){
    const components = connections.map(c => c.getComponents()).flat(1).filter(
        (c, i, arr) => 
        arr.indexOf(c) != i
    )

    const récepteurs: Récepteur[] = components.filter(c => "R" in c) as Récepteur[]
    const Rtotal = récepteurs.reduce((r, c) => r + c.R, 0)

    const powerSources : PowerSource[] = components.filter(c => "getVoltage" in c) as PowerSource[]
    const V = powerSources.reduce((v, c) => v + c.getVoltage(), 0)

    const I = V / Rtotal
    
    récepteurs.forEach(r => r.I = I)
}