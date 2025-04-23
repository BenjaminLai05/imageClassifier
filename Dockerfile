# Base image with Node.js (for React) and Debian (to install Python)
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip

# Set working directory
WORKDIR /app

# --- Install Python dependencies ---
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# --- Install React frontend dependencies ---
# Copy only package.json and lockfile first for caching
COPY webpage-ui/package*.json ./webpage-ui/
RUN npm install --prefix ./webpage-ui

# --- Copy full frontend and backend source code ---
COPY . .

# Expose React development port
EXPOSE 3000

# Start React app from within webpage-ui folder
CMD ["npm", "start", "--prefix", "webpage-ui"]
