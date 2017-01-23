## React JS 기초 정리##  

**reactjs를 테스트 환경을 위해서는 일단 npm을 이용해 아래의 의존성 패키지 설치 필요.**  
    + webpack  
    + webpack-dev-server  
    + babel-core  
    + babel-loader  
    + babel-preset-es2015  
    + babel-preset-react
    + react  
    + react-dom  

** webpack.config 설정 **
```javascript
    module.exports = {
        entry :  './src/app.js',
        output : {
            path :  __dirname,
            filename : "bundle.js"
        },
        module : {
            loaders : [
                {
                    test : /\.jsx?$/,
                    loader : 'babel',
                    exclude : /node_modules/,
                    query : {
                        presets : ['es2015', 'react' ]
                    }
                }
            ]
        },
        devServer : {
                inline : true,
                contentBase : __dirname
        }
    };
```
** react 코드 작성 **
```html
    <!doctype html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html" charset="utf-8" />
        <title>hello_react</title>
    </head>
    <body>
        <div id="root"></div>
        <!-- webpack빌드 시 만들어지는 파일  -->
        <script type="text/javascript" src="./bundle.js"></script>
    </body>
    </html>
```

```javascript
    import React from "react";
    import ReactDOM from "react-dom";

    class Hello extends React.Component {
        render(){
            return (
                  <h1> Hello React </h1>
          );
        }
    }
    ReactDOM.render(<Hello/>, document.getElementById("root") );
```

** webpack 빌드 후 브라우저에 확인**
```javascript
    // 프로젝트 폴더에서 webpack빌드
    webpack
```
webpack-dev-server를 사용하면 package.json에 devServer를 실행을 위한 script등록 후 사용 가능  
```json
    "start": "node_modules/.bin/webpack-dev-server --progress"
```
webpack-dev-server를 실행 후 주소창에 아래와 같이 치면 js파일 변경에 따른 자동갱신 가능
```html
    localhost:8080/webpack-dev-server
```
