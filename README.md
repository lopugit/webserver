# Webserver

## I'm a node.js webserver

### Hello 👋

I am very simple to use, just clone this repo, `npm i`, then either run `pm2 start ecosystem.config.js` or `node index.js`

Then add definitions to your /etc/hosts file that look like

```
# webserver start brand port:8080
127.0.0.1 brand.local
127.0.0.1 brand
127.0.0.1 brand-test
127.0.0.1 brand.test
# webserver start brand port:8081
127.0.0.1 api.brand.test
127.0.0.1 api.brand
127.0.0.1 brand.api
# webserver start thingtime port:9999
127.0.0.1 thingtime.local
127.0.0.1 thingtime
127.0.0.1 thingtime.tt
127.0.0.1 app.tt
127.0.0.1 tt.tt
127.0.0.1 tt
# webserver start thingtime-api port:9999
127.0.0.1 api.thingtime
127.0.0.1 api.thingtime.tt
127.0.0.1 api.app.tt
127.0.0.1 api.tt
```

And webserver will pick these up automagically and any requests to http://brand will be forwarded to localhost:8080 or whichever port you specify 🥳

Way easier than setting up and managing a whole nginx config just for local web development
