# MarketMate

MarketMate has a static HTML/JavaScript frontend in `frontend/` and a Spring
Boot REST API in `backend/`. The backend can package and serve the frontend,
or it can be deployed separately as a Render Static Site.

For Render Static Site deployment, use `frontend/` as the publish directory
and keep its subdirectories in the published output. The login and registration
pages are available at `/login/` and `/register/` for hosts that normalize
`.html` URLs.

## Run the backend

Create the `marketmate` MySQL database. If it requires a password, set
`DB_PASSWORD` in the terminal before starting the API. From the repository
root, run:

```powershell
$env:DB_PASSWORD = "your-database-password"
cd backend
.\mvnw.cmd spring-boot:run
```

Omit the first command if your MySQL account has no password. The username
defaults to `root`; override it with the `DB_USERNAME` environment variable if
needed.

Open `http://localhost:8081/index.html` for the frontend. The API is available
at `http://localhost:8081/api/users`.

## Demo logins

To enable one optional demo account that bypasses the database lookup, set
`MARKETMATE_DEMO_EMAIL` and `MARKETMATE_DEMO_PASSWORD` in the same terminal
before starting the backend. Optionally set `MARKETMATE_DEMO_NAME`; it defaults
to `Demo User`. Without email and password values, all logins use the normal
database-backed flow.
