module "networking" {
  source = "./modules/networking"
  //Variables
  region = var.region
  application_name = var.application_name
  domain_name = var.domain_name
}

module "webapp" {
  source = "./modules/webapp"
  //Variables
  region = var.region
  application_name = var.application_name
  hosted_zone = module.networking.hosted_zone
  ssl_certificate = module.networking.ssl_certificate
}
