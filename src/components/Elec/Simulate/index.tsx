import './style.css'
import { useEffect, useRef, useState } from "react";
import { Component, ComponentSide, Connection, Pos, Side, PowerSource } from "./components/types";
import ComponentDrag from './components/drag';

import cableImg from './img/cable.png'
import binImg from './img/bin.png'
import disconnectImg from './img/disconnect.png';
import Générateur from './components/Générateur';
import ImageBank from './img/bank';
import Lampe from './components/Lampe';
import { drawDot, drawLine, getCtx } from './components/functions';
import Interupteur from './components/Interrupteur';
import Pile from './components/Pile';
import ComponentProperties from './components/properties';
import { Circuit } from './components/circuit';


const componentTypes = [
    Générateur,
    Lampe,
    Interupteur,
    Pile
]

function ElecSimulate() {
    const [cableMouse, setCableMouse] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState<ComponentSide>(null)
    const movingComponent = useRef<Component>(null)

    const components = useRef<Component[]>([])
    const connections = useRef<Connection[]>([])

    const componentSizeRef = useRef<number>(128)

    const [idMax, setIdMax] = useState<number>(0)
    const frameRate = 60

    const mousePosRef = useRef<Pos>({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLCanvasElement>()

    const getConnections = (c: Component) =>  connections.current.filter(con => con.a.component == c || con.b.component == c).map(con => con.a.component.id != c.id ? con.a : con.b)

    function handleDrop(e){
        const pos = getMousePos(e)
        const type = e.dataTransfer.getData("text/plain")

        const componentType = componentTypes.find(t => type == t.nom)
        
        if(componentType){
            const component = new componentType(idMax, pos)
        
            components.current.push(component)
            setIdMax((prevId) => prevId + 1);
            setSelectedComponent(new ComponentSide(component, 0))
        }
        
        canvasRef.current.style.border = ''
    }

    function getMousePos(evt) {
        const canvas = canvasRef.current
        var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;
    
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }

    function selectComponent(mousePos: Pos) : ComponentSide{
        const componentSize = componentSizeRef.current
        let side = 0 as Side
        const component = components.current.find((component) => {
            let x = mousePos.x - component.pos.x
            let y = mousePos.y - component.pos.y
            
            side = x > 0 ? 1 : -1

            return Math.abs(x) < componentSize/2 && Math.abs(y) < componentSize/2
        })

        return component ? new ComponentSide(component, side) : null
    }


    function handleMouseDown(e){
        const mousePos = getMousePos(e)
        const componentSide = selectComponent(mousePos)

        setSelectedComponent(componentSide)
        movingComponent.current = componentSide?.component

        if(movingComponent.current && !cableMouse){
            movingComponent.current.pos = mousePos
        }
    }

    function handleMouseUp(e){
        const componentBSide = selectComponent(getMousePos(e))

        const isMovingCable = cableMouse && movingComponent.current && selectedComponent.side

        if(isMovingCable){
            if(componentBSide && componentBSide.component.id != movingComponent.current.id){
                const a = new ComponentSide(movingComponent.current, selectedComponent.side)
                const b = componentBSide

                connections.current.push(new Connection(a, b))
            }
        }

        movingComponent.current = null
    }

    function handleMouseMove(e){
        const mousePos = getMousePos(e)
        mousePosRef.current = mousePos

        if(movingComponent.current && !cableMouse){
            movingComponent.current.pos = mousePos
        }
    }

    function drawCanvas(ctx: CanvasRenderingContext2D, mousePos: Pos, componentSize: number){
        if(canvasRef.current){
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.font = componentSize/3 + "px sans-serif"
            ctx.lineWidth = componentSize/12;
            components.current.forEach(component => component.draw(ctx, componentSize))

            components.current.filter(c => "getVoltage" in c).forEach((component) => {
                const on = typeof component["on"] !== "undefined" ? (component as Générateur).on : true
                const circuit = new Circuit(connections.current)
            })

            connections.current.forEach(c => {
                const sidePosA = c.a.getPos(componentSize), sidePosB = c.b.getPos(componentSize)
                drawDot(ctx, sidePosA)
                drawDot(ctx, sidePosB)
                c.draw(ctx, componentSize)
            })

            if(cableMouse){
                const componentSide = selectComponent(mousePos)
                if(componentSide){
                    const sidePos = componentSide.getPos(componentSize)
                    drawDot(ctx, sidePos)
                }

                if(movingComponent.current && selectedComponent.side){
                    const sidePos = selectedComponent.getPos(componentSize)
                    drawDot(ctx, sidePos)
                    drawLine(ctx, sidePos, mousePos)
                }
            }
        }
    }

    useEffect(() => {
        const ctx = getCtx(canvasRef)

        const intervalId = setInterval(() => {
            drawCanvas(ctx, mousePosRef.current, componentSizeRef.current)
        }, 1000/frameRate)
    
        return () => clearInterval(intervalId);
    }, [components, mousePosRef.current, componentSizeRef.current])

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.ondragover = (event) => {
            event.preventDefault()
            canvas.style.borderStyle = 'dashed'
            canvas.style.borderColor = '#009eff'
        }

        canvas.ondragleave = () => canvas.style.border = '';

        function resizeCanvas(){
            canvas.setAttribute('width', (canvas.getBoundingClientRect().width * 2).toString())
            canvas.setAttribute('height', (canvas.getBoundingClientRect().height * 2).toString())
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas);
    }, [])
    
    const nameInput = useRef<HTMLInputElement>(null)
    const handleNameChange = () => selectedComponent.component.name = nameInput.current.value
    useEffect(() => {if(nameInput.current) {nameInput.current.value = selectedComponent?.component.name}}, [selectedComponent])

    return (<>
        <img className="back" onClick={() => history.go(-1)} src="/assets/back-arrow.png" alt="←"/>
        
        <h1>Simulation de circuit électriques</h1>
        
        <div id="app" className={cableMouse ? 'cable' : ""}>
            <div>
                <div id="components">
                    <div className="componentBox">
                        <img src={cableImg} className={cableMouse ? 'cable' : ""} onClick={() => setCableMouse(cable => ! cable)} draggable="false"/>
                        <span>Câble</span>
                    </div>
                    <ComponentDrag img={ImageBank.GénérateurOff} name={"Générateur"}/>
                    <ComponentDrag img={ImageBank.PileOff} name={"Pile"}/>
                    <ComponentDrag img={ImageBank.LampeOff} name={"Lampe"}/>
                    <ComponentDrag img={ImageBank.InterrupteurOpened} name={"Interrupteur"}/>
                    {/* <ComponentDrag img={Moteur} name={"Moteur"}/> */}
                </div>
    
                <canvas 
                    id="result" 
                    ref={canvasRef} 
                    width="800" 
                    height="400"
                    onDrop={handleDrop}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                ></canvas>
            </div>

            <div>
                <img 
                    src={binImg} 
                    onClick={() => {
                        if(selectedComponent){
                            const id = selectedComponent.component.id
                            connections.current = connections.current.filter(c => !(c.a.component.id == id || c.b.component.id == id))
                            components.current.splice(components.current.findIndex(c => c.id == id), 1)
                            setSelectedComponent(null)
                        }
                    }}
                    alt="🗑" 
                    id="bin"
                />
                <img 
                    src={disconnectImg} 
                    id="disconnect" 
                    onClick={() => {
                        if(selectedComponent){
                            const id = selectedComponent.component.id
                            connections.current = connections.current.filter(c => !(c.a.component.id == id || c.b.component.id == id))
                        }
                    }} 
                    alt=""
                />
                <label htmlFor="range">Taille</label>
                <input 
                    type="range" 
                    min="64" 
                    max="256" 
                    defaultValue={128}
                    onInput={(e) => {componentSizeRef.current = Number((e.target as HTMLInputElement).value)}}
                />

                <div id="properties">
                    {
                    selectedComponent ? 

                    <>
                    <input 
                        type="text" 
                        ref={nameInput}
                        onInput={handleNameChange}
                    />
                    {selectedComponent?.component.properties && selectedComponent.component.properties()}
                    {selectedComponent?.component.pos && <>
                        {/* <ComponentProperties label="Pos X : " component={selectedComponent.component} property='pos.x'/>
                        <ComponentProperties label="Pos Y : " component={selectedComponent.component} property='pos.y'/> */}
                    </>}
                    </>
                    : ""
                    }
                </div>
            </div>
        </div>
    </>)
}

export default ElecSimulate;