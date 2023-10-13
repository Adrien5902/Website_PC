import { Atome } from "./funct";

export class Isotope extends Atome{
    electrons: number
    A: number

    constructor(Z: number, A?: number, electrons?: number){
        super(Z)
        this.A = A ?? Z * 2
        this.electrons = electrons ?? Z
    }

    getN = () => this.A - this.Z
}