variable "region" {
  description = "AWS region"
  type = string
  default = "us-east-1"
}

variable "aws_profile" {
  description = "Name of your AWS profile"
  type = string
  default = "bb"
}

variable "application_name" {
  description = "Name of the application"
  type = string
  default = "binge-buddy"
}

variable "domain_name" {
  description = "Domain name"
  type = string
  default = "binge-buddy.io"
}
