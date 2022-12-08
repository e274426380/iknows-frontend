import {defineConfig, loadEnv, UserConfig} from 'vite';
import path from 'path';
import {JsonRpcProvider, Network, NETWORK_TO_API} from '@mysten/sui.js';

import {createVitePlugins} from './build/vite/plugins';
import {ViteEnv} from './types/model';

enum ConfigMode {
    development = 1, // 防止 0 情况 if 出错
    dev_frontend,
    alpha,
    beta,
    production,
}

// 测试用
function testApi(){
    // const provider = new JsonRpcProvider(Network.DEVNET);
    // console.log("Network->",Network)
    // provider.requestSuiFromFaucet(
    //     '0x54fb68ff3d8b9003a55641756b819b4057d52978'
    // ).then((res)=>{
    //     console.log("getObject",res)
    // });
    // // console.log("provider->",provider)
}

// 输出配置文件
export default defineConfig(({ command, mode }) => {
    testApi();
    console.log('command ->', command);
    console.log('mode ->', mode);

    const configMode = getConfigMode(mode); // 获取配置模式
    console.log('config mode ->', ConfigMode[configMode]); // 输出查询出来的配置模式

    const readEnv = loadEnv(mode, './env');
    // @ts-ignore force transform, not a bit problem for string variable
    const viteEnv: ViteEnv = readEnv; // 导入设置的环境变量，会根据选择的 mode 选择文件
    // but matters other types
    if (readEnv.VITE_DROP_CONSOLE !== undefined)
        viteEnv.VITE_DROP_CONSOLE = readEnv.VITE_DROP_CONSOLE === 'true';
    if (readEnv.VITE_DROP_DEBUGGER !== undefined)
        viteEnv.VITE_DROP_DEBUGGER = readEnv.VITE_DROP_DEBUGGER === 'true';
    console.log('viteEnv ->', viteEnv); // 输出加载的变量

    const network = viteEnv.VITE_NETWORK;
    console.log('network ->', network);

    const location = getLocation(viteEnv); //sui本地端口 获取后端运行地址
    console.log('server location ->', location); //

    process.env.configMode = ConfigMode[configMode];
    process.env.network = network;
    process.env.location = location;

    if (configMode !== ConfigMode.production) {
        // 开发模式总是有个 warning 不想看到
        // canistersAlias['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js';
    }
    mode = getMode(configMode);
    const isBuild = mode === 'production';
    const common: UserConfig = {
        publicDir: 'public', // 该目录下文件会原封不动存放至 dist
        mode, // 运行模式
        define: {
            'process.env.NODE_ENV': JSON.stringify(getNodeEnv(configMode)), // 接口文件里面需要用来判断 莫名其妙要加双引号
            'process.env': process.env, // 环境变量
        },
        plugins: [...createVitePlugins(viteEnv, isBuild)], // 插件
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'), // @符号要解析
                '~/': `${path.resolve(__dirname, 'src')}/`, // element-plus 可能要用
                // "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js", // 浏览器总是有 warning，这样就不显示了
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'], // import 可以省略的拓展名
        },
        build: {
            minify: isBuild ? 'esbuild' : false, // 默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%
            terserOptions: {
                compress: {
                    drop_console:
                        configMode == ConfigMode.production
                            ? true // 线上部署的生产打包一定不包含
                            : viteEnv.VITE_DROP_CONSOLE === undefined
                            ? isBuild
                            : viteEnv.VITE_DROP_CONSOLE, // 生产环境去除 console
                    drop_debugger:
                        configMode == ConfigMode.production
                            ? true // 线上部署的生产打包一定不包含
                            : viteEnv.VITE_DROP_DEBUGGER === undefined
                            ? isBuild
                            : viteEnv.VITE_DROP_DEBUGGER, // 生产环境去除 debugger
                },
            },
            rollupOptions: {
                // external: ["element-plus"],
                output: {
                    manualChunks: {
                        // 每个 '键' 都表示一个分包块，'值' 包含列出的模块及其所有依赖项
                        vue: ['vue', 'vue-router', 'pinia'], // 目前打包还是这个最小，还没有 bug
                        'element-plus': ['element-plus'],
                    },
                    // manualChunks(id) {
                    //     if (id.includes("node_modules")) {
                    //         return "vendor"
                    //     }
                    //     // if (
                    //     //     id.includes("node_modules") &&
                    //     //     id.match(/element-plus|legacy/)
                    //     // ) { // TODO 本来是想解决打包过大问题，但是现在发现，打的包会失效无法线上运行
                    //     //     return id
                    //     //         .toString()
                    //     //         .split("node_modules/")[1]
                    //     //         .split("/")[0]
                    //     //         .toString()
                    //     // }
                    // },
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false, // TODO 没作用 element-plus 的 index.css 在被打包时会报错 warning: "@charset" must be the first rule in the f
                    // additionalData: `@use "~/assets/theme/element-variables.scss" as *;`,
                },
            },
        },
        envDir: 'env',
        clearScreen: false,
    };

    console.log(`process.env.NODE_ENV -> ${common.define['process.env.NODE_ENV']}`);

    if (!isBuild) {
        return {
            // serve 独有配置 开发模式
            ...common,
            server: {
                proxy: {
                    '/api': {
                        target: location,
                        changeOrigin: true,
                        rewrite: (path) => path,
                    },
                },
                cors: true,
                host: '0.0.0.0',
            },
        };
    } else {
        return {
            // build 独有配置 生产模式
            ...common,
        };
    }
});

// 获取后端运行地址，本地/在线
function getLocation(viteEnv: ViteEnv): string {
    const position = viteEnv.VITE_NETWORK;
    if (position==='local') {
        return NETWORK_TO_API.LOCAL.fullNode;
    }
    return NETWORK_TO_API.DEVNET.fullNode;
}


// 判断配置模式
function getConfigMode(mode: string): ConfigMode {
    if (ConfigMode[mode]) {
        return ConfigMode[mode];
    }
    throw new Error('can not recognize mode: ' + mode);
}

function getMode(configMode: ConfigMode) {
    let mode = '';
    switch (configMode) {
        case ConfigMode.development:
            mode = 'development';
            break;

        case ConfigMode.dev_frontend:
            mode = 'development'; // 前端是开发模式
            break;

        case ConfigMode.alpha:
            mode = 'production';
            break;

        case ConfigMode.beta:
            mode = 'production';
            break;

        case ConfigMode.production:
            mode = 'production';
            break;

        default:
            throw new Error(`what a config config mode: ${configMode} ${ConfigMode[configMode]}`);
    }
    return mode;
}

function getNodeEnv(mode: ConfigMode): string {
    let env = '';
    switch (mode) {
        case ConfigMode.development:
            env = 'development';
            break;

        case ConfigMode.dev_frontend:
            env = 'production'; // 后端用的是 sui
            break;

        case ConfigMode.alpha:
            env = 'development';
            break;

        case ConfigMode.beta:
            env = 'production'; // 后端用的是 sui
            break;

        case ConfigMode.production:
            env = 'production'; // 后端用的是 sui
            break;

        default:
            throw new Error(`what a config config mode: ${mode} ${ConfigMode[mode]}`);
    }
    return env;
}
