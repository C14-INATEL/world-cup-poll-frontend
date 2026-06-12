pipeline {
    agent any

    tools {
        nodejs 'node22.16'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        CI             = 'true'
        IMAGE_NAME     = 'world-cup-poll-frontend'
        CONTAINER_NAME = 'world-cup-poll-frontend'
        HOST_PORT      = '3000'
        NOTIFICATION_EMAILS = 'viniciusgsimoni@gmail.com, joaovitorlucena000@gmail.com' 
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
                sh '''
                    set -euo pipefail
                    mkdir -p coverage
                    npm run test:ci
                '''
            }
            post {
                always {
                    junit(testResults: 'coverage/junit.xml', allowEmptyResults: true)
                    archiveArtifacts(
                        artifacts: 'coverage/**',
                        fingerprint: true,
                        allowEmptyArchive: true
                    )
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker build \
                    --build-arg VITE_API_URL=\${VITE_API_URL} \
                    -t world-cup-poll-frontend:latest .
                """
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
            script {
                if (env.NOTIFICATION_EMAILS?.trim()) {
                    def testSummary = 'Test summary unavailable: coverage/junit.xml was not found. Tests may not have run, or Vitest may have failed before writing the JUnit report.'
                    def failedTestDetails = []
                    def decodeXml = { value ->
                        value
                            .replace('&quot;', '"')
                            .replace('&apos;', "'")
                            .replace('&lt;', '<')
                            .replace('&gt;', '>')
                            .replace('&amp;', '&')
                    }
                    def attrValue = { attrs, attrName ->
                        def attrMatcher = attrs =~ /${attrName}="([^"]*)"/
                        attrMatcher.find() ? decodeXml(attrMatcher.group(1)) : ''
                    }

                    if (fileExists('coverage/junit.xml')) {
                        def junitXml = readFile('coverage/junit.xml')
                        def testsMatcher = junitXml =~ /<testsuites[^>]*tests="(\d+)"/
                        def failuresMatcher = junitXml =~ /<testsuites[^>]*failures="(\d+)"/
                        def errorsMatcher = junitXml =~ /<testsuites[^>]*errors="(\d+)"/
                        def skippedRootMatcher = junitXml =~ /<testsuites[^>]*skipped="(\d+)"/

                        if (testsMatcher.find() && failuresMatcher.find() && errorsMatcher.find()) {
                            def totalTests = testsMatcher.group(1).toInteger()
                            def failedTests = failuresMatcher.group(1).toInteger()
                            def errorTests = errorsMatcher.group(1).toInteger()
                            def skippedTests = 0

                            if (skippedRootMatcher.find()) {
                                skippedTests = skippedRootMatcher.group(1).toInteger()
                            } else {
                                def skippedMatcher = junitXml =~ /<testsuite[^>]*skipped="(\d+)"/

                                while (skippedMatcher.find()) {
                                    skippedTests += skippedMatcher.group(1).toInteger()
                                }
                            }

                            def passedTests = Math.max(totalTests - failedTests - errorTests - skippedTests, 0)

                            if (failedTests > 0 || errorTests > 0) {
                                def failedCaseMatcher = junitXml =~ /(?s)<testcase\b([^>]*)>.*?<(failure|error)\b[^>]*>(.*?)<\/(failure|error)>.*?<\/testcase>/

                                while (failedCaseMatcher.find()) {
                                    def attrs = failedCaseMatcher.group(1)
                                    def failureType = failedCaseMatcher.group(2)
                                    def className = attrValue(attrs, 'classname')
                                    def testName = attrValue(attrs, 'name')
                                    def message = decodeXml(failedCaseMatcher.group(3).replaceAll(/(?s)<[^>]+>/, '').trim())

                                    if (message.length() > 500) {
                                        message = message.take(500) + '...'
                                    }

                                    failedTestDetails << "- ${className} > ${testName} [${failureType}]\n  ${message}"
                                }
                            }

                            testSummary = """Test summary:
Total: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Errors: ${errorTests}
Skipped: ${skippedTests}"""

                            if (failedTestDetails) {
                                testSummary = """${testSummary}

Failed test details:
${failedTestDetails.join('\n')}"""
                            }
                        }
                    }

                    mail(
                        to: env.NOTIFICATION_EMAILS,
                        subject: "[Jenkins] Frontend failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
Frontend pipeline failed.

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Status: ${currentBuild.currentResult}
URL: ${env.BUILD_URL}

${testSummary}

Check the Jenkins console output and test reports for details.
"""
                    )
                } else {
                    echo 'No NOTIFICATION_EMAILS configured; skipping email notification.'
                }
            }
        }
        always {
            sh 'docker image prune -f || true'
        }
        cleanup {
            cleanWs(notFailBuild: true, deleteDirs: true)
        }
    }
}
