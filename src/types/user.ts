// 统一用户信息的结构
// 注意和types.ts中的ApiUserInfo统一格式
export class UserInitInfo {
    id = 0; //用户id
    owner = ''; // address，唯一
    email = ''; //邮箱
    name = ''; // 用户自己设置的用户名
    biography = ''; // 用户签名
    status = ''; //用户状态
    create_at = 0; //注册时间
    avatar_id = 0; // 头像 id
}

export type User = {
    avatar:string;
    biography:string;
    birthday:string;
    created_at:number;
    email:string;
    gender:string;
    id:{
        id:string;
    }
    interests:string;
    location:string;
    memo:string;
    name:string;
    sui_wallet:string;
};

export interface UserInfoElement {
    owner?: string;
    name?: string;
    avatarId?: number;
}
