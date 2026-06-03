pipeline {
    agent {
        docker {
            image 'node:20'
            reuseNode true
            args '-v $HOME/.npm:/root/.npm'
        }
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
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

        stage('Deploy to Vercel') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
                ]) {
                    sh 'npx vercel pull --yes --environment=production --token="$VERCEL_TOKEN"'
                    sh 'npx vercel build --prod --token="$VERCEL_TOKEN"'
                    sh 'npx vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
