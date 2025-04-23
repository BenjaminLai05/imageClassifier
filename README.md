# imageClassifier

This project combines a React.js frontend and a Python backend to build an AI-powered image classification system. It is fully Dockerized for easy setup.

## Pre-requisites
- Docker installed: https://docs.docker.com/get-docker/
- Git installed (optional, for cloning)

## Setup Instructions

1. Clone the Repository:
```bash
git clone https://github.com/your-username/imageClassifier.git
cd imageClassifier
```

2. Build the Docker Image:
```bash
docker build -t imageclassifier-env .
```

3. Run the Docker Container:
```bash
docker run -it -p 3000:3000 imageclassifier-env
```

4. Open the App in Your Browser:
Visit http://localhost:3000

5. To Make Code Changes:
- Stop the container with Ctrl + C
- Make local code changes
- Rebuild the image:
```bash
docker build -t imageclassifier-env .
```
- Run the container again:
```bash
docker run -it -p 3000:3000 imageclassifier-env
```

## Project Structure
- `webpage-ui/` – React.js frontend
- `main.py` – Python backend for image processing
- `requirements.txt` – Python package requirements
- `Dockerfile` – Builds and runs the full environment

## Included Dependencies (via Docker)
- Node.js 18 and npm
- React (installed via npm)
- Python 3 and pip
- All packages in requirements.txt

## Support
Open an issue on GitHub or modify the Dockerfile as needed.
