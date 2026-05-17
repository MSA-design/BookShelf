=====================================
  BookShelf — Library Management System
  Web Client-Side Programming — Final Project
=====================================

App Idea:
---------
BookShelf is a fully client-side library management system that allows users
to manage a book catalog, borrow and return books, track borrow history,
and personalize their experience — all without a backend or page reload.

GitHub Repository:
------------------
https://github.com/MSA-design/BookShelf

Team Members:
-------------
Mohamed Saeed Ahmed 
Mohamed Ibrahim Ahmed
Mohamed Ahmed
Omar Ghareeb

=====================================
  Features
=====================================

1. Book Catalog (Books Section)
   - Displays all books in a responsive grid with cover images.
   - Each card shows the book title, author, status (available/borrowed), and copy count.
   - Falls back to an emoji placeholder if the cover image fails to load.

2. Add Book
   - Form to add a new book with title, author, category, year, number of copies, and cover URL.
   - Full validation: required fields are checked before submission.
   - Confirmation message shown after a book is successfully added.

3. Search / Filter Books
   - Real-time search by title or author as the user types.
   - No page reload — DOM updates instantly.

4. Borrow a Book
   - User enters their name, selects an available book, and picks a due date.
   - Validation ensures a future date is selected and all fields are filled.
   - Borrowed books are marked as unavailable and removed from the borrow dropdown.

5. Return a Book
   - Dropdown shows all active borrows.
   - One click to return — book status resets to available immediately.

6. Borrow History
   - Table showing all past and current borrows with borrower name, due date, and status badge.
   - Sorted by most recent first.

7. Delete Book
   - Delete button appears on hover over each book card.
   - Borrowed books cannot be deleted — error toast is shown.

8. Copy Count Control
   - Each book card has +/− buttons to adjust the number of available copies.
   - Changes are saved instantly to localStorage.

9. User Preference (Cookie)
   - User can enter their name and save it as a cookie.
   - Name persists across sessions and is shown in the header and welcome message.

10. Dark / Light Theme Toggle
    - Theme toggle button in the header switches between light and dark mode.
    - Preference is saved in a cookie and restored on next visit.

11. Live Stats Dashboard (Home)
    - Real-time counters for total books, available books, borrowed books, and total borrows.
    - Live status bar updates automatically after every action.

12. Data Persistence (localStorage)
    - All books and borrow records are saved to localStorage.
    - Data survives page refresh — nothing is lost on reload.

=====================================
  Outline Comments Reference
=====================================

Outline 1  — Objects & Classes        → Book class, BorrowRecord class
Outline 2  — Arrays & Array Methods   → push(), filter(), map(), find(), forEach()
Outline 3  — DOM Manipulation         → renderBooks(), renderHistory(), updateStats()
Outline 4  — Event Listeners          → searchInput (input), prefName (keydown)
Outline 5  — Functions                → addBook(), borrowBook(), returnBook(), renderBooks(), updateStats()
Outline 6  — localStorage             → save() with JSON.stringify, load() with JSON.parse
Outline 7  — Cookies                  → setCookie(), getCookie() — theme & username
Outline 8  — Conditional Logic        → Input validation in addBook(), borrowBook()
Outline 9  — Error Handling           → try...catch in addBook(), borrowBook(), returnBook(), load()
Outline 10 — Dynamic UI & Feedback    → Live counter bar, toast notifications, confirmation messages
