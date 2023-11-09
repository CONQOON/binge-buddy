resource "aws_security_group" "default" {
  name = "default-${terraform.workspace}"
  vpc_id = aws_vpc.main.id
  description = "default VPC security group"

  egress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 0
    protocol = "-1"
    to_port = 0
    self = false
  }

  ingress {
    cidr_blocks = []
    description = ""
    from_port = 0
    protocol = "-1"
    to_port = 0
    self = true
  }

  tags = {
    Name = "default"
  }
}
