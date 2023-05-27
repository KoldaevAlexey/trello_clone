"use client";

import React from "react";
import {
    DraggableProvided,
    DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps;
};

const TodoCard = ({
    todo,
    index,
    id,
    draggableProps,
    dragHandleProps,
}: Props) => {
    return <div>TodoCard</div>;
};

export default TodoCard;
