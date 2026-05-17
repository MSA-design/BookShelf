// Outline 1: Objects & Classes — ES6 class to model Book data
class Book {
  constructor(title, author, category, year, cover, copies) {
    this.id = Date.now() + Math.random().toString(36).slice(2);
    this.title = title;
    this.author = author;
    this.category = category;
    this.year = year || '';
    this.cover = cover || '';
    this.status = 'available';
    this.copies = parseInt(copies) || 1;
    this.addedAt = new Date().toISOString();
  }
}

// Outline 1: Objects & Classes — ES6 class to model BorrowRecord data
class BorrowRecord {constructor(bookId, bookTitle, borrower, dueDate) {
    this.id = Date.now() + Math.random().toString(36).slice(2);
    this.bookId = bookId;
    this.bookTitle = bookTitle;
    this.borrower = borrower;
    this.dueDate = dueDate;
    this.borrowedAt = new Date().toISOString();
    this.returnedAt = null;
    this.status = 'active';
  }
}

let books = [];
let borrows = [];

// Outline 6: localStorage — save data using JSON.stringify
const save = () => {
  localStorage.setItem('bs_books', JSON.stringify(books));
  localStorage.setItem('bs_borrows', JSON.stringify(borrows));
};

// Outline 6: localStorage — restore data using JSON.parse
const load = () => {
  try {
    const b = localStorage.getItem('bs_books');
    const r = localStorage.getItem('bs_borrows');
    if (b) books = JSON.parse(b);    // Outline 6
    if (r) borrows = JSON.parse(r);  // Outline 6
  } catch (e) {
    
    console.error('localStorage error:', e);
    toast('Could not restore saved data.', 'err');
  }
};


