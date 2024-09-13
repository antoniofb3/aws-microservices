# Microservices Deployment with Kubernetes on AWS EKS

## Overview

This project involves deploying a microservices-based application using Docker containers and Kubernetes on Amazon Elastic Kubernetes Service (EKS). We will utilize other AWS services like Elastic Container Registry (ECR) for image storage and CloudWatch for monitoring and logging.

### Microservices

1. **Auth Service**: Handles authentication.
2. **Product Service**: Manages products.
3. **User Service**: Manages users.

### Prerequisites

Before starting, make sure you have the following tools installed and configured on your local machine:

- **AWS CLI**: [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- **kubectl**: [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- **eksctl**: [Install eksctl](https://eksctl.io/introduction/#installation)
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Helm (optional)**: For managing Kubernetes charts.

### Steps for Configuration and Deployment on AWS
1. **Configure AWS CLI:**
   ```bash
   aws configure

2. **Create an EKS cluster using eksctl. This command will provision a Kubernetes cluster with 3 nodes and auto-scaling enabled in AWS:**
   ```bash
   eksctl create cluster --name microservices-cluster --region <AWS_REGION> --nodegroup-name standard-workers --node-type t3.medium --nodes 3 --nodes-min 1 --nodes-max 4 --managed

3. **After the EKS cluster is created connect kubectl to the EKS Cluster:**  
   This command will update the kubeconfig file to enable kubectl to communicate with your EKS cluster.
   ```bash
   aws eks --region <AWS_REGION> update-kubeconfig --name microservices-cluster

4. **Create a repository for Image Registry in Amazon Elastic Container Registry (ECR) to store Docker images.:**
   ```bash
   aws ecr create-repository --repository-name auth-service
   aws ecr create-repository --repository-name product-service
   aws ecr create-repository --repository-name user-service

5. **Build and Push Docker Images to ECR, for this you have to log in to ECR to enable Docker to push images to the registry:**
   ```bash
   aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com
  
   # Build and tag Docker images for each microservice and push them to ECR.
   # Auth Service
   docker build -t auth-service ./auth-service/
   docker tag auth-service:latest <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/auth-service:latest
   docker push <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/auth-service:latest

   # Product Service
   docker build -t product-service ./product-service/
   docker tag product-service:latest <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/product-service:latest
   docker push <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/product-service:latest

   # User Service
   docker build -t user-service ./user-service/
   docker tag user-service:latest <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/user-service:latest
   docker push <aws_account_id>.dkr.ecr.<AWS_REGION>.amazonaws.com/user-service:latest

6. **Apply Kubernetes Deployment Files:**  
   Ensure that the Kubernetes deployment YAML files point to the correct Docker images in ECR. Then, apply the deployment files to deploy the microservices on EKS.
   ```bash
   # Deploy Auth Service
   kubectl apply -f k8s/auth-deployment.yaml
   kubectl apply -f k8s/auth-service.yaml

   # Deploy Product Service
   kubectl apply -f k8s/product-deployment.yaml
   kubectl apply -f k8s/product-service.yaml

   # Deploy User Service
   kubectl apply -f k8s/user-deployment.yaml
   kubectl apply -f k8s/user-service.yaml

7. **Set Up Ingress for the Services:**  
   Use an Ingress controller or Load Balancer to expose the services to the public. If using Ingress, ensure that AWS Load Balancer Controller is deployed.
   ```bash
   kubectl apply -f k8s/ingress.yaml 

8. **Configure CloudWatch for Logging and Monitoring:**  
   Ensure that service logs are sent to AWS CloudWatch for centralized logging and monitoring. You can enable CloudWatch logging for EKS nodes or configure each service to output logs to CloudWatch.
   ```bash
   kubectl logs <pod-name> 

9. **Testing: Access the Services:**  
   Once the services are deployed, retrieve the public IP of the load balancer to access the services
   ```bash
   kubectl get services 

   # Use the public IP to access the microservices:
   - Auth Service: http://<load-balancer-ip>/auth
   - Product Service: http://<load-balancer-ip>/products
   - User Service: http://<load-balancer-ip>/users 

10. **Set Up Monitoring with Prometheus and Grafana:**  

   Deploy Prometheus
   ```bash
   kubectl apply -f k8s/prometheus-deployment.yaml  

   # Deploy Grafana
   kubectl apply -f k8s/grafana-deployment.yaml  
   
   #Access Grafana at http://<grafana-url>:3000.  
 
11. **Troubleshooting:**
   Check Pod Logs:  
   If any of the services are not functioning as expected, check the pod logs
   ```bash
   kubectl logs <pod-name>  
   
   # Verify Cluster Health:  
   # Check that all pods and services are running
   kubectl get pods
   kubectl get services  

   # Inspect Load Balancer:  
   # If the services are not accessible, inspect the status of the load balancer
   kubectl describe service <service-name>

