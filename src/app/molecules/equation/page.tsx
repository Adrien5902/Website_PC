"use client";

import { Equation, EquationError } from "@/components/MolEquation";
import { type ChangeEvent, useState } from "react";

function ppcm(a: number, b: number) {
	function pgcd(x: number, y: number) {
		if (y === 0) {
			return x;
		}
		return pgcd(y, x % y);
	}

	return (a * b) / pgcd(a, b);
}

function MoleculesEquation() {
	const [result, setResult] = useState<React.ReactNode | null>(null);

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		const input = (e.target as HTMLInputElement).value;
		try {
			const eq = Equation.parseString(input);
			setResult(eq.toJSX());
		} catch (error) {
			if (error instanceof EquationError) {
				console.log(error.message);
			} else {
				throw error;
			}
		}
	}

	return (
		<>
			<input type="text" onInput={handleInput} />
			<p
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{result}
			</p>
		</>
	);
}

export default MoleculesEquation;
