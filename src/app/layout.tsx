"use client";

import Header from "@/components/Header";
import "./globals.css";
import { useRef } from "react";
import ExperimentsContextProvider, {
	type ExperimentsContextProviderRef,
} from "@/components/ExperimentsContextProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const experimentsContextProvider =
		useRef<ExperimentsContextProviderRef>(null);
	return (
		<html lang="fr">
			<head>
				<title>Physique Chimie</title>
				<link
					rel="shortcut icon"
					href="/assets/favicon.ico"
					type="image/x-icon"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="google-site-verification"
					content="udttGKh9r3ORf-_Fj9Ek8tbON-lC5p6PBrlPjiZ9JAs"
				/>
				<meta name="author" content="Adrien5902/Adrien Monneret" />
				<meta
					name="description"
					content="Site web Physique Chimie Adrien5902"
				/>
				<meta content="Physique-Chimie" property="og:title" />
				<meta
					content="Site sur la physique et la chimie par Adrien5902"
					property="og:description"
				/>
				<meta content="/assets/logo_square.png" property="og:image" />
				<meta content="#ff9100" data-react-helmet="true" name="theme-color" />
			</head>

			<body>
				<ExperimentsContextProvider ref={experimentsContextProvider}>
					<Header experimentsContextProvider={experimentsContextProvider} />
					<div id="root">{children}</div>
				</ExperimentsContextProvider>
			</body>
		</html>
	);
}
