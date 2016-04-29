# mkg-share
Easy way to add social share buttons to website including facebook, twitter, google plus, reddit, pinterest, linkedin, whatsapp, sms and e-mail. Its auto detect mobile browsers and display sms and whatsapp share buttons. mkg-share has goodlooking visual design buttons instead of other unattractive buttons.

It's easy to use and vanilla js. keep clean your source code! now if u prefer native apis, u can use native share buttons with switching one property.

## Install
Get the latest release of mkg-share from repo or install with bower cli => `bower install mkg-share`

import the stylesheet and script files
```html
<link rel="stylesheet" href="mkg-share.min.css" />
<script src="mkg-share.min.js"></script>
```
## Views

#### default view
![default view](https://raw.githubusercontent.com/mkg0/mkg-share/master/demo/assets/1.jpg)
#### small sized
![default view](https://raw.githubusercontent.com/mkg0/mkg-share/master/demo/assets/2.jpg)
#### pane mode
![default view](https://raw.githubusercontent.com/mkg0/mkg-share/master/demo/assets/3.gif)
#### native buttons are also optional
![default view](https://raw.githubusercontent.com/mkg0/mkg-share/master/demo/assets/4.jpg)

## Usage

expanded share buttons without texts:
```js
new mShare('#demo1',{text:false});
```

expanded share buttons:
```js
new mShare('#demo2',{});
```

social share buttons with assigned pane:
```js
new mShare('#demo3',{style:'pane',googleplus:false,reddit:false,pinterest:false});
```

## To do
- add new mode 'sidebar'
- add new style 'minimal'
- add optional share counts
- add responsive property(fluid buttons)
- add vertical alignment property
- add hover title displayin with design

## License

The code is released under the MIT License.
