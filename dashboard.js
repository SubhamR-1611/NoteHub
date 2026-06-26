const addBtn = document.querySelector(".add-btn");
const notesContainer = document.querySelector(".notes-container");

const allBtn = document.querySelector(".nav-left button:first-child");
const importantBtn = document.querySelector(".nav-left button:last-child");
const searchInput = document.getElementById("searchInput");
const currentUser = localStorage.getItem("loggedInUser");

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
            important: false
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
            <div class="note-card" onclick="expandCard(this)">

                <h3>${note.title}</h3>

                <textarea
                    placeholder="DESCRIPTION"
                    onclick="event.stopPropagation()"
                >${note.description}</textarea>

                <div class="card-buttons">

                    <button
                        class="save-btn"
                        onclick="saveNote(event, ${originalIndex})"
                    >
                        ✓
                    </button>

                    <button
                        class="star-btn"
                        onclick="toggleImportant(event, ${originalIndex})"
                    >
                        ${note.important ? "⭐" : "☆"}
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(event, ${originalIndex})"
                    >
                        Delete
                    </button>

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

function saveNote(event, index) {

    event.stopPropagation();

    const textarea =
        event.target
            .closest(".note-card")
            .querySelector("textarea");

    notes[index].description = textarea.value;

    saveData();

    alert("Note Saved Successfully!");
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
   LOCAL STORAGE
========================== */

function saveData() {

    localStorage.setItem(
        "notes_" + currentUser,
        JSON.stringify(notes)
    );

}
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