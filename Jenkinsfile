pipeline {
    agent any

    environment {
        IMAGE_NAME = 'student-management-app'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls the code from the GitHub repo configured in the job
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f student-app-test || true'
                sh "docker run -d --name student-app-test -p 3000:3000 ${IMAGE_NAME}:latest"
                sh 'sleep 5'
                sh 'curl -f http://localhost:3000/health'
            }
        }

        stage('Karate API Tests') {
            steps {
                dir('tests/karate') {
                    sh 'mvn -q test -DbaseUrl=http://localhost:3000'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                sh 'kubectl get pods,svc'
            }
        }
    }

    post {
        always {
            sh 'docker rm -f student-app-test || true'
        }
        success {
            echo 'Pipeline finished successfully'
        }
        failure {
            echo 'Pipeline failed - check the stage logs above'
        }
    }
}
