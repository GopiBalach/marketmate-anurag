const requestedPage = new URLSearchParams(window.location.search).get("page");

if (["login", "register", "dashboard"].includes(requestedPage)) {
    const main = document.querySelector("main");
    const pageTemplate = document.getElementById(`${requestedPage}Page`);
    const navigation = document.querySelector("header nav");

    if (requestedPage === "dashboard") {
        const storedUser = localStorage.getItem("marketmateUser");
        if (!storedUser) {
            window.location.replace("/?page=login");
        } else {
            main.className = "max-w-7xl mx-auto px-6 py-12";
            main.replaceChildren(pageTemplate.content.cloneNode(true));
            document.title = "Dashboard - MarketMate";

            navigation.replaceChildren();
            const dashboardLink = document.createElement("a");
            dashboardLink.href = "/?page=dashboard";
            dashboardLink.className = "text-sm font-medium text-green-100";
            dashboardLink.textContent = "Dashboard";

            const logoutButton = document.createElement("button");
            logoutButton.type = "button";
            logoutButton.className =
                "rounded-lg border border-white px-4 py-2 text-sm font-semibold transition hover:bg-white hover:text-green-600";
            logoutButton.textContent = "Logout";
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("marketmateUser");
                window.location.assign("/?page=login");
            });
            navigation.append(dashboardLink, logoutButton);

            const user = JSON.parse(storedUser);
            document.getElementById("userName").textContent = user.name;
        }
    } else {
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

        window.MarketMateAuth.initializeForms();
    }
}
