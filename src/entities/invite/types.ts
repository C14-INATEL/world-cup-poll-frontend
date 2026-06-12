export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Invite {
  id: string;
  pollId: string;
  invitedUserId: string;
  invitedBy: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
  pollTitle?: string;
  pollCode?: string;
  invitedByName?: string;
}
