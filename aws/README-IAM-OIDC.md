# AWS setup: GitHub Actions OIDC to ECR

This guide explains the AWS-side setup. Replace every placeholder with your own values.

## 1. Create a private ECR repository

```bash
# Create the repository in the chosen AWS Region.
aws ecr create-repository --repository-name devops-status-api --region eu-north-1
```

If the repository already exists, reuse it. Record your AWS account ID and region.

## 2. Add GitHub as an IAM OIDC provider

In AWS Console, open IAM → Identity providers → Add provider:
- Provider type: OpenID Connect
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

OIDC lets GitHub Actions request short-lived AWS credentials rather than storing long-lived AWS access keys.

## 3. Create the role trust policy

Save the JSON below as `trust-policy.json`. Replace `AWS_ACCOUNT_ID`, `GITHUB_OWNER`, and `GITHUB_REPO`.

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:GITHUB_OWNER/GITHUB_REPO:ref:refs/heads/main"
      }
    }
  }]
}
```

The `sub` condition restricts this role to the `main` branch of the specified repository. Current GitHub OIDC subject formats can vary for repositories using immutable subject claims; verify your repository's actual format in the official GitHub documentation.

## 4. Create a least-privilege ECR permissions policy

Save the JSON below as `ecr-push-policy.json`. Replace `AWS_REGION` and `AWS_ACCOUNT_ID`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAuthorization",
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Sid": "PushToOneRepository",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:BatchGetImage"
      ],
      "Resource": "arn:aws:ecr:AWS_REGION:AWS_ACCOUNT_ID:repository/devops-status-api"
    }
  ]
}
```

Create an IAM role with the trust policy and attach the permissions policy. Example role name: `github-actions-devops-status-api`. Do not attach `AdministratorAccess`.

## 5. Add GitHub repository variables

In GitHub, open Settings → Secrets and variables → Actions → Variables. Add:

- `AWS_ROLE_ARN`: full ARN of the IAM role.
- `AWS_REGION`: same Region used for ECR, e.g. `eu-north-1`.
- `ECR_REPOSITORY`: `devops-status-api`.

No long-lived AWS access key is needed by this workflow.

## 6. Verify the workflow

Push a commit to `main` and open the Actions tab. The test job runs first. If it passes, the publish job assumes the role and pushes a commit-SHA tag and `latest` to ECR.

## Security and cost

- Never commit AWS credentials, tokens, or `.env` files.
- Keep the trust policy scoped to the exact repository and branch.
- Keep the IAM permissions limited to the required ECR repository.
- For production, review and pin third-party actions to verified full commit SHAs.
- ECR storage and data transfer may incur charges. Delete unused images/repositories when finished.
