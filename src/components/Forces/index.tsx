import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css'
import { useRef, useState } from 'react';
import { faArrowsLeftRight, faDownLeftAndUpRightToCenter, faEarth, faSquareRootVariable, faWeightHanging } from '@fortawesome/free-solid-svg-icons';


function Forces() {
    const [result, setResult] = useState(null)
    const [decimals, setDecimals] = useState(2)
    const [astre, setAstre] = useState(null)

    const getInputNumber = (ref) => Number((ref.current as HTMLInputElement).value)

    const G = 6.67*10**-11
    const calcForceGrav = (mA, mB, d) => (G*(mA*mB)/(d**2)).toFixed(decimals)

    const mA = useRef<HTMLInputElement>(null)
    const mAe = useRef<HTMLInputElement>(null)
    const mB = useRef<HTMLInputElement>(null)
    const mBe = useRef<HTMLInputElement>(null)
    const d = useRef<HTMLInputElement>(null)
    const de = useRef<HTMLInputElement>(null)

    function handleForceGrav(){
        let mAr = getInputNumber(mA)
        mAr *= 10 ** getInputNumber(mAe)

        let mBr = getInputNumber(mB)
        mBr *= 10 ** getInputNumber(mBe);

        let dr = getInputNumber(d)
        dr *= 10 ** getInputNumber(de);

        setResult(calcForceGrav(mAr, mBr, dr))
    }

    const mObj = useRef<HTMLInputElement>(null)
    const gAstre = useRef<HTMLSelectElement>(null)
    const gOther = useRef<HTMLInputElement>(null)

    const calcPoidsSurAstre = (mObj, gAstre) => (mObj*gAstre).toFixed(decimals)

    function handlePoidsSurAstre(){
        let g = getInputNumber(gAstre) || getInputNumber(gOther)
        setAstre(gAstre.current.value)
        setResult(calcPoidsSurAstre(getInputNumber(mObj), g))
    }

    return (<>
        <div className="formulas">
            <form id="forceGrav">
                <h2><FontAwesomeIcon icon={faDownLeftAndUpRightToCenter}/> Calculer la force d'interaction gravitationelle entre 2 objets :</h2>

                <label><FontAwesomeIcon icon={faWeightHanging}/> Masse du 1<sup>er</sup> objet (en kg) :</label>
                <div>
                    <input type="number" ref={mA} onInput={handleForceGrav} placeholder="ex. 12kg..."/>
                    x10^
                    <input type="number" className='e' ref={mAe} onInput={handleForceGrav} defaultValue="0"/>
                </div>

                <br/>

                <label><FontAwesomeIcon icon={faWeightHanging}/> Masse du 2<sup>ème</sup> objet (en kg) :</label>
                <div>
                    <input type="number" ref={mB} onInput={handleForceGrav} placeholder="ex. 25kg..."/>
                    x10^
                    <input type="number" className='e' ref={mBe} onInput={handleForceGrav} defaultValue="0"/>
                </div>

                <br/>

                <label><FontAwesomeIcon icon={faArrowsLeftRight}/> Distance entre les deux objets (en m) :</label>
                <div>
                    <input type="number" ref={d} onInput={handleForceGrav} placeholder="ex. 5m..."/>
                    x10^
                    <input type="number" className='e' ref={de} onInput={handleForceGrav} defaultValue="0"/>
                </div>
                <p><FontAwesomeIcon icon={faSquareRootVariable}/> Formule : F<sub>A/B</sub> = G x (m<sub>A</sub> x m<sub>B</sub>) / d²</p>
            </form>

            <form >
                <h2><FontAwesomeIcon icon={faWeightHanging}/> Calculer le poids d'un objet sur un astre :</h2>

                <label><FontAwesomeIcon icon={faWeightHanging}/> Masse de l'objet (en kg) :</label>
                <input type="number" onInput={handlePoidsSurAstre} ref={mObj} placeholder="ex. 20kg..."/>

                <br/>

                <label><FontAwesomeIcon icon={faEarth}/>  Astre :</label>
                <select onInput={handlePoidsSurAstre} ref={gAstre}>
                    <option value="9.807">Terre 🌍</option>
                    <option value="1.62">Lune 🌕</option>
                    <option value="274">Soleil ☀️</option>
                    <option value="3.721">Mars ☄️</option>
                    <option value="10.44">Saturne 🪐</option>
                    <option value="other">Autre...</option>
                </select>
                <input className={astre == "other" ? "" : "hide"} onChange={handlePoidsSurAstre} type="number" ref={gOther} placeholder="Valeur de la gravité sur l'astre... ex: 9.8"/>
                
                <p><FontAwesomeIcon icon={faSquareRootVariable}/> Formule : P<sub>objet</sub> = m<sub>objet</sub> x g<sub>astre</sub></p>
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