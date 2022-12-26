import { UserInitInfo } from '@/types/user';

// 本地保存语言选择
export const setLocaleStorage = (locale: string): void => {
    localStorage.setItem('LANGUAGE_LOCALE', locale);
};

export const getLocaleStorage = (): string => {
    const locale = localStorage.getItem('LANGUAGE_LOCALE');
    return locale ? locale : 'en';
};

// 本地保存用户信息，没有网络访问时也可以显示
export const setUserInfoStorage = (user: UserInitInfo): void => {
    if (user.sui_wallet !== "") {
        localStorage.setItem(`USER_${user.sui_wallet.toUpperCase()}`, JSON.stringify(user));
    }
};
// get方法注意缓存清没清
export const getUserInfoStorage = (address: string): UserInitInfo | null => {
    const info = localStorage.getItem(`USER_${address.toUpperCase()}`);
    if (null == info) return null;
    try {
        const read = JSON.parse(info) as UserInitInfo;
        return read;
    } catch (e) {
        console.error(`read user ${address} info failed:`, e);
    }
    return null;
};

export const deleteUserInfoStorage = (address: string): void => {
    localStorage.removeItem(`USER_${address.toUpperCase()}`);
};

// 保存钱包链接对象到 session
export const setWalletInfoStorage = (walletInfo: any): void => {
    sessionStorage.setItem('WALLET_INFO', JSON.stringify(walletInfo));
};
export const getWalletInfoStorage = (): any => {
    const result = sessionStorage.getItem('WALLET_INFO');
    if (result) {
        return JSON.parse(result);
    }
    return null;
};
export const deleteWalletInfoStorage = (): void => {
    sessionStorage.removeItem('WALLET_INFO');
};
