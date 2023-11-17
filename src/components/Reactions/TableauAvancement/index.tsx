import { useRef, useState } from 'react';
import './style.css'
import { Equation } from '../../../types/equation';
import unites from './../../../types/unites.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlaskVial, faPlus, faTable, faXmark } from '@fortawesome/free-solid-svg-icons';

function SelectEchelle({echelle, setEchelle}){
    return <select defaultValue={echelle.toString()} key={echelle} onChange={(e) => setEchelle(Number(e.target.value))}>
        {
            unites.map((u, i) => <option value={u.puissance} key={i}>
                {u.prefix + "mol"}
            </option>)
        }
    </select>
}

function parseCoef(ceof: number){
    return ceof > 1 ? ceof.toString() : ""
}

export default function TableauAvancement() {
    const [equation, setEquation] = useState<Equation | null>(null) //Equation de la réaction
    const [echelle, setEchelle] = useState<number>(0) //Ordre de grandeur mol
    const [quantity, setQuantity] = useState<number[]>([]) //Quantités initiales des réactifs
    const [intermediaires, setIntermediaires] = useState<number[]>([]) //Valeur de x des états intermédiaires

    const addStateInput = useRef<HTMLInputElement>(null)
    const equationInput = useRef<HTMLInputElement>(null)

    const reactifs = equation?.sides[0].data ?? []
    const produits = equation?.sides[1].data ?? []

    function changeEquation(e: React.FormEvent){
        const input = (e.target as HTMLInputElement).value
        const newEquation = Equation.parseString(input)
        setEquation(newEquation)

        const reactifs = newEquation?.sides[0].data
        setQuantity([...quantity, ...(new Array(reactifs.length).fill(10))].slice(0, reactifs.length))
    }

    const elements = equation?.sides.flat(1).map(s => s.data).flat(1) ?? []

    const xf = Math.min(...quantity.map((q, i) => q/reactifs[i].count))
    const reactisLimitants = reactifs.filter((mol, i) => quantity[i] - mol.count * xf == 0) ?? []
    const stoechiometrique = reactisLimitants.length == reactifs.length


    return (<>
    <h1><FontAwesomeIcon icon={faFlaskVial}/> Tableau d'avancement <FontAwesomeIcon icon={faTable}/> :</h1>
    <table id="avancement-reaction">
        <thead>
            <tr>
                <td colSpan={2}>Equation de la réaction</td>
                <td colSpan={elements.length} onClick={()=> equationInput.current.focus()}>
                    <input ref={equationInput} type="text" id='equation-input' onChange={changeEquation}/>
                    <div id='equation'>{equation?.toJSX()}</div>
                </td>
            </tr>
            <tr>
                <td>État</td>
                <td>
                    <span>Avancement </span>
                    <SelectEchelle echelle={echelle} setEchelle={setEchelle}/>
                </td>
                <td colSpan={elements.length}>
                    <span>Quantités de matière </span>
                    <SelectEchelle echelle={echelle} setEchelle={setEchelle}/>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Initial</td>
                <td>x = 0</td>
                {
                    reactifs.map((_mol, i) => <td key={i} className='reaction-quantity'>
                        <input type="number" defaultValue={10} onChange={(e) => {
                            setQuantity(q => {
                                const quant = [...q]
                                quant[i] = Number(e.target.value)
                                return quant
                            })
                        }}/>
                    </td>)
                }
                {
                    produits.map((_mol, i) => <td key={i} className='reaction-quantity'>0</td>)
                }
            </tr>
            <tr>
                <td rowSpan={intermediaires.length + 2}>Intermédiaire</td>
                <td>x quelconque</td>
                {
                    reactifs.map((mol, i) => <td key={i}>
                        {quantity[i]} - {parseCoef(mol.count)}x
                    </td>)
                }
                {
                    produits.map((mol, i) => <td key={i}>
                        {parseCoef(mol.count)}x
                    </td>)
                }
            </tr>
            {
                intermediaires.map((x, i) => <tr key={i}>
                    <td>
                        <span>x = </span>
                        <input type="number" defaultValue={x} onInput={(e) => {
                            setIntermediaires(inter => {
                                const newI = [...inter]
                                newI[i] = Number((e.target as HTMLInputElement).value)
                                return newI
                            })
                        }}/>
                        <FontAwesomeIcon icon={faXmark} className='accent-hover' onClick={() => {
                            setIntermediaires(inter => {
                                const newI = [...inter]
                                newI.splice(i, 1)
                                return newI
                            })
                        }}/>
                    </td>
                    {
                        reactifs.map((mol, i) => <td key={i}>
                            {(quantity[i] - mol.count * x).toFixed(2)}
                        </td>)
                    }
                    {
                        produits.map((mol, i) => <td key={i}>
                            {parseCoef(mol.count)}x = {(mol.count * x).toFixed(2)}
                        </td>)
                    }
                </tr>)
            }
            <tr>
                <td colSpan={elements.length + 1} className="add-state" onClick={() => {
                    setIntermediaires(i => [...i, 0])
                }}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <span> Ajouter un état intermédiaire</span>
                </td>
            </tr>
            <tr>
                <td>Final</td>
                <td>xf = {xf.toFixed(2)}</td>
                {
                    reactifs.map((mol, i) => <td key={i}>
                        {(quantity[i] - mol.count * xf).toFixed(2)}
                    </td>)
                }
                {
                    produits.map((mol, i) => <td key={i}>
                        {parseCoef(mol.count)}xf = {(mol.count * xf).toFixed(2)}
                    </td>)
                }
            </tr>
        </tbody>
    </table>
    <p id='info'>{
        reactifs.length ?
        stoechiometrique ? 
        "Le mélange est stoechiometrique tous les réactifs sont entièrement consommés" 
        : 
        <>
            {reactisLimitants.length > 1 ? "Les réactifs limitant sont " : "Le réactif limitant est "}
            {reactisLimitants.map((mol, i) => mol.mol.toHTML(i)).reduce((prev, curr) => [...prev, prev.length ? " et " : "", curr] , [])}
        </>
        :""
        }</p>
    </>);
}