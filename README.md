# Adamo docs

The documentation is a static Astro/Starlight site. Build it with Node 22:

```sh
npm ci
npm run build
```

`npm run dev` starts the local development server. The production build is in
`dist/`, including the Pagefind search index and the generated 404 page.

## S3 publishing

`.github/workflows/deploy.yml` builds pull requests and publishes successful
`main` builds to the dedicated private S3 bucket behind CloudFront. A manual
workflow run on `main` can republish the site. There is no release versioning.

Provision `infra/envs/docs` in `adamo-tech/adamo-infra`, then configure these
repository Actions variables from its Terraform outputs:

| Variable | Terraform output |
| --- | --- |
| `DOCS_AWS_ROLE_ARN` | `publisher_role_arn` |
| `DOCS_CLOUDFRONT_DISTRIBUTION_ID` | `distribution_id` |

GitHub authenticates through OIDC; no AWS access keys are stored in the repository.
The AWS role trusts only this repository's `main` branch and can upload only to
the docs bucket and invalidate only its CloudFront distribution.

To publish a local build with appropriately scoped AWS credentials:

```sh
DOCS_CLOUDFRONT_DISTRIBUTION_ID=YOUR_DISTRIBUTION_ID python3 scripts/deploy.py
```

The script checks the destination and required build files, uploads assets before
HTML, and waits for CloudFront invalidation. Hashed assets are cached for a year;
HTML is revalidated and other files have a 60-second cache lifetime. It retains
previous objects so cached pages can still load their assets during a rollout.
Removed pages therefore require deliberate cleanup from S3. To roll back a bad
content change, revert it on `main` and let the workflow republish.

Test the publisher without contacting AWS:

```sh
python3 -m unittest discover -s scripts -p 'test_*.py'
```

Follow the infrastructure environment's README for certificate validation,
testing the CloudFront hostname, and the DNS cutover from Vercel.
