import Echo from "laravel-echo";

// Make sure ReverbConnector exists
const ReverbConnector = window.ReverbConnector;

const echo = ReverbConnector
  ? new Echo({
      broadcaster: ReverbConnector,
      key: "local",
      wsHost: "192.168.0.207", // replace with your PC LAN IP
      wsPort: 8080,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    })
  : null;

export default echo;
