acl purge {
    "localhost";
    "127.0.0.1";
    "172.16.0.0"/12;
}

sub vcl_recv {
    unset req.http.X-Prezly-Cache-Policy;
    unset req.http.X-Prezly-Negative-Cache-Bypass;

    if (req.http.Authorization || req.http.Cookie || req.http.RSC ||
        req.http.Next-Router-State-Tree || req.http.Next-Router-Prefetch ||
        req.http.Next-Router-Segment-Prefetch || req.http.X-Middleware-Prefetch ||
        req.http.X-Now-Route-Matches || req.http.X-Fresh) {
        set req.http.X-Prezly-Negative-Cache-Bypass = "1";
        return (pass);
    }

    if (req.method == "BAN") {
        if (client.ip !~ purge) {
            return (synth(403, "Not allowed"));
        }
        if (req.http.Room) {
            ban("obj.http.X-Newsroom == " + req.http.Room);
        } else {
            ban("obj.http.X-Cache-Host == " + req.http.host);
        }
        return (synth(200, "Ban added"));
    }

    if (req.method == "PURGE") {
        if (client.ip !~ purge) {
            return (synth(405, "Not allowed"));
        }
        return (purge);
    }

    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }

    return (hash);
}

sub vcl_backend_response {
    set beresp.grace = 6h;
    set beresp.http.X-Cache-Host = bereq.http.host;

    if (bereq.url ~ "\\.(png|gif|jpe?g|webp|avif|svg|css|js|pdf)(\\?.*)?$") {
        unset beresp.http.Set-Cookie;
    }

    if (beresp.status == 404 &&
        beresp.http.X-Prezly-Cache-Policy == "public-story-404-v1" &&
        !bereq.http.X-Prezly-Negative-Cache-Bypass &&
        beresp.http.Content-Type ~ "(?i)^text/html" &&
        !beresp.http.Set-Cookie &&
        beresp.http.Vary != "*") {
        unset beresp.http.Cache-Control;
        unset beresp.http.Expires;
        set beresp.ttl = 30s;
        set beresp.grace = 0s;
        set beresp.uncacheable = false;
        return (deliver);
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
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }

    if (resp.http.X-Prezly-Cache-Policy == "public-story-404-v1") {
        set resp.http.Cache-Control = "no-store";
    }

    unset resp.http.X-Prezly-Cache-Policy;
    unset resp.http.X-Cache-Host;
    unset resp.http.X-Powered-By;
    unset resp.http.Server;
    unset resp.http.Via;
    unset resp.http.X-Varnish;
}
