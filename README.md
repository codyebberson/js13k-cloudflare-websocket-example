# js13k-cloudflare-websocket-example

Example app that demonstrates:

- Cloudflare Workers
- Cloudflare Wrangler
- Cloudflare Durable Object

## Setup

1. Clone the repo

```bash
git clone ...
```

2. Install dependencies

```bash
npm ci
```

3. Update `wrangler.toml` with your Cloudflare account ID

4. Authenticate Wrangler with your Cloudflare account

```bash
npx wrangler login
```

5. Start the Wrangler dev server

```bash
npx wrangler dev
```

## References

https://github.com/cloudflare/workers-chat-demo

## License

MIT
