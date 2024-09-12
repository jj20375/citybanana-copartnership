import { create } from "zustand";
import { GetUserProfileAPI } from "@/api/userAPI/userAPI";
import { UserProfileInterface } from "@/interface/user";
export interface UserStore {
    user: UserProfileInterface | any;
    isLoading: boolean;
    setUser: (user: UserProfileInterface) => void;
    fetchUserProfileAPI(): Promise<UserProfileInterface> | void;
}

const useUserStore = create<UserStore>((set) => ({
    user: {
        name: "",
        banana_id: "",
        wallet: {},
    },
    isLoading: false,
    setUser: (user) => set((state) => ({ user: user })),
    fetchUserProfileAPI: async () => {
        try {
            const data = await GetUserProfileAPI();
            console.log("user profile =>", data);
            set({ user: data });
            return data;
        } catch (error) {
            console.log("GetUserProfileAPI err =>", error);
            throw error;
        }
    },
}));

export default useUserStore;
