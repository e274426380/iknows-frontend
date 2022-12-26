import { JsonRpcProvider } from "@mysten/sui.js";
import { localStorageKeys, suiRpcUrl } from "@/types/constants";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

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
    const userStore = useUserStore();
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
        userStore.address = address || null
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
            console.log("verifyWalletPermissions",res)
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
        provider.getObjectsOwnedByAddress(address.toString()).then(res => {
        }).catch(e => {
        });
    }

    // returns wallet address
    const getAddress = async () => {
        //如果没有钱包地址，则请求一次钱包地址
        console.log("userStore.address",userStore.address,walletProvider)
        if(!userStore.address && walletProvider){
            console.log("get")
            await window[walletProvider].getAccounts().then(accounts => {
                console.log("getAddress",accounts[0])
                updateSuiAddress(accounts[0]);
                return accounts[0];
            }).catch(e => {
                return false
            });
        }
        console.log("getAddress")
        return userStore.address;
    }

    // checks if we have a sui address to do any requests
    const isPermissionGranted = computed(() => {
        return userStore.address !== null;
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
    const requestWalletAccess = async (provider) => {
        // 用户浏览器没有对应钱包插件，跳转对应插件商店。
        if (!window[provider]) {
            // @ts-ignore
            return window.open(walletProviders[provider].url, '_blank').focus();
        }
        permissionGrantedError.value = "";
        const res = await window[provider].requestPermissions().catch(e => {
            permissionGrantedError.value = `You need to give us ${walletProviders[provider].title} permissions to continue.`;
            console.error(`You need to give us ${walletProviders[provider].title} permissions to continue.`)
            updateSuiAddress(null);
            return;
        });
        authStore.walletProvider = provider;
        const accounts = await window[provider].getAccounts()
        console.log("accounts",accounts)
        updateSuiAddress(accounts[0], provider);
        return true;
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
