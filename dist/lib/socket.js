let ioInstance = null;
let chatWsHubInstance = null;
export const setSocketIO = (io) => {
    ioInstance = io;
};
export const getSocketIO = () => ioInstance;
export const setChatWsHub = (hub) => {
    chatWsHubInstance = hub;
};
export const getChatWsHub = () => chatWsHubInstance;
//# sourceMappingURL=socket.js.map