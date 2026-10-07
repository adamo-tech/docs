"""Publish an Astro build to the dedicated docs bucket using the AWS CLI."""

import json
import os
from pathlib import Path
import subprocess

BUCKET = "adamo-docs-prod-727481405861"
ORIGIN = f"{BUCKET}.s3.eu-west-2.amazonaws.com"


def aws(*args):
    return subprocess.check_output(["aws", *args], text=True)


def validate_target(config):
    origins = config["Origins"]["Items"]
    aliases = config.get("Aliases", {}).get("Items", [])
    if (
        len(origins) != 1
        or origins[0]["DomainName"] != ORIGIN
        or origins[0].get("OriginPath", "")
        or set(aliases) - {"docs.adamohq.com"}
    ):
        raise ValueError("Refusing to publish: CloudFront must serve only the dedicated docs bucket and hostname")


def deploy(directory, distribution):
    root = Path(directory).resolve()
    for name in ("index.html", "404.html", "quickstart/index.html", "pagefind/pagefind.js"):
        if not (root / name).is_file():
            raise ValueError(f"Incomplete docs build: missing {name}; run npm run build first")
    if not distribution:
        raise ValueError("Set DOCS_CLOUDFRONT_DISTRIBUTION_ID from the docs Terraform outputs")
    config = json.loads(aws("cloudfront", "get-distribution-config", "--id", distribution))["DistributionConfig"]
    validate_target(config)

    source, destination = str(root) + "/", f"s3://{BUCKET}/"
    # Retain previous hashed assets so cached pages continue working during a
    # rollout. Upload dependencies first and HTML last. cp also refreshes cache
    # headers for files whose content did not change since the last deployment.
    groups = [
        (["--exclude", "*", "--include", "_astro/*"], "public,max-age=31536000,immutable"),
        (["--exclude", "_astro/*", "--exclude", "*.html"], "public,max-age=60,must-revalidate"),
        (["--exclude", "*", "--include", "*.html"], "public,max-age=0,must-revalidate"),
    ]
    for filters, cache_control in groups:
        aws("s3", "cp", source, destination, "--recursive", *filters,
            "--cache-control", cache_control, "--only-show-errors")
    invalidation = json.loads(aws("cloudfront", "create-invalidation", "--distribution-id", distribution,
                                  "--paths", "/*"))["Invalidation"]["Id"]
    aws("cloudfront", "wait", "invalidation-completed", "--distribution-id", distribution,
        "--id", invalidation)
    print(f"Published docs to {BUCKET}; CloudFront invalidation {invalidation} completed")


if __name__ == "__main__":
    deploy("dist", os.environ.get("DOCS_CLOUDFRONT_DISTRIBUTION_ID", ""))
