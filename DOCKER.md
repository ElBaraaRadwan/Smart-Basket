# Docker Setup for Smart-Basket

This guide explains how to use Docker to run the Smart-Basket application.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Environment Setup

1. Create a `.env` file in the root directory of the project with the following variables:

```
# Application
NODE_ENV=production
PORT=8080

# Database
DATABASE_URI=your_external_database_url

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1d

# Add other required environment variables for your specific setup
```

## Development Setup

To run the application in development mode:

```bash
docker-compose up -d
```

This will:
- Build the application container
- Expose the API on port 8080

## Production Setup

For production deployment:

1. Make sure you have SSL certificates:
   - Place your SSL certificate at `./nginx/ssl/server.crt`
   - Place your SSL key at `./nginx/ssl/server.key`

2. Run the production stack:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will:
- Build the application container
- Start an Nginx container as a reverse proxy
- Expose ports 80 and 443 for HTTP and HTTPS access

## AWS Deployment

For AWS deployment:

1. Build the Docker image:
   ```bash
   docker build -t smart-basket-api .
   ```

2. Tag the image for your AWS ECR repository:
   ```bash
   docker tag smart-basket-api:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/smart-basket-api:latest
   ```

3. Push the image to AWS ECR:
   ```bash
   aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
   docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/smart-basket-api:latest
   ```

4. Deploy the container using AWS ECS or EKS with the appropriate environment variables set for your external database connection.

## Container Management

### View running containers:
```bash
docker-compose ps
```

### View logs:
```bash
docker-compose logs -f app
```

### Stop the containers:
```bash
docker-compose down
```

## Data Persistence

Uploaded files are stored in the `./uploads` directory which is mounted to the container.

## Security Notes

1. Never commit your `.env` file to version control
2. Rotate your JWT_SECRET and other security keys regularly
3. Keep your Docker and all dependencies up to date
4. In production, consider using AWS Secrets Manager for storing sensitive environment variables
