pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t mysql mysql/.'
            }
            post {
                success {
                    echo 'Build successful. Now archiving...'
                    
                }
            }
        }
    }
}
