import io from 'socket.io-client'; // Default import for modern versions

// Create a mock socket implementation for when the server is not available
class MockSocket {
  private listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event: string) {
    delete this.listeners[event];
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    console.log(`Mock socket emitted ${event}`, args);
    return this;
  }

  connect() {
    if (this.listeners['connect']) {
      this.listeners['connect'].forEach(callback => callback());
    }
    return this;
  }

  disconnect() {
    if (this.listeners['disconnect']) {
      this.listeners['disconnect'].forEach(callback => callback());
    }
    return this;
  }

  get id() {
    return 'mock-socket-id';
  }
}

// Determine if we're in development mode
const isDev = import.meta.env.DEV;

// Function to create a socket connection with error handling
const createSocket = () => {
  try {
    // In development, try to connect to the WebSocket server
    if (isDev) {
      const socket = io('http://localhost:5001', {
        transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
        autoConnect: true,
      });

      // Log connection status
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      socket.on('connect_error', (error: Error) => {
        console.warn('Connection error:', error.message);
      });

      return socket;
    } else {
      // In production, use the actual server URL
      // This would be replaced with your production WebSocket URL
      return io('https://your-production-server.com', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
        autoConnect: true,
      });
    }
  } catch (error) {
    console.warn('Failed to initialize socket.io client, using mock socket instead:', error);
    // Return a mock socket implementation if the real one fails
    const mockSocket = new MockSocket();
    mockSocket.connect();
    return mockSocket as unknown as ReturnType<typeof io>;
  }
};

// Create the socket instance
const socket = createSocket();

export default socket;