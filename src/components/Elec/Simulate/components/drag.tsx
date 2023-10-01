import * as React from 'react';

function ComponentDrag({img, name}) {
    function handleDragStart(e: React.DragEvent<HTMLImageElement>){
        e.dataTransfer.setData("text/plain", name)
    }

    return ( 
        <div className="componentBox">
            <img onDragStart={handleDragStart} src={img} draggable="true"/>
            <span>{name}</span>
        </div>
    );
}

export default ComponentDrag;