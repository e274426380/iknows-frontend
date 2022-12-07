declare type Recordable<T = any> = Record<string, T>;

declare interface Window {
    suiWallet: any; //sui钱包插件
    requestPermissions: any; // 申请连接用户钱包许可
    hasPermissions: any; // 检查钱包权限是否正常
    disconnect: any; // 断开钱包链接
    getAccounts: () => Promise<[string]>; // 获取用户钱包地址
    executeMoveCall: any; // 调用sui合约
}
