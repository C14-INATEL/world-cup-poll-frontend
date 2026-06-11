pipeline {
    agent any
    tools {
        nodejs 'node22.16'
    }

    environment {
        CI             = 'true'
        IMAGE_NAME     = 'world-cup-poll-frontend'
        CONTAINER_NAME = 'world-cup-poll-frontend'
        HOST_PORT      = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci --prefer-offline --cache .npm-cache'
            }
        }

        stage('Type check') {
            steps {
                sh 'npx tsc --noEmit'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker build --no-cache -t ${IMAGE_NAME}:latest .'
                sh 'docker rm -f ${CONTAINER_NAME} || true'
                sh '''
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        --network world-cup-poll-network \
                        ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline falhou!'
        }
        always {
            sh 'docker image prune -f || true'
            cleanWs(notFailBuild: true, deleteDirs: true)
        }
    }
}