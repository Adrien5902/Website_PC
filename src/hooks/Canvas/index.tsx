import React, { useEffect } from "react";
import { Pos } from "../../types/canvas";

export default function useCanvas(
    canvasRef: React.MutableRefObject<HTMLCanvasElement>,
    onResize?: (size: Pos) => unknown
) {
    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.ondragover = (event) => {
            event.preventDefault();

            canvasRef.current.classList.add("draghover");
        };

        canvas.ondragleave = () => canvasRef.current.classList.remove("draghover");

        function resizeCanvas() {
            const box = canvas.getBoundingClientRect();

            canvas.width = box.width * 2;
            canvas.height = box.height * 2;

            onResize && onResize({ x: canvas.width, y: canvas.height });
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            // Cleanup event listener when the component unmounts
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);
}