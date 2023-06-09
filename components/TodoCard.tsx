"use client";

import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import {
    DraggableProvided,
    DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type TodoCardProps = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps | null | undefined;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard = ({
    todo,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps,
}: TodoCardProps) => {
    
    const deleteTask = useBoardStore((state) => state.deleteTask);

    return (
        <div
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
            className="bg-white rounded-md space-y-2 drop-shadow-md"
        >
            <div className="flex justify-between items-center p-5">
                <p>{todo.title}</p>
                <button
                    onClick={() => deleteTask(index, todo, id)}
                    className="text-red-500 hover:text-red-600"
                >
                    <XCircleIcon className="ml-5 h-8 w-8" />
                </button>
            </div>
        </div>
    );
};

export default TodoCard;
