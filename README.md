
## General info
This project is created for purpose of master thesis. The three frontend frameworks were used: Angular, Svelte and React for later comparison. 

The versions of applications are devided using x.y.z schema, where: 
* x is the structure version (1 - unchamged, 2 - optimized)
* y is the cache version (1 - no cache, 2 - images cache, 3 - attachments cache)
* z is the attachement compression (1 - files.zip; 2 - compress.zip; 3 - webp.zip)

	
## Setup
If You want to download the version of the application, you must remember to install Node.js, and install the applications. 
The applications are prepared to work on the hosting server, that is why some paths myst be changed to work correctly on localhost. Just delete '/' before the paths of files in each framework. 
Also you must download the corresponding version of attachments (the z from the structure described in table above) form '04-attachment' folder and extract to publc folder. 


To run this project, install it locally using npm:
if there will be a problem with packages look on 'package.json' in the version.

#Installation of Angular:
```
$ cd tasknote-angular
$ npm update --all --force 
$ npm install -g @angular/cli
```

Run the application (before this step, install UIkit):
```
$ cd TNAngular
$ ng serve
```



#Installation of Svelte:
```
$ npm create vite@latest tasknote-svelte -- --template svelte
$ cd tasknote-svelte
$ npm install
```

Run the application (before this step, install UIkit):
```
$ cd TNSvelte
$ npm run dev
```


#Installation of React: 
```
$ npm create vite@latest TNReact -- --template react
$ cd TNReact
$ npm install
```

Run the application (before this step, install UIkit):
```
$ cd TNSvelte
$ npm run dev
```


#Adding UIkit to the frameworks:
```
$npm i uikit --save
$npm i --save-dev @types/uikit
```
