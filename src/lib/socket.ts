import type { Server } from "socket.io";
import type { ChatWsHub } from "./chatWs";

let ioInstance: Server | null = null;
let chatWsHubInstance: ChatWsHub | null = null;

export const setSocketIO = (io: Server) => {
  ioInstance = io;
};

export const getSocketIO = () => ioInstance;

export const setChatWsHub = (hub: ChatWsHub) => {
  chatWsHubInstance = hub;
};

export const getChatWsHub = () => chatWsHubInstance;
