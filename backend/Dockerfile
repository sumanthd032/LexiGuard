# backend/Dockerfile

# Use an official, slim Python runtime as the base
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the backend application code
COPY . .

# Command to run the application
# Cloud Run automatically provides the $PORT environment variable.
CMD uvicorn main:app --host 0.0.0.0 --port $PORT