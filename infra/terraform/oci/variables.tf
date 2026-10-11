variable "region" {
  description = "OCI region. Pilot country is Saudi Arabia (pilot brief D1): me-jeddah-1 or me-riyadh-1, if Arm always-free capacity is available there."
  type        = string
  default     = "me-jeddah-1"
}

variable "oci_profile" {
  description = "Profile name in ~/.oci/config."
  type        = string
  default     = "DEFAULT"
}

variable "compartment_ocid" {
  description = "Compartment for all resources (the tenancy OCID works for a single-person account)."
  type        = string
}

variable "ssh_public_key" {
  description = "Public SSH key for the `ubuntu` user."
  type        = string
}

variable "admin_cidr" {
  description = "The only network allowed to reach SSH (port 22), e.g. your home IP as x.x.x.x/32. Web traffic arrives through Cloudflare Tunnel, so no other inbound port is opened."
  type        = string

  validation {
    condition     = can(cidrhost(var.admin_cidr, 0)) && var.admin_cidr != "0.0.0.0/0"
    error_message = "admin_cidr must be a valid CIDR and must not be 0.0.0.0/0."
  }
}

variable "name" {
  description = "Prefix for resource names."
  type        = string
  default     = "platform"
}

# Always-free limits for Ampere A1: up to 4 OCPU and 24 GB in total. The plan uses 2 OCPU / 12 GB.
variable "ocpus" {
  type    = number
  default = 2
}

variable "memory_gbs" {
  type    = number
  default = 12
}

variable "boot_volume_gbs" {
  description = "Boot volume size. Always free covers up to 200 GB of block storage in total."
  type        = number
  default     = 100
}
