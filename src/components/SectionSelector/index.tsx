import { useEffect, useRef, useState } from "react";
import "./style.css";

export interface Section<T extends string> {
	label: T;
	content: JSX.Element;
}

export interface Props<T extends string> {
	id: string;
	sections: Section<T>[];
	onSelection?: (label: string) => void;
	defaultSection?: number;
}

const SectionSelector = <T extends string>({
	id,
	sections,
	onSelection,
	defaultSection = 0,
}: Props<T>) => {
	const [activeSection, setActiveSection] = useState(
		sections[defaultSection].label,
	);

	const selector = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const indicator = selector.current.querySelector(
			".indicator",
		) as HTMLDivElement;

		const activeEl = selector.current.querySelector(
			".option.active",
		) as HTMLDivElement;

		indicator.style.width = `${activeEl.offsetWidth}px`;
		indicator.style.height = `${activeEl.offsetHeight}px`;

		indicator.style.left = `${activeEl.offsetLeft}px`;
	}, [activeSection]);

	return (
		<div className="section-selector" ref={selector} id={id}>
			<div className="options">
				{sections.map((section) => (
					<div
						key={section.label}
						className={`option ${
							activeSection === section.label ? "active" : ""
						}`}
						onClick={() => {
							if (onSelection) {
								onSelection(section.label);
							}

							setActiveSection(section.label);
						}}
					>
						{section.label}
					</div>
				))}
				<div className="indicator" />
			</div>
			<div className="content">
				{sections.find((section) => section.label === activeSection).content}
			</div>
		</div>
	);
};

export default SectionSelector;
