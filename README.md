# Student Management App — DevOps Project

A simple Student Management application (Node.js + Express) that is built with Jenkins, packaged with Docker, deployed on Kubernetes and tested with Karate.

## Features
- Add, view, update and delete students (name, roll number, branch, year)
- REST API under `/api/students` and a web page at `/`
- `/health` endpoint used by Jenkins and Kubernetes probes

## Project structure
```
student-management-devops/
├── server.js              # Express REST API
├── public/index.html      # Web UI
├── package.json
├── Dockerfile             # Container image
├── .dockerignore
├── Jenkinsfile            # CI/CD pipeline
├── k8s/
│   ├── deployment.yaml    # Kubernetes Deployment (2 replicas)
│   └── service.yaml       # NodePort Service on port 30080
└── tests/karate/          # Karate API tests (Maven project)
    ├── pom.xml
    └── src/test/java/
        ├── karate-config.js
        └── students/
            ├── students.feature
            └── StudentsTest.java
```

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /api/students | List all students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Add a student (name and rollNo required) |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |

## Run locally
```bash
npm install
npm start
# open http://localhost:3000
```

## Docker
```bash
docker build -t student-management-app:latest .
docker images
docker run -d --name student-app -p 3000:3000 student-management-app:latest
docker ps
```

## Kubernetes (Minikube)
```bash
minikube start
eval $(minikube docker-env)          # Windows PowerShell: & minikube docker-env | Invoke-Expression
docker build -t student-management-app:latest .
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get deployments,pods,svc
minikube service student-management-service --url
```

## Karate tests
App must be running on port 3000.
```bash
cd tests/karate
mvn test -DbaseUrl=http://localhost:3000
```
Report: `tests/karate/target/karate-reports/karate-summary.html`

5 scenarios: health check, list students, add + fetch student, validation error (400), unknown student (404).

## Jenkins
Pipeline job → "Pipeline script from SCM" → Git → this repo URL → branch `main` → script path `Jenkinsfile`.
Stages: Checkout → Install Dependencies → Build Docker Image → Run Container → Karate API Tests → Deploy to Kubernetes.