// Outline 7: Cookies — helper functions to set and get cookies
const setCookie = (name, val, days = 365) => {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(val)};expires=${exp};path=/`;
};

const getCookie = (name) => {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : '';
};

const saveName = () => {
  const name = document.getElementById('prefName').value.trim();
  if (!name) { toast('Please enter a name first.', 'err'); return; }
  setCookie('bs_user', name);   
  applyUser(name);
  toast('Name saved in cookie! 🍪');
};

const applyUser = (name) => {
  document.getElementById('welcomeName').textContent = name;
  document.getElementById('userGreet').textContent = `Hi, ${name}`;
};

// Outline 5: Functions — well-named function handling one responsibility (add a book)
const addBook = () => {
  const title = document.getElementById('fTitle').value.trim();
  const author = document.getElementById('fAuthor').value.trim();
  const category = document.getElementById('fCategory').value;

  let ok = true;
  const setErr = (id, show) => document.getElementById(id).classList.toggle('show', show);
  if (!title)    { setErr('errTitle', true); ok = false; } else setErr('errTitle', false);
  if (!author)   { setErr('errAuthor', true); ok = false; } else setErr('errAuthor', false);
  if (!category) { setErr('errCat', true); ok = false; } else setErr('errCat', false);
  if (!ok) return;

  try {
    
    const book = new Book(
      title, author, category,
      document.getElementById('fYear').value,
      document.getElementById('fCover').value.trim(),
      document.getElementById('fCopies').value
    );
    books.push(book);  
    save();
    updateStats();
    updateBorrowSelect();
    clearForm();

    
    const conf = document.getElementById('addConfirm');
    conf.className = 'confirm-bar show';
    conf.innerHTML = `✅ <strong>"${book.title}"</strong> added to the library!`;
    setTimeout(() => conf.className = 'confirm-bar', 3000);
    toast(`"${book.title}" added! 📚`);
  } catch (e) {
   
    console.error('Add book error:', e);
    toast('Something went wrong: ' + e.message, 'err');
  }
};

const clearForm = () => {
  ['fTitle','fAuthor','fYear','fCover'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fCategory').value = '';
  document.getElementById('fCopies').value = '1';
  ['errTitle','errAuthor','errCat'].forEach(id => document.getElementById(id).classList.remove('show'));
};

// Outline 8: Conditional Logic & Validation — validate all inputs before borrowing
const borrowBook = () => {
  const name = document.getElementById('bName').value.trim();
  const bookId = document.getElementById('bBook').value;
  const due = document.getElementById('bDue').value;
  let ok = true;
  const setErr = (id, show) => document.getElementById(id).classList.toggle('show', show);

  if (!name) { setErr('errBName', true); ok = false; } else setErr('errBName', false);
  if (!bookId) { setErr('errBBook', true); ok = false; } else setErr('errBBook', false);
  if (!due || new Date(due) <= new Date()) { setErr('errBDue', true); ok = false; } else setErr('errBDue', false);
  if (!ok) return;

  try {
    const book = books.find(b => b.id === bookId);  
    if (!book || book.status !== 'available') { toast('Book not available!', 'err'); return; }

    const record = new BorrowRecord(bookId, book.title, name, due);
    borrows.push(record);  
    book.status = 'borrowed';
    save();
    updateStats();
    updateBorrowSelect();
    updateReturnSelect();
    renderHistory();

    const conf = document.getElementById('borrowConfirm');
    conf.className = 'confirm-bar show';
    conf.innerHTML = `📤 <strong>"${book.title}"</strong> borrowed by ${name}. Due: ${new Date(due).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}`;
    setTimeout(() => conf.className = 'confirm-bar', 4000);
    toast(`Borrowed "${book.title}" ✅`);
  } catch(e) {
    console.error('Borrow error:', e);
    toast('Borrow failed: ' + e.message, 'err');
  }
};

// Outline 9: Error Handling — try...catch wraps critical logic with user-friendly messages
const returnBook = () => {
  const id = document.getElementById('rSelect').value;
  if (!id) { toast('Select a borrow record first.', 'err'); return; }

  try {
    const record = borrows.find(b => b.id === id);   
    const book = books.find(b => b.id === record.bookId);
    record.status = 'returned';
    record.returnedAt = new Date().toISOString();
    if (book) book.status = 'available';
    save();
    updateStats();
    updateBorrowSelect();
    updateReturnSelect();
    renderHistory();

    const conf = document.getElementById('returnConfirm');
    conf.className = 'confirm-bar show';
    conf.innerHTML = `📥 <strong>"${record.bookTitle}"</strong> returned successfully!`;
    setTimeout(() => conf.className = 'confirm-bar', 3000);
    toast(`"${record.bookTitle}" returned 📥`);
  } catch(e) {
    console.error('Return error:', e);
    toast('Return failed: ' + e.message, 'err');
  }
};

// Outline 3: DOM Manipulation — dynamically create and update HTML elements without page reload
const renderBooks = (filter = '') => {
  const grid = document.getElementById('booksGrid');
  const filtered = books.filter(b =>
    !filter ||
    b.title.toLowerCase().includes(filter.toLowerCase()) ||
    b.author.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="big">📚</div>No books found</div>';
    return;
  }

  grid.innerHTML = filtered.map(b => {
    const emoji = {Fiction:'📖',Science:'🔬',History:'🏛️',Technology:'💻',Biography:'👤',Philosophy:'🧠'}[b.category] || '📚';
    const coverHtml = b.cover
      ? `<img src="${b.cover}" alt="${b.title}" onerror="this.outerHTML='<div class=cover-placeholder>${emoji}</div>'">`
      : `<div class="cover-placeholder">${emoji}</div>`;
    const copies = b.copies || 1;
    return `
      <div class="book-card" id="card-${b.id}">
        <div style="position:relative">
          ${coverHtml}
          <button class="delete-btn" onclick="deleteBook('${b.id}')" title="حذف الكتاب">🗑️</button>
        </div>
        <div class="book-info">
          <div class="book-title">${b.title}</div>
          <div class="book-author">${b.author}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
            <span class="badge ${b.status === 'available' ? 'badge-avail' : 'badge-out'}">
              ${b.status}
            </span>
            <div class="copies-ctrl">
              <button class="copies-btn" onclick="changeCopies('${b.id}',-1)">−</button>
              <span class="copies-num">${copies}</span>
              <button class="copies-btn" onclick="changeCopies('${b.id}',1)">+</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
};

const deleteBook = (id) => {
  const book = books.find(b => b.id === id);
  if (!book) return;
  if (book.status === 'borrowed') {
    toast('❌ لا يمكن حذف كتاب مستعار حالياً!', 'err');
    return;
  }
  books = books.filter(b => b.id !== id);
  save();
  updateStats();
  updateBorrowSelect();
  renderBooks(document.getElementById('searchInput').value);
  toast(`🗑️ تم حذف "${book.title}"`);
};

const changeCopies = (id, delta) => {
  const book = books.find(b => b.id === id);
  if (!book) return;
  book.copies = Math.max(1, (book.copies || 1) + delta);
  save();
  const card = document.getElementById('card-' + id);
  if (card) card.querySelector('.copies-num').textContent = book.copies;
};

