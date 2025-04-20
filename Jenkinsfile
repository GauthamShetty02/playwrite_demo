pipeline {
  agent any

  environment {
    // Make sure this is secure in production!
    NAUKRI_EMAIL = credentials('naukri_email')        // Jenkins secret credential ID
    NAUKRI_PASSWORD = credentials('naukri_password')  // Jenkins secret credential ID
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📦 Checking out code...'
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        echo '📥 Installing dependencies...'
        sh 'npm install'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        echo '🧩 Installing Playwright browsers...'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Tests') {
      steps {
        echo '🚀 Running Playwright test...'
        sh 'NAUKRI_EMAIL=$NAUKRI_EMAIL NAUKRI_PASSWORD=$NAUKRI_PASSWORD npx playwright test'
      }
    }
  }

  post {
    always {
      echo '📸 Collecting screenshots if any...'
      archiveArtifacts artifacts: '**/*.png', allowEmptyArchive: true
    }
    failure {
      echo '❌ Build failed! Check the logs and screenshots.'
    }
    success {
      echo '✅ Build completed successfully.'
    }
  }
}
