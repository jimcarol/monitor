"use strict";
(() => {
var exports = {};
exports.id = 449;
exports.ids = [449];
exports.modules = {

/***/ 90405:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = require("node:fs");
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = require("path");
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_namespaceObject);
;// CONCATENATED MODULE: ./src/pages/api/url/[env].ts


const Regex = {
    qa: /^https:\/\/qa-www\.thebump\.com/,
    prod: /^https:\/\/www\.thebump\.com/
};
const isVaildParameters = (env, url)=>{
    const vaildUrlRegex = Regex[env];
    if (Array.isArray(url)) {
        for (const item of url){
            if (!vaildUrlRegex.test(item)) {
                return false;
            }
        }
    } else {
        return vaildUrlRegex.test(url);
    }
    return true;
};
function handler(req, res) {
    const { env  } = req.query;
    const filepath = external_path_default().join(process.cwd(), `assets/${env}.json`);
    const urls = (0,external_node_fs_namespaceObject.readFileSync)(filepath, {
        encoding: "utf-8"
    });
    const urlsObject = JSON.parse(urls);
    let result = urlsObject;
    try {
        console.log("--->");
        if (req.method === "POST") {
            const { url ="" , urls =[
                ""
            ]  } = req.body;
            if (url) {
                if (isVaildParameters(env, url)) {
                    result = Array.from(new Set([
                        ...urlsObject,
                        url
                    ]));
                } else {
                    res.status(500).json({
                        error: `invaild Parameters, faild to match ${Regex[env]}`
                    });
                }
            }
            if (urls) {
                if (isVaildParameters(env, urls)) {
                    let newUrls = urls;
                    if (!Array.isArray(urls)) {
                        newUrls = Array(urls);
                    }
                    result = Array.from(new Set([
                        ...urlsObject,
                        ...newUrls
                    ]));
                } else {
                    res.status(500).json({
                        error: `invaild Parameters, faild to match ${Regex[env]}`
                    });
                }
            }
            (0,external_node_fs_namespaceObject.writeFileSync)(filepath, JSON.stringify(result));
        }
    } catch (error) {
        console.log(error);
    }
    res.json({
        data: result
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(90405));
module.exports = __webpack_exports__;

})();