(() => {
    const usersStorageKey = "marketmateDemoUsers";
    const currentUserStorageKey = "marketmateUser";
    const demoAccount = {
        id: "demo-navya",
        name: "Navya",
        email: "navya@gmail.com",
        password: "navya123",
    };

    function readUsers() {
        const savedUsers = localStorage.getItem(usersStorageKey);
        if (!savedUsers) {
            return [];
        }

        const users = JSON.parse(savedUsers);
        if (!Array.isArray(users)) {
            throw new Error("Saved demo accounts have an invalid format.");
        }
        return users;
    }

    async function hashPassword(password, salt) {
        if (!window.crypto?.subtle) {
            throw new Error("Secure password hashing is unavailable in this browser.");
        }

        const passwordBytes = new TextEncoder().encode(`${salt}:${password}`);
        const hash = await window.crypto.subtle.digest("SHA-256", passwordBytes);
        return Array.from(new Uint8Array(hash), (byte) =>
            byte.toString(16).padStart(2, "0")
        ).join("");
    }

    function createSalt() {
        return Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) =>
            byte.toString(16).padStart(2, "0")
        ).join("");
    }

    async function ensureDemoAccount() {
        const users = readUsers();
        const existingIndex = users.findIndex(
            (user) => user.email.toLowerCase() === demoAccount.email
        );
        const existingUser = existingIndex >= 0 ? users[existingIndex] : null;

        if (
            existingUser?.id === demoAccount.id &&
            existingUser.passwordHash ===
                (await hashPassword(demoAccount.password, existingUser.salt))
        ) {
            return;
        }

        const salt = createSalt();
        const seededAccount = {
            id: demoAccount.id,
            name: demoAccount.name,
            email: demoAccount.email,
            salt,
            passwordHash: await hashPassword(demoAccount.password, salt),
        };

        if (existingIndex >= 0) {
            users[existingIndex] = seededAccount;
        } else {
            users.push(seededAccount);
        }

        localStorage.setItem(usersStorageKey, JSON.stringify(users));
    }

    const demoAccountReady = ensureDemoAccount();

    function showMessage(element, text, kind) {
        element.textContent = text;
        element.className = `min-h-5 text-center text-sm ${
            kind === "error" ? "text-red-600" : "text-green-700"
        }`;
    }

    function initializeRegisterForm() {
        const form = document.getElementById("registerForm");
        if (!form) {
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;
            const message = document.getElementById("registerMessage");

            if (password !== confirmPassword) {
                showMessage(message, "Passwords do not match.", "error");
                return;
            }

            try {
                await demoAccountReady;
                const users = readUsers();
                if (
                    users.some(
                        (user) =>
                            user.email.toLowerCase() === email.toLowerCase()
                    )
                ) {
                    showMessage(
                        message,
                        "An account with this email already exists in this browser.",
                        "error"
                    );
                    return;
                }

                const salt = createSalt();
                users.push({
                    id: `local-${Date.now()}`,
                    name,
                    email,
                    salt,
                    passwordHash: await hashPassword(password, salt),
                });
                localStorage.setItem(usersStorageKey, JSON.stringify(users));
                showMessage(
                    message,
                    "Account created on this browser. Redirecting to login...",
                    "success"
                );
                window.setTimeout(
                    () =>
                        window.location.assign(
                            `/?page=login&email=${encodeURIComponent(email)}`
                        ),
                    700
                );
            } catch (error) {
                console.error("Unable to create the local demo account.", error);
                showMessage(
                    message,
                    "Could not save this demo account in browser storage.",
                    "error"
                );
            }
        });
    }

    function initializeLoginForm() {
        const form = document.getElementById("loginForm");
        if (!form) {
            return;
        }

        const emailInput = document.getElementById("loginEmail");
        const emailFromUrl = new URLSearchParams(window.location.search).get("email");
        if (emailFromUrl) {
            emailInput.value = emailFromUrl;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = document.getElementById("loginPassword").value;
            const message = document.getElementById("loginMessage");

            try {
                await demoAccountReady;
                const users = readUsers();
                const user = users.find(
                    (savedUser) =>
                        savedUser.email.toLowerCase() === email.toLowerCase()
                );

                if (
                    !user ||
                    user.passwordHash !==
                        (await hashPassword(password, user.salt))
                ) {
                    showMessage(
                        message,
                        "Invalid email or password. Register in this browser first.",
                        "error"
                    );
                    return;
                }

                localStorage.setItem(
                    currentUserStorageKey,
                    JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    })
                );
                showMessage(
                    message,
                    `Signed in locally as ${user.name}. This demo account is saved in this browser only.`,
                    "success"
                );
            } catch (error) {
                console.error("Unable to sign in to the local demo account.", error);
                showMessage(
                    message,
                    "Could not access demo accounts in browser storage.",
                    "error"
                );
            }
        });
    }

    window.MarketMateAuth = {
        initializeForms() {
            initializeRegisterForm();
            initializeLoginForm();
        },
    };

    window.MarketMateAuth.initializeForms();
})();
