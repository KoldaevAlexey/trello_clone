import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    newTaskInput: "",
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },

    setBoardState: (board) => set({ board }),

    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        );
    },

    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);

        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECION_ID!,
            todo.$id
        );
    },
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
}));
