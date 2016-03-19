# Reproduce issue

- `cd ~/Desktop && git clone https://github.com/chris-schmitz/VueLoaderNotHotReloading.git NotHotReloading && cd NotHotReloading`
- `npm install`
- `npm run dev`
- Open a browser to localhost:8080
- Open project in a text editor and make a change to the data property in `src/PlaceMapper/index.js`
    - **Hot reload will work and browser will "refresh" itself**
- Make a change to the data property in `src/PlaceMapper/map.vue`
    - **Webpack's watch will recognize the change (as seen in the terminal) but the browser will not "refresh" itself**
