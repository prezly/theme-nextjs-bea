acl purgers {
    "localhost";
    "127.0.0.1";
    "10.0.0.0"/8;
    "172.16.0.0"/12;
    "192.168.0.0"/16;
}

sub vcl_recv {
    if (req.method == "BAN" || req.method == "PURGE") {
        if (client.ip !~ purgers) {
            return (synth(405, "Method not allowed"));
        }
        if (req.http.X-Host) {
            set req.http.Host = req.http.X-Host;
        }
        if (req.http.X-Newsroom-Uuid) {
            ban("obj.http.X-Newsroom-Uuid == " + req.http.X-Newsroom-Uuid);
        } elseif (req.http.X-Newsroom-Theme) {
            ban("obj.http.X-Newsroom-Theme == " + req.http.X-Newsroom-Theme);
        } else {
            ban("obj.status != 0");
        }
        return (synth(204, req.method + " DONE"));
    }

    # Production removes cookies before lookup and before forwarding to a theme.
    unset req.http.Cookie;

    if (req.http.X-Fresh) {
        return (pass);
    }
}

sub vcl_backend_response {
    set beresp.ttl = 7d;

    if (beresp.status == 400 || beresp.status == 403 || beresp.status == 500 ||
        beresp.status == 502 || beresp.status == 503 || beresp.status == 504) {
        if (bereq.is_bgfetch) {
            return (abandon);
        }
        set beresp.uncacheable = true;
    }

    if (beresp.status == 404) {
        set beresp.ttl = 30s;
    }

    unset beresp.http.Server;
    unset beresp.http.Set-Cookie;
    unset beresp.http.Via;
    unset beresp.http.X-Varnish;
    unset beresp.http.X-Powered-By;

    if (bereq.http.X-Newsroom-Uuid) {
        set beresp.http.X-Newsroom-Uuid = bereq.http.X-Newsroom-Uuid;
    }
    if (bereq.http.X-Newsroom-Theme) {
        set beresp.http.X-Newsroom-Theme = bereq.http.X-Newsroom-Theme;
    }
}

sub vcl_hash {
    hash_data(req.url);
    hash_data(req.http.host);

    if (req.http.Cookie) {
        hash_data(req.http.Cookie);
    }
    if (req.http.X-Prezly-Reverse-Proxy-Culture) {
        hash_data(req.http.X-Prezly-Reverse-Proxy-Culture);
    }
    if (req.http.X-Requested-With) {
        hash_data(req.http.X-Requested-With);
    }
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Prezly-Cache = "Hit";
    } else {
        set resp.http.X-Prezly-Cache = "Miss";
    }
}
