"use client";

import {
	createContext,
	useContext,
	useImperativeHandle,
	useState,
} from "react";

export const ExperimentsContext = createContext<boolean>(
	process.env.NODE_ENV === "development",
);

export interface ExperimentsContextProviderRef {
	setExperiments: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Props {
	children: React.ReactNode;
	ref: React.Ref<ExperimentsContextProviderRef>;
}

export default function ExperimentsContextProvider({ children, ref }: Props) {
	const [experiments, setExperiments] = useState<boolean>(
		process.env.NODE_ENV === "development",
	);

	useImperativeHandle(
		ref,
		() => {
			return {
				setExperiments,
			};
		},
		[],
	);

	return (
		<ExperimentsContext.Provider value={experiments}>
			{children}
		</ExperimentsContext.Provider>
	);
}

export const useExperiments = () => useContext(ExperimentsContext);
