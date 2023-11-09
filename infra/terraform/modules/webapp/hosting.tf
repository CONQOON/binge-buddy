resource "aws_s3_bucket" "app-hosting" {
  bucket = "${var.application_name}-app-hosting"

  tags = {
    Name = "${var.application_name}-app-hosting"
  }
}

resource "aws_s3_bucket_cors_configuration" "app-bucket-cors-conf" {
  bucket = aws_s3_bucket.app-hosting.id

  cors_rule {
    allowed_headers = [
      "Authorization",
      "Content-Length"
    ]
    allowed_methods = [
      "GET"]
    allowed_origins = [
      "*"]
    expose_headers = []
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "app-hosting-bucket" {
  bucket = aws_s3_bucket.app-hosting.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "app-hosting-bucket" {
  bucket = aws_s3_bucket.app-hosting.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "app-hosting-bucket" {
  bucket = aws_s3_bucket.app-hosting.id
  policy = data.aws_iam_policy_document.app-hosting-bucket.json
}

data "aws_iam_policy_document" "app-hosting-bucket" {
  statement {

    sid = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = [
        "cloudfront.amazonaws.com"]
    }

    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        aws_cloudfront_distribution.app-distribution.arn]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.app-hosting.arn,
      "${aws_s3_bucket.app-hosting.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app-hosting-bucket-encryption-conf" {
  bucket = aws_s3_bucket.app-hosting.id

  rule {
    bucket_key_enabled = false

    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "app-hosting-bucket-versioning" {
  bucket = aws_s3_bucket.app-hosting.id

  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_website_configuration" "app-hosting-bucket-website-conf" {
  bucket = aws_s3_bucket.app-hosting.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}


resource "aws_cloudfront_origin_access_control" "app-distribution" {
  name = "${var.application_name}-app-distribution"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "app-distribution" {

  origin {
    connection_attempts = 3
    connection_timeout = 10
    domain_name = aws_s3_bucket.app-hosting.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.app-distribution.id
    origin_id = aws_s3_bucket.app-hosting.id
  }

  aliases = [
    "app.${var.hosted_zone.name}",
  ]

  enabled = true
  is_ipv6_enabled = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
      "OPTIONS"]
    cached_methods = [
      "GET",
      "HEAD",
      "OPTIONS"]
    target_origin_id = aws_s3_bucket.app-hosting.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 3600
    max_ttl = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.ssl_certificate.arn
    ssl_support_method = "sni-only"
  }

  tags = {
    Name = "${var.application_name}-app-distribution"
  }
}
