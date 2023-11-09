resource "aws_vpc" "main" {
  cidr_block = "172.31.0.0/16"
  assign_generated_ipv6_cidr_block = false
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc-${var.region}"
  }
}

resource "aws_subnet" "public_subnet_a" {
  cidr_block = "172.31.16.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "public-subnet-a-${var.region}"
  }
}

resource "aws_subnet" "public_subnet_b" {
  cidr_block = "172.31.32.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "public-subnet-b-${var.region}"
  }
}

resource "aws_subnet" "public_subnet_c" {
  cidr_block = "172.31.0.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "public-subnet-c-${var.region}"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    "Name" = "igw-${var.region}"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    "Name" = "main-public-route-table"
  }
}
