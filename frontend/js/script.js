const API_URL = "http://localhost:8081/api/users";


/* =========================
   REGISTER
========================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        // Check password
        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.className =
                "text-center text-sm text-red-600";

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const contentType =
                response.headers.get("content-type");


            let data;

            if (contentType &&
                contentType.includes("application/json")) {

                data = await response.json();

            } else {

                data = await response.text();

            }


            if (response.ok) {

                message.textContent =
                    "Registration successful! Redirecting to login...";

                message.className =
                    "text-center text-sm text-green-600";


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);


            } else {

                message.textContent =
                    typeof data === "string"
                        ? data
                        : "Registration failed.";

                message.className =
                    "text-center text-sm text-red-600";
            }


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

            message.className =
                "text-center text-sm text-red-600";
        }

    });
}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim();


        const password =
            document.getElementById("loginPassword")
                .value;


        const message =
            document.getElementById("loginMessage");


        try {

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const contentType =
                response.headers.get("content-type");


            let data;

            if (contentType &&
                contentType.includes("application/json")) {

                data = await response.json();

            } else {

                data = await response.text();

            }


            if (response.ok) {

                // Save logged-in user
                localStorage.setItem(
                    "marketmateUser",
                    JSON.stringify(data)
                );


                message.textContent =
                    "Login successful!";

                message.className =
                    "text-center text-sm text-green-600";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } else {

                message.textContent =
                    typeof data === "string"
                        ? data
                        : "Invalid email or password.";

                message.className =
                    "text-center text-sm text-red-600";
            }


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

            message.className =
                "text-center text-sm text-red-600";
        }

    });
}


/* =========================
   DASHBOARD
========================= */

const userNameElement =
    document.getElementById("userName");


if (userNameElement) {

    const storedUser =
        localStorage.getItem("marketmateUser");


    // User not logged in
    if (!storedUser) {

        window.location.href =
            "login.html";

    } else {

        try {

            const user =
                JSON.parse(storedUser);

            userNameElement.textContent =
                user.name;

        } catch (error) {

            console.error(error);

            localStorage.removeItem(
                "marketmateUser"
            );

            window.location.href =
                "login.html";
        }
    }
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "marketmateUser"
    );

    window.location.href =
        "login.html";
}