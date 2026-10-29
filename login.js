document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const buttonText = document.getElementById("buttonText");

    // Show / hide password
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            togglePassword.textContent = isPassword ? "Hide" : "Show";
            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    }

    // Prevent repeated clicks while submitting.
    // Do not redirect from JavaScript.
    if (loginForm) {
        loginForm.addEventListener("submit", function () {
            if (!loginForm.checkValidity()) {
                return;
            }

            if (loginButton) {
                loginButton.disabled = true;
            }

            if (buttonText) {
                buttonText.textContent = "Logging in...";
            }
        });
    }
});
