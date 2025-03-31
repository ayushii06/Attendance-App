# Use a base image with Python
FROM python:3.9  

# Install required system libraries
RUN apt-get update && apt-get install -y \
    cmake \
    libgl1-mesa-glx \
    libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . . 

# Install Python dependencies
# Install dependencies in a specific order
RUN pip install --no-cache-dir tensorflow==2.9.0 keras==2.9.0  # Force correct versions
RUN pip install --no-cache-dir -r requirements.txt

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
