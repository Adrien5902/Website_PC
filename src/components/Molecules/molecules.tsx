import elements from "../Atom/elements.json";
import { Isotope } from "../Atom/isotope";

export class Molécule{
    data: {atome: Isotope, count: number}[]

    constructor(data: {atome: Isotope, count: number}[]){
        this.data = data
    }

    toHTML = (key? : number) => <span className="molecule-string" key={key}>{
        this.data.map((d, i) => <span key={i}>{d.atome.symbol}{d.count > 1 && <sub>{d.count}</sub>}</span>)
    }</span>

    static parseString(input: string){
        const isotopes = input.split(/(?=[A-Z])/)
        .map(part => ({
            atome: new Isotope(elements.find(a => part.replace(/\d+/g, '') == a.symbol).Z),
            count: Number(part.match(/\d+/)?.[0]) || 1
        }))
        return new Molécule(isotopes)
    }
}