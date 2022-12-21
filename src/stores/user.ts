import { defineStore } from "pinia";
import { changeLanguage, findLocaleByString, SupportedLocale } from "@/locale";
import { UserInitInfo, UserInfoElement } from "@/types/user";
import {
    deleteUserInfoStorage,
    getLocaleStorage,
    getUserInfoStorage,
    setLocaleStorage,
    setUserInfoStorage
} from "@/utils/storage";
import { localStorageKeys } from "@/types/constants";

interface UserState {
    locale: SupportedLocale | "";
    address: any;
    user: UserInitInfo;
}

//从缓存中读取userInfo
const getUserInfoByState = function (address: string, user: UserInitInfo): UserInitInfo {
    // console.log("getUserInfoByState",state.address);
    if (!address) return new UserInitInfo(); // 还没有设置 address 就都给空
    if (user && user.owner == address) return user;
    // 缓存中没有，就读取
    let readUser = getUserInfoStorage(address);
    if (!readUser) {
        readUser = new UserInitInfo(); // 如果没有就新建一个空的
        readUser.owner = address;
        setUserInfoStorage(readUser);
    }
    return readUser;
};

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        locale: "",
        address: localStorage.getItem(localStorageKeys.address),
        user: new UserInitInfo(),
    }),
    getters: {
        getLocale: (state): SupportedLocale => {
            if (state.locale) return state.locale;
            state.locale = findLocaleByString(getLocaleStorage()); // 放入缓存
            return state.locale;
        },
        getUserInfo: (state): UserInitInfo => {
            state.user = getUserInfoByState(state.address, state.user);
            return state.user
        },
    },
    actions: {
        setLocale(locale: SupportedLocale) {
            this.locale = locale;
            changeLanguage(locale); // 统一设置语言
            setLocaleStorage(locale); // 持久化 SupportedLocale对象本身就是字符串枚举
        },
        setAddress(address: string) {
            if (address === '') {
                this.user = new UserInitInfo();
                // 如果是清除用户登录信息 持久化的信息也应该清除
                deleteUserInfoStorage(this.address);
                this.address = address;
            } else if (address !== this.address) {
                // 如果是设置新的用户身份 应当重新尝试获取信息
                this.address = address;
                getUserInfoByState(this.address, this.user); // 更新对应 address 的持久化信息
            }
            // 当前 address 不用持久化
        },
        setUserInfo(UserInitInfo: UserInfoElement) {
            this.user = {...this.user, ...UserInitInfo};
            setUserInfoStorage(this.user);
        },
        setUsername(username: string) {
            const UserInitInfo = getUserInfoByState(this.address, this.user);
            UserInitInfo.name = username;
            setUserInfoStorage(UserInitInfo);
        },
    }
});

