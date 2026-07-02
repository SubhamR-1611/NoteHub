const addBtn = document.querySelector(".add-btn");
const notesContainer = document.querySelector(".notes-container");

const allBtn = document.querySelector(".nav-left button:first-child");
const importantBtn = document.querySelector(".nav-left button:last-child");
const searchInput = document.getElementById("searchInput");
const currentUser = localStorage.getItem("loggedInUser");
const themeBtn = document.getElementById("themeBtn");

// If no user is logged in, go back to login page
if (!currentUser) {
    window.location.href = "login.html";
}

// Each user gets their own notes
let notes = JSON.parse(
    localStorage.getItem("notes_" + currentUser)
) || [];

let showImportant = false;

displayNotes();

/* ==========================
   ADD NOTE
========================== */

addBtn.addEventListener("click", () => {

    const title = prompt("Enter Note Title");

    if (title && title.trim() !== "") {

        notes.push({
            title: title,
            description: "",
            important: false,
            color:"transparent"
        });
        

        saveData();
        displayNotes();
    }
});

/* ==========================
   FILTER BUTTONS
========================== */

allBtn.addEventListener("click", () => {

    showImportant = false;

    allBtn.classList.add("active-btn");
    importantBtn.classList.remove("active-btn");

    displayNotes();
});

importantBtn.addEventListener("click", () => {

    showImportant = true;

    importantBtn.classList.add("active-btn");
    allBtn.classList.remove("active-btn");

    displayNotes();
});
searchInput.addEventListener("input", () => {

    displayNotes();

});

/* ==========================
   DISPLAY NOTES
========================== */

function displayNotes() {

    notesContainer.innerHTML = "";

let filteredNotes = showImportant
    ? notes.filter(note => note.important)
    : notes;

const searchText = searchInput.value.toLowerCase();

filteredNotes = filteredNotes.filter(note =>

    note.title.toLowerCase().includes(searchText) ||

    note.description.toLowerCase().includes(searchText)

);

    if (filteredNotes.length === 0) {

        notesContainer.innerHTML = `
            <h2 style="color:#777;">
                No Notes Available
            </h2>
        `;

        return;
    }

    filteredNotes.forEach((note) => {

        const originalIndex = notes.indexOf(note);

        notesContainer.innerHTML += `
            <div class="note-card" style="border-top:8px solid ${note.color}" onclick="expandCard(this)">

                <input
                    class="title-input"
                    value="${note.title}"
                    readonly
                    onclick="event.stopPropagation()"
                >

                <textarea
                    placeholder="DESCRIPTION"
                    readonly
                    onclick="event.stopPropagation()"
                >${note.description}</textarea>

                <div class="card-buttons">

                    <button class="save-btn" onclick="toggleEdit(event, ${originalIndex})" data-mode="view">
                        ✏️ Edit
                    </button>

                    <button class="star-btn" onclick="toggleImportant(event, ${originalIndex})">
                        ${note.important ? "⭐" : "✰"}
                    </button>

                    <button class="delete-btn" onclick="deleteNote(event, ${originalIndex})">
                        🗑️
                    </button>

                    <div class="more-box">
                        <button class="more-btn" onclick="toggleMoreMenu(event)">⋯ More</button>
                        <div class="more-menu">

                            <button class="more-item share-item" onclick="shareNote(event, ${originalIndex})">
                                📤 Share
                            </button>

                            <button class="more-item pdf-item" onclick="saveAsPDF(event, ${originalIndex})">
                                📄 Save as PDF
                            </button>

                            <div class="more-item color-item">
                                <span>🎨 Color</span>
                                <div class="color-swatches" onclick="setColor(event, ${originalIndex})">
                                    <button data-color="red"></button>
                                    <button data-color="blue"></button>
                                    <button data-color="green"></button>
                                    <button data-color="yellow"></button>
                                    <button data-color="orange"></button>
                                    <button data-color="none" class="clear-color">✕</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        `;
    });
}

/* ==========================
   EXPAND CARD
========================== */

function expandCard(card) {

    document
        .querySelectorAll(".note-card")
        .forEach(c => c.classList.remove("expanded"));

    card.classList.add("expanded");
}

/* ==========================
   SAVE NOTE
========================== */

function toggleEdit(event,index){

    event.stopPropagation();

    const card = event.target.closest(".note-card");

    const title = card.querySelector(".title-input");

    const textarea = card.querySelector("textarea");

    const btn = event.target;

    if(btn.dataset.mode==="view"){

        title.removeAttribute("readonly");

        textarea.removeAttribute("readonly");

        title.focus();

        btn.dataset.mode="edit";

        btn.innerHTML="💾 Save";

        return;

    }

    notes[index].title=title.value;

    notes[index].description=textarea.value;

    saveData();

    title.setAttribute("readonly",true);

    textarea.setAttribute("readonly",true);

    btn.dataset.mode="view";

    btn.innerHTML="✏️ Edit";

    displayNotes();

}
/* ==========================
   IMPORTANT
========================== */

function toggleImportant(event, index) {

    event.stopPropagation();

    notes[index].important = !notes[index].important;

    saveData();
    displayNotes();
}


/* ==========================
   DELETE
========================== */

function deleteNote(event, index) {

    event.stopPropagation();

    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    notes.splice(index, 1);

    saveData();
    displayNotes();
}

/* ==========================
   SHARE NOTE
========================== */

function shareNote(event, index) {

    event.stopPropagation();

    const note = notes[index];

    const shareText = `📝 ${note.title}\n\n${note.description}`;

    if (navigator.share) {

        navigator.share({
            title: note.title,
            text: shareText
        });

    } else {

        navigator.clipboard.writeText(shareText).then(() => {
            alert("Note copied to clipboard!");
        }).catch(() => {
            alert("Could not share or copy the note.");
        });

    }
}

/* ==========================
   SAVE AS PDF
========================== */

function saveAsPDF(event, index) {

    event.stopPropagation();

    const note = notes[index];

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${escapeHTML(note.title)}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                }
                h1 {
                    border-bottom: 2px solid #1d7df7;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <h1>${escapeHTML(note.title)}</h1>
            <p>${escapeHTML(note.description)}</p>
        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
}

function escapeHTML(str) {

    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;

}

/* ==========================
   LOCAL STORAGE
========================== */

function saveData() {

    localStorage.setItem(
        "notes_" + currentUser,
        JSON.stringify(notes)
    );

}
/* ==========================
   DARK MODE
========================== */

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");
        themeBtn.textContent="☀️";

    }

    else{

        localStorage.setItem("theme","light");
        themeBtn.textContent="🌙";

    }

});

/* ==========================
   MORE MENU
========================== */

function toggleMoreMenu(event) {

    event.stopPropagation();

    const box = event.target.closest(".more-box");
    const menu = box.querySelector(".more-menu");

    document.querySelectorAll(".more-menu.show").forEach(m => {
        if (m !== menu) m.classList.remove("show");
    });

    menu.classList.toggle("show");
}

function setColor(event, index) {

    event.stopPropagation();

    const color = event.target.dataset.color;
    if (!color) return;

    notes[index].color = color === "none" ? "transparent" : color;

    saveData();
    displayNotes();
}

document.addEventListener("click", function () {
    document.querySelectorAll(".more-menu").forEach(menu => {
        menu.classList.remove("show");
    });
});


/* ==========================
   LOGOUT
========================== */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

});