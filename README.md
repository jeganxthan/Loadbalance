# WebSocket Chat Load Balancer

This project is a **scalable, real-time WebSocket chat system** using Node.js, Redis, Docker, and Nginx.  
It supports thousands of concurrent WebSocket connections distributed across multiple server instances.

---

## **Architecture**
Client
│
▼
Nginx (Load Balancer & WebSocket Proxy)
│
▼
Multiple WebSocket Chat Servers (Node.js)
│
▼
Redis Pub/Sub (Message Broker)

- **Nginx**: Acts as a reverse proxy and load balancer for WebSocket connections.
- **Chat Servers**: Stateless Node.js WebSocket servers handling client connections.
- **Redis**: Handles Pub/Sub communication between chat servers.
- **Docker**: Containers to run and scale services easily.

---

## **Features**
- Stateless WebSocket servers for scalability.
- Redis Pub/Sub for cross-server message broadcasting.
- Nginx load balancing WebSocket connections.
- Dockerized for easy deployment.
- Support for thousands of concurrent connections.

---

---

## **Setup & Run**

```bash
git clone <repository-url>
cd loadbalancer
docker compose up --build
```
