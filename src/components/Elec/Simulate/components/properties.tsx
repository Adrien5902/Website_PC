import { Component } from "./types"

interface Props{
    label: string
    component: Component
    readonly?: boolean
    property: string
    type?: string
    suffix?: string
}

function deepFind(obj: any, path: string) {
    let paths = path.split('.')
        , current = obj
        , i: number;
  
    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }

    return current;
}

function setToValue(obj, path, value) {
    let i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    obj[path[i]] = value;
}

export default function ComponentProperties({label, suffix, component, readonly = false, property, type}: Props) {
    const typeOfProperty = typeof deepFind(component, property)

    const inputType = type ?? (() => {
        switch (typeOfProperty) {
            case "boolean":
                return "checkbox"

            case "number":
                return "number"
        
            default:
                return "text"
        }
    })()

    function parseInputValue(v: string){
        switch (typeOfProperty) {
            case "boolean":
                return v === "true"

            case "number":
                return Number(v)
        
            default:
                return v
        }
    }

    function propertyToString(s: any){
        switch (typeOfProperty) {
            case "boolean":
                return s ? "✅" : "❌"
        
            default:
                return String(s)
        }
    }

    return (
        <div>
            <span>{label}</span>
            {readonly ?
            <span>{propertyToString(deepFind(component, property))}</span>
            :
            <input 
                type={inputType}
                defaultValue={inputType != "checkbox" && deepFind(component, property)}
                defaultChecked={inputType == "checkbox" && deepFind(component, property)}
                onChange={(e) => {
                    setToValue(component, property, inputType == "checkbox" ? e.target.checked : parseInputValue(e.target.value))
                }}
            />
            }
            {inputType == "range" && <span>{deepFind(component, property)}</span>}
            {suffix && <span>{suffix}</span>}
        </div>
    );
}