# DevOps Status API — Git, GitHub Actions, Docker, Amazon ECR 
My DevOps Project`nThis project is used to practice Git

This teaching project demonstrates a small Node.js API that is tested, containerized, and published to a private Amazon ECR repository by GitHub Actions.

## What students learn

- Git: repositories, commits, branches, pull requests.
- Docker: Dockerfiles, images, containers, ports, logs.
- GitHub Actions: workflows, jobs, triggers, test gates.
- AWS IAM OIDC: short-lived AWS credentials without long-lived keys in GitHub.
- Amazon ECR: private container registry and versioned image tags.

## Requirements

- Git
- Node.js 22 or newer
- Docker Desktop or Docker Engine
- GitHub account
- AWS account and AWS CLI for the AWS steps

## 1. Run locally

```bash
# Run the automated tests.
npm test

# Start the API.
npm start
```

Open `http://localhost:3000/` and `http://localhost:3000/health`.

## 2. Build and run with Docker

```bash
# Build an image from the Dockerfile in the current directory.
docker build -t devops-status-api:local .

# Start a container and map host port 3000 to container port 3000.
docker run --rm --name status-api -p 3000:3000 devops-status-api:local
```

Test `http://localhost:3000/health`. Stop the container with Ctrl+C.

Useful commands:

```bash
# List running containers.
docker ps

# List local images.
docker images

# Show container logs (useful for debugging).
docker logs status-api

# Show detailed container configuration.
docker inspect status-api
```

## 3. Push to GitHub

Create an empty GitHub repository named `devops-status-api`, then run:

```bash
# Start Git version control in this folder.
git init

# Stage all project files for the next commit.
git add .

# Save the staged files as a versioned snapshot.
git commit -m "Initial DevOps Status API"

# Name the main branch main.
git branch -M main

# Connect the local repository to your GitHub repository.
git remote add origin https://github.com/YOUR_USERNAME/devops-status-api.git

# Push main to GitHub and remember the upstream branch.
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 4. Configure ECR and OIDC

Follow [`aws/README-IAM-OIDC.md`](aws/README-IAM-OIDC.md) to configure ECR, the IAM OIDC provider, a least-privilege role, and GitHub repository variables.

Required GitHub variables:
- `AWS_ROLE_ARN`
- `AWS_REGION`
- `ECR_REPOSITORY`

The workflow runs tests on pushes and pull requests. It only publishes to ECR after tests pass on a push to `main`.

## 5. Expected image tags

Each successful push to `main` publishes:
- `latest`
- The full Git commit SHA

The SHA tag identifies the source revision used to build the image.

## 6. Ten hands-on activities

See [`docs/HANDS-ON-ACTIVITIES.md`](docs/HANDS-ON-ACTIVITIES.md) for ten guided exercises, learning objectives, tasks, and completion checks.

## Security and cost

- Never commit AWS credentials.
- Keep ECR private.
- Scope the OIDC trust policy to this repository and branch.
- This project publishes an image; it does not run a persistent AWS application.
- ECR storage and data transfer can incur charges. Check current AWS pricing and remove unused images when finished.

## Architecture

```text
Git push / pull request
          |
          v
    GitHub Actions
          |
          v
       npm test
          |
          v
    Docker image build
          |
          v
  (main push only) OIDC
          |
          v
       AWS IAM role
          |
          v
    Private Amazon ECR
```
