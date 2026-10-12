const userNameElement = document.getElementById("userName");

if (userNameElement) {
    const storedUser = localStorage.getItem("marketmateUser");

    if (!storedUser) {
        window.location.href = "/?page=login";
    } else {
        try {
            const user = JSON.parse(storedUser);
            userNameElement.textContent = user.name;
        } catch (error) {
            console.error("Unable to read the saved MarketMate session.", error);
            localStorage.removeItem("marketmateUser");
            window.location.href = "/?page=login";
        }
    }
}

function logout() {
    localStorage.removeItem("marketmateUser");
    window.location.href = "/?page=login";
}
