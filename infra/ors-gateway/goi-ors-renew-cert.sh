#!/bin/bash
set -euo pipefail
DOMAIN="$(hostname -f)"
umask 077
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
/usr/bin/tailscale cert --cert-file "$TMP/cert.pem" --key-file "$TMP/key.pem" "$DOMAIN"
install -o root -g root -m 0644 "$TMP/cert.pem" /etc/goi-ors/tls/fullchain.pem
install -o root -g root -m 0600 "$TMP/key.pem" /etc/goi-ors/tls/privkey.pem
nginx -t
systemctl reload nginx
