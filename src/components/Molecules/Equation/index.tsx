import { useState } from "react"
import { Molécule } from "../molecules"

class EqError extends Error{
    constructor(message: string){
        super(message)
    }
}


function MoleculesEquation({}) {
    const [result, setResult] = useState("")

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
        const sides = input.split(" > ")
        if(sides.length != 2){
            throw new EqError("The equation must have to sides")
        }

        const equation = sides.map(side => side.split(" + ")).map(side => side.map(m => Molécule.parseString(m)))
        const res = equation.map(side => side.map(mol => mol.toHTML()).join(" + ")).join(" -> ")
        console.log(res)
        setResult(res)
    }

    return (<>
        <input type="text" onInput={handleInput}/>
        <p>{result}</p>
    </>);
}

export default MoleculesEquation;