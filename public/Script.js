const container = document.getElementById('books-container');
const loader = document.getElementById('loader');

// Modal Elements
const openModalBtn = document.getElementById('open-modal-btn');
const addModal = document.getElementById('add-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addForm = document.getElementById('add-form');

async function fetchBooks() {
    try {
        const response = await fetch('/books');
        if (!response.ok) throw new Error('Failed to fetch data');
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        container.innerHTML = '<div class="loader">Failed to load data.</div>';
        console.error(error);
    }
}

function renderBooks(books) {
    container.innerHTML = '';
    if (books.length === 0) {
        container.innerHTML = '<div class="loader">No books available.</div>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        const readStatusClass = book.isRead ? 'read' : 'unread';
        const readStatusText = book.isRead ? 'Read' : 'Not Read';

        card.innerHTML = `
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <span class="status ${readStatusClass}">${readStatusText}</span>
            </div>
            <div class="actions">
                <button class="delete-btn" data-title="${book.title}">Delete</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Event delegation for delete buttons
container.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const title = e.target.getAttribute('data-title');
        
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        const card = e.target.closest('.book-card');

        try {
            const response = await fetch(`/books/${encodeURIComponent(title)}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.remove();
                    if (container.children.length === 0) {
                        container.innerHTML = '<div class="loader">No books available.</div>';
                    }
                }, 300);
            } else {
                alert('Failed to delete the book. Check the server console logs.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during deletion.');
        }
    }
});

// Modal Actions
openModalBtn.addEventListener('click', () => {
    addModal.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
    addModal.style.display = 'none';
    addForm.reset();
});

// Close modal if user clicks outside of the modal window
window.addEventListener('click', (e) => {
    if (e.target === addModal) {
        addModal.style.display = 'none';
        addForm.reset();
    }
});

// Add Book Submission
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button during request to prevent double submissions
    const saveBtn = addForm.querySelector('button[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const newBook = {
        title: document.getElementById('add-title').value.trim(),
        author: document.getElementById('add-author').value.trim(),
        year: parseInt(document.getElementById('add-year').value, 10),
        isRead: document.getElementById('add-isRead').checked
    };

    try {
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            // Give it a brief moment before refreshing so user sees smooth state change
            setTimeout(() => {
                addModal.style.display = 'none';
                addForm.reset();
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
                fetchBooks(); // Refresh the books list
            }, 400);
        } else {
            const errorData = await response.json();
            console.error(errorData);
            alert('Failed to save the book. Check fields.');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while saving.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    }
});

// Initialize rendering on load
fetchBooks();
