import { JsonRpcProvider } from "@mysten/sui.js";
import { localStorageKeys, suiRpcUrl } from "@/types/constants";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const provider = new JsonRpcProvider(suiRpcUrl);

const walletProviders = {
    suiWallet: {
        key: 'suiWallet',
        title: 'Sui Wallet',
        logo: 'https://suifoundation.org/images/favicon.png',
        url: 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil'
    },
    ethosWallet: {
        key: 'ethosWallet',
        title: 'Ethos Wallet',
        logo: 'https://ethoswallet.xyz/favicon.ico',
        url: 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli'
    }
}

export function useWallet() {
    const authStore = useAuthStore();
    const permissionGrantedError = ref("");

    const updateSuiAddress = (address, provider?) => {
        if (address) {
            localStorage.setItem(localStorageKeys.address, address);
            localStorage.setItem(localStorageKeys.walletProvider, provider);
        } else {
            // 参数address为null则为移除对应的地址
            localStorage.removeItem(localStorageKeys.address);
            localStorage.removeItem(localStorageKeys.walletProvider);
        }
        authStore.hasWalletPermission = !!address;
        authStore.userSuiAddress = address || null
    }

    const walletAddress = localStorage.getItem(localStorageKeys.address);
    const walletProvider = localStorage.getItem(localStorageKeys.walletProvider);

    if (walletAddress && walletProvider) {
        updateSuiAddress(walletAddress, walletProvider);
    }

    //检查钱包权限是否正常
    const verifyWalletPermissions = async () => {
        if (!authStore.walletProvider || !window[authStore.walletProvider]) {
            logout()
            return false;
        }
        return await window[authStore.walletProvider].hasPermissions().then(async res => {
            if (!res) {
                logout()
                return false;
            }
            return true;
        }).catch(e => {
            logout();
            return false;
        });
    }

    //获取用户拥有的代币清单
    const getUserCoinList = () => {
        const address = getAddress();
        if (!address) return;
        provider.getObjectsOwnedByAddress(address).then(res => {
        }).catch(e => {
        });
    }

    // returns wallet address
    const getAddress = () => {
        return authStore.userSuiAddress;
    }

    // checks if we have a sui address to do any requests
    const isPermissionGranted = computed(() => {
        return authStore.userSuiAddress !== null;
    });

    // remove saved wallet address. Can't revoke permissions yet.
    const logout = async () => {
        if (authStore.walletProvider === walletProviders.ethosWallet.key && window[authStore.walletProvider]) {
            await window[authStore.walletProvider].disconnect();
        }
        updateSuiAddress(null);
        authStore.$reset();
    }

    // 请求获取钱包连接
    const requestWalletAccess = (provider) => {
        // 用户浏览器没有对应钱包插件，跳转对应插件商店。
        if (!window[provider]) {
            // @ts-ignore
            return window.open(walletProviders[provider].url, '_blank').focus();
        }
        permissionGrantedError.value = "";
        return window[provider].requestPermissions().then(async res => {
            authStore.walletProvider = provider;
            return await window[provider].getAccounts().then(accounts => {
                updateSuiAddress(accounts[0], provider);
                return true;
            }).catch(e => {
                return false
            });
        }).catch(e => {
            permissionGrantedError.value = `You need to give us ${walletProviders[provider].title} permissions to continue.`;
            updateSuiAddress(null);
            return false;
        });
    }
    //
    // const getSuitableCoinId = (amount) => {
    //     let coinId = null;
    //     for (let coin of authStore.coins) {
    //         if (coin.balance >= amount) {
    //             coinId = coin.id
    //             break;
    //         }
    //     }
    //     return coinId;
    // }

    //调用合约对应方法。
    const executeMoveCall = async (params) => {
        if (!authStore.walletProvider || !window[authStore.walletProvider]) return logout();
        return window[authStore.walletProvider].executeMoveCall(params);
    }

    return {
        provider,
        walletProviders,
        verifyWalletPermissions,
        requestWalletAccess,
        getAddress,
        logout,
        executeMoveCall,
        isPermissionGranted,
        permissionGrantedError
    }
}
