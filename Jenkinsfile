pipeline {
    agent {
        docker {
            image 'node:20'
            reuseNode true
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

        stage('Deploy to Vercel') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
                    string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID'),
                ]) {
                    sh 'vercel pull --yes --environment=production --token="$VERCEL_TOKEN"'
                    sh 'vercel build --prod --token="$VERCEL_TOKEN"'
                    sh 'vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"'
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs(notFailBuild: true, deleteDirs: true)
        }
    }
}
