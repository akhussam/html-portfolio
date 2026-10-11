output "server_public_ip" {
  description = "For SSH only (port 22 from admin_cidr). Web traffic goes through Cloudflare Tunnel."
  value       = oci_core_instance.server.public_ip
}

output "backup_bucket" {
  value = oci_objectstorage_bucket.backups.name
}

output "object_storage_namespace" {
  value = data.oci_objectstorage_namespace.ns.namespace
}
