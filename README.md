# Microservices Deployment with Kubernetes on AWS

## Overview
This project demonstrates the deployment of a microservices-based application using Docker containers and Kubernetes on AWS.

### Microservices
- Auth Service: Handles user authentication.
- Product Service: Manages product data.
- User Service: Manages user data.

### Prerequisites
- AWS account
- Kubernetes CLI (kubectl)
- Docker
- GitLab CI/CD (for CI/CD pipeline)
- Prometheus and Grafana (for monitoring)

### Steps to Deploy
1. **Build Docker Images:**
   ```bash
   docker build -t <your-dockerhub-username>/auth-service:latest auth-service/
   docker build -t <your-dockerhub-username>/product-service:latest product-service/
   docker build -t <your-dockerhub-username>/user-service:latest user-service/

2. **Push Docker Images:**
   ```bash
   docker push <your-dockerhub-username>/auth-service:latest
   docker push <your-dockerhub-username>/product-service:latest
   docker push <your-dockerhub-username>/user-service:latest

3. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f k8s/auth-deployment.yaml
   kubectl apply -f k8s/auth-service.yaml
   kubectl apply -f k8s/product-deployment.yaml
   kubectl apply -f k8s/product-service.yaml
   kubectl apply -f k8s/user-deployment.yaml
   kubectl apply -f k8s/user-service.yaml

4. **Setup monitoring:**
   ```bash
   kubectl apply -f k8s/prometheus-deployment.yaml
   kubectl apply -f k8s/grafana-deployment.yaml
