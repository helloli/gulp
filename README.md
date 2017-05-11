## 一个支持es6和less的gulp环境

支持的功能有：

- .es6文件通过babel编译生成ES5规范的.js文件
- .less文件编译和压缩生成.min.css文件
- 其他文件会直接copy
- gulp会监听文件变化，进行增量编译

使用说明：

- 新建工作目录，将`gulpfile.js`和`package.json`复制到工作目录下
- 在工作目录下新建一个文件夹命名为es6
- 打开终端，进入到工作目录下。如果没有安装过gulp，请全局安装gulp: `npm install --global gulp`
- 在终端中执行`npm install`安装gulp依赖
- 在终端中执行`gulp`，然后就可以在es6文件夹中编写源码了，请将es6语法的文件格式设为`.es6`,less语法的文件命名为`.less`。
- 编译后的文件在工作目录下的amd文件夹中
- 请不要将其他文件夹名字命名为es6或者amd
- enjoy coding