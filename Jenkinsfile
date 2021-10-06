pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'sudo docker-compose up -d --build'
            }
            post {
                success {
                    echo 'Build successful. Now archiving...'
                    
                }
            }
        }
    }
}
