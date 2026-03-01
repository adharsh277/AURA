import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  ws: WebSocket;
  id: string;
  accountId?: string;
}

export class WebSocketService {
  private clients: Map<string, Client> = new Map();
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.initialize();
  }

  private initialize(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      
      const client: Client = {
        ws,
        id: clientId
      };

      this.clients.set(clientId, client);
      console.log(`✅ Client connected: ${clientId}`);

      // Send welcome message
      this.send(clientId, {
        type: 'connected',
        data: { clientId }
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`❌ Client disconnected: ${clientId}`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });
    });
  }

  private handleMessage(clientId: string, message: any): void {
    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, message.data);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message.data);
        break;
      case 'ping':
        this.send(clientId, { type: 'pong' });
        break;
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private handleSubscribe(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client && data.accountId) {
      client.accountId = data.accountId;
      console.log(`Client ${clientId} subscribed to account ${data.accountId}`);
    }
  }

  private handleUnsubscribe(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.accountId = undefined;
      console.log(`Client ${clientId} unsubscribed`);
    }
  }

  /**
   * Send message to specific client
   */
  send(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  /**
   * Send message to clients subscribed to specific account
   */
  sendToAccount(accountId: string, message: any): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.accountId === accountId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
