document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // --- DOM Elements ---
    const addItemForm = document.getElementById('add-item-form');
    const itemTypeSelect = document.getElementById('item-type');
    const projectFields = document.getElementById('project-fields');
    const designFields = document.getElementById('design-fields');
    const itemsListContainer = document.getElementById('items-list');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    
    // Edit Modal Elements
    const editItemModalEl = document.getElementById('editItemModal');
    const editItemModal = new bootstrap.Modal(editItemModalEl);
    const editItemForm = document.getElementById('edit-item-form');
    const editProjectFields = document.getElementById('edit-project-fields');
    const editDesignFields = document.getElementById('edit-design-fields');

    let allPortfolioItems = [];

    /**
     * Renders portfolio items. Can render all items or a filtered subset.
     * @param {Array} [itemsToRender=allPortfolioItems] - The array of items to render.
     */
    function renderItems(itemsToRender = allPortfolioItems) {
        itemsListContainer.innerHTML = '';
        if (itemsToRender.length === 0) {
            itemsListContainer.innerHTML = `<p class="text-muted text-center col-12">No items found.</p>`;
            return;
        }

        itemsToRender.forEach(item => {
            const imageUrl = item.coverImage instanceof Blob ? URL.createObjectURL(item.coverImage) : item.coverImage;
            const itemCard = `
                <div class="col-md-6 col-xl-4">
                    <div class="admin-item-card">
                        <img src="${imageUrl}" class="card-img-top" alt="${item.titleEn}">
                        <div class="card-body">
                            <h5 class="card-title" title="${item.titleEn}">${item.titleEn}</h5>
                            <span class="badge bg-primary">${item.type}</span>
                            <button class="btn btn-info btn-sm edit-btn" data-id="${item.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            itemsListContainer.innerHTML += itemCard;
        });
    }

    /**
     * Fetches all items from DB, stores them, and renders them.
     */
    async function fetchAndRenderItems() {
        allPortfolioItems = await db.getAllItems();
        renderItems();
    }

    // --- Event Listeners ---

    // Toggle form fields based on item type selection
    itemTypeSelect.addEventListener('change', function() {
        projectFields.style.display = this.value === 'project' ? 'block' : 'none';
        designFields.style.display = this.value === 'design' ? 'block' : 'none';
    });

    // Handle Add Item form submission
    addItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const coverImageFile = document.getElementById('item-image').files[0];
        if (!coverImageFile) {
            alert('Please select a cover image.');
            return;
        }

        const newItem = {
            type: document.getElementById('item-type').value,
            titleEn: document.getElementById('item-title-en').value,
            titleAr: document.getElementById('item-title-ar').value,
            coverImage: coverImageFile,
        };

        if (newItem.type === 'project') {
            newItem.liveUrl = document.getElementById('item-live-url').value;
            newItem.githubUrl = document.getElementById('item-github-url').value;
        } else if (newItem.type === 'design') {
            const galleryFiles = document.getElementById('item-gallery-images').files;
            newItem.galleryImages = [coverImageFile, ...Array.from(galleryFiles)];
        }

        await db.addItem(newItem);
        await fetchAndRenderItems(); // Refetch and render all
        addItemForm.reset();
        itemTypeSelect.dispatchEvent(new Event('change'));
    });
    
    // Handle clicks on Delete and Edit buttons using event delegation
    itemsListContainer.addEventListener('click', async function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.dataset.id);

        // Handle Delete
        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this item?')) {
                await db.deleteItem(id);
                await fetchAndRenderItems();
            }
        }

        // Handle Edit
        if (target.classList.contains('edit-btn')) {
            const item = await db.getItemById(id);
            if (!item) return;

            // Populate modal
            document.getElementById('edit-item-id').value = item.id;
            document.getElementById('edit-item-type').value = item.type;
            document.getElementById('edit-item-title-en').value = item.titleEn;
            document.getElementById('edit-item-title-ar').value = item.titleAr;

            if (item.type === 'project') {
                editProjectFields.style.display = 'block';
                editDesignFields.style.display = 'none';
                document.getElementById('edit-item-live-url').value = item.liveUrl || '';
                document.getElementById('edit-item-github-url').value = item.githubUrl || '';
            } else {
                editProjectFields.style.display = 'none';
                editDesignFields.style.display = 'block';
            }
            
            editItemModal.show();
        }
    });
    
    // Handle Edit Item form submission
    editItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-item-id').value);
        const itemToUpdate = await db.getItemById(id);

        if (!itemToUpdate) return;
        
        // Update fields
        itemToUpdate.titleEn = document.getElementById('edit-item-title-en').value;
        itemToUpdate.titleAr = document.getElementById('edit-item-title-ar').value;
        
        const newCoverImage = document.getElementById('edit-item-image').files[0];
        if (newCoverImage) {
            itemToUpdate.coverImage = newCoverImage;
        }

        if (itemToUpdate.type === 'project') {
            itemToUpdate.liveUrl = document.getElementById('edit-item-live-url').value;
            itemToUpdate.githubUrl = document.getElementById('edit-item-github-url').value;
        } else {
            const newGalleryImages = document.getElementById('edit-item-gallery-images').files;
            if(newGalleryImages.length > 0){
                // This logic simply adds new images. For a full implementation, you might want to allow removing old ones.
                itemToUpdate.galleryImages.push(...Array.from(newGalleryImages));
            }
        }
        
        await db.updateItem(itemToUpdate);
        editItemModal.hide();
        await fetchAndRenderItems();
    });
    
    // Handle Search
    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = allPortfolioItems.filter(item => 
            item.titleEn.toLowerCase().includes(searchTerm) ||
            item.titleAr.toLowerCase().includes(searchTerm)
        );
        renderItems(filteredItems);
    });

    // Handle logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'login.html';
    });

    // --- Initial Load ---
    itemTypeSelect.dispatchEvent(new Event('change'));
    fetchAndRenderItems();
});
