# 1. Choose a Python base image
FROM python:3.12

# 2. Set a working directory inside the container
WORKDIR /app

# 3. Copy your project files into the container
COPY . .

# 4. Install Python dependencies from requirements.txt
RUN pip install -r requirements.txt

# 5. Default command (runs bash if no command provided)
CMD ["bash"]