export type ProspectStatus =
  | "nouveau"
  | "a_relancer"
  | "hesitant"
  | "client"
  | "ancien_client"
  | "perdu";

export type ProspectSource = "chatbot" | "manuel" | "reseaux_sociaux" | "site";

export interface Prospect {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: ProspectStatus;
  source: ProspectSource;
  interest?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  /** Links an anonymous chat-widget session to this record before we know who they are. */
  chatSessionId?: string;
}

export type SocialPlatform = "facebook" | "instagram" | "linkedin";

export type ContentPostStatus = "brouillon" | "planifie" | "publie" | "echec";

export interface ContentPost {
  id: string;
  title: string;
  body: string;
  platforms: SocialPlatform[];
  productRef?: string;
  status: ContentPostStatus;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  publishResult?: string;
}

export type EscalationKind = "besoin_humain" | "idee_business" | "paiement";

export type EscalationStatus = "en_attente" | "approuve" | "rejete";

export interface Escalation {
  id: string;
  kind: EscalationKind;
  summary: string;
  details: string;
  prospectId?: string;
  status: EscalationStatus;
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface Database {
  prospects: Prospect[];
  posts: ContentPost[];
  escalations: Escalation[];
}
