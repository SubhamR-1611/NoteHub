document.addEventListener("DOMContentLoaded", () => {
    
    const signupForm = document.querySelector("form");
    const emailInput = document.querySelector("#signup-email");
    const passwordInput = document.querySelector("#Password");
    const confirmPasswordInput = document.querySelector("#Confirm-password");

    
    signupForm.addEventListener("submit", (event) => {
        
        event.preventDefault();

        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        
        if (!email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        
        const existingUser = localStorage.getItem(email);
        if (existingUser) {
            alert("An account with this email already exists! Please log in.");
            return;
        }

        
        localStorage.setItem(email, password);

        alert("Signup successful! Redirecting to login page...");

        
        window.location.href = "login.html";
    });
});