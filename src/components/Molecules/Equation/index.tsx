import { useState } from "react"
import { Molécule } from "../molecules"
import { Isotope } from "../../Atom/isotope";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

class EqError extends Error{
    constructor(message: string){
        super(message)
    }
}

function ppcm(a: number, b: number) {
    function pgcd(x: number, y: number) {
        if (y === 0) {
            return x;
        } else {
            return pgcd(y, x % y);
        }
    }

    return (a * b) / pgcd(a, b);
}

function MoleculesEquation({}) {
    const [result, setResult] = useState<JSX.Element[]>()

    function handleInput(e){
        const input = (e.target as HTMLInputElement).value
        try {
            parseEquation(input)
        } catch (error) {
            if(error instanceof EqError){
                console.log(error.message)
            }else{
                throw error
            }
        }
    }

    function parseEquation(input: string) {
        const sides = input.split(" -> ")
        if(sides.length != 2){
            throw new EqError("The equation must have to sides")
        }

        const equation = sides
        .map(side => ({
            data: side.split(" + ").map(m => ({mol: Molécule.parseString(m), count: 1})),
            counts: null
        }))

        equation
            .map(
                side => 
                side.counts = side.data
                    .map(mol => mol.mol.data.map(a => ({atome: a.atome, count: a.count * mol.count})))
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
        )

        

        const resString = equation.map(side => 
            side.data.map(
                (mol, i) => <span key={i}>{mol.count}{mol.mol.toHTML()}</span>
            ).reduce(
                (prev, current) => 
                [...prev, prev.length ? <span key="plus"> + </span> : "", current], []
            )
        ).reduce(
            (prev, current) => 
            [...prev, prev.length ? <FontAwesomeIcon style={{margin: ".5em"}} icon={faArrowRight}/>: "", current], []
        )

        setResult(resString)
    }

    return (<>
        <input type="text" onInput={handleInput}/>
        <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>{result}</p>
    </>);
}

export default MoleculesEquation;