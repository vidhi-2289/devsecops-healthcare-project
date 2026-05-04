pipeline {
    agent any

    environment {
        IMAGE_NAME = "vidhi4941/devsecops-healthcare:latest"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=devsecops-healthcare \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

stage('Trivy Scan') {
    steps {
sh 'trivy image --timeout 5m --severity HIGH,CRITICAL vidhi4941/devsecops-healthcare:latest || true'    }
}
        stage('Push Docker Image') {
            steps {
                sh 'docker push $IMAGE_NAME'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
                sh 'kubectl apply -f service.yaml'
            }
        }
    }
}
