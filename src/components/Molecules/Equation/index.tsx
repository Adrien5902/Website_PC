import { useState } from "react"
import { EqError, Equation } from "../../../types/equation";

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
            const eq = Equation.parseString(input)
            setResult(eq.toJSX())
        } catch (error) {
            if(error instanceof EqError){
                console.log(error.message)
            }else{
                throw error
            }
        }
    }

    return (<>
        <input type="text" onInput={handleInput}/>
        <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>{result}</p>
    </>);
}

export default MoleculesEquation;