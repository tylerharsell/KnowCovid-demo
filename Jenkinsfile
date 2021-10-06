pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker-compose up -d --build'
            }
            post {
                success {
                    echo 'Build successful. Now archiving...'
                    
                }
            }
        }
    }
}
