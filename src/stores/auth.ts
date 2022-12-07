import {defineStore} from "pinia";
import {localStorageKeys} from "@/types/constants";

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        walletProvider: localStorage.getItem(localStorageKeys.walletProvider),
        hasWalletPermission: false,
        userSuiAddress: localStorage.getItem(localStorageKeys.walletProvider),
        coins: [],
    }),

    actions:{
    }
});
