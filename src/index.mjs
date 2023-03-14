import HTML from './index.html';

// Main request handler
// By Cloudflare convention, the default export is the main request handler.
// For root requests, returns the default HTML page
// For /ws requests, returns a websocket handler
// Otherwise, returns a 404
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      switch (url.pathname) {
        case '/':
          return new Response(HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        case '/ws':
          // idFromName will always return the same ID for the same name.
          // This means that all requests to /ws will be routed to the same GameServer object.
          return env.servers.get(env.servers.idFromName('x')).fetch(request, env);
        default:
          return new Response('Not found', { status: 404 });
      }
    } catch (err) {
      return new Response(err.toString());
    }
  },
};

/**
 * The GameServer class is a Cloudflare Durable Object that handles a single game session.
 * In this example, there is only one game session, but in a real game there could be many.
 */
export class GameServer {
  constructor(controller, env) {
    this.storage = controller.storage;
    this.env = env;
    this.state = { time: 0, players: [] };
    setInterval(() => this.state.time++, 30);
  }

  /**
   * Handles an HTTP request.
   * The game server is a websocket server, so the only valid HTTP request is a websocket upgrade.
   * @param request The HTTP request for the /ws websocket endpoint.
   * @returns An HTTP 101 Upgrade response.
   */
  async fetch(request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 400 });
    }
    const [client, server] = Object.values(new WebSocketPair());
    await this.handleSession(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  /**
   * Handles a websocket connection.
   * This function is called once for each websocket connection.
   * @param websocket The websocket connection to the client.
   */
  async handleSession(websocket) {
    // Generate a random ID for this player.
    const id = crypto.randomUUID();

    // Accept the websocket connection.
    websocket.accept();

    // On every message, update the player's location and send a copy of the server state.
    websocket.addEventListener('message', async ({ data }) => {
      let player = this.state.players.find((p) => p.id === id);
      if (!player) {
        player = { id, x: 0, y: 0 };
        this.state.players.push(player);
      }

      const newLocation = JSON.parse(data);
      player.x = newLocation.x;
      player.y = newLocation.y;

      websocket.send(JSON.stringify({ ...this.state, me: id }));
    });

    // When the websocket closes, remove the player from the game.
    websocket.addEventListener('close', async (evt) => {
      this.state.players = this.state.players.filter((p) => p.id !== id);
    });
  }
}
