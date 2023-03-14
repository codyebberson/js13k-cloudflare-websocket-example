# js13k-cloudflare-websocket-example

Example app that demonstrates:

- Cloudflare Workers
- Cloudflare Wrangler
- Cloudflare Durable Object

## Localhost

1. Clone the repo

```bash
git clone git@github.com:codyebberson/js13k-cloudflare-websocket-example.git
```

2. Install dependencies

```bash
cd js13k-cloudflare-websocket-example
npm ci
```

3. Run the dev server

```bash
npm run dev
```

4. Open a web browser

> <http://localhost:5173>

## Deployment

1. Login to your Cloudflare account with Wrangler

```bash
npx wrangler login
```

2. Publish your Worker to Cloudflare

```bash
npx wrangler publish
```

You may be prompted to enable Durable Objects:

```bash
Your worker has access to the following bindings:
- Durable Objects:
  - servers: GameServer
Total Upload: 4.83 KiB / gzip: 1.78 KiB

✘ [ERROR] A request to the Cloudflare API (/accounts/xxxxxxxxxx/workers/scripts/js13k-cloudflare-websocket-example) failed.

  In order to use Durable Objects, you must agree to pricing at
  https://dash.cloudflare.com/xxxxxxxxxx/workers/overview?enable-durable-objects
  [code: 10084]
```

If so, follow the link, enable Durable Objects, and try again.

## References

https://github.com/cloudflare/workers-chat-demo

## License

MIT
