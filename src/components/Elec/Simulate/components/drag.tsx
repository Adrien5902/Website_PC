import type * as React from "react";

type Props = {
	img: string;
	name: string;
};

function ComponentDrag({ img, name }: Props) {
	function handleDragStart(e: React.DragEvent<HTMLImageElement>) {
		e.dataTransfer.setData("text/plain", name);
	}

	return (
		<div className="componentBox">
			<img
				alt={name}
				onDragStart={handleDragStart}
				src={img}
				draggable="true"
			/>
			<span>{name}</span>
		</div>
	);
}

export default ComponentDrag;
