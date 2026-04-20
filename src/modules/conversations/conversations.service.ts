import { Role } from "../../generated/client";
import { chatService } from "../chat/chat.service";

const getAllConversationsForAdmin = async (expertId?: string) => {
	return chatService.getUserRooms("", Role.ADMIN, expertId);
};

export const conversationsService = {
	getAllConversationsForAdmin,
};
