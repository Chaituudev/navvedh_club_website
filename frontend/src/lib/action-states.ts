export type AuthActionState = {
  error?: string;
  message?: string;
};

export type ProfileActionState = {
  error?: string;
  message?: string;
};

export type EventRegistrationState = {
  error?: string;
};

export type CertificateLookupState = {
  error?: string;
  result?: {
    certificateNumber: string;
    recipientName: string;
    roleType: string;
    awardName: string | null;
    issuedAt: string;
    verificationStatus: string;
    eventName: string | null;
  };
};

export type JoinActionState = {
  error?: string;
  message?: string;
};

export type ContactActionState = {
  error?: string;
  message?: string;
};

export type CommunicationActionState = {
  error?: string;
  message?: string;
  recipientCount?: number;
};

export const initialAuthState: AuthActionState = {};
export const initialProfileState: ProfileActionState = {};
export const initialEventRegistrationState: EventRegistrationState = {};
export const initialCertificateLookupState: CertificateLookupState = {};
export const initialJoinState: JoinActionState = {};
export const initialContactState: ContactActionState = {};
export const initialCommunicationState: CommunicationActionState = {};
