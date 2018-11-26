/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
var AngularFileUploaderComponent = /** @class */ (function () {
    function AngularFileUploaderComponent() {
        this.config = {};
        this.resetUpload = this.config["resetUpload"];
        this.ApiResponse = new EventEmitter();
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
            for (var _a = tslib_1.__values(Object.keys(this.headers)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                // Object.keys will give an Array of keys
                xhr.setRequestHeader(key, this.headers[key]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
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
        (/** @type {?} */ (document.getElementById("sel" + this.id))).click();
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
        { type: Component, args: [{
                    selector: "angular-file-uploader",
                    template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n\n    <!-- Drag n Drop theme Starts -->\n    <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\" class=\"dragNDrop\">\n        <div style=\"position:relative;\">\n            <div id=\"div1\" class=\"div1 afu-dragndrop-box\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n                <p class=\"afu-dragndrop-text\">Drag N Drop</p>\n            </div>\n            <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n        </div>\n    </div>\n    <!-- Drag n Drop theme Ends -->\n\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm afu-select-btn\" *ngIf=\"!hideSelectBtn\">\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644<span *ngIf=\"multiple\"> \u0647\u0627 </span></label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644\"\n        name=\"files[]\" [accept]=formatsAllowed [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm resetBtn afu-reset-btn\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">\u062D\u0630\u0641 \u0647\u0645\u0647</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info afu-constraints-info\">({{formatsAllowed}}) \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0641\u0627\u06CC\u0644 - {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row afu-valid-file\" *ngFor=\"let sf of selectedFiles;let i=index\" >\n        <p class=\"col-xs-3 textOverflow\"><span class=\"text-primary\">{{sf.name}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg afu-progress-bar\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger afu-invalid-file\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\"><span>{{na['fileName']}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{na['fileSize']}})</strong></p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}} + afu-upload-status\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg afu-progress-bar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success afu-upload-btn\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>{{uploadBtnText}}</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn afu-attach-pin' (click)=\"attachpinOnclick()\">\n            {{attachPinText}}\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->",
                    styles: [".constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}"]
                },] },
    ];
    AngularFileUploaderComponent.ctorParameters = function () { return []; };
    AngularFileUploaderComponent.propDecorators = {
        config: [{ type: Input }],
        resetUpload: [{ type: Input }],
        ApiResponse: [{ type: Output }]
    };
    return AngularFileUploaderComponent;
}());
export { AngularFileUploaderComponent };
if (false) {
    /** @type {?} */
    AngularFileUploaderComponent.prototype.config;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.resetUpload;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.ApiResponse;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.theme;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.id;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideProgressBar;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.maxSize;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadAPI;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.formatsAllowed;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.multiple;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.headers;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideResetBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideSelectBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.attachPinText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadBtnText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.idDate;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.reg;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.selectedFiles;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.notAllowedList;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.Caption;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.singleFile;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.progressBarShow;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsg;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.afterUpload;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadClick;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsgText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsgClass;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.percentComplete;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBdUQsTUFBTSxlQUFlLENBQUM7QUFDcEk7SUFrSEU7UUFsQ0EsV0FBTSxHQUFRLEVBQUUsQ0FBQztRQUVqQixnQkFBVyxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFbEQsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBZWpDLFdBQU0sR0FBVyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDN0IsUUFBRyxHQUFXLGlCQUFpQixDQUFDO1FBQ2hDLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBQy9CLG1CQUFjLEdBQWtCLEVBQUUsQ0FBQztRQUNuQyxZQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUM1QixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQU1qQiw4QkFBOEI7UUFDOUIsc0NBQXNDO1FBQ3RDLDZCQUE2QjtJQUMvQixDQUFDOzs7OztJQUVELGtEQUFXOzs7O0lBQVgsVUFBWSxHQUFrQjtRQUM1QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7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U1ksNEJBQTRCOzs7SUFDdkMsOENBQ2lCOztJQUNqQixtREFDa0Q7O0lBQ2xELG1EQUNpQzs7SUFFakMsNkNBQWM7O0lBQ2QsMENBQVc7O0lBQ1gsdURBQXlCOztJQUN6QiwrQ0FBZ0I7O0lBQ2hCLGlEQUFrQjs7SUFDbEIsc0RBQXVCOztJQUN2QixnREFBa0I7O0lBQ2xCLCtDQUFhOztJQUNiLG9EQUFzQjs7SUFDdEIscURBQXVCOztJQUN2QixxREFBc0I7O0lBQ3RCLHFEQUFzQjs7SUFFdEIsOENBQTZCOztJQUM3QiwyQ0FBZ0M7O0lBQ2hDLHFEQUErQjs7SUFDL0Isc0RBQW1DOztJQUNuQywrQ0FBNEI7O0lBQzVCLGtEQUFrQjs7SUFDbEIsdURBQXdCOztJQUN4QixpREFBa0I7O0lBQ2xCLGlEQUFrQjs7SUFDbEIsbURBQW9COztJQUNwQixtREFBbUI7O0lBQ25CLHFEQUFzQjs7SUFDdEIsc0RBQXVCOztJQUN2Qix1REFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiYW5ndWxhci1maWxlLXVwbG9hZGVyXCIsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgKm5nSWY9XCIodGhlbWUgIT09ICdhdHRhY2hQaW4nKVwiIGlkPVwiZGVmYXVsdFwiPlxyXG5cclxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgU3RhcnRzIC0tPlxyXG4gICAgPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIiBbbmdDbGFzc109XCIoaGlkZVNlbGVjdEJ0biAmJiBoaWRlUmVzZXRCdG4pID8gbnVsbCA6ICdkcmFnTkRyb3BCdG1QYWQnXCIgY2xhc3M9XCJkcmFnTkRyb3BcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7XCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaXYxXCIgY2xhc3M9XCJkaXYxIGFmdS1kcmFnbmRyb3AtYm94XCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFmdS1kcmFnbmRyb3AtdGV4dFwiPkRyYWcgTiBEcm9wPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPCEtLSA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+IC0tPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIERyYWcgbiBEcm9wIHRoZW1lIEVuZHMgLS0+XHJcblxyXG4gICAgPGxhYmVsIGZvcj1cInNlbHt7aWR9fVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBhZnUtc2VsZWN0LWJ0blwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj7Yp9mG2KrYrtin2Kgg2YHYp9uM2YQ8c3BhbiAqbmdJZj1cIm11bHRpcGxlXCI+INmH2KcgPC9zcGFuPjwvbGFiZWw+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiB0aXRsZT1cItin2YbYqtiu2KfYqCDZgdin24zZhFwiXHJcbiAgICAgICAgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZCBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi1zbSByZXNldEJ0biBhZnUtcmVzZXQtYnRuXCIgKGNsaWNrKT1cInJlc2V0RmlsZVVwbG9hZCgpXCIgKm5nSWY9XCIhaGlkZVJlc2V0QnRuXCI+2K3YsNmBINmH2YXZhzwvYnV0dG9uPlxyXG4gICAgPGJyICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj5cclxuICAgIDxwIGNsYXNzPVwiY29uc3RyYWludHMtaW5mbyBhZnUtY29uc3RyYWludHMtaW5mb1wiPih7e2Zvcm1hdHNBbGxvd2VkfX0pINmF2K3Yr9mI2K/bjNiqINmB2KfbjNmEIC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqMTAyNDAwMCkpfX08L3A+XHJcbiAgICA8IS0tU2VsZWN0ZWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGFmdS12YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IHNmIG9mIHNlbGVjdGVkRmlsZXM7bGV0IGk9aW5kZXhcIiA+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyB0ZXh0T3ZlcmZsb3dcIj48c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeVwiPnt7c2YubmFtZX19PC9zcGFuPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e2NvbnZlcnRTaXplKHNmLnNpemUpfX0pPC9zdHJvbmc+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7PC9wPlxyXG4gICAgICAgIDwhLS0gIDxpbnB1dCBjbGFzcz1cImNvbC14cy0zIHByb2dyZXNzIGNhcHRpb25cIiAgdHlwZT1cInRleHRcIiAgcGxhY2Vob2xkZXI9XCJDYXB0aW9uLi5cIiAgWyhuZ01vZGVsKV09XCJDYXB0aW9uW2ldXCIgICpuZ0lmPVwidXBsb2FkQ2xpY2tcIi8+IC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtMyBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIiAqbmdJZj1cInNpbmdsZUZpbGUgJiYgcHJvZ3Jlc3NCYXJTaG93ICYmICFoaWRlUHJvZ3Jlc3NCYXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTFcIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaSwnc2YnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLUludmFsaWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IHRleHQtZGFuZ2VyIGFmdS1pbnZhbGlkLWZpbGVcIiAqbmdGb3I9XCJsZXQgbmEgb2Ygbm90QWxsb3dlZExpc3Q7bGV0IGo9aW5kZXhcIj5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuPnt7bmFbJ2ZpbGVOYW1lJ119fTwvc3Bhbj48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tuYVsnZmlsZVNpemUnXX19KTwvc3Ryb25nPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIFwiPnt7bmFbJ2Vycm9yTXNnJ119fTwvcD5cclxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xIGRlbEZpbGVJY29uXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGosJ25hJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8cCAqbmdJZj1cInVwbG9hZE1zZ1wiIGNsYXNzPVwie3t1cGxvYWRNc2dDbGFzc319ICsgYWZ1LXVwbG9hZC1zdGF0dXNcIj57e3VwbG9hZE1zZ1RleHR9fTxwPlxyXG4gICAgPGRpdiAqbmdJZj1cIiFzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy00IHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBhZnUtdXBsb2FkLWJ0blwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIFtkaXNhYmxlZF09IXVwbG9hZEJ0bj57e3VwbG9hZEJ0blRleHR9fTwvYnV0dG9uPlxyXG4gICAgPGJyPlxyXG48L2Rpdj5cclxuXHJcbjwhLS0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gQVRUQUNIIFBJTiBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxyXG48ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2F0dGFjaFBpbidcIiBpZD1cImF0dGFjaFBpblwiPlxyXG4gICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cclxuICAgICAgICA8YSBjbGFzcz0nYnRuIHVwX2J0biBhZnUtYXR0YWNoLXBpbicgKGNsaWNrKT1cImF0dGFjaHBpbk9uY2xpY2soKVwiPlxyXG4gICAgICAgICAgICB7e2F0dGFjaFBpblRleHR9fVxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBhcGVyY2xpcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPCEtLSA8cCBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKiAxMDI0MDAwKSl9fTwvcD4gLS0+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgdGl0bGU9XCJTZWxlY3QgZmlsZVwiIG5hbWU9XCJmaWxlc1tdXCIgW2FjY2VwdF09Zm9ybWF0c0FsbG93ZWRcclxuICAgICAgICAgICAgICAgIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICAmbmJzcDtcclxuICAgICAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERSQUcgTiBEUk9QIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XHJcbjwhLS0gPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIj5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxyXG4gICAgPGRpdiBpZD1cImRpdjFcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cclxuICAgICAgPHA+RHJhZyBOIERyb3A8L3A+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9kaXY+IC0tPmAgLFxyXG4gIHN0eWxlczogW2AuY29uc3RyYWludHMtaW5mb3ttYXJnaW4tdG9wOjEwcHg7Zm9udC1zdHlsZTppdGFsaWN9LnBhZE1hcmd7cGFkZGluZzowO21hcmdpbi1ib3R0b206MH0uY2FwdGlvbnttYXJnaW4tcmlnaHQ6NXB4fS50ZXh0T3ZlcmZsb3d7d2hpdGUtc3BhY2U6bm93cmFwO3BhZGRpbmctcmlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30udXBfYnRue2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtib3JkZXI6MnB4IHNvbGlkICM1YzViNWI7Ym9yZGVyLXJhZGl1czoyMnB4fS5kZWxGaWxlSWNvbnt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojY2UwOTA5fS5kcmFnTkRyb3AgLmRpdjF7ZGlzcGxheTpib3JkZXItYm94O2JvcmRlcjoycHggZGFzaGVkICM1YzViNWI7aGVpZ2h0OjZyZW07d2lkdGg6MjByZW19LmRyYWdORHJvcCAuZGl2MT5we3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNWM1YjViO21hcmdpbi10b3A6MS40ZW19LmRyYWdORHJvcEJ0bVBhZHtwYWRkaW5nLWJvdHRvbToycmVtfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NjIwcHgpey5jYXB0aW9ue3BhZGRpbmc6MH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo1MTBweCl7LnNpemVDe3dpZHRoOjI1JX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoyNjBweCl7LmNhcHRpb24sLnNpemVDe2ZvbnQtc2l6ZToxMHB4fX0ucmVzZXRCdG57bWFyZ2luLWxlZnQ6M3B4fWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpXHJcbiAgY29uZmlnOiBhbnkgPSB7fTtcclxuICBASW5wdXQoKVxyXG4gIHJlc2V0VXBsb2FkOiBib29sZWFuID0gdGhpcy5jb25maWdbXCJyZXNldFVwbG9hZFwiXTtcclxuICBAT3V0cHV0KClcclxuICBBcGlSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdGhlbWU6IHN0cmluZztcclxuICBpZDogbnVtYmVyO1xyXG4gIGhpZGVQcm9ncmVzc0JhcjogYm9vbGVhbjtcclxuICBtYXhTaXplOiBudW1iZXI7XHJcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XHJcbiAgZm9ybWF0c0FsbG93ZWQ6IHN0cmluZztcclxuICBtdWx0aXBsZTogYm9vbGVhbjtcclxuICBoZWFkZXJzOiBhbnk7XHJcbiAgaGlkZVJlc2V0QnRuOiBib29sZWFuO1xyXG4gIGhpZGVTZWxlY3RCdG46IGJvb2xlYW47XHJcbiAgYXR0YWNoUGluVGV4dDogc3RyaW5nO1xyXG4gIHVwbG9hZEJ0blRleHQ6IHN0cmluZztcclxuXHJcbiAgaWREYXRlOiBudW1iZXIgPSArbmV3IERhdGUoKTtcclxuICByZWc6IFJlZ0V4cCA9IC8oPzpcXC4oW14uXSspKT8kLztcclxuICBzZWxlY3RlZEZpbGVzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgbm90QWxsb3dlZExpc3Q6IEFycmF5PE9iamVjdD4gPSBbXTtcclxuICBDYXB0aW9uOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgc2luZ2xlRmlsZSA9IHRydWU7XHJcbiAgcHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XHJcbiAgdXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgdXBsb2FkTXNnID0gZmFsc2U7XHJcbiAgYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcclxuICB1cGxvYWRDbGljayA9IHRydWU7XHJcbiAgdXBsb2FkTXNnVGV4dDogc3RyaW5nO1xyXG4gIHVwbG9hZE1zZ0NsYXNzOiBzdHJpbmc7XHJcbiAgcGVyY2VudENvbXBsZXRlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImlkOiBcIix0aGlzLmlkKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJpZERhdGU6IFwiLHRoaXMuaWREYXRlKTtcclxuICAgIC8vY29uc29sZS5sb2coTWF0aC5yYW5kb20oKSk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhyc3Q6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChyc3RbXCJjb25maWdcIl0pIHtcclxuICAgICAgdGhpcy50aGVtZSA9IHRoaXMuY29uZmlnW1widGhlbWVcIl0gfHwgXCJcIjtcclxuICAgICAgdGhpcy5pZCA9XHJcbiAgICAgICAgdGhpcy5jb25maWdbXCJpZFwiXSB8fFxyXG4gICAgICAgIHBhcnNlSW50KCh0aGlzLmlkRGF0ZSAvIDEwMDAwKS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXSkgK1xyXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICogMTAwMDA7XHJcbiAgICAgIHRoaXMuaGlkZVByb2dyZXNzQmFyID0gdGhpcy5jb25maWdbXCJoaWRlUHJvZ3Jlc3NCYXJcIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuaGlkZVJlc2V0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlUmVzZXRCdG5cIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuaGlkZVNlbGVjdEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVNlbGVjdEJ0blwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRCdG5UZXh0ID0gdGhpcy5jb25maWdbXCJ1cGxvYWRCdG5UZXh0XCJdIHx8IFwi2KjYp9ix2q/Ystin2LHbjFwiO1xyXG4gICAgICB0aGlzLm1heFNpemUgPSB0aGlzLmNvbmZpZ1tcIm1heFNpemVcIl0gfHwgMjA7XHJcbiAgICAgIHRoaXMudXBsb2FkQVBJID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJ1cmxcIl07XHJcbiAgICAgIHRoaXMuZm9ybWF0c0FsbG93ZWQgPVxyXG4gICAgICAgIHRoaXMuY29uZmlnW1wiZm9ybWF0c0FsbG93ZWRcIl0gfHwgXCIuanBnLC5wbmcsLnBkZiwuZG9jeCwudHh0LC5naWYsLmpwZWdcIjtcclxuICAgICAgdGhpcy5tdWx0aXBsZSA9IHRoaXMuY29uZmlnW1wibXVsdGlwbGVcIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuaGVhZGVycyA9IHRoaXMuY29uZmlnW1widXBsb2FkQVBJXCJdW1wiaGVhZGVyc1wiXSB8fCB7fTtcclxuICAgICAgdGhpcy5hdHRhY2hQaW5UZXh0ID1cclxuICAgICAgICB0aGlzLmNvbmZpZ1tcImF0dGFjaFBpblRleHRcIl0gfHwgXCJBdHRhY2ggc3VwcG9ydGluZyBkb2N1bWVudHMuLlwiO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwiY29uZmlnOiBcIiwgdGhpcy5jb25maWcpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSk7XHJcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5oZWFkZXJzKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcInJzdDogXCIsIHJzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdKSB7XHJcbiAgICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICB0aGlzLnJlc2V0RmlsZVVwbG9hZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJJZDogXCIsIHRoaXMuaWQpO1xyXG4gICAgdGhpcy5yZXNldFVwbG9hZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmVzZXRGaWxlVXBsb2FkKCkge1xyXG4gICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XHJcbiAgICB0aGlzLkNhcHRpb24gPSBbXTtcclxuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcclxuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XHJcbiAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2UoZXZlbnQ6IGFueSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLm1heFNpemUgKyB0aGlzLmZvcm1hdHNBbGxvd2VkICsgdGhpcy5tdWx0aXBsZSk7XHJcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XHJcbiAgICAvL2NvbnNvbGUubG9nKFwib25jaGFuZ2UgaGl0XCIpO1xyXG4gICAgaWYgKHRoaXMuYWZ0ZXJVcGxvYWQgfHwgIXRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XHJcbiAgICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xyXG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvL0ZPUk1BVFMgQUxMT1dFRCBMSVNUXHJcbiAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUUyBBTExPV0VEIExJU1Q9IFwiK3RoaXMuZm9ybWF0c0FsbG93ZWQpO1xyXG4gICAgLy9OTyBPRiBGT1JNQVRTIEFMTE9XRURcclxuICAgIGxldCBmb3JtYXRzQ291bnQ6IGFueTtcclxuICAgIGZvcm1hdHNDb3VudCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQubWF0Y2gobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSk7XHJcbiAgICBmb3JtYXRzQ291bnQgPSBmb3JtYXRzQ291bnQubGVuZ3RoO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk5PIE9GIEZPUk1BVFMgQUxMT1dFRD0gXCIrZm9ybWF0c0NvdW50KTtcclxuICAgIC8vY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG5cclxuICAgIC8vSVRFUkFURSBTRUxFQ1RFRCBGSUxFU1xyXG4gICAgbGV0IGZpbGU6IEZpbGVMaXN0O1xyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT0gXCJkcm9wXCIpIHtcclxuICAgICAgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcclxuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGRyb3BcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzIHx8IGV2ZW50LnNyY0VsZW1lbnQuZmlsZXM7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0eXBlOiBjaGFuZ2VcIik7XHJcbiAgICB9XHJcbiAgICAvL2NvbnNvbGUubG9nKGZpbGUpO1xyXG4gICAgbGV0IGN1cnJlbnRGaWxlRXh0OiBhbnk7XHJcbiAgICBsZXQgZXh0OiBhbnk7XHJcbiAgICBsZXQgZnJtdEFsbG93ZWQ6IGJvb2xlYW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy9DSEVDSyBGT1JNQVRcclxuICAgICAgLy9DVVJSRU5UIEZJTEUgRVhURU5TSU9OXHJcbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gdGhpcy5yZWcuZXhlYyhmaWxlW2ldLm5hbWUpO1xyXG4gICAgICBjdXJyZW50RmlsZUV4dCA9IGN1cnJlbnRGaWxlRXh0WzFdO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGVbaV0ubmFtZSk7XHJcbiAgICAgIGZybXRBbGxvd2VkID0gZmFsc2U7XHJcbiAgICAgIC8vRk9STUFUIEFMTE9XRUQgTElTVCBJVEVSQVRFXHJcbiAgICAgIGZvciAobGV0IGogPSBmb3JtYXRzQ291bnQ7IGogPiAwOyBqLS0pIHtcclxuICAgICAgICBleHQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLnNwbGl0KFwiLlwiKVtqXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIExJU1QgKFwiK2orXCIpPSBcIitleHQuc3BsaXQoXCIsXCIpWzBdKTtcclxuICAgICAgICBpZiAoaiA9PSBmb3JtYXRzQ291bnQpIHtcclxuICAgICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdICsgXCIsXCI7XHJcbiAgICAgICAgfSAvL2NoZWNrIGZvcm1hdFxyXG4gICAgICAgIGlmIChjdXJyZW50RmlsZUV4dC50b0xvd2VyQ2FzZSgpID09IGV4dC5zcGxpdChcIixcIilbMF0pIHtcclxuICAgICAgICAgIGZybXRBbGxvd2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmcm10QWxsb3dlZCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgQUxMT1dFRFwiKTtcclxuICAgICAgICAvL0NIRUNLIFNJWkVcclxuICAgICAgICBpZiAoZmlsZVtpXS5zaXplID4gdGhpcy5tYXhTaXplICogMTAyNDAwMCkge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlNJWkUgTk9UIEFMTE9XRUQgKFwiK2ZpbGVbaV0uc2l6ZStcIilcIik7XHJcbiAgICAgICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnB1c2goe1xyXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxyXG4gICAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxyXG4gICAgICAgICAgICBlcnJvck1zZzogXCLYrdis2YUg2YHYp9uM2YQg2LXYrduM2K0g2YbbjNiz2KpcIlxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy9mb3JtYXQgYWxsb3dlZCBhbmQgc2l6ZSBhbGxvd2VkIHRoZW4gYWRkIGZpbGUgdG8gc2VsZWN0ZWRGaWxlIGFycmF5XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXMucHVzaChmaWxlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBOT1QgQUxMT1dFRFwiKTtcclxuICAgICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnB1c2goe1xyXG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGVbaV0ubmFtZSxcclxuICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXHJcbiAgICAgICAgICBlcnJvck1zZzogXCLZgdix2YXYqiDZgdin24zZhCDYtdit24zYrSDZhtuM2LPYqlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IHRydWU7XHJcbiAgICAgIGlmICh0aGlzLnRoZW1lID09IFwiYXR0YWNoUGluXCIpIHRoaXMudXBsb2FkRmlsZXMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwbG9hZE1zZyA9IGZhbHNlO1xyXG4gICAgdGhpcy51cGxvYWRDbGljayA9IHRydWU7XHJcbiAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IDA7XHJcbiAgICBldmVudC50YXJnZXQudmFsdWUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XHJcblxyXG4gICAgbGV0IGk6IGFueTtcclxuICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gdHJ1ZTtcclxuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSBmYWxzZTtcclxuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcclxuICAgIGxldCBpc0Vycm9yID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5DYXB0aW9uW2ldID09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgdGhpcy5DYXB0aW9uW2ldID0gXCLZgdin24zZhFwiICsgaTtcclxuICAgICAgLy9BZGQgREFUQSBUTyBCRSBTRU5UXHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcclxuICAgICAgICB0aGlzLkNhcHRpb25baV0sXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzW2ldIC8qLCB0aGlzLnNlbGVjdGVkRmlsZXNbaV0ubmFtZSovXHJcbiAgICAgICk7XHJcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzW2ldK1wie1wiK3RoaXMuQ2FwdGlvbltpXStcIiAoQ2FwdGlvbil9XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpID4gMSkge1xyXG4gICAgICB0aGlzLnNpbmdsZUZpbGUgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGV2bnQgPT4ge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwib25yZWFkeVwiKTtcclxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgaXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCLYrti32Kcg2K/YsSDYqNin2LHar9iy2KfYsduMICFcIjtcclxuICAgICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtZGFuZ2VyIGxlYWRcIjtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0KTtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuQXBpUmVzcG9uc2UuZW1pdCh4aHIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2bnQgPT4ge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlOyAvLyBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIGJ5IHByb2Nlc3MgdXBsb2FkaW5nXHJcbiAgICAgIGlmIChldm50Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IE1hdGgucm91bmQoKGV2bnQubG9hZGVkIC8gZXZudC50b3RhbCkgKiAxMDApO1xyXG4gICAgICB9XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJQcm9ncmVzcy4uLlwiLyordGhpcy5wZXJjZW50Q29tcGxldGUrXCIgJVwiKi8pO1xyXG4gICAgfTtcclxuXHJcbiAgICB4aHIub25sb2FkID0gZXZudCA9PiB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmxvYWRcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XHJcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XHJcbiAgICAgIGlmICghaXNFcnJvcikge1xyXG4gICAgICAgIHRoaXMudXBsb2FkTXNnVGV4dCA9IFwi2KjYpyDZhdmI2YHZgtuM2Kog2KjYp9ix2q/Ystin2LHbjCDYtNivICFcIjtcclxuICAgICAgICB0aGlzLnVwbG9hZE1zZ0NsYXNzID0gXCJ0ZXh0LXN1Y2Nlc3MgbGVhZFwiO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0ICsgXCIgXCIgKyB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICsgXCIgZmlsZVwiKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB4aHIub25lcnJvciA9IGV2bnQgPT4ge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwib25lcnJvclwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcclxuICAgIH07XHJcblxyXG4gICAgeGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXBsb2FkQVBJLCB0cnVlKTtcclxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuaGVhZGVycykpIHtcclxuICAgICAgLy8gT2JqZWN0LmtleXMgd2lsbCBnaXZlIGFuIEFycmF5IG9mIGtleXNcclxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB0aGlzLmhlYWRlcnNba2V5XSk7XHJcbiAgICB9XHJcbiAgICAvL2xldCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIik7XHJcbiAgICAvL3hoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke3Rva2VufWApO1xyXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRmlsZShpOiBhbnksIHNmX25hOiBhbnkpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJyZW1vdmUgZmlsZSBjbGlja2VkIFwiICsgaSlcclxuICAgIGlmIChzZl9uYSA9PSBcInNmXCIpIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgdGhpcy5DYXB0aW9uLnNwbGljZShpLCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm90QWxsb3dlZExpc3Quc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnZlcnRTaXplKGZpbGVTaXplOiBudW1iZXIpIHtcclxuICAgIC8vY29uc29sZS5sb2coZmlsZVNpemUgKyBcIiAtIFwiKyBzdHIpO1xyXG4gICAgcmV0dXJuIGZpbGVTaXplIDwgMTAyNDAwMFxyXG4gICAgICA/IChmaWxlU2l6ZSAvIDEwMjQpLnRvRml4ZWQoMikgKyBcIiBLQlwiXHJcbiAgICAgIDogKGZpbGVTaXplIC8gMTAyNDAwMCkudG9GaXhlZCgyKSArIFwiIE1CXCI7XHJcbiAgfVxyXG5cclxuICBhdHRhY2hwaW5PbmNsaWNrKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIklEOiBcIiwgdGhpcy5pZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbFwiICsgdGhpcy5pZCkhLmNsaWNrKCk7XHJcbiAgICAvLyQoXCIjXCIrXCJzZWxcIit0aGlzLmlkKS5jbGljaygpO1xyXG4gIH1cclxuXHJcbiAgZHJvcChldmVudDogYW55KSB7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiZHJvcDogXCIsIGV2ZW50KTtcclxuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcclxuICAgIHRoaXMub25DaGFuZ2UoZXZlbnQpO1xyXG4gIH1cclxuICBhbGxvd0Ryb3AoZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgIC8vY29uc29sZS5sb2coXCJhbGxvd0Ryb3A6IFwiLGV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuLyogaW50ZXJmYWNlIENPTkZJRyB7XHJcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XHJcbiAgbXVsdGlwbGU/OiBib29sZWFuO1xyXG4gIGZvcm1hdHNBbGxvd2VkPzogc3RyaW5nO1xyXG4gIG1heFNpemU/OiBudW1iZXI7XHJcbiAgaWQ/OiBudW1iZXI7XHJcbiAgcmVzZXRVcGxvYWQ/OiBib29sZWFuO1xyXG4gIHRoZW1lPzogc3RyaW5nO1xyXG4gIGhpZGVQcm9ncmVzc0Jhcj86IGJvb2xlYW47XHJcbiB9XHJcbiAqLyJdfQ==