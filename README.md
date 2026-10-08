# MarketMate

MarketMate is split into two independently served parts:

- `frontend/` contains the static HTML and JavaScript UI.
- `backend/` contains the Spring Boot REST API and MySQL persistence layer.

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

The API listens on `http://localhost:8081`.

## Run the frontend

Serve the `frontend/` directory with a static file server (for example, the
VS Code Live Server extension) and open `index.html`. The UI sends requests to
`http://localhost:8081/api/users`.
