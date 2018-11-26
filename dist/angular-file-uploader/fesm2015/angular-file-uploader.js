import { Injectable, Component, Input, Output, EventEmitter, NgModule, defineInjectable } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class AngularFileUploaderService {
    constructor() { }
}
AngularFileUploaderService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
AngularFileUploaderService.ctorParameters = () => [];
/** @nocollapse */ AngularFileUploaderService.ngInjectableDef = defineInjectable({ factory: function AngularFileUploaderService_Factory() { return new AngularFileUploaderService(); }, token: AngularFileUploaderService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class AngularFileUploaderComponent {
    constructor() {
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
    ngOnChanges(rst) {
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
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        //console.log("Id: ", this.id);
        this.resetUpload = false;
    }
    /**
     * @return {?}
     */
    resetFileUpload() {
        this.selectedFiles = [];
        this.Caption = [];
        this.notAllowedList = [];
        this.uploadMsg = false;
        this.uploadBtn = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onChange(event) {
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
        let formatsCount;
        formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
        formatsCount = formatsCount.length;
        //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
        //console.log("-------------------------------");
        //ITERATE SELECTED FILES
        /** @type {?} */
        let file;
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
        let currentFileExt;
        /** @type {?} */
        let ext;
        /** @type {?} */
        let frmtAllowed;
        for (let i = 0; i < file.length; i++) {
            //CHECK FORMAT
            //CURRENT FILE EXTENSION
            currentFileExt = this.reg.exec(file[i].name);
            currentFileExt = currentFileExt[1];
            //console.log(file[i].name);
            frmtAllowed = false;
            //FORMAT ALLOWED LIST ITERATE
            for (let j = formatsCount; j > 0; j--) {
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
    }
    /**
     * @return {?}
     */
    uploadFiles() {
        //console.log(this.selectedFiles);
        //console.log(this.selectedFiles);
        /** @type {?} */
        let i;
        this.progressBarShow = true;
        this.uploadClick = false;
        this.notAllowedList = [];
        /** @type {?} */
        let isError = false;
        /** @type {?} */
        let xhr = new XMLHttpRequest();
        /** @type {?} */
        let formData = new FormData();
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
        xhr.onreadystatechange = evnt => {
            //console.log("onready");
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    isError = true;
                    this.progressBarShow = false;
                    this.uploadBtn = false;
                    this.uploadMsg = true;
                    this.afterUpload = true;
                    this.uploadMsgText = "خطا در بارگزاری !";
                    this.uploadMsgClass = "text-danger lead";
                    //console.log(this.uploadMsgText);
                    //console.log(evnt);
                }
                this.ApiResponse.emit(xhr);
            }
        };
        xhr.upload.onprogress = evnt => {
            this.uploadBtn = false; // button should be disabled by process uploading
            if (evnt.lengthComputable) {
                this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
            }
            //console.log("Progress..."/*+this.percentComplete+" %"*/);
        };
        xhr.onload = evnt => {
            //console.log("onload");
            //console.log(evnt);
            this.progressBarShow = false;
            this.uploadBtn = false;
            this.uploadMsg = true;
            this.afterUpload = true;
            if (!isError) {
                this.uploadMsgText = "با موفقیت بارگزاری شد !";
                this.uploadMsgClass = "text-success lead";
                //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
            }
        };
        xhr.onerror = evnt => {
            //console.log("onerror");
            //console.log(evnt);
        };
        xhr.open("POST", this.uploadAPI, true);
        for (const key of Object.keys(this.headers)) {
            // Object.keys will give an Array of keys
            xhr.setRequestHeader(key, this.headers[key]);
        }
        //let token = sessionStorage.getItem("token");
        //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    }
    /**
     * @param {?} i
     * @param {?} sf_na
     * @return {?}
     */
    removeFile(i, sf_na) {
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
    }
    /**
     * @param {?} fileSize
     * @return {?}
     */
    convertSize(fileSize) {
        //console.log(fileSize + " - "+ str);
        return fileSize < 1024000
            ? (fileSize / 1024).toFixed(2) + " KB"
            : (fileSize / 1024000).toFixed(2) + " MB";
    }
    /**
     * @return {?}
     */
    attachpinOnclick() {
        //console.log("ID: ", this.id);
        (/** @type {?} */ (document.getElementById("sel" + this.id))).click();
        //$("#"+"sel"+this.id).click();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drop(event) {
        event.stopPropagation();
        event.preventDefault();
        //console.log("drop: ", event);
        //console.log("drop: ", event.dataTransfer.files);
        this.onChange(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        //console.log("allowDrop: ",event)
    }
}
AngularFileUploaderComponent.decorators = [
    { type: Component, args: [{
                selector: "angular-file-uploader",
                template: `<div class="container" *ngIf="(theme !== 'attachPin')" id="default">

    <!-- Drag n Drop theme Starts -->
    <div *ngIf="theme == 'dragNDrop'" id="dragNDrop" [ngClass]="(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'" class="dragNDrop">
        <div style="position:relative;">
            <div id="div1" class="div1 afu-dragndrop-box" (drop)="drop($event)" (dragover)="allowDrop($event)">
                <p class="afu-dragndrop-text">Drag N Drop</p>
            </div>
            <!-- <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span> -->
        </div>
    </div>
    <!-- Drag n Drop theme Ends -->

    <label for="sel{{id}}" class="btn btn-primary btn-sm afu-select-btn" *ngIf="!hideSelectBtn">انتخاب فایل<span *ngIf="multiple"> ها </span></label>
    <input type="file" id="sel{{id}}" style="display: none" *ngIf="!hideSelectBtn" (change)="onChange($event)" title="انتخاب فایل"
        name="files[]" [accept]=formatsAllowed [attr.multiple]="multiple ? '' : null" />
    <button class="btn btn-info btn-sm resetBtn afu-reset-btn" (click)="resetFileUpload()" *ngIf="!hideResetBtn">حذف همه</button>
    <br *ngIf="!hideSelectBtn">
    <p class="constraints-info afu-constraints-info">({{formatsAllowed}}) محدودیت فایل - {{(convertSize(maxSize *1024000))}}</p>
    <!--Selected file list-->
    <div class="row afu-valid-file" *ngFor="let sf of selectedFiles;let i=index" >
        <p class="col-xs-3 textOverflow"><span class="text-primary">{{sf.name}}</span></p>
        <p class="col-xs-3 padMarg sizeC"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <!--  <input class="col-xs-3 progress caption"  type="text"  placeholder="Caption.."  [(ngModel)]="Caption[i]"  *ngIf="uploadClick"/> -->
        <div class="progress col-xs-3 padMarg afu-progress-bar" *ngIf="singleFile && progressBarShow && !hideProgressBar">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <a class="col-xs-1" role="button" (click)="removeFile(i,'sf')" *ngIf="uploadClick"><i class="fa fa-times"></i></a>
    </div>
    <!--Invalid file list-->
    <div class="row text-danger afu-invalid-file" *ngFor="let na of notAllowedList;let j=index">
        <p class="col-xs-3 textOverflow"><span>{{na['fileName']}}</span></p>
        <p class="col-xs-3 padMarg sizeC"><strong>({{na['fileSize']}})</strong></p>
        <p class="col-xs-3 ">{{na['errorMsg']}}</p>
        <a class="col-xs-1 delFileIcon" role="button" (click)="removeFile(j,'na')" *ngIf="uploadClick">&nbsp;<i class="fa fa-times"></i></a>
    </div>

    <p *ngIf="uploadMsg" class="{{uploadMsgClass}} + afu-upload-status">{{uploadMsgText}}<p>
    <div *ngIf="!singleFile && progressBarShow && !hideProgressBar">
        <div class="progress col-xs-4 padMarg afu-progress-bar">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <br>
        <br>
    </div>
    <button class="btn btn-success afu-upload-btn" type="button" (click)="uploadFiles()" [disabled]=!uploadBtn>{{uploadBtnText}}</button>
    <br>
</div>

<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->
<div *ngIf="theme == 'attachPin'" id="attachPin">
    <div style="position:relative;padding-left:6px">
        <a class='btn up_btn afu-attach-pin' (click)="attachpinOnclick()">
            {{attachPinText}}
            <i class="fa fa-paperclip" aria-hidden="true"></i>
            <!-- <p style="margin-top:10px">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->
            <input type="file" id="sel{{id}}" (change)="onChange($event)" style="display: none" title="Select file" name="files[]" [accept]=formatsAllowed
                [attr.multiple]="multiple ? '' : null" />
            <br>
        </a>
        &nbsp;
        <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span>
    </div>
</div>

<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->
<!-- <div *ngIf="theme == 'dragNDrop'" id="dragNDrop">
  <div style="position:relative;padding-left:6px">
    <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">
      <p>Drag N Drop</p>
    </div>
    <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span>
  </div>
</div> -->`,
                styles: [`.constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}`]
            },] },
];
AngularFileUploaderComponent.ctorParameters = () => [];
AngularFileUploaderComponent.propDecorators = {
    config: [{ type: Input }],
    resetUpload: [{ type: Input }],
    ApiResponse: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class AngularFileUploaderModule {
}
AngularFileUploaderModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [AngularFileUploaderComponent],
                exports: [AngularFileUploaderComponent]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { AngularFileUploaderService, AngularFileUploaderComponent, AngularFileUploaderModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5zZXJ2aWNlLnRzIiwibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci9saWIvYW5ndWxhci1maWxlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImFuZ3VsYXItZmlsZS11cGxvYWRlclwiLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiICpuZ0lmPVwiKHRoZW1lICE9PSAnYXR0YWNoUGluJylcIiBpZD1cImRlZmF1bHRcIj5cclxuXHJcbiAgICA8IS0tIERyYWcgbiBEcm9wIHRoZW1lIFN0YXJ0cyAtLT5cclxuICAgIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCIgW25nQ2xhc3NdPVwiKGhpZGVTZWxlY3RCdG4gJiYgaGlkZVJlc2V0QnRuKSA/IG51bGwgOiAnZHJhZ05Ecm9wQnRtUGFkJ1wiIGNsYXNzPVwiZHJhZ05Ecm9wXCI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiZGl2MVwiIGNsYXNzPVwiZGl2MSBhZnUtZHJhZ25kcm9wLWJveFwiIChkcm9wKT1cImRyb3AoJGV2ZW50KVwiIChkcmFnb3Zlcik9XCJhbGxvd0Ryb3AoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhZnUtZHJhZ25kcm9wLXRleHRcIj5EcmFnIE4gRHJvcDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwhLS0gPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPiAtLT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBFbmRzIC0tPlxyXG5cclxuICAgIDxsYWJlbCBmb3I9XCJzZWx7e2lkfX1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gYWZ1LXNlbGVjdC1idG5cIiAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCI+w5jCp8OZwobDmMKqw5jCrsOYwqfDmMKoIMOZwoHDmMKnw5vCjMOZwoQ8c3BhbiAqbmdJZj1cIm11bHRpcGxlXCI+IMOZwofDmMKnIDwvc3Bhbj48L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJzZWx7e2lkfX1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgdGl0bGU9XCLDmMKnw5nChsOYwqrDmMKuw5jCp8OYwqggw5nCgcOYwqfDm8KMw5nChFwiXHJcbiAgICAgICAgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZCBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi1zbSByZXNldEJ0biBhZnUtcmVzZXQtYnRuXCIgKGNsaWNrKT1cInJlc2V0RmlsZVVwbG9hZCgpXCIgKm5nSWY9XCIhaGlkZVJlc2V0QnRuXCI+w5jCrcOYwrDDmcKBIMOZwofDmcKFw5nChzwvYnV0dG9uPlxyXG4gICAgPGJyICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj5cclxuICAgIDxwIGNsYXNzPVwiY29uc3RyYWludHMtaW5mbyBhZnUtY29uc3RyYWludHMtaW5mb1wiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIMOZwoXDmMKtw5jCr8OZwojDmMKvw5vCjMOYwqogw5nCgcOYwqfDm8KMw5nChCAtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKjEwMjQwMDApKX19PC9wPlxyXG4gICAgPCEtLVNlbGVjdGVkIGZpbGUgbGlzdC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBhZnUtdmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBzZiBvZiBzZWxlY3RlZEZpbGVzO2xldCBpPWluZGV4XCIgPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnlcIj57e3NmLm5hbWV9fTwvc3Bhbj48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tjb252ZXJ0U2l6ZShzZi5zaXplKX19KTwvc3Ryb25nPiZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOzwvcD5cclxuICAgICAgICA8IS0tICA8aW5wdXQgY2xhc3M9XCJjb2wteHMtMyBwcm9ncmVzcyBjYXB0aW9uXCIgIHR5cGU9XCJ0ZXh0XCIgIHBsYWNlaG9sZGVyPVwiQ2FwdGlvbi4uXCIgIFsobmdNb2RlbCldPVwiQ2FwdGlvbltpXVwiICAqbmdJZj1cInVwbG9hZENsaWNrXCIvPiAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTMgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCIgKm5nSWY9XCJzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6cGVyY2VudENvbXBsZXRlKyclJ31cIj57e3BlcmNlbnRDb21wbGV0ZX19JTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGksJ3NmJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS1JbnZhbGlkIGZpbGUgbGlzdC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyB0ZXh0LWRhbmdlciBhZnUtaW52YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IG5hIG9mIG5vdEFsbG93ZWRMaXN0O2xldCBqPWluZGV4XCI+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyB0ZXh0T3ZlcmZsb3dcIj48c3Bhbj57e25hWydmaWxlTmFtZSddfX08L3NwYW4+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7bmFbJ2ZpbGVTaXplJ119fSk8L3N0cm9uZz48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBcIj57e25hWydlcnJvck1zZyddfX08L3A+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJjb2wteHMtMSBkZWxGaWxlSWNvblwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlRmlsZShqLCduYScpXCIgKm5nSWY9XCJ1cGxvYWRDbGlja1wiPiZuYnNwOzxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9hPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHAgKm5nSWY9XCJ1cGxvYWRNc2dcIiBjbGFzcz1cInt7dXBsb2FkTXNnQ2xhc3N9fSArIGFmdS11cGxvYWQtc3RhdHVzXCI+e3t1cGxvYWRNc2dUZXh0fX08cD5cclxuICAgIDxkaXYgKm5nSWY9XCIhc2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtNCBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgYWZ1LXVwbG9hZC1idG5cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiBbZGlzYWJsZWRdPSF1cGxvYWRCdG4+e3t1cGxvYWRCdG5UZXh0fX08L2J1dHRvbj5cclxuICAgIDxicj5cclxuPC9kaXY+XHJcblxyXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIEFUVEFDSCBQSU4gVEhFTUUgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8tLT5cclxuPGRpdiAqbmdJZj1cInRoZW1lID09ICdhdHRhY2hQaW4nXCIgaWQ9XCJhdHRhY2hQaW5cIj5cclxuICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XHJcbiAgICAgICAgPGEgY2xhc3M9J2J0biB1cF9idG4gYWZ1LWF0dGFjaC1waW4nIChjbGljayk9XCJhdHRhY2hwaW5PbmNsaWNrKClcIj5cclxuICAgICAgICAgICAge3thdHRhY2hQaW5UZXh0fX1cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwhLS0gPHAgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj4oe3tmb3JtYXRzQWxsb3dlZH19KSBTaXplIGxpbWl0LSB7eyhjb252ZXJ0U2l6ZShtYXhTaXplICogMTAyNDAwMCkpfX08L3A+IC0tPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHRpdGxlPVwiU2VsZWN0IGZpbGVcIiBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkXHJcbiAgICAgICAgICAgICAgICBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgJm5ic3A7XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBEUkFHIE4gRFJPUCBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxyXG48IS0tIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCI+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cclxuICAgIDxkaXYgaWQ9XCJkaXYxXCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XHJcbiAgICAgIDxwPkRyYWcgTiBEcm9wPC9wPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PiAtLT5gICxcclxuICBzdHlsZXM6IFtgLmNvbnN0cmFpbnRzLWluZm97bWFyZ2luLXRvcDoxMHB4O2ZvbnQtc3R5bGU6aXRhbGljfS5wYWRNYXJne3BhZGRpbmc6MDttYXJnaW4tYm90dG9tOjB9LmNhcHRpb257bWFyZ2luLXJpZ2h0OjVweH0udGV4dE92ZXJmbG93e3doaXRlLXNwYWNlOm5vd3JhcDtwYWRkaW5nLXJpZ2h0OjA7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXN9LnVwX2J0bntjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyOjJweCBzb2xpZCAjNWM1YjViO2JvcmRlci1yYWRpdXM6MjJweH0uZGVsRmlsZUljb257dGV4dC1kZWNvcmF0aW9uOm5vbmU7Y29sb3I6I2NlMDkwOX0uZHJhZ05Ecm9wIC5kaXYxe2Rpc3BsYXk6Ym9yZGVyLWJveDtib3JkZXI6MnB4IGRhc2hlZCAjNWM1YjViO2hlaWdodDo2cmVtO3dpZHRoOjIwcmVtfS5kcmFnTkRyb3AgLmRpdjE+cHt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXdlaWdodDo3MDA7Y29sb3I6IzVjNWI1YjttYXJnaW4tdG9wOjEuNGVtfS5kcmFnTkRyb3BCdG1QYWR7cGFkZGluZy1ib3R0b206MnJlbX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjYyMHB4KXsuY2FwdGlvbntwYWRkaW5nOjB9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NTEwcHgpey5zaXplQ3t3aWR0aDoyNSV9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MjYwcHgpey5jYXB0aW9uLC5zaXplQ3tmb250LXNpemU6MTBweH19LnJlc2V0QnRue21hcmdpbi1sZWZ0OjNweH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogYW55ID0ge307XHJcbiAgQElucHV0KClcclxuICByZXNldFVwbG9hZDogYm9vbGVhbiA9IHRoaXMuY29uZmlnW1wicmVzZXRVcGxvYWRcIl07XHJcbiAgQE91dHB1dCgpXHJcbiAgQXBpUmVzcG9uc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHRoZW1lOiBzdHJpbmc7XHJcbiAgaWQ6IG51bWJlcjtcclxuICBoaWRlUHJvZ3Jlc3NCYXI6IGJvb2xlYW47XHJcbiAgbWF4U2l6ZTogbnVtYmVyO1xyXG4gIHVwbG9hZEFQSTogc3RyaW5nO1xyXG4gIGZvcm1hdHNBbGxvd2VkOiBzdHJpbmc7XHJcbiAgbXVsdGlwbGU6IGJvb2xlYW47XHJcbiAgaGVhZGVyczogYW55O1xyXG4gIGhpZGVSZXNldEJ0bjogYm9vbGVhbjtcclxuICBoaWRlU2VsZWN0QnRuOiBib29sZWFuO1xyXG4gIGF0dGFjaFBpblRleHQ6IHN0cmluZztcclxuICB1cGxvYWRCdG5UZXh0OiBzdHJpbmc7XHJcblxyXG4gIGlkRGF0ZTogbnVtYmVyID0gK25ldyBEYXRlKCk7XHJcbiAgcmVnOiBSZWdFeHAgPSAvKD86XFwuKFteLl0rKSk/JC87XHJcbiAgc2VsZWN0ZWRGaWxlczogQXJyYXk8YW55PiA9IFtdO1xyXG4gIG5vdEFsbG93ZWRMaXN0OiBBcnJheTxPYmplY3Q+ID0gW107XHJcbiAgQ2FwdGlvbjogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gIHNpbmdsZUZpbGUgPSB0cnVlO1xyXG4gIHByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xyXG4gIHVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gIHVwbG9hZE1zZyA9IGZhbHNlO1xyXG4gIGFmdGVyVXBsb2FkID0gZmFsc2U7XHJcbiAgdXBsb2FkQ2xpY2sgPSB0cnVlO1xyXG4gIHVwbG9hZE1zZ1RleHQ6IHN0cmluZztcclxuICB1cGxvYWRNc2dDbGFzczogc3RyaW5nO1xyXG4gIHBlcmNlbnRDb21wbGV0ZTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJpZDogXCIsdGhpcy5pZCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiaWREYXRlOiBcIix0aGlzLmlkRGF0ZSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKE1hdGgucmFuZG9tKCkpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMocnN0OiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAocnN0W1wiY29uZmlnXCJdKSB7XHJcbiAgICAgIHRoaXMudGhlbWUgPSB0aGlzLmNvbmZpZ1tcInRoZW1lXCJdIHx8IFwiXCI7XHJcbiAgICAgIHRoaXMuaWQgPVxyXG4gICAgICAgIHRoaXMuY29uZmlnW1wiaWRcIl0gfHxcclxuICAgICAgICBwYXJzZUludCgodGhpcy5pZERhdGUgLyAxMDAwMCkudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0pICtcclxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwKSAqIDEwMDAwO1xyXG4gICAgICB0aGlzLmhpZGVQcm9ncmVzc0JhciA9IHRoaXMuY29uZmlnW1wiaGlkZVByb2dyZXNzQmFyXCJdIHx8IGZhbHNlO1xyXG4gICAgICB0aGlzLmhpZGVSZXNldEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVJlc2V0QnRuXCJdIHx8IGZhbHNlO1xyXG4gICAgICB0aGlzLmhpZGVTZWxlY3RCdG4gPSB0aGlzLmNvbmZpZ1tcImhpZGVTZWxlY3RCdG5cIl0gfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuVGV4dCA9IHRoaXMuY29uZmlnW1widXBsb2FkQnRuVGV4dFwiXSB8fCBcIsOYwqjDmMKnw5jCscOawq/DmMKyw5jCp8OYwrHDm8KMXCI7XHJcbiAgICAgIHRoaXMubWF4U2l6ZSA9IHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSB8fCAyMDtcclxuICAgICAgdGhpcy51cGxvYWRBUEkgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcInVybFwiXTtcclxuICAgICAgdGhpcy5mb3JtYXRzQWxsb3dlZCA9XHJcbiAgICAgICAgdGhpcy5jb25maWdbXCJmb3JtYXRzQWxsb3dlZFwiXSB8fCBcIi5qcGcsLnBuZywucGRmLC5kb2N4LC50eHQsLmdpZiwuanBlZ1wiO1xyXG4gICAgICB0aGlzLm11bHRpcGxlID0gdGhpcy5jb25maWdbXCJtdWx0aXBsZVwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy5oZWFkZXJzID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJoZWFkZXJzXCJdIHx8IHt9O1xyXG4gICAgICB0aGlzLmF0dGFjaFBpblRleHQgPVxyXG4gICAgICAgIHRoaXMuY29uZmlnW1wiYXR0YWNoUGluVGV4dFwiXSB8fCBcIkF0dGFjaCBzdXBwb3J0aW5nIGRvY3VtZW50cy4uXCI7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJjb25maWc6IFwiLCB0aGlzLmNvbmZpZyk7XHJcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5jb25maWdbXCJtYXhTaXplXCJdKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmhlYWRlcnMpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwicnN0OiBcIiwgcnN0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0pIHtcclxuICAgICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMucmVzZXRGaWxlVXBsb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIklkOiBcIiwgdGhpcy5pZCk7XHJcbiAgICB0aGlzLnJlc2V0VXBsb2FkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXNldEZpbGVVcGxvYWQoKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xyXG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xyXG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcclxuICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZShldmVudDogYW55KSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMubWF4U2l6ZSArIHRoaXMuZm9ybWF0c0FsbG93ZWQgKyB0aGlzLm11bHRpcGxlKTtcclxuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcclxuICAgIC8vY29uc29sZS5sb2coXCJvbmNoYW5nZSBoaXRcIik7XHJcbiAgICBpZiAodGhpcy5hZnRlclVwbG9hZCB8fCAhdGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgICAgdGhpcy5DYXB0aW9uID0gW107XHJcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vRk9STUFUUyBBTExPV0VEIExJU1RcclxuICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVRTIEFMTE9XRUQgTElTVD0gXCIrdGhpcy5mb3JtYXRzQWxsb3dlZCk7XHJcbiAgICAvL05PIE9GIEZPUk1BVFMgQUxMT1dFRFxyXG4gICAgbGV0IGZvcm1hdHNDb3VudDogYW55O1xyXG4gICAgZm9ybWF0c0NvdW50ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5tYXRjaChuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpKTtcclxuICAgIGZvcm1hdHNDb3VudCA9IGZvcm1hdHNDb3VudC5sZW5ndGg7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTk8gT0YgRk9STUFUUyBBTExPV0VEPSBcIitmb3JtYXRzQ291bnQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcblxyXG4gICAgLy9JVEVSQVRFIFNFTEVDVEVEIEZJTEVTXHJcbiAgICBsZXQgZmlsZTogRmlsZUxpc3Q7XHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PSBcImRyb3BcIikge1xyXG4gICAgICBmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogZHJvcFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXMgfHwgZXZlbnQuc3JjRWxlbWVudC5maWxlcztcclxuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGNoYW5nZVwiKTtcclxuICAgIH1cclxuICAgIC8vY29uc29sZS5sb2coZmlsZSk7XHJcbiAgICBsZXQgY3VycmVudEZpbGVFeHQ6IGFueTtcclxuICAgIGxldCBleHQ6IGFueTtcclxuICAgIGxldCBmcm10QWxsb3dlZDogYm9vbGVhbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvL0NIRUNLIEZPUk1BVFxyXG4gICAgICAvL0NVUlJFTlQgRklMRSBFWFRFTlNJT05cclxuICAgICAgY3VycmVudEZpbGVFeHQgPSB0aGlzLnJlZy5leGVjKGZpbGVbaV0ubmFtZSk7XHJcbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gY3VycmVudEZpbGVFeHRbMV07XHJcbiAgICAgIC8vY29uc29sZS5sb2coZmlsZVtpXS5uYW1lKTtcclxuICAgICAgZnJtdEFsbG93ZWQgPSBmYWxzZTtcclxuICAgICAgLy9GT1JNQVQgQUxMT1dFRCBMSVNUIElURVJBVEVcclxuICAgICAgZm9yIChsZXQgaiA9IGZvcm1hdHNDb3VudDsgaiA+IDA7IGotLSkge1xyXG4gICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTElTVCAoXCIraitcIik9IFwiK2V4dC5zcGxpdChcIixcIilbMF0pO1xyXG4gICAgICAgIGlmIChqID09IGZvcm1hdHNDb3VudCkge1xyXG4gICAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal0gKyBcIixcIjtcclxuICAgICAgICB9IC8vY2hlY2sgZm9ybWF0XHJcbiAgICAgICAgaWYgKGN1cnJlbnRGaWxlRXh0LnRvTG93ZXJDYXNlKCkgPT0gZXh0LnNwbGl0KFwiLFwiKVswXSkge1xyXG4gICAgICAgICAgZnJtdEFsbG93ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZybXRBbGxvd2VkKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBBTExPV0VEXCIpO1xyXG4gICAgICAgIC8vQ0hFQ0sgU0laRVxyXG4gICAgICAgIGlmIChmaWxlW2ldLnNpemUgPiB0aGlzLm1heFNpemUgKiAxMDI0MDAwKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU0laRSBOT1QgQUxMT1dFRCAoXCIrZmlsZVtpXS5zaXplK1wiKVwiKTtcclxuICAgICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXHJcbiAgICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXHJcbiAgICAgICAgICAgIGVycm9yTXNnOiBcIsOYwq3DmMKsw5nChSDDmcKBw5jCp8ObwozDmcKEIMOYwrXDmMKtw5vCjMOYwq0gw5nChsObwozDmMKzw5jCqlwiXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL2Zvcm1hdCBhbGxvd2VkIGFuZCBzaXplIGFsbG93ZWQgdGhlbiBhZGQgZmlsZSB0byBzZWxlY3RlZEZpbGUgYXJyYXlcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5wdXNoKGZpbGVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIE5PVCBBTExPV0VEXCIpO1xyXG4gICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XHJcbiAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxyXG4gICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcclxuICAgICAgICAgIGVycm9yTXNnOiBcIsOZwoHDmMKxw5nChcOYwqogw5nCgcOYwqfDm8KMw5nChCDDmMK1w5jCrcObwozDmMKtIMOZwobDm8KMw5jCs8OYwqpcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSB0cnVlO1xyXG4gICAgICBpZiAodGhpcy50aGVtZSA9PSBcImF0dGFjaFBpblwiKSB0aGlzLnVwbG9hZEZpbGVzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcclxuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSB0cnVlO1xyXG4gICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwO1xyXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwbG9hZEZpbGVzKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkRmlsZXMpO1xyXG5cclxuICAgIGxldCBpOiBhbnk7XHJcbiAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IHRydWU7XHJcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XHJcbiAgICBsZXQgaXNFcnJvciA9IGZhbHNlO1xyXG5cclxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMuQ2FwdGlvbltpXSA9PSB1bmRlZmluZWQpIFxyXG4gICAgICAgIHRoaXMuQ2FwdGlvbltpXSA9IFwiw5nCgcOYwqfDm8KMw5nChFwiICsgaTtcclxuICAgICAgLy9BZGQgREFUQSBUTyBCRSBTRU5UXHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcclxuICAgICAgICB0aGlzLkNhcHRpb25baV0sXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzW2ldIC8qLCB0aGlzLnNlbGVjdGVkRmlsZXNbaV0ubmFtZSovXHJcbiAgICAgICk7XHJcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzW2ldK1wie1wiK3RoaXMuQ2FwdGlvbltpXStcIiAoQ2FwdGlvbil9XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpID4gMSkge1xyXG4gICAgICB0aGlzLnNpbmdsZUZpbGUgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGV2bnQgPT4ge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwib25yZWFkeVwiKTtcclxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgaXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCLDmMKuw5jCt8OYwqcgw5jCr8OYwrEgw5jCqMOYwqfDmMKxw5rCr8OYwrLDmMKnw5jCscObwowgIVwiO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dDbGFzcyA9IFwidGV4dC1kYW5nZXIgbGVhZFwiO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQpO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5BcGlSZXNwb25zZS5lbWl0KHhocik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZudCA9PiB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7IC8vIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQgYnkgcHJvY2VzcyB1cGxvYWRpbmdcclxuICAgICAgaWYgKGV2bnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gTWF0aC5yb3VuZCgoZXZudC5sb2FkZWQgLyBldm50LnRvdGFsKSAqIDEwMCk7XHJcbiAgICAgIH1cclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlByb2dyZXNzLi4uXCIvKit0aGlzLnBlcmNlbnRDb21wbGV0ZStcIiAlXCIqLyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vbmxvYWQgPSBldm50ID0+IHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ubG9hZFwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcclxuICAgICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gdHJ1ZTtcclxuICAgICAgaWYgKCFpc0Vycm9yKSB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCLDmMKow5jCpyDDmcKFw5nCiMOZwoHDmcKCw5vCjMOYwqogw5jCqMOYwqfDmMKxw5rCr8OYwrLDmMKnw5jCscObwowgw5jCtMOYwq8gIVwiO1xyXG4gICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtc3VjY2VzcyBsZWFkXCI7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQgKyBcIiBcIiArIHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggKyBcIiBmaWxlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vbmVycm9yID0gZXZudCA9PiB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmVycm9yXCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICB4aHIub3BlbihcIlBPU1RcIiwgdGhpcy51cGxvYWRBUEksIHRydWUpO1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5oZWFkZXJzKSkge1xyXG4gICAgICAvLyBPYmplY3Qua2V5cyB3aWxsIGdpdmUgYW4gQXJyYXkgb2Yga2V5c1xyXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHRoaXMuaGVhZGVyc1trZXldKTtcclxuICAgIH1cclxuICAgIC8vbGV0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xyXG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvcGxhaW47Y2hhcnNldD1VVEYtOFwiKTtcclxuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7dG9rZW59YCk7XHJcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVGaWxlKGk6IGFueSwgc2ZfbmE6IGFueSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInJlbW92ZSBmaWxlIGNsaWNrZWQgXCIgKyBpKVxyXG4gICAgaWYgKHNmX25hID09IFwic2ZcIikge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICB0aGlzLkNhcHRpb24uc3BsaWNlKGksIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29udmVydFNpemUoZmlsZVNpemU6IG51bWJlcikge1xyXG4gICAgLy9jb25zb2xlLmxvZyhmaWxlU2l6ZSArIFwiIC0gXCIrIHN0cik7XHJcbiAgICByZXR1cm4gZmlsZVNpemUgPCAxMDI0MDAwXHJcbiAgICAgID8gKGZpbGVTaXplIC8gMTAyNCkudG9GaXhlZCgyKSArIFwiIEtCXCJcclxuICAgICAgOiAoZmlsZVNpemUgLyAxMDI0MDAwKS50b0ZpeGVkKDIpICsgXCIgTUJcIjtcclxuICB9XHJcblxyXG4gIGF0dGFjaHBpbk9uY2xpY2soKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiSUQ6IFwiLCB0aGlzLmlkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsXCIgKyB0aGlzLmlkKSEuY2xpY2soKTtcclxuICAgIC8vJChcIiNcIitcInNlbFwiK3RoaXMuaWQpLmNsaWNrKCk7XHJcbiAgfVxyXG5cclxuICBkcm9wKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImRyb3A6IFwiLCBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpO1xyXG4gICAgdGhpcy5vbkNoYW5nZShldmVudCk7XHJcbiAgfVxyXG4gIGFsbG93RHJvcChldmVudDogYW55KSB7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImFsbG93RHJvcDogXCIsZXZlbnQpXHJcbiAgfVxyXG59XHJcblxyXG4vKiBpbnRlcmZhY2UgQ09ORklHIHtcclxuICB1cGxvYWRBUEk6IHN0cmluZztcclxuICBtdWx0aXBsZT86IGJvb2xlYW47XHJcbiAgZm9ybWF0c0FsbG93ZWQ/OiBzdHJpbmc7XHJcbiAgbWF4U2l6ZT86IG51bWJlcjtcclxuICBpZD86IG51bWJlcjtcclxuICByZXNldFVwbG9hZD86IGJvb2xlYW47XHJcbiAgdGhlbWU/OiBzdHJpbmc7XHJcbiAgaGlkZVByb2dyZXNzQmFyPzogYm9vbGVhbjtcclxuIH1cclxuICovIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogW0FuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyTW9kdWxlIHsgfVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0lBT0UsaUJBQWlCOzs7WUFMbEIsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7QUNKRDtJQW1IRTtRQWxDQSxXQUFNLEdBQVEsRUFBRSxDQUFDO1FBRWpCLGdCQUFXLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRCxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFlakMsV0FBTSxHQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM3QixRQUFHLEdBQVcsaUJBQWlCLENBQUM7UUFDaEMsa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFDL0IsbUJBQWMsR0FBa0IsRUFBRSxDQUFDO1FBQ25DLFlBQU8sR0FBa0IsRUFBRSxDQUFDO1FBQzVCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFXLEdBQUcs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