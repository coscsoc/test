import { filesToRouters, readdir, buildFile } from "./utils";
import path from "path";
import module from "module";

export async function createMockRouter(dir: string) {
  /*
   [
    'role\\[id]\\index.ts',
    'role\\[id]\\permission\\index.ts',
    'upload.ts',
    'user\\a.ts',
    'user\\index.ts',
    'user\\[id].ts'
  ]
  routers[
    [ 'role\\[id]\\index' ],
    [ 'role\\[id]\\permission\\index' ],
    [ 'upload' ],
    [ 'user\\a' ],
    [ 'user\\index' ],
    [ 'user\\[id]' ]
  ] 
  */
  // 递归遍历dir下的子文件
  const files = readdir(dir);
  // 去掉后缀, 切分/
  const routers = filesToRouters(files);
  
  // store.routers = routers; // 没用到的代码
  // role\\[id]\\index => D:\\UserData\\Desktop\\vite-plugin-best-mock\\mock\\role\\[id]\\index.ts
  const weakMap = new Map<string[], string>();
  routers.forEach((item, index) => {
    const filePath = path.resolve(dir, files[index]);
    weakMap.set(item, filePath);
  });

  const resolveModulePromiseList = [];

  for (let index = 0; index < routers.length; index++) {
    const router = routers[index];
    resolveModulePromiseList.push(resolveModule(weakMap.get(router)!, router));
  }

  const mockData = await Promise.all(resolveModulePromiseList);
  // {路由地址, 文件内容}
  return mockData;
}

// 根据路径解析module内的导出
// 完整路径, 路由
export async function resolveModule(fileName: string, router: string[]) {
  // esbuild编译后的文件
  const result = await buildFile(fileName);
  // esbuild编译后的js代码
  const bundledCode = result.outputFiles[0].text;
  // 后缀
  const extension = path.extname(fileName);

  // @ts-expect-error
  // node的模块加载(默认只支持.js.json.node)
  // const extensions = module.Module._extensions;
  const extensions = require.extensions
  let defaultLoader: any;
  const isJs = extension === ".js";
  if (isJs) {
    // require.extensions['.js']
    defaultLoader = extensions[extension]!;
  }
  // 重写
  extensions[extension] = (module: NodeModule, filename: string) => {
    if (filename === fileName) {
      // @ts-expect-error
      // 处理编译后的 js
      (module as NodeModule)._compile(bundledCode, filename);
    } else {
      if (!isJs) {
        extensions[extension]!(module, filename);
      } else {
        defaultLoader(module, filename);
      }
    }
  };
  let config;
  try {
    if (require && require.cache) {
      // 删除require的缓存
      delete require.cache[fileName];
    }
    const raw = require(fileName);
    
    // config = raw.__esModule ? raw.default : raw;
    config = raw;
    if (defaultLoader && isJs) {
      extensions[extension] = defaultLoader;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    router,
    config,
  };
}
