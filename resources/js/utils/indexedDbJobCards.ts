import { openDB } from "idb";

const DB_NAME = "jobCardDB";
const STORE = "jobCards";

export async function initJobCardDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, { keyPath: "id" });
            }
        },
    });
}

export async function saveJobCards(jobCards: any[]) {
    const db = await initJobCardDB();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);

    for (const job of jobCards) {
        await store.put(job);
    }

    await tx.done;
}

export async function getOfflineJobCards() {
    const db = await initJobCardDB();
    return db.getAll(STORE);
}

export async function clearJobCards() {
    const db = await initJobCardDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.store.clear();
    await tx.done;
}