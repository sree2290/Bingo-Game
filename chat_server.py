import asyncio
import websockets

# Store connected clients
clients = set()

# Define the server behavior
async def server(websocket, path):
    clients.add(websocket)  # Add client to the set of connected clients
    try:
        async for message in websocket:
            # Broadcast the received message to all connected clients
            await asyncio.wait([client.send(message) for client in clients])
    finally:
        clients.remove(websocket)  # Remove client from the set of connected clients when disconnected

# Start the WebSocket server
async def start_server(ip,port):
    async with websockets.serve(server, ip, port):
        print(f"WebSocket server started on port {port}.")
        await asyncio.Future()  # Keep the server running indefinitely

def hostServer(ip, port):
    asyncio.run(start_server(ip,port))