const renderHistory = () => {
  const tbody = document.getElementById('histTbody');
  const empty = document.getElementById('histEmpty');
  const sorted = [...borrows].sort((a, b) => new Date(b.borrowedAt) - new Date(a.borrowedAt));

  if (sorted.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  tbody.innerHTML = sorted.map(r => {
    const badge = r.status === 'active'
      ? '<span class="badge badge-out">Active</span>'
      : '<span class="badge badge-avail">Returned</span>';
    const due = new Date(r.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    return `<tr><td><strong>${r.bookTitle}</strong></td><td>${r.borrower}</td><td>${due}</td><td>${badge}</td></tr>`;
  }).join('');
};


// Outline 10: Dynamic UI & User Feedback — live counter updates in real time + confirmation messages
const updateStats = () => {
  const avail = books.filter(b => b.status === 'available').length;  // Outline 2: filter()
  const out = books.filter(b => b.status === 'borrowed').length;
  document.getElementById('s-total').textContent = books.length;
  document.getElementById('s-avail').textContent = avail;
  document.getElementById('s-out').textContent = out;
  document.getElementById('s-history').textContent = borrows.length;

  document.getElementById('liveCounter').textContent =
    `${books.length} books in catalog · ${avail} available · ${out} borrowed`;
};

const updateBorrowSelect = () => {
  const sel = document.getElementById('bBook');
  const avail = books.filter(b => b.status === 'available');  
  sel.innerHTML = '<option value="">— Available books —</option>' +
    avail.map(b => `<option value="${b.id}">${b.title} — ${b.author}</option>`).join('');
};

const updateReturnSelect = () => {
  const sel = document.getElementById('rSelect');
  const active = borrows.filter(r => r.status === 'active'); 
  sel.innerHTML = '<option value="">— Active borrows —</option>' +
    active.map(r => `<option value="${r.id}">${r.bookTitle} → ${r.borrower}</option>`).join('');
};


const toast = (msg, type = 'ok') => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.background = type === 'err' ? '#c0392b' : '#2c2416';
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => { el.style.animation = 'slideOut 0.3s forwards'; setTimeout(() => el.remove(), 300); }, 2800);
};

// Outline 4: Event Listeners — using addEventListener() for input and keydown events
document.getElementById('searchInput').addEventListener('input', e => {
  renderBooks(e.target.value);
});

document.getElementById('prefName').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveName();
});


const nav = (id, btn) => {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');

  if (id === 'books') renderBooks(document.getElementById('searchInput').value);
  if (id === 'borrow') { updateBorrowSelect(); updateReturnSelect(); }
  if (id === 'history') renderHistory();
};


const toggleTheme = () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  setCookie('bs_theme', next);    // Outline 7
};

const seedData = () => {
  if (books.length > 0) return;
  [
    { title:'The Great Gatsby', author:'F. Scott Fitzgerald', cat:'Fiction', year:'1925', cover:'https://covers.openlibrary.org/b/id/8432503-L.jpg', copies:3 },
    { title:'A Brief History of Time', author:'Stephen Hawking', cat:'Science', year:'1988', cover:'https://covers.openlibrary.org/b/id/8739161-L.jpg', copies:2 },
    { title:'1984', author:'George Orwell', cat:'Fiction', year:'1949', cover:'https://covers.openlibrary.org/b/id/8575708-L.jpg', copies:4 },
    { title:'Sapiens', author:'Yuval Noah Harari', cat:'History', year:'2011', cover:'https://covers.openlibrary.org/b/id/9253895-L.jpg', copies:2 },
    { title:'Clean Code', author:'Robert C. Martin', cat:'Technology', year:'2008', cover:'https://covers.openlibrary.org/b/id/8739177-L.jpg', copies:1 },
  ].forEach(d => books.push(new Book(d.title, d.author, d.cat, d.year, d.cover, d.copies)));
  save();
};


document.addEventListener('DOMContentLoaded', () => {
  load();
  seedData();

  const savedTheme = getCookie('bs_theme') || 'light';    
  document.documentElement.setAttribute('data-theme', savedTheme);

  const savedName = getCookie('bs_user');                 
  if (savedName) {
    applyUser(savedName);
    document.getElementById('prefName').value = savedName;
  }

  const due = new Date(); due.setDate(due.getDate() + 14);
  document.getElementById('bDue').value = due.toISOString().split('T')[0];
  document.getElementById('bDue').min = new Date().toISOString().split('T')[0];

  updateStats();
  updateBorrowSelect();
});
