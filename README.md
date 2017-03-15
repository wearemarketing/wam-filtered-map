# INSTALATION #
```shell
npm install https://github.com/wearemarketing/wam-filtered-map --save-dev
```

and create an instance in your js file
```js
import Maps from 'wam-filtered-map';

let maps = new Maps({
    el: '.map',
    filter: '.map-legend--item input',
    data: environmentData,
    customOptions: {}
});
```

### Develop: Transpile es2015 code into final JS file ###
./node_modules/.bin/babel --presets es2015 -d lib/ src/
