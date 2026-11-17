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
                    echo "Checking CropQueue project files..."

                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f docker-compose.yml
                    test -f backend/package-lock.json
                    test -f frontend/package-lock.json

                    echo "Project files verified!"
                    git rev-parse --short HEAD
                '''
            }
        }

	stage('FIFO Unit Tests') {
    steps {
        sh '''
            echo "Running CropQueue FIFO unit tests..."

            docker run --rm \
              -v "$PWD/backend:/app:ro" \
              -w /app \
              node:22-alpine \
              node --test test/distributionService.test.js
        '''
    }
}

        stage('Backend Dependency Security Scan') {
            steps {
                sh '''
                    echo "Scanning backend npm dependencies..."

                    docker run --rm \
                      -v "$PWD/backend:/app:ro" \
                      -w /app \
                      node:22-alpine \
                      npm audit --audit-level=moderate
                '''
            }
        }

        stage('Frontend Dependency Security Scan') {
            steps {
                sh '''
                    echo "Scanning frontend npm dependencies..."

                    docker run --rm \
                      -v "$PWD/frontend:/app:ro" \
                      -w /app \
                      node:22-alpine \
                      npm audit --audit-level=moderate
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building CropQueue backend..."

                    docker build \
                      -t cropqueue-backend:ci-${BUILD_NUMBER} \
                      ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building CropQueue frontend..."

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

                    echo "Both Docker images verified!"
                '''
            }
        }
    }

    post {
        success {
            echo 'CropQueue CI + Dependency Security Scans SUCCESS!'
        }

        failure {
            echo 'CropQueue CI/CD FAILED! Check build or security scan.'
        }
    }
}
