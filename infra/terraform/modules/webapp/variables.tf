variable "region" {
  description = "The region to deploy to"
  default = "eu-central-1"
}

variable "application_name" {
  description = "The name of the application"
  default = "my-app"
}

variable "hosted_zone" {
  description = "The hosted zone"
}

variable "ssl_certificate" {
  description = "The SSL certificate"
}
