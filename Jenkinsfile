pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Run Playwright Login Test') {
            environment {
                NAUKRI_USER = credentials('NAUKRI_LOGIN')
            }
            steps {
                script {
                    sh '''
                        export NAUKRI_EMAIL="$NAUKRI_USER_USR"
                        export NAUKRI_PASSWORD="$NAUKRI_USER_PSW"
                        npx playwright test naukriLogin.spec.js
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Jenkins pipeline successful'
        }
        failure {
            echo '❌ Jenkins pipeline failed'
        }
    }
}
