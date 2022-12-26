//传入名字,根据名字生成颜色,这样颜色就固定下来了
export function extractColorByName(name: string): string {
    name = name + '123456';
    const temp = ['#'];
    for (let index = 0; index < name.length; index++) {
        temp.push(parseInt(name[index].charCodeAt(0).toString(), 10).toString(16));
    }
    return temp.slice(0, 5).join('').slice(0, 4);
}

// 处理头像名字显示的逻辑
export function showAvatarName(username: string, addressId: string) {
    if (username) {
        //只取首字母大写为头像名字
        return username.substring(0, 1).toUpperCase();
    }
    //没有名字返回addressId首字母作为名字
    return addressId ? addressId.substring(0, 1).toUpperCase() : '';
}

// 处理用户名字显示的逻辑
export function showUsername(username: string, addressId: string) {
    if (username) {
        const MAX_LENGTH = 15; // 显示的最长字符
        if (username.length >= MAX_LENGTH) {
            return username.substring(0, MAX_LENGTH - 3) + '...';
        }
        return username;
    }
    //没有名字返回addressId作为名字，保留前5位，后3位
    return addressId ? addressId.substring(0, 5) + "..." + addressId.substring(addressId.length - 3, addressId.length)
        : "";
}
// 处理用户名字显示的逻辑
export function getUserRegName(addressId: string) {
    //返回addressId作为名字，保留前10位
    return addressId.substring(0, 10)
}

