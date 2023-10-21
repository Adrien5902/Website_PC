import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Isotope } from "../../Atom/isotope"
import { Molécule } from "../molecules"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

export class EqError extends Error{
    constructor(message: string){
        super(message)
    }
}

type EquationSideData = {
    mol: Molécule,
    count: number
}[]

type EquationSide = {
    data: EquationSideData
    counts: {atome: Isotope, count: number}[]
}

export class Equation{
    sides: EquationSide[]

    constructor(sides: EquationSideData[]){
        this.sides = sides.map(data => ({
            data,
            counts: data
                .map(
                    mol => mol.mol.data.map(a => ({atome: a.atome, count: a.count * mol.count}))
                )
                .flat(1)
                .reduce((prev, curr) => {
                    const otherSameAtomIndex = (prev as {atome: Isotope, count: number}[]).findIndex((v) => v.atome.Z == curr.atome.Z)
                    if(otherSameAtomIndex >= 0){
                        prev[otherSameAtomIndex].count += curr.count
                        return prev
                    }else{
                        return [...prev, curr]
                    }
                }, [])
        } as EquationSide))
    }

    static parseString(input: string){
        const sides = input.split(" -> ")
        if(sides.length != 2){
            throw new EqError("The equation must have to sides")
        }

        const data = sides.map(
            side => 
            side.split(" + ").map(m => ({mol: Molécule.parseString(m), count: 1})) as EquationSideData
        )

        return new this(data)
    }

    toString(){
        return this.sides.map(side => 
            side.data.map(
                (mol, i) => <span key={i}>{mol.count}{mol.mol.toHTML()}</span>
            ).reduce(
                (prev, current) => 
                [...prev, prev.length ? <span key="plus"> + </span> : "", current], []
            )
        ).reduce(
            (prev, current) => 
            [...prev, prev.length ? <FontAwesomeIcon style={{margin: ".5em"}} icon={faArrowRight}/>: "", current], []
        ) as JSX.Element[]
    }
}