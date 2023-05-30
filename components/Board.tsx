"use client";

import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

const Board = () => {
    const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
        (state) => [
            state.board,
            state.getBoard,
            state.setBoardState,
            state.updateTodoInDB,
        ]
    );

    useEffect(() => {
        getBoard();
    }, [getBoard]);

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, type, source } = result;

        if (!destination) return;

        if (type === "column") {
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(entries);
            setBoardState({ ...board, columns: rearrangedColumns });
        }

        const copyColumns = Array.from(board.columns);
        const startColIndex = copyColumns[Number(source.droppableId)];
        const finishColIndex = copyColumns[Number(destination.droppableId)];

        const startColumn: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos,
        };

        const finishColumn: Column = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos,
        };

        if (!startColumn || !finishColumn) return;

        if (source.index === destination.index && startColumn === finishColumn)
            return;

        const newTodos = startColumn.todos;
        const [todoMoved] = newTodos.splice(source.index, 1);

        if (startColumn.id === finishColumn.id) {
            newTodos.splice(destination.index, 0, todoMoved);
            const newColumn = {
                id: startColumn.id,
                todos: newTodos,
            };

            const newColumns = new Map(board.columns);
            newColumns.set(startColumn.id, newColumn);

            setBoardState({ ...board, columns: newColumns });
        } else {
            const finishTodos = Array.from(finishColumn.todos);
            finishTodos.splice(destination.index, 0, todoMoved);

            const newColumns = new Map(board.columns);
            const newColumn = {
                id: startColumn.id,
                todos: newTodos,
            };

            newColumns.set(startColumn.id, newColumn);
            newColumns.set(finishColumn.id, {
                id: finishColumn.id,
                todos: finishTodos,
            });

            updateTodoInDB(todoMoved, finishColumn.id);

            setBoardState({ ...board, columns: newColumns });
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {Array.from(board.columns.entries()).map(
                            ([id, column], index) => (
                                <Column
                                    key={id}
                                    id={id}
                                    todos={column.todos}
                                    index={index}
                                />
                            )
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Board;
