import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormEvent, useEffect, useRef } from "react"

function makeFreqSound(freq: number) {
    const ctx = new AudioContext()

    const oscilattor = ctx.createOscillator()
    oscilattor.type = "sine"
    oscilattor.frequency.setValueAtTime(freq, ctx.currentTime)
    oscilattor.connect(ctx.destination)
    oscilattor.start()
    oscilattor.stop(ctx.currentTime + 2)
}

export default function Sounds() {
    const rangeRef = useRef<HTMLInputElement>(null)
    const labeledValue = useRef<HTMLInputElement>(null)

    function handleInput() {
        labeledValue.current.innerText = rangeRef.current.value + " Hz"
    }

    useEffect(handleInput)

    return (<>
        <span ref={labeledValue}></span>
        <input onInput={handleInput} type="range" ref={rangeRef} defaultValue={5000} min={20} max={20000} />
        <button onClick={() => makeFreqSound(Number(rangeRef.current.value))}>
            <FontAwesomeIcon icon={faVolumeHigh} />
        </button>
    </>);
}