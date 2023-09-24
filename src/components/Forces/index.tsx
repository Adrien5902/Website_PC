import './style.css'
import { useRef, useState } from 'react';


function Forces() {
    const [result, setResult] = useState(null)
    const [decimals, setDecimals] = useState(2)

    function round(n, decimals){
        return Math.round(n * 10 ** decimals) / 10 ** decimals
    }

    const getInputNumber = (ref) => Number((ref.current as HTMLInputElement).value)

    const G = 6.67*10**-11
    function calcForceGrav(mA, mB, d){
        return round(G*(mA*mB)/(d**2), decimals)
    }

    const mA = useRef()
    const mAe = useRef()
    const mB = useRef()
    const mBe = useRef()
    const d = useRef()
    const de = useRef()

    function handleForceGrav(){
        let mAr = getInputNumber(mA)
        mAr *= 10 ** getInputNumber(mAe)

        let mBr = getInputNumber(mB)
        mBr *= 10 ** getInputNumber(mBe);

        let dr = getInputNumber(d)
        dr *= 10 ** getInputNumber(de);

        setResult(calcForceGrav(mAr, mBr, dr))
    }

    const mObj = useRef()
    const gAstre = useRef()
    const gOther = useRef()

    function calcPoidsSurAstre(mObj, gAstre){
        return round(mObj*gAstre, decimals)
    }

    function handlePoidsSurAstre(){
        let g = getInputNumber(gAstre) ?? getInputNumber(gOther)
        setResult(calcPoidsSurAstre(getInputNumber(mObj), g))
    }

    return (<>
        <div className="formulas">
            <form id="forceGrav">
                <h2>Calculer la force d'interaction gravitationelle entre 2 objets :</h2>

                <label>Masse du 1<sup>er</sup> objet (en kg) :</label>
                <div>
                    <input type="number" ref={mA} onInput={handleForceGrav} placeholder="ex. 12kg..."/>
                    x10^
                    <input type="number" className='e' ref={mAe} onInput={handleForceGrav} defaultValue="0"/>
                </div>

                <br/>

                <label>Masse du 2<sup>ème</sup> objet (en kg) :</label>
                <div>
                    <input type="number" ref={mB} onInput={handleForceGrav} placeholder="ex. 25kg..."/>
                    x10^
                    <input type="number" className='e' ref={mBe} onInput={handleForceGrav} defaultValue="0"/>
                </div>

                <br/>

                <label>Distance entre les deux objets (en m) :</label>
                <div>
                    <input type="number" ref={d} onInput={handleForceGrav} placeholder="ex. 5m..."/>
                    x10^
                    <input type="number" className='e' ref={de} onInput={handleForceGrav} defaultValue="0"/>
                </div>
                <p>Formule : F<sub>A/B</sub> = G x (m<sub>A</sub> x m<sub>B</sub>) / d²</p>
            </form>

            <form >
                <h2>Calculer le poids d'un objet sur un astre :</h2>

                <label>Masse de l'objet (en kg) :</label>
                <input type="number" onInput={handlePoidsSurAstre} ref={mObj} placeholder="ex. 20kg..."/>

                <br/>

                <label>Astre :</label>
                <select onInput={handlePoidsSurAstre} ref={gAstre}>
                    <option value="9.807">Terre 🌍</option>
                    <option value="1.62">Lune 🌕</option>
                    <option value="274">Soleil ☀️</option>
                    <option value="3.721">Mars ☄️</option>
                    <option value="10.44">Saturne 🪐</option>
                    <option value="other">Autre...</option>
                </select>
                <input className="hide" type="number" ref={gOther} placeholder="Valeur de la gravité sur l'astre... ex: 9.8"/>
                
                <p>Formule : P<sub>objet</sub> = m<sub>objet</sub> x g<sub>astre</sub></p>
            </form>
        </div>
        
        {result ? <div id="formula-result">
            <span>Résultat : {result} N</span>
        </div> : ""}

        <br/>

        <label htmlFor="valeurs">Valeurs :</label>
        <ul>
            <li>G = 6.67 x 10<sup>-11</sup> N • m<sup>2</sup> • kg <sup>-2</sup></li>
            <li>g<sub>Terre</sub> = 9.807 N • kg<sup>-1</sup></li>
            <li>g<sub>Lune</sub> = 1.62 N • kg<sup>-1</sup></li>
            <li>g<sub>Soleil</sub> = 274 N • kg<sup>-1</sup></li>
            <li>g<sub>Mars</sub> = 3.721 N • kg<sup>-1</sup></li>
            <li>g<sub>Saturne</sub> = 10.44 N • kg<sup>-1</sup></li>
        </ul>
    </>);
}

export default Forces;