import { Isotope } from "../Atom/isotope";

export class Molécule{
    data: Isotope[]

    constructor(isotopes: Isotope[]){
        this.data = isotopes
    }

    toHTML = () => <span className="molecule-string">{
        this.map(isotope => <>{isotope.}</>)
    }</span>
}