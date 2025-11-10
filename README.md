# Frontend Setup: Equipment Lending System (React/Vite)
# DEMO : https://drive.google.com/file/d/1x4xG8BvtsjolBbkZZ4pTlSYr0i6jtTC4/view?usp=sharing
This guide provides the necessary steps to set up and run the Equipment Lending System frontend application.

## 1. Prerequisites (Local Development)

Ensure you have the following installed on your machine:

  * **Node.js (LTS)** and **npm** (or Yarn)
  * **Git**

## 2. Local Development Setup

To run the application locally on your machine:

1.  **Clone the Repository:**

    ```bash
    git clone [YOUR REPOSITORY URL]
    cd frontend/
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables (Crucial):**

      * Create a file named **`.env.local`** in the root of the frontend directory.
      * Set the URL for your running Spring Boot backend API.
      * *Example `.env.local`:*
        ```env
        VITE_API_URL=http://localhost:8080/api
        ```

4.  **Start the Application:**
    The frontend will typically run on **`http://localhost:4200`**.

    ```bash
    npm run dev
    # or
    yarn dev
    ```

-----

## 3. Docker Setup

If you prefer to run the frontend using Docker, follow these steps. This assumes you have **Docker** installed and running on your system.

### A. Build the Docker Image

1.  **Navigate** to the root of the frontend directory.
2.  Run the Docker build command, tagging the image (e.g., `lending-frontend`):
    ```bash
    docker build -t lending-frontend .
    ```

### B. Run the Docker Container

1.  Run the container, mapping the internal container port (`80`) to an external port (e.g., `4200`) on your machine.

    ```bash
    docker run -p 4200:80 --name lending-frontend-app lending-frontend
    ```

      * *(Note: You must ensure the environment variable inside the container points to the correct backend service URL, which often requires passing the `VITE_API_URL` during the `docker run` command, or setting it in the Dockerfile if you are using Docker Compose.)*

2.  The application will now be accessible at **`http://localhost:4200`**.

-----

### Next Step

Once the frontend is running, ensure your **Keycloak** and **Spring Boot Backend** are also running concurrently on their respective ports (`8081` and `8080`) to enable successful authentication and data fetching.
