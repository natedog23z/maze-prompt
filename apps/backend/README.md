# Maze Backend API

This is the FastAPI backend for the Maze application.

## Setup

```bash
# Install the dependencies
pip install -r requirements.txt

# Install the package in development mode
pip install -e .
```

## Running the API

```bash
# Run the API with hot reloading
cd apps/backend
python -m app.main
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## API Documentation

FastAPI automatically generates API documentation:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Available Endpoints

- `GET /health`: Health check endpoint
- `POST /prompts/generate`: Generate a prompt using the SubjectAgent

## Running Tests

```bash
python -m pytest apps/backend/tests/ -v
``` 