import {
  LoadingBarModule,
  LoadingBarService
} from "./chunk-FQHISFSN.js";
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpContextToken
} from "./chunk-GC2WZBFU.js";
import "./chunk-SA743QD5.js";
import {
  Injectable,
  NgModule,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-DTF4Q2T2.js";
import "./chunk-C5MXKN46.js";
import "./chunk-P6V7QE56.js";
import {
  finalize,
  tap
} from "./chunk-RRDUBJAB.js";
import "./chunk-YNZI7GL3.js";

// node_modules/@ngx-loading-bar/http-client/fesm2020/ngx-loading-bar-http-client.mjs
var NGX_LOADING_BAR_IGNORED = new HttpContextToken(() => false);
var LoadingBarInterceptor = class {
  constructor(loader) {
    this.loader = loader;
  }
  intercept(req, next) {
    if (req.headers.has("ignoreLoadingBar")) {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        console.warn(`Using http headers ('ignoreLoadingBar') to ignore loading bar is deprecated. Use HttpContext instead: 'context: new HttpContext().set(NGX_LOADING_BAR_IGNORED, true)'`);
      }
      return next.handle(req.clone({
        headers: req.headers.delete("ignoreLoadingBar")
      }));
    }
    if (req.context.get(NGX_LOADING_BAR_IGNORED) === true) {
      return next.handle(req);
    }
    let started = false;
    const ref = this.loader.useRef("http");
    return next.handle(req).pipe(tap(() => {
      if (!started) {
        ref.start();
        started = true;
      }
    }), finalize(() => started && ref.complete()));
  }
};
LoadingBarInterceptor.ɵfac = function LoadingBarInterceptor_Factory(ɵt) {
  return new (ɵt || LoadingBarInterceptor)(ɵɵinject(LoadingBarService));
};
LoadingBarInterceptor.ɵprov = ɵɵdefineInjectable({
  token: LoadingBarInterceptor,
  factory: LoadingBarInterceptor.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingBarInterceptor, [{
    type: Injectable
  }], function() {
    return [{
      type: LoadingBarService
    }];
  }, null);
})();
var LoadingBarHttpClientModule = class {
};
LoadingBarHttpClientModule.ɵfac = function LoadingBarHttpClientModule_Factory(ɵt) {
  return new (ɵt || LoadingBarHttpClientModule)();
};
LoadingBarHttpClientModule.ɵmod = ɵɵdefineNgModule({
  type: LoadingBarHttpClientModule,
  imports: [HttpClientModule, LoadingBarModule],
  exports: [HttpClientModule, LoadingBarModule]
});
LoadingBarHttpClientModule.ɵinj = ɵɵdefineInjector({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingBarInterceptor,
    multi: true
  }],
  imports: [[HttpClientModule, LoadingBarModule], HttpClientModule, LoadingBarModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingBarHttpClientModule, [{
    type: NgModule,
    args: [{
      imports: [HttpClientModule, LoadingBarModule],
      exports: [HttpClientModule, LoadingBarModule],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingBarInterceptor,
        multi: true
      }]
    }]
  }], null, null);
})();
export {
  LoadingBarHttpClientModule,
  NGX_LOADING_BAR_IGNORED
};
//# sourceMappingURL=@ngx-loading-bar_http-client.js.map
