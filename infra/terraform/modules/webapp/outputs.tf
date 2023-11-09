output "app_deployment_bucket_id" {
  description = "The name of the S3 bucket used for storing the deployment artifacts"
  value = aws_s3_bucket.app-hosting.id
}

output "app_distribution_id" {
  description = "The ID of the CloudFront distribution used for serving the application"
  value = aws_cloudfront_distribution.app-distribution.id
}
