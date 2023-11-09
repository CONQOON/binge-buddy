output "app_deployment_bucket_id" {
  description = "The name of the S3 bucket to store the application deployment artifacts"
  value = module.webapp.app_deployment_bucket_id
}

output "app_distribution_id" {
  description = "The CloudFront distribution ID for the application"
  value = module.webapp.app_distribution_id
}
