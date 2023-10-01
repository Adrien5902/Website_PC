import { useEffect, useState } from "react";
import { Component, ComponentSide, Connection } from "./types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlugCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
    label: string;
    component: Component;
    readonly?: boolean;
    property: string;
    type?: string;
    suffix?: string;
}

export function ComponentProperty({
    label,
    suffix,
    component,
    readonly = false,
    property,
    type,
}: Props) {
    const typeOfProperty = typeof component[property];

    const inputType = type ?? (() => {
        switch (typeOfProperty) {
            case "boolean":
                return "checkbox";

            case "number":
                return "number";

            default:
                return "text";
        }
    })();

    function parseInputValue(v: string) {
        switch (typeOfProperty) {
            case "boolean":
                return v === "true";

            case "number":
                return Number(v);

            default:
                return v;
        }
    }

    function propertyToString(s: any) {
        switch (inputType) {
            case "boolean":
                return s ? "✅" : "❌";

            default:
                switch (typeOfProperty) {
                    case "boolean":
                        return s ? "✅" : "❌";

                    case "number":
                        return (s as number).toFixed(2).toString();

                    default:
                        return String(s);
                }
        }
    }

    return (
        <div>
            <label>{label}</label>
            {readonly ? (
                <span>{propertyToString(component[property])}</span>
            ) : (
                <input
                    type={inputType}
                    value={component[property]}
                    onChange={(e) => {
                        const newValue =
                            inputType === "checkbox"
                                ? e.target.checked
                                : parseInputValue(e.target.value);
                        component[property] = newValue;
                    }}
                />
            )}
            {inputType === "range" && <span>{component[property]}</span>}
            {suffix && <span>{suffix}</span>}
        </div>
    );
}

export function ComponentProperties(
    {
        c, 
        conns, 
        sizeRef, 
        components}
    : {
        c: ComponentSide, 
        conns: React.MutableRefObject<Connection[]>, 
        sizeRef: React.MutableRefObject<number>
        components: React.MutableRefObject<Component[]>
    }
){
    const [side, setSide] = useState<ComponentSide>(c)

    useEffect(() => {
        setSide(c)
    }, [c])

    function handleNameChange(e){
        side.component.name = (e.target as HTMLInputElement).value
    }

    return (<div id="properties" className="shadow-box">
        {
        side?.component ? 

        <>
        <div id="right-props">
            <div>
                <FontAwesomeIcon icon={faTrash} id="bin"
                    onClick={() => {
                        if(side){
                            const id = side.component?.id
                            conns.current = conns.current.filter(c => !(c.a.component.id == id || c.b.component.id == id))
                            components.current.splice(components.current.findIndex(c => c.id == id), 1)
                            setSide(null)
                        }
                    }}
                />

                <FontAwesomeIcon 
                    id="disconnect"
                    icon={faPlugCircleXmark}
                    onClick={() => {
                        if(side){
                            const id = side.component?.id
                            conns.current = conns.current.filter(c => !(c.a.component.id == id || c.b.component.id == id))
                        }
                    }} 
                />
            </div>

            <div id="size">
                <label htmlFor="range">Taille :</label>
                <input 
                    type="range" 
                    min="64" 
                    max="256" 
                    defaultValue={128}
                    onInput={(e) => {sizeRef.current = Number((e.target as HTMLInputElement).value)}}
                />
            </div>
        </div>

        <div>

            <label htmlFor="component-name-input">Nom : </label>
            <input 
                id="component-name-input"
                type="text"
                defaultValue={side.component?.name}
                onInput={handleNameChange}
            />
        </div>

        {"properties" in side.component && side.component?.properties()}
        {side.component?.pos && <>
            {/* <ComponentProperties label="Pos X : " component={selectedComponent.component} property='pos.x'/>
            <ComponentProperties label="Pos Y : " component={selectedComponent.component} property='pos.y'/> */}
        </>}
        </>
        : ""
        }
    </div>);
}