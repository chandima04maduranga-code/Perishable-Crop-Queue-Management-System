pipeline {
    agent {
        label 'rootless-user-agent'
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project Files') {
            steps {
                sh '''
                    echo "Checking CropQueue project..."

                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f docker-compose.yml

                    echo "Project files verified!"
                    git rev-parse --short HEAD
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building CropQueue Backend..."
                    docker build \
                      -t cropqueue-backend:ci-${BUILD_NUMBER} \
                      ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building CropQueue Frontend..."
                    docker build \
                      -t cropqueue-frontend:ci-${BUILD_NUMBER} \
                      ./frontend
                '''
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh '''
                    docker image inspect \
                      cropqueue-backend:ci-${BUILD_NUMBER} \
                      > /dev/null

                    docker image inspect \
                      cropqueue-frontend:ci-${BUILD_NUMBER} \
                      > /dev/null

                    echo "Both Docker images built successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo 'CropQueue CI Docker build SUCCESS!'
        }

        failure {
            echo 'CropQueue CI build FAILED!'
        }
    }
}
