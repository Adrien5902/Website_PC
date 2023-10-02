import elements from "../Atom/elements.json";
import { Isotope } from "../Atom/isotope";

export class Molécule{
    data: {atome: Isotope, count: number}[]

    constructor(data: {atome: Isotope, count: number}[]){
        this.data = data
    }

    toHTML = () => <span className="molecule-string">{
        this.data.map(d => <span>{d.atome.symbol}<sub>{d.count}</sub></span>)
    }</span>

    static parseString(input: string){
        const isotopes = input.split(/(?=[A-Z])/)
        .map(part => ({
            atome: new Isotope(elements.find(a => part.includes(a.symbol)).Z),
            count: Number(part.match(/\d+/)?.[0]) || 1
        }))
        return new Molécule(isotopes)
    }
}