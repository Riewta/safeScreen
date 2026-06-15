export interface PointsEntry {
  id: string;
  date: string;
  desc: string;
  pts: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  gender?: "male" | "female" | "other";
  birthday?: string;
  points: number;
  pointsHistory: PointsEntry[];
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  gender?: "male" | "female" | "other";
  birthday?: string;
}

export type MemberTier = "Silver" | "Gold" | "Platinum" | "Diamond";

export interface MemberInfo {
  tier: MemberTier;
  points: number;
  nextTierPoints?: number;
}
