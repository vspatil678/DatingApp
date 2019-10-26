export interface Message {
    Id: number;
    SenderId: number;
    SenderKnownAs: string;
    SenderPhotoUrl: string;
    RecipientId: number;
    RecipientKnownAs: string;
    RecipientPhotoUrl: string;
    Content: string;
    IsRead: boolean;
    DateRead: Date;
    MessageSent: Date;
}
