import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { uploadImage } from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;

    setNewTaskInput: (input: string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
    setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    newTaskInput: "",
    newTaskType: "todo",
    image: null,

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

    addTask: async (
        todo: string,
        columnId: TypedColumn,
        image?: File | null
    ) => {
        let file: Image | undefined;

        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                };
            }
        }

        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) }),
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

    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

    setImage: (image: File | null) => set({ image }),
}));
