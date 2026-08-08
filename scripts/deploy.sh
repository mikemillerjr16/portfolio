#!/usr/bin/env bash
# Build the static export and deploy it to S3 + CloudFront for mikemiller.ai.
#
# Prereqs: AWS CLI configured (account 961406434831), Node/npm on PATH.
# Do NOT run `npm run build` while `npm run dev` is running (it corrupts .next).
# Stop the dev server first; this script cleans .next/out before building.
set -euo pipefail

BUCKET="mikemiller-ai-site"
DIST_ID="E2AB64W1D6L57C"
REGION="us-east-1"

cd "$(dirname "$0")/.."

echo "==> Building static export"
rm -rf .next out
NEXT_OUTPUT=export npm run build

echo "==> Syncing hashed assets (long cache)"
aws s3 sync out/ "s3://$BUCKET/" --delete \
  --exclude "*.html" --exclude "*.xml" --exclude "*.txt" \
  --cache-control "public,max-age=31536000,immutable" --only-show-errors

echo "==> Syncing HTML (short cache)"
aws s3 sync out/ "s3://$BUCKET/" \
  --exclude "*" --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=60,must-revalidate" --only-show-errors

# Correct content types for the metadata files.
aws s3 cp "s3://$BUCKET/sitemap.xml" "s3://$BUCKET/sitemap.xml" \
  --content-type "application/xml" --metadata-directive REPLACE \
  --cache-control "public,max-age=300" --only-show-errors
aws s3 cp "s3://$BUCKET/robots.txt" "s3://$BUCKET/robots.txt" \
  --content-type "text/plain" --metadata-directive REPLACE \
  --cache-control "public,max-age=300" --only-show-errors

echo "==> Invalidating CloudFront"
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" \
  --query 'Invalidation.Status' --output text

echo "==> Done. Live at https://mikemiller.ai"
