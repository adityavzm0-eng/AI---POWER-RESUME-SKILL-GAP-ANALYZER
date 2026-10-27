# Multi-stage Dockerfile for SkillSync AI
# Stage 1: Build Frontend (Vite + React + Tailwind)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Backend (FastAPI + Python)
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for PyMuPDF
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy source code and built frontend assets
COPY . .
COPY --from=frontend-builder /app/dist ./dist

# Environment variables
ENV PORT=8000
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Start Uvicorn production server
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
