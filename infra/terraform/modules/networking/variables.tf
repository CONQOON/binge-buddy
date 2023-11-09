variable "region" {
  description = "The region to deploy to"
  default = "eu-central-1"
}

variable "application_name" {
  description = "The name of the application"
  default = "my-app"
}

variable "domain_name" {
  description = "The domain name to use for the application"
}
