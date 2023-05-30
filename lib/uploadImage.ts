import { ID, storage } from "@/appwrite";

export const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(
        "6471eb3caa6b687527c6",
        ID.unique(),
        file
    );

    return fileUploaded;
};
