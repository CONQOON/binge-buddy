output "hosted_zone" {
  description = "The hosted zone for the domain"
  value = aws_route53_zone.main
}

output "ssl_certificate" {
  description = "The SSL certificate for the domain"
  value = aws_acm_certificate.main
}
