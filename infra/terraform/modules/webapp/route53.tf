resource "aws_route53_record" "webapp_domain" {
  zone_id = var.hosted_zone.id
  name    = "app.${var.hosted_zone.name}"
  type    = "A"

  alias {
    name    = aws_cloudfront_distribution.app-distribution.domain_name
    zone_id = aws_cloudfront_distribution.app-distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
