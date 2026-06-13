// src/utils/MapStorage.js
// A lightweight wrapper around IndexedDB for storing massive .glb Blobs natively

const DB_NAME = 'PixelmonMapsDB';
const DB_VERSION = 1;
const STORE_NAME = 'CustomMaps';

let dbInstance = null;

function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => reject(new Error('Failed to open IndexedDB'));

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Store maps with an auto-incrementing ID
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };
  });
}

export async function saveMap(name, blob) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const mapData = {
      name: name || 'Untitled Map',
      blob: blob, // Store the binary Blob natively!
      createdAt: Date.now(),
      sizeBytes: blob.size
    };

    const request = store.add(mapData);

    request.onsuccess = () => resolve(request.result); // Returns the new ID
    request.onerror = (e) => {
      if (e.target.error.name === 'QuotaExceededError') {
        reject(new Error('Storage Full: Please delete old maps or free up space on your device.'));
      } else {
        reject(new Error('Failed to save map.'));
      }
    };
  });
}

// Retrieves only the lightweight metadata (name, id, size, date), omitting the massive Blobs
export async function getMaps() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result || [];
      // Strip the massive blobbinary so we can render lists instantly
      const metadata = items.map(item => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        sizeBytes: item.sizeBytes
      })).sort((a, b) => b.createdAt - a.createdAt); // Newest first
      resolve(metadata);
    };
    request.onerror = () => reject(new Error('Failed to get maps.'));
  });
}

// Retrieves the full binary Blob for a specific map ID
export async function getMapBlob(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) resolve(request.result.blob);
      else reject(new Error('Map not found.'));
    };
    request.onerror = () => reject(new Error('Failed to load map blob.'));
  });
}

export async function deleteMap(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to delete map.'));
  });
}
