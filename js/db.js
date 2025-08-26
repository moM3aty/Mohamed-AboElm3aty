const db = {
    _db: null,
    _dbName: 'PortfolioDB',
    _storeName: 'portfolioItems',

    async _getDB() {
        if (this._db) {
            return this._db;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this._dbName, 1);

            request.onerror = (event) => {
                console.error("Database error:", event.target.error);
                reject("Database error");
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this._storeName)) {
                    db.createObjectStore(this._storeName, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this._db = event.target.result;
                resolve(this._db);
            };
        });
    },

    async addItem(item) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readwrite');
            const store = transaction.objectStore(this._storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error("Error adding item:", event.target.error);
                reject("Error adding item");
            };
        });
    },

    async getAllItems() {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readonly');
            const store = transaction.objectStore(this._storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error("Error getting all items:", event.target.error);
                reject("Error getting all items");
            };
        });
    },

    // ================== NEW FUNCTION ==================
    async getItemById(id) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readonly');
            const store = transaction.objectStore(this._storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error("Error getting item by ID:", event.target.error);
                reject("Error getting item by ID");
            };
        });
    },

    // ================== NEW FUNCTION ==================
    async updateItem(item) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readwrite');
            const store = transaction.objectStore(this._storeName);
            const request = store.put(item); // .put() updates if key exists, otherwise adds.

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error("Error updating item:", event.target.error);
                reject("Error updating item");
            };
        });
    },

    async deleteItem(id) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readwrite');
            const store = transaction.objectStore(this._storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error("Error deleting item:", event.target.error);
                reject("Error deleting item");
            };
        });
    }
};
