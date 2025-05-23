"use client";

import { Suspense } from "react";

// Here to wrap AtomView into a Suspense since it loads dynamically using search params
export default function AtomViewLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense>{children}</Suspense>;
}
