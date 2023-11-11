import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Isotope } from "../components/Atom/isotope"
import { Molécule } from "../components/Molecules/molecules"
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
            side
            .split(" + ")
            .map(m => ({
                mol: Molécule.parseString(m.replace(m.match(/^\d+/)?.[0] ?? "", "").replaceAll(" ", "")), 
                count: m.match(/^\d+/)?.[0] ?? 1
            })) as EquationSideData
        )

        return new this(data)
    }

    toJSX(){
        return this.sides.map((side, i) => 
            side.data.map(
                (mol, j) => <span key={"mol" + i + j}>{mol.count > 1 ? mol.count : ""}{mol.mol.toHTML()}</span>
            ).reduce(
                (prev, current, j) => 
                [...prev, prev.length ? <span key={"plus" + i + j}> + </span> : "", current], []
            )
        ).reduce(
            (prev, current, k) => 
            [...prev, prev.length ? <FontAwesomeIcon style={{margin: ".5em"}} key={"arrow" + k} icon={faArrowRight}/>: "", current], []
        ) as JSX.Element[]
    }
}