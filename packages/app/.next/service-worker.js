try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const a=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class c{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let a,c=i&&i.handler;if(!c&&this.s&&(c=this.s),c){try{a=c.handle({url:s,request:e,event:t,params:n})}catch(e){a=Promise.reject(e)}return a instanceof Promise&&this.i&&(a=a.catch(n=>this.i.handle({url:s,request:e,event:t}))),a}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const a=i.match({url:e,request:t,event:s});if(a)return n=a,(Array.isArray(a)&&0===a.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new c,r.addFetchListener(),r.addCacheListener()),r);const f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[f.prefix,e,f.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||u(f.precache),d=e=>e||u(f.runtime);function l(e){e.then(()=>{})}const b=new Set;class w{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:a=!1}={}){return await this.transaction([e],"readonly",(c,r)=>{const o=c.objectStore(e),f=t?o.index(t):o,u=[],h=f.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(u.push(a?e:e.value),i&&u.length>=i?r(u):e.continue()):r(u)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const a=this.o.transaction(e,t);a.onabort=()=>i(a.error),a.oncomplete=()=>n(),s(a,e=>n(e))})}async v(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const a=s.objectStore(t),c=a[e].apply(a,n);c.onsuccess=()=>i(c.result)})}close(){this.o&&(this.o.close(),this.o=null)}}w.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(w.prototype[s]=async function(t,...n){return await this.v(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class v{constructor(e){this.g=e,this.o=new w("workbox-expiration",1,{onupgradeneeded:e=>this.m(e)})}m(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.g)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.g,id:this.q(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.q(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),a=[];let c=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.g&&(e&&n.timestamp<e||t&&c>=t?a.push(s.value):c++),s.continue()}else n(a)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}q(e){return this.g+"|"+y(e)}}class g{constructor(e,t={}){this._=!1,this.L=!1,this.R=t.maxEntries,this.j=t.maxAgeSeconds,this.g=e,this.M=new v(e)}async expireEntries(){if(this._)return void(this.L=!0);this._=!0;const e=this.j?Date.now()-1e3*this.j:0,t=await this.M.expireEntries(e,this.R),s=await self.caches.open(this.g);for(const e of t)await s.delete(e);this._=!1,this.L&&(this.L=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.M.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.j){return await this.M.getTimestamp(e)<Date.now()-1e3*this.j}return!1}async delete(){this.L=!1,await this.M.expireEntries(1/0)}}const m=(e,t)=>e.filter(e=>t in e),x=async({request:e,mode:t,plugins:s=[]})=>{const n=m(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},q=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const a=await self.caches.open(e),c=await x({plugins:i,request:t,mode:"read"});let r=await a.match(c,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:c})}return r},L=async({cacheName:e,request:s,response:n,event:i,plugins:c=[],matchOptions:r})=>{const o=await x({plugins:c,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:a(o.url)});const f=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,a=!1;for(const t of n)if("cacheWillUpdate"in t){a=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return a||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:c,response:n,request:o});if(!f)return;const u=await self.caches.open(e),h=m(c,"cacheDidUpdate"),d=h.length>0?await q({cacheName:e,matchOptions:r,request:o}):null;try{await u.put(o,f)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of b)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:d,newResponse:f,request:o})},R=q,j=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const a=m(i,"fetchDidFail"),c=a.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of a)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:c.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const M={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let N;async function U(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,a=function(){if(void 0===N){const e=new Response("");if("body"in e)try{new Response(e.body),N=!0}catch(e){N=!1}N=!1}return N}()?s.body:await s.blob();return new Response(a,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function S(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),a=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:a.href}}class k{constructor(e){this.g=h(e),this.N=new Map,this.U=new Map,this.S=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=S(n),a="string"!=typeof n&&n.revision?"reload":"default";if(this.N.has(i)&&this.N.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.N.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.S.has(e)&&this.S.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.S.set(e,n.integrity)}if(this.N.set(i,e),this.U.set(i,a),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.g),a=await i.keys(),c=new Set(a.map(e=>e.url));for(const[e,t]of this.N)c.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.S.get(s),a=this.U.get(n);return this.k({cacheKey:s,cacheMode:a,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.g),t=await e.keys(),s=new Set(this.N.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async k({cacheKey:e,url:s,cacheMode:n,event:i,plugins:a,integrity:c}){const r=new Request(s,{integrity:c,cache:n,credentials:"same-origin"});let o,f=await j({event:i,plugins:a,request:r});for(const e of a||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:f}):f.status<400))throw new t("bad-precaching-response",{url:s,status:f.status});f.redirected&&(f=await U(f)),await L({event:i,plugins:a,response:f,request:e===s?r:new Request(e),cacheName:this.g,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.N}getCachedURLs(){return[...this.N.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.N.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.g)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.g,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let K;const A=()=>(K||(K=new k),K);const E=(e,t)=>{const s=A().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const a=new URL(e,location.href);a.hash="",yield a.href;const c=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(a,t);if(yield c.href,s&&c.pathname.endsWith("/")){const e=new URL(c.href);e.pathname+=s,yield e.href}if(n){const e=new URL(c.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:a});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let T=!1;function P(e){T||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=h();self.addEventListener("fetch",a=>{const c=E(a.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!c)return;let r=self.caches.open(i).then(e=>e.match(c)).then(e=>e||fetch(c));a.respondWith(r)})})(e),T=!0)}const O=[],D={get:()=>O,add(e){O.push(...e)}},C=e=>{const t=A(),s=D.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},V=e=>{const t=A();e.waitUntil(t.activate())};var I;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),I={},function(e){A().addToCacheList(e),e.length>0&&(self.addEventListener("install",C),self.addEventListener("activate",V))}([{url:"_next/static/chunks/134f926d23bad2c76ff2d178a5441efef3c0968d.1e204dee18d9405421f4.js",revision:"ea86eea194c04fadfa8ff226963f652d"},{url:"_next/static/chunks/1d21fbfb9905796591a6825ab5787db74518a85f.6aafbe998de7c270fe19.js",revision:"993db70685d3657115152406c489b1cb"},{url:"_next/static/chunks/29107295.9234196b81fd02ccfdc7.js",revision:"29e5c0bc2f6690c6e84e9faa88072e02"},{url:"_next/static/chunks/383bc2ae7c2fbe14558281a565fb8742e65477cd.eb8ba3b2a52e8e075d72.js",revision:"eead0d8f2ea36051ad9f289c8c153ff1"},{url:"_next/static/chunks/4b56c6ea99fc037c1b0321a2c091da329b94c4ba.efd67ad2ee5c98aeaff3.js",revision:"a8d5457ead19057bdd7ac64b94bfbe89"},{url:"_next/static/chunks/548f95728cf943c0aa2184f6a7a3eebeec0a3e09.7e02b68300e2fd166e12.js",revision:"1dc4fc05d547f11f311f7e51cc79c567"},{url:"_next/static/chunks/69a07af8ea0cf79a259de69fdbff984ac794133f.4a3221dbec4bad64f9c4.js",revision:"da475cba745f9eff7ab98982d50eafc5"},{url:"_next/static/chunks/7b69ab06c4cfeeef82beed435a92e477439e1b69.96e54de04c15d71ed2ef.js",revision:"54d24643dabac4070c348853015491fc"},{url:"_next/static/chunks/8f36e3db77eb3b9c8c943459443ab9819219a1d4.8ec4bedee65af08c1c6f.js",revision:"01f98b22e7aeabbda037202940da5966"},{url:"_next/static/chunks/92dadc9b6972e3dc33e105f4e60fa875cc9e0211.8593ab6f7a8a8d1d042c.js",revision:"de184c84521222f938a9048395a4ca64"},{url:"_next/static/chunks/a29ae703.a6b1d49c8c18c916051d.js",revision:"b4d98aa353fdfb78b8e2798fbf65b083"},{url:"_next/static/chunks/b9f26d4e7b05125e9755db8ae4a66a1a4e4c0702.b990028738d317dba5be.js",revision:"151ccdf83a8d627f8aa3294c7c124408"},{url:"_next/static/chunks/c96b4d7e.ff4871388b9ad0566c3b.js",revision:"e7b125b8347adb4ed17b666bc76685ff"},{url:"_next/static/chunks/commons.d207e9baa9df58f53439.js",revision:"eae6bdefc4b4c1bad3f734dc3193e3b1"},{url:"_next/static/chunks/d87aaed2719b8bfa47512fb1401a4e6c58213842.9708f84493aff45b242d.js",revision:"d910a3c2119912bc555747b930886eea"},{url:"_next/static/chunks/e7ca15f1a5d512628bf7eeeb53fbd2bb9f54910e.b96abae88d8509dee55a.js",revision:"41c66b118bb8f1dd07e9cee3c17dee92"},{url:"_next/static/chunks/f70de4c4fa039bad0e4ffc37c8221b054d92a03a.475aa6618c25f93d0df1.js",revision:"1a371545b82b8e1c34ce202c666434a6"},{url:"_next/static/chunks/fc8d00fd.afd2d8f4015a50040cc7.js",revision:"034a5909526fbfd8b9f907ec8a52d5df"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/82cdff9d095f5d7a12bb.css",revision:"6b687fd5afb07213a49206ef2e8317af"},{url:"_next/static/runtime/main-00e67620c6b92839287b.js",revision:"b94d5329b028cb21854c3b4e5acf10f5"},{url:"_next/static/runtime/polyfills-6fc9c16da0f56a6bfd37.js",revision:"183078308a2ea59c12d51151de2095f7"},{url:"_next/static/runtime/webpack-c212667a5f965e81e004.js",revision:"cd00a63b218fd15ffccf530cd57d5a5e"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/_buildManifest.js",revision:"59f636c06b893894e112d2cb0b3506d5"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/_app.js",revision:"8aa662ce8a4bedc88829b77cc9605fb5"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/_error.js",revision:"56ecda379ffc555c9f3ff226d36463df"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/course/[cid]/queue/[qid].js",revision:"944f504c802d37ce08f7e82afb0d6c74"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/course/[cid]/schedule.js",revision:"4e750da767a4f9779d87ff856429b5e2"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/course/[cid]/today.js",revision:"f4fb815884d3e991930505d17f3c3ac5"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/dev.js",revision:"66b19443e79e1bf470bcabb8d637c12a"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/index.js",revision:"41aad23a8cbaadd6f18552b05982ee4b"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/login.js",revision:"d3a9fdfb73d392c83af7ef0bc81daf0d"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/nocourses.js",revision:"a23045fd4ed9b6d0ea9c1eb763feeb8a"},{url:"_next/static/vjKS-AVSuNn38L3MLoMvf/pages/settings.js",revision:"852e80dbf651096203e5217d1ba69f06"}]),P(I),function(e,s,a){let c;if("string"==typeof e){const t=new URL(e,location.href);c=new n(({url:e})=>e.href===t.href,s,a)}else if(e instanceof RegExp)c=new i(e,s,a);else if("function"==typeof e)c=new n(e,s,a);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});c=e}o().registerRoute(c)}(/^https?.*/,new class{constructor(e={}){if(this.g=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.K=t?e.plugins:[M,...e.plugins]}else this.K=[M];this.A=e.networkTimeoutSeconds||0,this.T=e.fetchOptions,this.P=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let a;if(this.A){const{id:t,promise:c}=this.O({request:s,event:e,logs:n});a=t,i.push(c)}const c=this.D({timeoutId:a,request:s,event:e,logs:n});i.push(c);let r=await Promise.race(i);if(r||(r=await c),!r)throw new t("no-response",{url:s.url});return r}O({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.C({request:e,event:s}))},1e3*this.A)}),id:n}}async D({timeoutId:e,request:t,logs:s,event:n}){let i,a;try{a=await j({request:t,event:n,fetchOptions:this.T,plugins:this.K})}catch(e){i=e}if(e&&clearTimeout(e),i||!a)a=await this.C({request:t,event:n});else{const e=a.clone(),s=L({cacheName:this.g,request:t,response:e,event:n,plugins:this.K});if(n)try{n.waitUntil(s)}catch(e){}}return a}C({event:e,request:t}){return R({cacheName:this.g,request:t,event:e,matchOptions:this.P,plugins:this.K})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.V(n),a=this.I(s);l(a.expireEntries());const c=a.updateTimestamp(t.url);if(e)try{e.waitUntil(c)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.I(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.W=e,this.j=e.maxAgeSeconds,this.B=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),b.add(t))}I(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.B.get(e);return s||(s=new g(e,this.W),this.B.set(e,s)),s}V(e){if(!this.j)return!0;const t=this.F(e);if(null===t)return!0;return t>=Date.now()-1e3*this.j}F(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.B)await self.caches.delete(e),await t.delete();this.B=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
