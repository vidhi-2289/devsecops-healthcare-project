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

        stage('Dependency Check') {
            steps {
                sh '~/dependency-check-tool/bin/dependency-check.sh --scan . --format HTML --out ./dependency-check-report'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=devsecops-healthcare \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://3.81.203.237:9000 \
                    -Dsonar.login=$SONAR_AUTH_TOKEN
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
                sh 'trivy image $IMAGE_NAME'
            }
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
