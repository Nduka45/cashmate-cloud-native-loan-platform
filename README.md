CashMate 💸
Cloud-Native Loan Management Platform

CashMate is a cloud-native, microservices-based loan management platform built to demonstrate modern software engineering, DevOps, and platform engineering practices.

The platform is containerized with Docker, orchestrated with Kubernetes, and deployed on both Amazon EKS (AWS) and Azure AKS (Microsoft Azure), showcasing:

Multi-cloud deployments
Kubernetes auto-scaling
Service discovery
Rolling updates and zero-downtime deployments
Load balancing
CI/CD automation
Observability and monitoring
Event-driven microservices architecture

![alt text](architecture.png)

Features
✅ Microservices Architecture
✅ RESTful APIs
✅ Event-Driven Communication with Apache Kafka
✅ Containerized Services with Docker
✅ Kubernetes Deployments and Service Discovery
✅ Horizontal Pod Autoscaling (HPA)
✅ Rolling Updates and Zero-Downtime Deployments
✅ Multi-Cloud Deployment (AWS EKS & Azure AKS)
✅ CI/CD Pipelines with GitHub Actions
✅ Monitoring with Prometheus and Grafana
✅ Infrastructure as Code Ready
✅ Production-Ready Deployment Architecture

Technology Stack
Category	Technology
Backend	Node.js, Express.js
Database	PostgreSQL
Messaging	Apache Kafka
Containerization	Docker
Orchestration	Kubernetes
Cloud Platforms	AWS EKS, Azure AKS
CI/CD	GitHub Actions
Monitoring	Prometheus, Grafana
Version Control	Git & GitHub

Repository Structure
cashmate-cloud-native-loan-platform/
│
├── api-gateway/
├── auth-service/
├── customer-service/
├── loan-service/
├── payment-service/
├── notification-service/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetees
│   └── terraform/
│
├── docs/
│   ├── architecture/
│   └── screenshots/
│
├── .github/
│   └── workflows/
│
└── README.md

Prerequisites

Before running the project, ensure you have installed:

Node.js (v20 or later)
Docker & Docker Compose
Kubernetes (Minikube or Docker Desktop Kubernetes)
kubectl
Git

