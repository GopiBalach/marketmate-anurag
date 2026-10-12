const requestedPage = new URLSearchParams(window.location.search).get("page");

if (requestedPage === "login" || requestedPage === "register") {
    const main = document.querySelector("main");
    const pageTemplate = document.getElementById(`${requestedPage}Page`);
    const navigation = document.querySelector("header nav");
    const otherPage = requestedPage === "login" ? "register" : "login";
    const otherPageLabel = requestedPage === "login" ? "Register" : "Login";

    main.className =
        "min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12";
    main.replaceChildren(pageTemplate.content.cloneNode(true));
    document.title = `${requestedPage === "login" ? "Login" : "Register"} - MarketMate`;

    navigation.replaceChildren();
    const homeLink = document.createElement("a");
    homeLink.href = "/";
    homeLink.className = "text-sm font-medium transition hover:text-green-100";
    homeLink.textContent = "Home";

    const otherPageLink = document.createElement("a");
    otherPageLink.href = `/?page=${otherPage}`;
    otherPageLink.className =
        "rounded-lg bg-white px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50";
    otherPageLink.textContent = otherPageLabel;
    navigation.append(homeLink, otherPageLink);

    const form = document.getElementById(
        requestedPage === "login" ? "loginForm" : "registerForm"
    );
    const message = document.getElementById(
        requestedPage === "login" ? "loginMessage" : "registerMessage"
    );

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (
            requestedPage === "register" &&
            document.getElementById("password").value !==
                document.getElementById("confirmPassword").value
        ) {
            message.textContent = "Passwords do not match.";
            message.className = "min-h-5 text-center text-sm text-red-600";
            return;
        }

        message.textContent =
            "Form submission is unavailable in this frontend-only deployment.";
        message.className = "min-h-5 text-center text-sm text-gray-600";
    });
}
