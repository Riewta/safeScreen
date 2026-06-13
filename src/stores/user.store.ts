import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  birthday?: string; // ISO or YYYY-MM-DD
  points: number;
  pointsHistory: PointsEntry[];
}

interface UserStore {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  addPoints: (pts: number, desc?: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name:   "ธนิดา โอวาท",
  email:  "thanid.off@gmail.com",
  phone:  "0891234567",
  avatar: null,
  gender: "female",
  birthday: "1995-05-14",
  points: 48700,
  pointsHistory: [
    { id: "h0", date: new Date(Date.now() - 24*60*60*1000).toISOString(), desc: "ยินดีต้อนรับสมาชิกใหม่", pts: 1000 },
    { id: "h1", date: new Date().toISOString(), desc: "รีวิวสินค้า", pts: 560 },
  ],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,

      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),

      addPoints: (pts, desc = "รับคะแนนสะสม") =>
        set((s) => {
          const newEntry: PointsEntry = {
            id: `h-${Date.now()}`,
            date: new Date().toISOString(),
            desc,
            pts,
          };
          return {
            profile: {
              ...s.profile,
              points: s.profile.points + pts,
              pointsHistory: [newEntry, ...(s.profile.pointsHistory || [])],
            },
          };
        }),
    }),
    { name: "karmart-user" }
  )
);

export const useProfile = () => useUserStore((s) => s.profile);
