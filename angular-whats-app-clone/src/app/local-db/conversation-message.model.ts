export interface ConversationMessage{
    id?: number,
    conversationUserId: string,
    message: string,
    mine: boolean,
    time: Date
}