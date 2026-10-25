# 10 Hands-on Activities: DevOps Status API

Use these exercises after extracting and running the project. Each activity has a goal, tasks, and a completion check. Students should make changes themselves and explain the result.

## Activity 1 — Explore and run the API

**Goal:** Understand the application before deploying it.

Tasks:
1. Read `src/app.js` and explain the purpose of the HTTP server.
2. Run `npm test`.
3. Run `npm start`.
4. Visit `/` and `/health`.
5. Visit `/unknown` and observe the 404 response.

Completion check: Explain HTTP methods, status codes, JSON responses, and why a health endpoint is useful.

## Activity 2 — Practise Git commits

**Goal:** Track changes safely.

Tasks:
1. Change the application version in `src/app.js`.
2. Run the tests.
3. Run `git status`.
4. Stage only the intended file.
5. Commit with a descriptive message.
6. Use `git log --oneline` to inspect history.

Completion check: Explain working tree, staging area, commit, and why small commits are useful.

## Activity 3 — Feature branch and pull request

**Goal:** Practise team collaboration.

Tasks:
1. Create a branch named `feature/add-about-route`.
2. Add a new `/about` endpoint.
3. Add a test for the endpoint.
4. Commit and push the branch.
5. Open a pull request and review the changes.
6. Merge after checks pass.

Completion check: Explain branch isolation, pull requests, review, and merge conflicts.

## Activity 4 — Break and fix a unit test

**Goal:** Understand test-driven feedback.

Tasks:
1. Change the expected health response in the test to an incorrect value.
2. Run `npm test`.
3. Read the failure output and identify the assertion that failed.
4. Restore the correct expectation.
5. Add a test for a new route.

Completion check: Explain why automated tests should run before publishing a container image.

## Activity 5 — Build and inspect a Docker image

**Goal:** Understand images and containers.

Tasks:
1. Run `docker build -t devops-status-api:local .`.
2. Inspect the image with `docker images`.
3. Start the container using port mapping.
4. Check the endpoint in a browser.
5. Inspect logs and container details.
6. Stop and remove the container.

Completion check: Explain the Dockerfile, image, container, `EXPOSE`, and `-p`.

## Activity 6 — Diagnose Docker problems

**Goal:** Practise troubleshooting.

Tasks:
1. Start a container with a conflicting host port.
2. Observe and explain the error.
3. Try a different host port, such as `-p 3001:3000`.
4. Use an incorrect endpoint and observe the 404.
5. Inspect logs and container status.

Completion check: Explain host port versus container port and how logs help diagnose problems.

## Activity 7 — Understand the GitHub Actions workflow

**Goal:** Read and modify a CI pipeline.

Tasks:
1. Read `.github/workflows/ci-cd.yml`.
2. Identify workflow triggers, jobs, steps, runner, and permissions.
3. Push a small change to a feature branch.
4. Open a pull request.
5. Inspect the test job on the Actions tab.
6. Deliberately make a test fail and observe the pipeline.

Completion check: Explain why `publish` depends on `test` and why pull requests do not publish images.

## Activity 8 — Create an Amazon ECR repository

**Goal:** Understand a private container registry.

Tasks:
1. Choose an AWS Region.
2. Create the `devops-status-api` private repository.
3. Find the repository URI in the AWS Console.
4. Explain the account ID, Region, repository name, and image tag in the URI.
5. Review the applicable ECR pricing and clean-up options.

Completion check: Explain why ECR is used instead of storing images only on a developer's laptop.

## Activity 9 — Configure GitHub OIDC and IAM

**Goal:** Authenticate a workflow securely.

Tasks:
1. Follow `aws/README-IAM-OIDC.md`.
2. Configure GitHub as an IAM OIDC provider.
3. Create a role trust policy scoped to the intended repository and main branch.
4. Attach the least-privilege ECR push policy.
5. Add `AWS_ROLE_ARN`, `AWS_REGION`, and `ECR_REPOSITORY` as GitHub repository variables.
6. Review the trust policy and permissions before running the workflow.

Completion check: Explain the difference between a trust policy and a permissions policy, and why OIDC avoids long-lived AWS keys.

## Activity 10 — Publish and troubleshoot an image

**Goal:** Complete the end-to-end workflow.

Tasks:
1. Push a new commit to `main`.
2. Confirm tests pass.
3. Confirm the publish job authenticates to AWS.
4. Find the image in ECR.
5. Confirm both the commit-SHA tag and `latest` tag exist.
6. Investigate one controlled failure, such as an incorrect ECR repository variable.
7. Correct the problem and rerun the workflow.

Completion check: Explain how a commit becomes a versioned image in ECR and how you would identify which source revision produced an image.

## Instructor assessment rubric

Score each category from 0 to 2:
- 0 = unable to explain or complete.
- 1 = completes with guidance.
- 2 = completes independently and explains why it works.

Categories:
1. Git workflow.
2. Application and tests.
3. Docker image and container.
4. GitHub Actions workflow.
5. AWS ECR and image tags.
6. IAM/OIDC security.
7. Troubleshooting.

Maximum score: 14. Ask the student to demonstrate the workflow live rather than relying only on a written explanation.
