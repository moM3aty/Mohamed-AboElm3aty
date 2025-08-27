const db = {
    async getAllItems() {
        try {
            const response = await fetch('../json/portfolioItems.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Could not fetch portfolio items:", error);
            return [];
        }
    }
};
