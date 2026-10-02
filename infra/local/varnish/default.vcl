vcl 4.1;

backend default {
    .host = "app";
    .port = "3000";
    .connect_timeout = 5s;
    .first_byte_timeout = 120s;
    .between_bytes_timeout = 30s;
}

include "/etc/varnish/policy.vcl";
