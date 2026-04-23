import { Role } from "../../generated/client";
import { chatService } from "../chat/chat.service";
const getAllConversationsForAdmin = async (expertId) => {
    return chatService.getUserRooms("", Role.ADMIN, expertId);
};
export const conversationsService = {
    getAllConversationsForAdmin,
};
//# sourceMappingURL=conversations.service.js.map