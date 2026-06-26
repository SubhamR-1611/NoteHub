const form = document.querySelector("form");
const email = document.querySelector(".email");
const password = document.querySelector('input[type="password"]');

form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (email.value.trim() === "" || password.value.trim() === "") {
        alert("Please fill all the fields.");
    }
    else if (!email.value.includes("@") || !email.value.includes(".")) {
        alert("Please enter a valid email address.");
    }
    else if (password.value.length < 6) {
        alert("Password must be at least 6 characters long.");
    }
    else {
        const storedPassword = localStorage.getItem(email.value.trim());

if (storedPassword === null) {
    alert("Account not found. Please Sign Up.");
}
else if (storedPassword !== password.value) {
    alert("Incorrect Password.");
}
else {

    // Save logged in user
    localStorage.setItem("loggedInUser", email.value.trim());

    alert("Login Successful!");

    form.reset();

    window.location.href = "dashboard.html";
}
    }

});