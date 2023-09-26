import { Atome, atomes } from "./funct";

export class Isotope extends Atome{
    electrons: number
    A: number

    constructor(Z: number, A: number, electrons?: number){
        super(Z)
        this.A = A
        this.electrons = electrons ?? Z
    }

    getN = () => this.A - this.Z

    static parseString(input: string){
        atomes.find(a => input.includes(a.symbol))
    }
}