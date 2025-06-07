"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Component, ComponentSide, Connection } from "./types";

import { faPlugCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type Générateur from "./Générateur";

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
	const prop = property as "name" | "id";
	const typeOfProperty = typeof component[prop];

	const inputType =
		type ??
		(() => {
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

	function propertyToString(s: boolean | number | string) {
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

	const rerenderProperties = useContext(ComponentPropertiesContext);

	return (
		<div>
			<label htmlFor={label}>{label}</label>
			{readonly ? (
				<span>{propertyToString(component[prop] ?? "")}</span>
			) : (
				<input
					id={label}
					type={inputType}
					key={
						inputType === "range"
							? null
							: inputType === "checkbox"
								? component[prop]
								: propertyToString(component[prop])
					}
					defaultValue={propertyToString(component[prop])}
					defaultChecked={
						inputType === "checkbox"
							? (component[prop] as unknown as boolean)
							: undefined
					}
					onChange={(e) => {
						const newValue =
							inputType === "checkbox"
								? e.target.checked
								: parseInputValue(e.target.value);
						(component[prop] as string | number | boolean) = newValue;
						rerenderProperties?.();
					}}
				/>
			)}
			{inputType === "range" && <span>{component[prop]}</span>}
			{suffix && <span>{suffix}</span>}
		</div>
	);
}

const ComponentPropertiesContext = createContext<(() => void) | null>(null);
export function ComponentProperties({
	c,
	conns,
	sizeRef,
	components,
}: {
	c: ComponentSide | null;
	conns: Connection[];
	components: Component[];
	sizeRef: React.MutableRefObject<number>;
}) {
	const [side, setSide] = useState<ComponentSide | null>(c);

	useEffect(() => {
		setSide(c);
	}, [c, c?.component, c?.component.name]);

	const [rerender, setRerender] = useState(false);

	function handleNameChange(e: React.InputEvent<HTMLInputElement>) {
		if (side) side.component.name = (e.target as HTMLInputElement).value;
	}

	return (
		<div id="properties" className="shadow-box">
			{side?.component ? (
				<>
					<div id="right-props">
						<div>
							<img
								id="preview"
								src={(
									side.component.constructor as typeof Générateur
								).prototype.getDefaultImage()}
								alt={(side.component.constructor as typeof Générateur).nom}
							/>
							<span>
								{" "}
								{(side.component.constructor as typeof Générateur).nom}{" "}
							</span>
						</div>

						<div>
							<FontAwesomeIcon
								icon={faTrash}
								id="bin"
								className="accent-hover"
								onClick={() => {
									if (side) {
										const id = side.component?.id;
										conns = conns.filter(
											(c) =>
												!(c.a.component.id === id || c.b.component.id === id),
										);
										components.splice(
											components.findIndex((c) => c.id === id),
											1,
										);
										setSide(null);
									}
								}}
							/>

							<FontAwesomeIcon
								id="disconnect"
								icon={faPlugCircleXmark}
								className="accent-hover"
								onClick={() => {
									if (side) {
										const id = side.component?.id;
										conns = conns.filter(
											(c) =>
												!(c.a.component.id === id || c.b.component.id === id),
										);
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
								onInput={(e) => {
									sizeRef.current = Number(
										(e.target as HTMLInputElement).value,
									);
								}}
							/>
						</div>
					</div>

					<div>
						<label htmlFor="component-name-input">Nom : </label>
						<input
							id="component-name-input"
							type="text"
							defaultValue={side.component?.name}
							key={side.component?.name}
							onInput={handleNameChange}
						/>
					</div>

					<ComponentPropertiesContext.Provider
						value={() => setRerender(!rerender)}
					>
						{"properties" in side.component && side?.component?.properties?.()}
					</ComponentPropertiesContext.Provider>
				</>
			) : (
				""
			)}
		</div>
	);
}
