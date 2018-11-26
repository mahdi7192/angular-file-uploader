(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-file-uploader', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global['angular-file-uploader'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,i0,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderService = (function () {
        function AngularFileUploaderService() {
        }
        AngularFileUploaderService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        AngularFileUploaderService.ctorParameters = function () { return []; };
        /** @nocollapse */ AngularFileUploaderService.ngInjectableDef = i0.defineInjectable({ factory: function AngularFileUploaderService_Factory() { return new AngularFileUploaderService(); }, token: AngularFileUploaderService, providedIn: "root" });
        return AngularFileUploaderService;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderComponent = (function () {
        function AngularFileUploaderComponent() {
            this.config = {};
            this.resetUpload = this.config["resetUpload"];
            this.ApiResponse = new i0.EventEmitter();
            this.idDate = +new Date();
            this.reg = /(?:\.([^.]+))?$/;
            this.selectedFiles = [];
            this.notAllowedList = [];
            this.Caption = [];
            this.singleFile = true;
            this.progressBarShow = false;
            this.uploadBtn = false;
            this.uploadMsg = false;
            this.afterUpload = false;
            this.uploadClick = true;
            //console.log("id: ",this.id);
            //console.log("idDate: ",this.idDate);
            //console.log(Math.random());
        }
        /**
         * @param {?} rst
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.ngOnChanges = /**
         * @param {?} rst
         * @return {?}
         */
            function (rst) {
                if (rst["config"]) {
                    this.theme = this.config["theme"] || "";
                    this.id =
                        this.config["id"] ||
                            parseInt((this.idDate / 10000).toString().split(".")[1]) +
                                Math.floor(Math.random() * 20) * 10000;
                    this.hideProgressBar = this.config["hideProgressBar"] || false;
                    this.hideResetBtn = this.config["hideResetBtn"] || false;
                    this.hideSelectBtn = this.config["hideSelectBtn"] || false;
                    this.uploadBtnText = this.config["uploadBtnText"] || "بارگزاری";
                    this.maxSize = this.config["maxSize"] || 20;
                    this.uploadAPI = this.config["uploadAPI"]["url"];
                    this.formatsAllowed =
                        this.config["formatsAllowed"] || ".jpg,.png,.pdf,.docx,.txt,.gif,.jpeg";
                    this.multiple = this.config["multiple"] || false;
                    this.headers = this.config["uploadAPI"]["headers"] || {};
                    this.attachPinText =
                        this.config["attachPinText"] || "Attach supporting documents..";
                    //console.log("config: ", this.config);
                    //console.log(this.config["maxSize"]);
                    //console.log(this.headers);
                    //console.log("rst: ", rst);
                }
                if (rst["resetUpload"]) {
                    if (rst["resetUpload"].currentValue === true) {
                        this.resetFileUpload();
                    }
                }
            };
        /**
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                //console.log("Id: ", this.id);
                this.resetUpload = false;
            };
        /**
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.resetFileUpload = /**
         * @return {?}
         */
            function () {
                this.selectedFiles = [];
                this.Caption = [];
                this.notAllowedList = [];
                this.uploadMsg = false;
                this.uploadBtn = false;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.onChange = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                //console.log(this.maxSize + this.formatsAllowed + this.multiple);
                this.notAllowedList = [];
                //console.log("onchange hit");
                if (this.afterUpload || !this.multiple) {
                    this.selectedFiles = [];
                    this.Caption = [];
                    this.afterUpload = false;
                }
                //FORMATS ALLOWED LIST
                //console.log("FORMATS ALLOWED LIST= "+this.formatsAllowed);
                //NO OF FORMATS ALLOWED
                /** @type {?} */
                var formatsCount;
                formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
                formatsCount = formatsCount.length;
                //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
                //console.log("-------------------------------");
                //ITERATE SELECTED FILES
                /** @type {?} */
                var file;
                if (event.type == "drop") {
                    file = event.dataTransfer.files;
                    //console.log("type: drop");
                }
                else {
                    file = event.target.files || event.srcElement.files;
                    //console.log("type: change");
                }
                //console.log(file);
                /** @type {?} */
                var currentFileExt;
                /** @type {?} */
                var ext;
                /** @type {?} */
                var frmtAllowed;
                for (var i = 0; i < file.length; i++) {
                    //CHECK FORMAT
                    //CURRENT FILE EXTENSION
                    currentFileExt = this.reg.exec(file[i].name);
                    currentFileExt = currentFileExt[1];
                    //console.log(file[i].name);
                    frmtAllowed = false;
                    //FORMAT ALLOWED LIST ITERATE
                    for (var j = formatsCount; j > 0; j--) {
                        ext = this.formatsAllowed.split(".")[j];
                        //console.log("FORMAT LIST ("+j+")= "+ext.split(",")[0]);
                        if (j == formatsCount) {
                            ext = this.formatsAllowed.split(".")[j] + ",";
                        } //check format
                        if (currentFileExt.toLowerCase() == ext.split(",")[0]) {
                            frmtAllowed = true;
                        }
                    }
                    if (frmtAllowed) {
                        //console.log("FORMAT ALLOWED");
                        //CHECK SIZE
                        if (file[i].size > this.maxSize * 1024000) {
                            //console.log("SIZE NOT ALLOWED ("+file[i].size+")");
                            this.notAllowedList.push({
                                fileName: file[i].name,
                                fileSize: this.convertSize(file[i].size),
                                errorMsg: "حجم فایل صحیح نیست"
                            });
                            continue;
                        }
                        else {
                            //format allowed and size allowed then add file to selectedFile array
                            this.selectedFiles.push(file[i]);
                        }
                    }
                    else {
                        //console.log("FORMAT NOT ALLOWED");
                        this.notAllowedList.push({
                            fileName: file[i].name,
                            fileSize: this.convertSize(file[i].size),
                            errorMsg: "فرمت فایل صحیح نیست"
                        });
                        continue;
                    }
                }
                if (this.selectedFiles.length !== 0) {
                    this.uploadBtn = true;
                    if (this.theme == "attachPin")
                        this.uploadFiles();
                }
                else {
                    this.uploadBtn = false;
                }
                this.uploadMsg = false;
                this.uploadClick = true;
                this.percentComplete = 0;
                event.target.value = null;
            };
        /**
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.uploadFiles = /**
         * @return {?}
         */
            function () {
                //console.log(this.selectedFiles);
                var _this = this;
                //console.log(this.selectedFiles);
                /** @type {?} */
                var i;
                this.progressBarShow = true;
                this.uploadClick = false;
                this.notAllowedList = [];
                /** @type {?} */
                var isError = false;
                /** @type {?} */
                var xhr = new XMLHttpRequest();
                /** @type {?} */
                var formData = new FormData();
                for (i = 0; i < this.selectedFiles.length; i++) {
                    if (this.Caption[i] == undefined)
                        this.Caption[i] = "فایل" + i;
                    //Add DATA TO BE SENT
                    formData.append(this.Caption[i], this.selectedFiles[i] /*, this.selectedFiles[i].name*/);
                    //console.log(this.selectedFiles[i]+"{"+this.Caption[i]+" (Caption)}");
                }
                if (i > 1) {
                    this.singleFile = false;
                }
                else {
                    this.singleFile = true;
                }
                xhr.onreadystatechange = function (evnt) {
                    //console.log("onready");
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            isError = true;
                            _this.progressBarShow = false;
                            _this.uploadBtn = false;
                            _this.uploadMsg = true;
                            _this.afterUpload = true;
                            _this.uploadMsgText = "خطا در بارگزاری !";
                            _this.uploadMsgClass = "text-danger lead";
                            //console.log(this.uploadMsgText);
                            //console.log(evnt);
                        }
                        _this.ApiResponse.emit(xhr);
                    }
                };
                xhr.upload.onprogress = function (evnt) {
                    _this.uploadBtn = false; // button should be disabled by process uploading
                    if (evnt.lengthComputable) {
                        _this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
                    }
                    //console.log("Progress..."/*+this.percentComplete+" %"*/);
                };
                xhr.onload = function (evnt) {
                    //console.log("onload");
                    //console.log(evnt);
                    _this.progressBarShow = false;
                    _this.uploadBtn = false;
                    _this.uploadMsg = true;
                    _this.afterUpload = true;
                    if (!isError) {
                        _this.uploadMsgText = "با موفقیت بارگزاری شد !";
                        _this.uploadMsgClass = "text-success lead";
                        //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
                    }
                };
                xhr.onerror = function (evnt) {
                    //console.log("onerror");
                    //console.log(evnt);
                };
                xhr.open("POST", this.uploadAPI, true);
                try {
                    for (var _a = __values(Object.keys(this.headers)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var key = _b.value;
                        // Object.keys will give an Array of keys
                        xhr.setRequestHeader(key, this.headers[key]);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                //let token = sessionStorage.getItem("token");
                //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
                var e_1, _c;
            };
        /**
         * @param {?} i
         * @param {?} sf_na
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.removeFile = /**
         * @param {?} i
         * @param {?} sf_na
         * @return {?}
         */
            function (i, sf_na) {
                //console.log("remove file clicked " + i)
                if (sf_na == "sf") {
                    this.selectedFiles.splice(i, 1);
                    this.Caption.splice(i, 1);
                }
                else {
                    this.notAllowedList.splice(i, 1);
                }
                if (this.selectedFiles.length == 0) {
                    this.uploadBtn = false;
                }
            };
        /**
         * @param {?} fileSize
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.convertSize = /**
         * @param {?} fileSize
         * @return {?}
         */
            function (fileSize) {
                //console.log(fileSize + " - "+ str);
                return fileSize < 1024000
                    ? (fileSize / 1024).toFixed(2) + " KB"
                    : (fileSize / 1024000).toFixed(2) + " MB";
            };
        /**
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.attachpinOnclick = /**
         * @return {?}
         */
            function () {
                //console.log("ID: ", this.id);
                ((document.getElementById("sel" + this.id))).click();
                //$("#"+"sel"+this.id).click();
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.drop = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                event.stopPropagation();
                event.preventDefault();
                //console.log("drop: ", event);
                //console.log("drop: ", event.dataTransfer.files);
                this.onChange(event);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularFileUploaderComponent.prototype.allowDrop = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                event.stopPropagation();
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                //console.log("allowDrop: ",event)
            };
        AngularFileUploaderComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: "angular-file-uploader",
                        template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n\n    <!-- Drag n Drop theme Starts -->\n    <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\" class=\"dragNDrop\">\n        <div style=\"position:relative;\">\n            <div id=\"div1\" class=\"div1 afu-dragndrop-box\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n                <p class=\"afu-dragndrop-text\">Drag N Drop</p>\n            </div>\n            <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n        </div>\n    </div>\n    <!-- Drag n Drop theme Ends -->\n\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm afu-select-btn\" *ngIf=\"!hideSelectBtn\">\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644<span *ngIf=\"multiple\"> \u0647\u0627 </span></label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644\"\n        name=\"files[]\" [accept]=formatsAllowed [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm resetBtn afu-reset-btn\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">\u062D\u0630\u0641 \u0647\u0645\u0647</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info afu-constraints-info\">({{formatsAllowed}}) \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0641\u0627\u06CC\u0644 - {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row afu-valid-file\" *ngFor=\"let sf of selectedFiles;let i=index\" >\n        <p class=\"col-xs-3 textOverflow\"><span class=\"text-primary\">{{sf.name}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg afu-progress-bar\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger afu-invalid-file\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\"><span>{{na['fileName']}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{na['fileSize']}})</strong></p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}} + afu-upload-status\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg afu-progress-bar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success afu-upload-btn\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>{{uploadBtnText}}</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn afu-attach-pin' (click)=\"attachpinOnclick()\">\n            {{attachPinText}}\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->",
                        styles: [".constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}"]
                    },] },
        ];
        AngularFileUploaderComponent.ctorParameters = function () { return []; };
        AngularFileUploaderComponent.propDecorators = {
            config: [{ type: i0.Input }],
            resetUpload: [{ type: i0.Input }],
            ApiResponse: [{ type: i0.Output }]
        };
        return AngularFileUploaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderModule = (function () {
        function AngularFileUploaderModule() {
        }
        AngularFileUploaderModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        declarations: [AngularFileUploaderComponent],
                        exports: [AngularFileUploaderComponent]
                    },] },
        ];
        return AngularFileUploaderModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.AngularFileUploaderService = AngularFileUploaderService;
    exports.AngularFileUploaderComponent = AngularFileUploaderComponent;
    exports.AngularFileUploaderModule = AngularFileUploaderModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhci1maWxlLXVwbG9hZGVyL2xpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuc2VydmljZS50cyIsbnVsbCwibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci9saWIvYW5ndWxhci1maWxlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbn1cclxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiYW5ndWxhci1maWxlLXVwbG9hZGVyXCIsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgKm5nSWY9XCIodGhlbWUgIT09ICdhdHRhY2hQaW4nKVwiIGlkPVwiZGVmYXVsdFwiPlxyXG5cclxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgU3RhcnRzIC0tPlxyXG4gICAgPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIiBbbmdDbGFzc109XCIoaGlkZVNlbGVjdEJ0biAmJiBoaWRlUmVzZXRCdG4pID8gbnVsbCA6ICdkcmFnTkRyb3BCdG1QYWQnXCIgY2xhc3M9XCJkcmFnTkRyb3BcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7XCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaXYxXCIgY2xhc3M9XCJkaXYxIGFmdS1kcmFnbmRyb3AtYm94XCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFmdS1kcmFnbmRyb3AtdGV4dFwiPkRyYWcgTiBEcm9wPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPCEtLSA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+IC0tPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIERyYWcgbiBEcm9wIHRoZW1lIEVuZHMgLS0+XHJcblxyXG4gICAgPGxhYmVsIGZvcj1cInNlbHt7aWR9fVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBhZnUtc2VsZWN0LWJ0blwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj7DmMKnw5nChsOYwqrDmMKuw5jCp8OYwqggw5nCgcOYwqfDm8KMw5nChDxzcGFuICpuZ0lmPVwibXVsdGlwbGVcIj4gw5nCh8OYwqcgPC9zcGFuPjwvbGFiZWw+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiB0aXRsZT1cIsOYwqfDmcKGw5jCqsOYwq7DmMKnw5jCqCDDmcKBw5jCp8ObwozDmcKEXCJcclxuICAgICAgICBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXNtIHJlc2V0QnRuIGFmdS1yZXNldC1idG5cIiAoY2xpY2spPVwicmVzZXRGaWxlVXBsb2FkKClcIiAqbmdJZj1cIiFoaWRlUmVzZXRCdG5cIj7DmMKtw5jCsMOZwoEgw5nCh8OZwoXDmcKHPC9idXR0b24+XHJcbiAgICA8YnIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPlxyXG4gICAgPHAgY2xhc3M9XCJjb25zdHJhaW50cy1pbmZvIGFmdS1jb25zdHJhaW50cy1pbmZvXCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkgw5nChcOYwq3DmMKvw5nCiMOYwq/Dm8KMw5jCqiDDmcKBw5jCp8ObwozDmcKEIC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqMTAyNDAwMCkpfX08L3A+XHJcbiAgICA8IS0tU2VsZWN0ZWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGFmdS12YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IHNmIG9mIHNlbGVjdGVkRmlsZXM7bGV0IGk9aW5kZXhcIiA+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyB0ZXh0T3ZlcmZsb3dcIj48c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeVwiPnt7c2YubmFtZX19PC9zcGFuPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e2NvbnZlcnRTaXplKHNmLnNpemUpfX0pPC9zdHJvbmc+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7PC9wPlxyXG4gICAgICAgIDwhLS0gIDxpbnB1dCBjbGFzcz1cImNvbC14cy0zIHByb2dyZXNzIGNhcHRpb25cIiAgdHlwZT1cInRleHRcIiAgcGxhY2Vob2xkZXI9XCJDYXB0aW9uLi5cIiAgWyhuZ01vZGVsKV09XCJDYXB0aW9uW2ldXCIgICpuZ0lmPVwidXBsb2FkQ2xpY2tcIi8+IC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtMyBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIiAqbmdJZj1cInNpbmdsZUZpbGUgJiYgcHJvZ3Jlc3NCYXJTaG93ICYmICFoaWRlUHJvZ3Jlc3NCYXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTFcIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaSwnc2YnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLUludmFsaWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IHRleHQtZGFuZ2VyIGFmdS1pbnZhbGlkLWZpbGVcIiAqbmdGb3I9XCJsZXQgbmEgb2Ygbm90QWxsb3dlZExpc3Q7bGV0IGo9aW5kZXhcIj5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuPnt7bmFbJ2ZpbGVOYW1lJ119fTwvc3Bhbj48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tuYVsnZmlsZVNpemUnXX19KTwvc3Ryb25nPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIFwiPnt7bmFbJ2Vycm9yTXNnJ119fTwvcD5cclxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xIGRlbEZpbGVJY29uXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGosJ25hJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8cCAqbmdJZj1cInVwbG9hZE1zZ1wiIGNsYXNzPVwie3t1cGxvYWRNc2dDbGFzc319ICsgYWZ1LXVwbG9hZC1zdGF0dXNcIj57e3VwbG9hZE1zZ1RleHR9fTxwPlxyXG4gICAgPGRpdiAqbmdJZj1cIiFzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy00IHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBhZnUtdXBsb2FkLWJ0blwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIFtkaXNhYmxlZF09IXVwbG9hZEJ0bj57e3VwbG9hZEJ0blRleHR9fTwvYnV0dG9uPlxyXG4gICAgPGJyPlxyXG48L2Rpdj5cclxuXHJcbjwhLS0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gQVRUQUNIIFBJTiBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxyXG48ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2F0dGFjaFBpbidcIiBpZD1cImF0dGFjaFBpblwiPlxyXG4gICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cclxuICAgICAgICA8YSBjbGFzcz0nYnRuIHVwX2J0biBhZnUtYXR0YWNoLXBpbicgKGNsaWNrKT1cImF0dGFjaHBpbk9uY2xpY2soKVwiPlxyXG4gICAgICAgICAgICB7e2F0dGFjaFBpblRleHR9fVxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBhcGVyY2xpcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPCEtLSA8cCBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKiAxMDI0MDAwKSl9fTwvcD4gLS0+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgdGl0bGU9XCJTZWxlY3QgZmlsZVwiIG5hbWU9XCJmaWxlc1tdXCIgW2FjY2VwdF09Zm9ybWF0c0FsbG93ZWRcclxuICAgICAgICAgICAgICAgIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICAmbmJzcDtcclxuICAgICAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERSQUcgTiBEUk9QIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XHJcbjwhLS0gPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIj5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxyXG4gICAgPGRpdiBpZD1cImRpdjFcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cclxuICAgICAgPHA+RHJhZyBOIERyb3A8L3A+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9kaXY+IC0tPmAgLFxyXG4gIHN0eWxlczogW2AuY29uc3RyYWludHMtaW5mb3ttYXJnaW4tdG9wOjEwcHg7Zm9udC1zdHlsZTppdGFsaWN9LnBhZE1hcmd7cGFkZGluZzowO21hcmdpbi1ib3R0b206MH0uY2FwdGlvbnttYXJnaW4tcmlnaHQ6NXB4fS50ZXh0T3ZlcmZsb3d7d2hpdGUtc3BhY2U6bm93cmFwO3BhZGRpbmctcmlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30udXBfYnRue2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtib3JkZXI6MnB4IHNvbGlkICM1YzViNWI7Ym9yZGVyLXJhZGl1czoyMnB4fS5kZWxGaWxlSWNvbnt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojY2UwOTA5fS5kcmFnTkRyb3AgLmRpdjF7ZGlzcGxheTpib3JkZXItYm94O2JvcmRlcjoycHggZGFzaGVkICM1YzViNWI7aGVpZ2h0OjZyZW07d2lkdGg6MjByZW19LmRyYWdORHJvcCAuZGl2MT5we3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNWM1YjViO21hcmdpbi10b3A6MS40ZW19LmRyYWdORHJvcEJ0bVBhZHtwYWRkaW5nLWJvdHRvbToycmVtfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NjIwcHgpey5jYXB0aW9ue3BhZGRpbmc6MH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo1MTBweCl7LnNpemVDe3dpZHRoOjI1JX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoyNjBweCl7LmNhcHRpb24sLnNpemVDe2ZvbnQtc2l6ZToxMHB4fX0ucmVzZXRCdG57bWFyZ2luLWxlZnQ6M3B4fWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpXHJcbiAgY29uZmlnOiBhbnkgPSB7fTtcclxuICBASW5wdXQoKVxyXG4gIHJlc2V0VXBsb2FkOiBib29sZWFuID0gdGhpcy5jb25maWdbXCJyZXNldFVwbG9hZFwiXTtcclxuICBAT3V0cHV0KClcclxuICBBcGlSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdGhlbWU6IHN0cmluZztcclxuICBpZDogbnVtYmVyO1xyXG4gIGhpZGVQcm9ncmVzc0JhcjogYm9vbGVhbjtcclxuICBtYXhTaXplOiBudW1iZXI7XHJcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XHJcbiAgZm9ybWF0c0FsbG93ZWQ6IHN0cmluZztcclxuICBtdWx0aXBsZTogYm9vbGVhbjtcclxuICBoZWFkZXJzOiBhbnk7XHJcbiAgaGlkZVJlc2V0QnRuOiBib29sZWFuO1xyXG4gIGhpZGVTZWxlY3RCdG46IGJvb2xlYW47XHJcbiAgYXR0YWNoUGluVGV4dDogc3RyaW5nO1xyXG4gIHVwbG9hZEJ0blRleHQ6IHN0cmluZztcclxuXHJcbiAgaWREYXRlOiBudW1iZXIgPSArbmV3IERhdGUoKTtcclxuICByZWc6IFJlZ0V4cCA9IC8oPzpcXC4oW14uXSspKT8kLztcclxuICBzZWxlY3RlZEZpbGVzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgbm90QWxsb3dlZExpc3Q6IEFycmF5PE9iamVjdD4gPSBbXTtcclxuICBDYXB0aW9uOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgc2luZ2xlRmlsZSA9IHRydWU7XHJcbiAgcHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XHJcbiAgdXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgdXBsb2FkTXNnID0gZmFsc2U7XHJcbiAgYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcclxuICB1cGxvYWRDbGljayA9IHRydWU7XHJcbiAgdXBsb2FkTXNnVGV4dDogc3RyaW5nO1xyXG4gIHVwbG9hZE1zZ0NsYXNzOiBzdHJpbmc7XHJcbiAgcGVyY2VudENvbXBsZXRlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImlkOiBcIix0aGlzLmlkKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJpZERhdGU6IFwiLHRoaXMuaWREYXRlKTtcclxuICAgIC8vY29uc29sZS5sb2coTWF0aC5yYW5kb20oKSk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhyc3Q6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChyc3RbXCJjb25maWdcIl0pIHtcclxuICAgICAgdGhpcy50aGVtZSA9IHRoaXMuY29uZmlnW1widGhlbWVcIl0gfHwgXCJcIjtcclxuICAgICAgdGhpcy5pZCA9XHJcbiAgICAgICAgdGhpcy5jb25maWdbXCJpZFwiXSB8fFxyXG4gICAgICAgIHBhcnNlSW50KCh0aGlzLmlkRGF0ZSAvIDEwMDAwKS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXSkgK1xyXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICogMTAwMDA7XHJcbiAgICAgIHRoaXMuaGlkZVByb2dyZXNzQmFyID0gdGhpcy5jb25maWdbXCJoaWRlUHJvZ3Jlc3NCYXJcIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuaGlkZVJlc2V0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlUmVzZXRCdG5cIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuaGlkZVNlbGVjdEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVNlbGVjdEJ0blwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRCdG5UZXh0ID0gdGhpcy5jb25maWdbXCJ1cGxvYWRCdG5UZXh0XCJdIHx8IFwiw5jCqMOYwqfDmMKxw5rCr8OYwrLDmMKnw5jCscObwoxcIjtcclxuICAgICAgdGhpcy5tYXhTaXplID0gdGhpcy5jb25maWdbXCJtYXhTaXplXCJdIHx8IDIwO1xyXG4gICAgICB0aGlzLnVwbG9hZEFQSSA9IHRoaXMuY29uZmlnW1widXBsb2FkQVBJXCJdW1widXJsXCJdO1xyXG4gICAgICB0aGlzLmZvcm1hdHNBbGxvd2VkID1cclxuICAgICAgICB0aGlzLmNvbmZpZ1tcImZvcm1hdHNBbGxvd2VkXCJdIHx8IFwiLmpwZywucG5nLC5wZGYsLmRvY3gsLnR4dCwuZ2lmLC5qcGVnXCI7XHJcbiAgICAgIHRoaXMubXVsdGlwbGUgPSB0aGlzLmNvbmZpZ1tcIm11bHRpcGxlXCJdIHx8IGZhbHNlO1xyXG4gICAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcImhlYWRlcnNcIl0gfHwge307XHJcbiAgICAgIHRoaXMuYXR0YWNoUGluVGV4dCA9XHJcbiAgICAgICAgdGhpcy5jb25maWdbXCJhdHRhY2hQaW5UZXh0XCJdIHx8IFwiQXR0YWNoIHN1cHBvcnRpbmcgZG9jdW1lbnRzLi5cIjtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcImNvbmZpZzogXCIsIHRoaXMuY29uZmlnKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmNvbmZpZ1tcIm1heFNpemVcIl0pO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaGVhZGVycyk7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJyc3Q6IFwiLCByc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXSkge1xyXG4gICAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0uY3VycmVudFZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldEZpbGVVcGxvYWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiSWQ6IFwiLCB0aGlzLmlkKTtcclxuICAgIHRoaXMucmVzZXRVcGxvYWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJlc2V0RmlsZVVwbG9hZCgpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRGaWxlcyA9IFtdO1xyXG4gICAgdGhpcy5DYXB0aW9uID0gW107XHJcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XHJcbiAgICB0aGlzLnVwbG9hZE1zZyA9IGZhbHNlO1xyXG4gICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlKGV2ZW50OiBhbnkpIHtcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5tYXhTaXplICsgdGhpcy5mb3JtYXRzQWxsb3dlZCArIHRoaXMubXVsdGlwbGUpO1xyXG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIm9uY2hhbmdlIGhpdFwiKTtcclxuICAgIGlmICh0aGlzLmFmdGVyVXBsb2FkIHx8ICF0aGlzLm11bHRpcGxlKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcyA9IFtdO1xyXG4gICAgICB0aGlzLkNhcHRpb24gPSBbXTtcclxuICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy9GT1JNQVRTIEFMTE9XRUQgTElTVFxyXG4gICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVFMgQUxMT1dFRCBMSVNUPSBcIit0aGlzLmZvcm1hdHNBbGxvd2VkKTtcclxuICAgIC8vTk8gT0YgRk9STUFUUyBBTExPV0VEXHJcbiAgICBsZXQgZm9ybWF0c0NvdW50OiBhbnk7XHJcbiAgICBmb3JtYXRzQ291bnQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLm1hdGNoKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIikpO1xyXG4gICAgZm9ybWF0c0NvdW50ID0gZm9ybWF0c0NvdW50Lmxlbmd0aDtcclxuICAgIC8vY29uc29sZS5sb2coXCJOTyBPRiBGT1JNQVRTIEFMTE9XRUQ9IFwiK2Zvcm1hdHNDb3VudCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuXHJcbiAgICAvL0lURVJBVEUgU0VMRUNURUQgRklMRVNcclxuICAgIGxldCBmaWxlOiBGaWxlTGlzdDtcclxuICAgIGlmIChldmVudC50eXBlID09IFwiZHJvcFwiKSB7XHJcbiAgICAgIGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0eXBlOiBkcm9wXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcyB8fCBldmVudC5zcmNFbGVtZW50LmZpbGVzO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogY2hhbmdlXCIpO1xyXG4gICAgfVxyXG4gICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcclxuICAgIGxldCBjdXJyZW50RmlsZUV4dDogYW55O1xyXG4gICAgbGV0IGV4dDogYW55O1xyXG4gICAgbGV0IGZybXRBbGxvd2VkOiBib29sZWFuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vQ0hFQ0sgRk9STUFUXHJcbiAgICAgIC8vQ1VSUkVOVCBGSUxFIEVYVEVOU0lPTlxyXG4gICAgICBjdXJyZW50RmlsZUV4dCA9IHRoaXMucmVnLmV4ZWMoZmlsZVtpXS5uYW1lKTtcclxuICAgICAgY3VycmVudEZpbGVFeHQgPSBjdXJyZW50RmlsZUV4dFsxXTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlW2ldLm5hbWUpO1xyXG4gICAgICBmcm10QWxsb3dlZCA9IGZhbHNlO1xyXG4gICAgICAvL0ZPUk1BVCBBTExPV0VEIExJU1QgSVRFUkFURVxyXG4gICAgICBmb3IgKGxldCBqID0gZm9ybWF0c0NvdW50OyBqID4gMDsgai0tKSB7XHJcbiAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBMSVNUIChcIitqK1wiKT0gXCIrZXh0LnNwbGl0KFwiLFwiKVswXSk7XHJcbiAgICAgICAgaWYgKGogPT0gZm9ybWF0c0NvdW50KSB7XHJcbiAgICAgICAgICBleHQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLnNwbGl0KFwiLlwiKVtqXSArIFwiLFwiO1xyXG4gICAgICAgIH0gLy9jaGVjayBmb3JtYXRcclxuICAgICAgICBpZiAoY3VycmVudEZpbGVFeHQudG9Mb3dlckNhc2UoKSA9PSBleHQuc3BsaXQoXCIsXCIpWzBdKSB7XHJcbiAgICAgICAgICBmcm10QWxsb3dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZnJtdEFsbG93ZWQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIEFMTE9XRURcIik7XHJcbiAgICAgICAgLy9DSEVDSyBTSVpFXHJcbiAgICAgICAgaWYgKGZpbGVbaV0uc2l6ZSA+IHRoaXMubWF4U2l6ZSAqIDEwMjQwMDApIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTSVpFIE5PVCBBTExPV0VEIChcIitmaWxlW2ldLnNpemUrXCIpXCIpO1xyXG4gICAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVbaV0ubmFtZSxcclxuICAgICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcclxuICAgICAgICAgICAgZXJyb3JNc2c6IFwiw5jCrcOYwqzDmcKFIMOZwoHDmMKnw5vCjMOZwoQgw5jCtcOYwq3Dm8KMw5jCrSDDmcKGw5vCjMOYwrPDmMKqXCJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vZm9ybWF0IGFsbG93ZWQgYW5kIHNpemUgYWxsb3dlZCB0aGVuIGFkZCBmaWxlIHRvIHNlbGVjdGVkRmlsZSBhcnJheVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzLnB1c2goZmlsZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTk9UIEFMTE9XRURcIik7XHJcbiAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcclxuICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXHJcbiAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxyXG4gICAgICAgICAgZXJyb3JNc2c6IFwiw5nCgcOYwrHDmcKFw5jCqiDDmcKBw5jCp8ObwozDmcKEIMOYwrXDmMKtw5vCjMOYwq0gw5nChsObwozDmMKzw5jCqlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IHRydWU7XHJcbiAgICAgIGlmICh0aGlzLnRoZW1lID09IFwiYXR0YWNoUGluXCIpIHRoaXMudXBsb2FkRmlsZXMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwbG9hZE1zZyA9IGZhbHNlO1xyXG4gICAgdGhpcy51cGxvYWRDbGljayA9IHRydWU7XHJcbiAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IDA7XHJcbiAgICBldmVudC50YXJnZXQudmFsdWUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XHJcblxyXG4gICAgbGV0IGk6IGFueTtcclxuICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gdHJ1ZTtcclxuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSBmYWxzZTtcclxuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcclxuICAgIGxldCBpc0Vycm9yID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5DYXB0aW9uW2ldID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgdGhpcy5DYXB0aW9uW2ldID0gXCLDmcKBw5jCp8ObwozDmcKEXCIgKyBpO1xyXG4gICAgICAvL0FkZCBEQVRBIFRPIEJFIFNFTlRcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFxyXG4gICAgICAgIHRoaXMuQ2FwdGlvbltpXSxcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXNbaV0gLyosIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXS5uYW1lKi9cclxuICAgICAgKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkRmlsZXNbaV0rXCJ7XCIrdGhpcy5DYXB0aW9uW2ldK1wiIChDYXB0aW9uKX1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGkgPiAxKSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaW5nbGVGaWxlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZXZudCA9PiB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbnJlYWR5XCIpO1xyXG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcIsOYwq7DmMK3w5jCpyDDmMKvw5jCsSDDmMKow5jCp8OYwrHDmsKvw5jCssOYwqfDmMKxw5vCjCAhXCI7XHJcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ0NsYXNzID0gXCJ0ZXh0LWRhbmdlciBsZWFkXCI7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudXBsb2FkTXNnVGV4dCk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkFwaVJlc3BvbnNlLmVtaXQoeGhyKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBldm50ID0+IHtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTsgLy8gYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCBieSBwcm9jZXNzIHVwbG9hZGluZ1xyXG4gICAgICBpZiAoZXZudC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSBNYXRoLnJvdW5kKChldm50LmxvYWRlZCAvIGV2bnQudG90YWwpICogMTAwKTtcclxuICAgICAgfVxyXG4gICAgICAvL2NvbnNvbGUubG9nKFwiUHJvZ3Jlc3MuLi5cIi8qK3RoaXMucGVyY2VudENvbXBsZXRlK1wiICVcIiovKTtcclxuICAgIH07XHJcblxyXG4gICAgeGhyLm9ubG9hZCA9IGV2bnQgPT4ge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwib25sb2FkXCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xyXG4gICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnVwbG9hZE1zZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xyXG4gICAgICBpZiAoIWlzRXJyb3IpIHtcclxuICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcIsOYwqjDmMKnIMOZwoXDmcKIw5nCgcOZwoLDm8KMw5jCqiDDmMKow5jCp8OYwrHDmsKvw5jCssOYwqfDmMKxw5vCjCDDmMK0w5jCryAhXCI7XHJcbiAgICAgICAgdGhpcy51cGxvYWRNc2dDbGFzcyA9IFwidGV4dC1zdWNjZXNzIGxlYWRcIjtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudXBsb2FkTXNnVGV4dCArIFwiIFwiICsgdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCArIFwiIGZpbGVcIik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgeGhyLm9uZXJyb3IgPSBldm50ID0+IHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIm9uZXJyb3JcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vcGVuKFwiUE9TVFwiLCB0aGlzLnVwbG9hZEFQSSwgdHJ1ZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcnMpKSB7XHJcbiAgICAgIC8vIE9iamVjdC5rZXlzIHdpbGwgZ2l2ZSBhbiBBcnJheSBvZiBrZXlzXHJcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdGhpcy5oZWFkZXJzW2tleV0pO1xyXG4gICAgfVxyXG4gICAgLy9sZXQgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XHJcbiAgICAvL3hoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpO1xyXG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt0b2tlbn1gKTtcclxuICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUZpbGUoaTogYW55LCBzZl9uYTogYW55KSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwicmVtb3ZlIGZpbGUgY2xpY2tlZCBcIiArIGkpXHJcbiAgICBpZiAoc2ZfbmEgPT0gXCJzZlwiKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIHRoaXMuQ2FwdGlvbi5zcGxpY2UoaSwgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnNwbGljZShpLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0U2l6ZShmaWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKGZpbGVTaXplICsgXCIgLSBcIisgc3RyKTtcclxuICAgIHJldHVybiBmaWxlU2l6ZSA8IDEwMjQwMDBcclxuICAgICAgPyAoZmlsZVNpemUgLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS0JcIlxyXG4gICAgICA6IChmaWxlU2l6ZSAvIDEwMjQwMDApLnRvRml4ZWQoMikgKyBcIiBNQlwiO1xyXG4gIH1cclxuXHJcbiAgYXR0YWNocGluT25jbGljaygpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJJRDogXCIsIHRoaXMuaWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxcIiArIHRoaXMuaWQpIS5jbGljaygpO1xyXG4gICAgLy8kKFwiI1wiK1wic2VsXCIrdGhpcy5pZCkuY2xpY2soKTtcclxuICB9XHJcblxyXG4gIGRyb3AoZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImRyb3A6IFwiLCBldmVudCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiZHJvcDogXCIsIGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcyk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50KTtcclxuICB9XHJcbiAgYWxsb3dEcm9wKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiYWxsb3dEcm9wOiBcIixldmVudClcclxuICB9XHJcbn1cclxuXHJcbi8qIGludGVyZmFjZSBDT05GSUcge1xyXG4gIHVwbG9hZEFQSTogc3RyaW5nO1xyXG4gIG11bHRpcGxlPzogYm9vbGVhbjtcclxuICBmb3JtYXRzQWxsb3dlZD86IHN0cmluZztcclxuICBtYXhTaXplPzogbnVtYmVyO1xyXG4gIGlkPzogbnVtYmVyO1xyXG4gIHJlc2V0VXBsb2FkPzogYm9vbGVhbjtcclxuICB0aGVtZT86IHN0cmluZztcclxuICBoaWRlUHJvZ3Jlc3NCYXI/OiBib29sZWFuO1xyXG4gfVxyXG4gKi8iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJNb2R1bGUgeyB9XHJcbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwidHNsaWJfMS5fX3ZhbHVlcyIsIkNvbXBvbmVudCIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtRQU9FO1NBQWlCOztvQkFMbEJBLGFBQVUsU0FBQzt3QkFDVixVQUFVLEVBQUUsTUFBTTtxQkFDbkI7Ozs7eUNBSkQ7S0FRQzs7SUNSRDs7Ozs7Ozs7Ozs7Ozs7QUFjQSxzQkE0RnlCLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTztZQUNILElBQUksRUFBRTtnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUMzQztTQUNKLENBQUM7SUFDTixDQUFDOzs7Ozs7O1FDQUM7WUFsQ0EsV0FBTSxHQUFRLEVBQUUsQ0FBQztZQUVqQixnQkFBVyxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFbEQsZ0JBQVcsR0FBRyxJQUFJQyxlQUFZLEVBQUUsQ0FBQztZQWVqQyxXQUFNLEdBQVcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzdCLFFBQUcsR0FBVyxpQkFBaUIsQ0FBQztZQUNoQyxrQkFBYSxHQUFlLEVBQUUsQ0FBQztZQUMvQixtQkFBYyxHQUFrQixFQUFFLENBQUM7WUFDbkMsWUFBTyxHQUFr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