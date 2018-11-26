/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
export class AngularFileUploaderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUF1RCxNQUFNLGVBQWUsQ0FBQztBQStFcEksTUFBTTtJQW9DSjtRQWxDQSxXQUFNLEdBQVEsRUFBRSxDQUFDO1FBRWpCLGdCQUFXLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRCxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFlakMsV0FBTSxHQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM3QixRQUFHLEdBQVcsaUJBQWlCLENBQUM7UUFDaEMsa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFDL0IsbUJBQWMsR0FBa0IsRUFBRSxDQUFDO1FBQ25DLFlBQU8sR0FBa0IsRUFBRSxDQUFDO1FBQzVCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBTWpCLDhCQUE4QjtRQUM5QixzQ0FBc0M7UUFDdEMsNkJBQTZCO0lBQy9CLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLEdBQWtCO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsRUFBRTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUM7WUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQztZQUN6RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyxDQUFDO1lBQzNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUM7WUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLGNBQWM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxzQ0FBc0MsQ0FBQztZQUMxRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekQsSUFBSSxDQUFDLGFBQWE7Z0JBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksK0JBQStCLENBQUM7WUFDbEUsdUNBQXVDO1lBQ3ZDLHNDQUFzQztZQUN0Qyw0QkFBNEI7WUFDNUIsNEJBQTRCO1FBQzlCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQzs7OztJQUVELFFBQVE7UUFDTiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQzs7OztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDOzs7OztJQUVELFFBQVEsQ0FBQyxLQUFVO1FBQ2pCLGtFQUFrRTtRQUNsRSxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6Qiw4QkFBOEI7UUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzNCLENBQUM7Ozs7O1lBSUcsWUFBaUI7UUFDckIsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDOzs7OztZQUsvQixJQUFjO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDaEMsNEJBQTRCO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUNwRCw4QkFBOEI7UUFDaEMsQ0FBQzs7O1lBRUcsY0FBbUI7O1lBQ25CLEdBQVE7O1lBQ1IsV0FBb0I7UUFDeEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckMsY0FBYztZQUNkLHdCQUF3QjtZQUN4QixjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLGNBQWMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsNEJBQTRCO1lBQzVCLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDcEIsNkJBQTZCO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3RDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMseURBQXlEO2dCQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDaEQsQ0FBQyxDQUFDLGNBQWM7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztZQUNILENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixnQ0FBZ0M7Z0JBQ2hDLFlBQVk7Z0JBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzFDLHFEQUFxRDtvQkFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7d0JBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTt3QkFDdEIsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDeEMsUUFBUSxFQUFFLG9CQUFvQjtxQkFDL0IsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQztnQkFDWCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLHFFQUFxRTtvQkFDckUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sb0NBQW9DO2dCQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUN4QyxRQUFRLEVBQUUscUJBQXFCO2lCQUNoQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDO1lBQ1gsQ0FBQztRQUNILENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDO2dCQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN6QixDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1Qsa0NBQWtDOzs7WUFFOUIsQ0FBTTtRQUNWLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztZQUNyQixPQUFPLEdBQUcsS0FBSzs7WUFFZixHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUU7O1lBQzFCLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRTtRQUU3QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO2dCQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDL0IscUJBQXFCO1lBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDZixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUN2RCxDQUFDO1lBQ0YsdUVBQXVFO1FBQ3pFLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzFCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDOUIseUJBQXlCO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNmLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO29CQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLG1CQUFtQixDQUFDO29CQUN6QyxJQUFJLENBQUMsY0FBYyxHQUFHLGtCQUFrQixDQUFDO29CQUN6QyxrQ0FBa0M7b0JBQ2xDLG9CQUFvQjtnQkFDdEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxpREFBaUQ7WUFDekUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUNELDJEQUEyRDtRQUM3RCxDQUFDLENBQUM7UUFFRixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ2xCLHdCQUF3QjtZQUN4QixvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxhQUFhLEdBQUcseUJBQXlCLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUcsbUJBQW1CLENBQUM7Z0JBQzFDLDhFQUE4RTtZQUNoRixDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRTtZQUNuQix5QkFBeUI7WUFDekIsb0JBQW9CO1FBQ3RCLENBQUMsQ0FBQztRQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLHlDQUF5QztZQUN6QyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0QsOENBQThDO1FBQzlDLG1FQUFtRTtRQUNuRSwyREFBMkQ7UUFDM0QsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFFRCxVQUFVLENBQUMsQ0FBTSxFQUFFLEtBQVU7UUFDM0IseUNBQXlDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxRQUFnQjtRQUMxQixxQ0FBcUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSztZQUN0QyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUM5QyxDQUFDOzs7O0lBRUQsZ0JBQWdCO1FBQ2QsK0JBQStCO1FBQy9CLG1CQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xELCtCQUErQjtJQUNqQyxDQUFDOzs7OztJQUVELElBQUksQ0FBQyxLQUFVO1FBQ2IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QiwrQkFBK0I7UUFDL0Isa0RBQWtEO1FBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFDRCxTQUFTLENBQUMsS0FBVTtRQUNsQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN2QyxrQ0FBa0M7SUFDcEMsQ0FBQzs7O1lBelhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0F5RUQ7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsa3ZCQUFrdkIsQ0FBQzthQUM3dkI7Ozs7cUJBRUUsS0FBSzswQkFFTCxLQUFLOzBCQUVMLE1BQU07Ozs7SUFKUCw4Q0FDaUI7O0lBQ2pCLG1EQUNrRDs7SUFDbEQsbURBQ2lDOztJQUVqQyw2Q0FBYzs7SUFDZCwwQ0FBVzs7SUFDWCx1REFBeUI7O0lBQ3pCLCtDQUFnQjs7SUFDaEIsaURBQWtCOztJQUNsQixzREFBdUI7O0lBQ3ZCLGdEQUFrQjs7SUFDbEIsK0NBQWE7O0lBQ2Isb0RBQXNCOztJQUN0QixxREFBdUI7O0lBQ3ZCLHFEQUFzQjs7SUFDdEIscURBQXNCOztJQUV0Qiw4Q0FBNkI7O0lBQzdCLDJDQUFnQzs7SUFDaEMscURBQStCOztJQUMvQixzREFBbUM7O0lBQ25DLCtDQUE0Qjs7SUFDNUIsa0RBQWtCOztJQUNsQix1REFBd0I7O0lBQ3hCLGlEQUFrQjs7SUFDbEIsaURBQWtCOztJQUNsQixtREFBb0I7O0lBQ3BCLG1EQUFtQjs7SUFDbkIscURBQXNCOztJQUN0QixzREFBdUI7O0lBQ3ZCLHVEQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgSW5qZWN0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJhbmd1bGFyLWZpbGUtdXBsb2FkZXJcIixcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiAqbmdJZj1cIih0aGVtZSAhPT0gJ2F0dGFjaFBpbicpXCIgaWQ9XCJkZWZhdWx0XCI+XHJcblxyXG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBTdGFydHMgLS0+XHJcbiAgICA8ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2RyYWdORHJvcCdcIiBpZD1cImRyYWdORHJvcFwiIFtuZ0NsYXNzXT1cIihoaWRlU2VsZWN0QnRuICYmIGhpZGVSZXNldEJ0bikgPyBudWxsIDogJ2RyYWdORHJvcEJ0bVBhZCdcIiBjbGFzcz1cImRyYWdORHJvcFwiPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtcIj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImRpdjFcIiBjbGFzcz1cImRpdjEgYWZ1LWRyYWduZHJvcC1ib3hcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWZ1LWRyYWduZHJvcC10ZXh0XCI+RHJhZyBOIERyb3A8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8IS0tIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj4gLS0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgRW5kcyAtLT5cclxuXHJcbiAgICA8bGFiZWwgZm9yPVwic2Vse3tpZH19XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIGFmdS1zZWxlY3QtYnRuXCIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPtin2YbYqtiu2KfYqCDZgdin24zZhDxzcGFuICpuZ0lmPVwibXVsdGlwbGVcIj4g2YfYpyA8L3NwYW4+PC9sYWJlbD5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHRpdGxlPVwi2KfZhtiq2K7Yp9ioINmB2KfbjNmEXCJcclxuICAgICAgICBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXNtIHJlc2V0QnRuIGFmdS1yZXNldC1idG5cIiAoY2xpY2spPVwicmVzZXRGaWxlVXBsb2FkKClcIiAqbmdJZj1cIiFoaWRlUmVzZXRCdG5cIj7Yrdiw2YEg2YfZhdmHPC9idXR0b24+XHJcbiAgICA8YnIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPlxyXG4gICAgPHAgY2xhc3M9XCJjb25zdHJhaW50cy1pbmZvIGFmdS1jb25zdHJhaW50cy1pbmZvXCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkg2YXYrdiv2YjYr9uM2Kog2YHYp9uM2YQgLSB7eyhjb252ZXJ0U2l6ZShtYXhTaXplICoxMDI0MDAwKSl9fTwvcD5cclxuICAgIDwhLS1TZWxlY3RlZCBmaWxlIGxpc3QtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgYWZ1LXZhbGlkLWZpbGVcIiAqbmdGb3I9XCJsZXQgc2Ygb2Ygc2VsZWN0ZWRGaWxlcztsZXQgaT1pbmRleFwiID5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5XCI+e3tzZi5uYW1lfX08L3NwYW4+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7Y29udmVydFNpemUoc2Yuc2l6ZSl9fSk8L3N0cm9uZz4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDs8L3A+XHJcbiAgICAgICAgPCEtLSAgPGlucHV0IGNsYXNzPVwiY29sLXhzLTMgcHJvZ3Jlc3MgY2FwdGlvblwiICB0eXBlPVwidGV4dFwiICBwbGFjZWhvbGRlcj1cIkNhcHRpb24uLlwiICBbKG5nTW9kZWwpXT1cIkNhcHRpb25baV1cIiAgKm5nSWY9XCJ1cGxvYWRDbGlja1wiLz4gLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy0zIHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiICpuZ0lmPVwic2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJjb2wteHMtMVwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlRmlsZShpLCdzZicpXCIgKm5nSWY9XCJ1cGxvYWRDbGlja1wiPjxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tSW52YWxpZCBmaWxlIGxpc3QtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgdGV4dC1kYW5nZXIgYWZ1LWludmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBuYSBvZiBub3RBbGxvd2VkTGlzdDtsZXQgaj1pbmRleFwiPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4+e3tuYVsnZmlsZU5hbWUnXX19PC9zcGFuPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e25hWydmaWxlU2l6ZSddfX0pPC9zdHJvbmc+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgXCI+e3tuYVsnZXJyb3JNc2cnXX19PC9wPlxyXG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTEgZGVsRmlsZUljb25cIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaiwnbmEnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxwICpuZ0lmPVwidXBsb2FkTXNnXCIgY2xhc3M9XCJ7e3VwbG9hZE1zZ0NsYXNzfX0gKyBhZnUtdXBsb2FkLXN0YXR1c1wiPnt7dXBsb2FkTXNnVGV4dH19PHA+XHJcbiAgICA8ZGl2ICpuZ0lmPVwiIXNpbmdsZUZpbGUgJiYgcHJvZ3Jlc3NCYXJTaG93ICYmICFoaWRlUHJvZ3Jlc3NCYXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTQgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6cGVyY2VudENvbXBsZXRlKyclJ31cIj57e3BlcmNlbnRDb21wbGV0ZX19JTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzIGFmdS11cGxvYWQtYnRuXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJ1cGxvYWRGaWxlcygpXCIgW2Rpc2FibGVkXT0hdXBsb2FkQnRuPnt7dXBsb2FkQnRuVGV4dH19PC9idXR0b24+XHJcbiAgICA8YnI+XHJcbjwvZGl2PlxyXG5cclxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBBVFRBQ0ggUElOIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XHJcbjxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnYXR0YWNoUGluJ1wiIGlkPVwiYXR0YWNoUGluXCI+XHJcbiAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxyXG4gICAgICAgIDxhIGNsYXNzPSdidG4gdXBfYnRuIGFmdS1hdHRhY2gtcGluJyAoY2xpY2spPVwiYXR0YWNocGluT25jbGljaygpXCI+XHJcbiAgICAgICAgICAgIHt7YXR0YWNoUGluVGV4dH19XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICA8IS0tIDxwIHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkgU2l6ZSBsaW1pdC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqIDEwMjQwMDApKX19PC9wPiAtLT5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJzZWx7e2lkfX1cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiB0aXRsZT1cIlNlbGVjdCBmaWxlXCIgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZFxyXG4gICAgICAgICAgICAgICAgW2F0dHIubXVsdGlwbGVdPVwibXVsdGlwbGUgPyAnJyA6IG51bGxcIiAvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgICZuYnNwO1xyXG4gICAgICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcbjwhLS0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gRFJBRyBOIERST1AgVEhFTUUgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8tLT5cclxuPCEtLSA8ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2RyYWdORHJvcCdcIiBpZD1cImRyYWdORHJvcFwiPlxyXG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XHJcbiAgICA8ZGl2IGlkPVwiZGl2MVwiIChkcm9wKT1cImRyb3AoJGV2ZW50KVwiIChkcmFnb3Zlcik9XCJhbGxvd0Ryb3AoJGV2ZW50KVwiPlxyXG4gICAgICA8cD5EcmFnIE4gRHJvcDwvcD5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj4gLS0+YCAsXHJcbiAgc3R5bGVzOiBbYC5jb25zdHJhaW50cy1pbmZve21hcmdpbi10b3A6MTBweDtmb250LXN0eWxlOml0YWxpY30ucGFkTWFyZ3twYWRkaW5nOjA7bWFyZ2luLWJvdHRvbTowfS5jYXB0aW9ue21hcmdpbi1yaWdodDo1cHh9LnRleHRPdmVyZmxvd3t3aGl0ZS1zcGFjZTpub3dyYXA7cGFkZGluZy1yaWdodDowO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS51cF9idG57Y29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O2JvcmRlcjoycHggc29saWQgIzVjNWI1Yjtib3JkZXItcmFkaXVzOjIycHh9LmRlbEZpbGVJY29ue3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNjZTA5MDl9LmRyYWdORHJvcCAuZGl2MXtkaXNwbGF5OmJvcmRlci1ib3g7Ym9yZGVyOjJweCBkYXNoZWQgIzVjNWI1YjtoZWlnaHQ6NnJlbTt3aWR0aDoyMHJlbX0uZHJhZ05Ecm9wIC5kaXYxPnB7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiM1YzViNWI7bWFyZ2luLXRvcDoxLjRlbX0uZHJhZ05Ecm9wQnRtUGFke3BhZGRpbmctYm90dG9tOjJyZW19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo2MjBweCl7LmNhcHRpb257cGFkZGluZzowfX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjUxMHB4KXsuc2l6ZUN7d2lkdGg6MjUlfX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjI2MHB4KXsuY2FwdGlvbiwuc2l6ZUN7Zm9udC1zaXplOjEwcHh9fS5yZXNldEJ0bnttYXJnaW4tbGVmdDozcHh9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KClcclxuICBjb25maWc6IGFueSA9IHt9O1xyXG4gIEBJbnB1dCgpXHJcbiAgcmVzZXRVcGxvYWQ6IGJvb2xlYW4gPSB0aGlzLmNvbmZpZ1tcInJlc2V0VXBsb2FkXCJdO1xyXG4gIEBPdXRwdXQoKVxyXG4gIEFwaVJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB0aGVtZTogc3RyaW5nO1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgaGlkZVByb2dyZXNzQmFyOiBib29sZWFuO1xyXG4gIG1heFNpemU6IG51bWJlcjtcclxuICB1cGxvYWRBUEk6IHN0cmluZztcclxuICBmb3JtYXRzQWxsb3dlZDogc3RyaW5nO1xyXG4gIG11bHRpcGxlOiBib29sZWFuO1xyXG4gIGhlYWRlcnM6IGFueTtcclxuICBoaWRlUmVzZXRCdG46IGJvb2xlYW47XHJcbiAgaGlkZVNlbGVjdEJ0bjogYm9vbGVhbjtcclxuICBhdHRhY2hQaW5UZXh0OiBzdHJpbmc7XHJcbiAgdXBsb2FkQnRuVGV4dDogc3RyaW5nO1xyXG5cclxuICBpZERhdGU6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xyXG4gIHJlZzogUmVnRXhwID0gLyg/OlxcLihbXi5dKykpPyQvO1xyXG4gIHNlbGVjdGVkRmlsZXM6IEFycmF5PGFueT4gPSBbXTtcclxuICBub3RBbGxvd2VkTGlzdDogQXJyYXk8T2JqZWN0PiA9IFtdO1xyXG4gIENhcHRpb246IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICBzaW5nbGVGaWxlID0gdHJ1ZTtcclxuICBwcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcclxuICB1cGxvYWRCdG4gPSBmYWxzZTtcclxuICB1cGxvYWRNc2cgPSBmYWxzZTtcclxuICBhZnRlclVwbG9hZCA9IGZhbHNlO1xyXG4gIHVwbG9hZENsaWNrID0gdHJ1ZTtcclxuICB1cGxvYWRNc2dUZXh0OiBzdHJpbmc7XHJcbiAgdXBsb2FkTXNnQ2xhc3M6IHN0cmluZztcclxuICBwZXJjZW50Q29tcGxldGU6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiaWQ6IFwiLHRoaXMuaWQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImlkRGF0ZTogXCIsdGhpcy5pZERhdGUpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhNYXRoLnJhbmRvbSgpKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKHJzdDogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKHJzdFtcImNvbmZpZ1wiXSkge1xyXG4gICAgICB0aGlzLnRoZW1lID0gdGhpcy5jb25maWdbXCJ0aGVtZVwiXSB8fCBcIlwiO1xyXG4gICAgICB0aGlzLmlkID1cclxuICAgICAgICB0aGlzLmNvbmZpZ1tcImlkXCJdIHx8XHJcbiAgICAgICAgcGFyc2VJbnQoKHRoaXMuaWREYXRlIC8gMTAwMDApLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdKSArXHJcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMCkgKiAxMDAwMDtcclxuICAgICAgdGhpcy5oaWRlUHJvZ3Jlc3NCYXIgPSB0aGlzLmNvbmZpZ1tcImhpZGVQcm9ncmVzc0JhclwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy5oaWRlUmVzZXRCdG4gPSB0aGlzLmNvbmZpZ1tcImhpZGVSZXNldEJ0blwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy5oaWRlU2VsZWN0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlU2VsZWN0QnRuXCJdIHx8IGZhbHNlO1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0blRleHQgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEJ0blRleHRcIl0gfHwgXCLYqNin2LHar9iy2KfYsduMXCI7XHJcbiAgICAgIHRoaXMubWF4U2l6ZSA9IHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSB8fCAyMDtcclxuICAgICAgdGhpcy51cGxvYWRBUEkgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcInVybFwiXTtcclxuICAgICAgdGhpcy5mb3JtYXRzQWxsb3dlZCA9XHJcbiAgICAgICAgdGhpcy5jb25maWdbXCJmb3JtYXRzQWxsb3dlZFwiXSB8fCBcIi5qcGcsLnBuZywucGRmLC5kb2N4LC50eHQsLmdpZiwuanBlZ1wiO1xyXG4gICAgICB0aGlzLm11bHRpcGxlID0gdGhpcy5jb25maWdbXCJtdWx0aXBsZVwiXSB8fCBmYWxzZTtcclxuICAgICAgdGhpcy5oZWFkZXJzID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJoZWFkZXJzXCJdIHx8IHt9O1xyXG4gICAgICB0aGlzLmF0dGFjaFBpblRleHQgPVxyXG4gICAgICAgIHRoaXMuY29uZmlnW1wiYXR0YWNoUGluVGV4dFwiXSB8fCBcIkF0dGFjaCBzdXBwb3J0aW5nIGRvY3VtZW50cy4uXCI7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJjb25maWc6IFwiLCB0aGlzLmNvbmZpZyk7XHJcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5jb25maWdbXCJtYXhTaXplXCJdKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmhlYWRlcnMpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwicnN0OiBcIiwgcnN0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0pIHtcclxuICAgICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMucmVzZXRGaWxlVXBsb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIklkOiBcIiwgdGhpcy5pZCk7XHJcbiAgICB0aGlzLnJlc2V0VXBsb2FkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXNldEZpbGVVcGxvYWQoKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xyXG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xyXG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcclxuICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZShldmVudDogYW55KSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMubWF4U2l6ZSArIHRoaXMuZm9ybWF0c0FsbG93ZWQgKyB0aGlzLm11bHRpcGxlKTtcclxuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcclxuICAgIC8vY29uc29sZS5sb2coXCJvbmNoYW5nZSBoaXRcIik7XHJcbiAgICBpZiAodGhpcy5hZnRlclVwbG9hZCB8fCAhdGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgICAgdGhpcy5DYXB0aW9uID0gW107XHJcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vRk9STUFUUyBBTExPV0VEIExJU1RcclxuICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVRTIEFMTE9XRUQgTElTVD0gXCIrdGhpcy5mb3JtYXRzQWxsb3dlZCk7XHJcbiAgICAvL05PIE9GIEZPUk1BVFMgQUxMT1dFRFxyXG4gICAgbGV0IGZvcm1hdHNDb3VudDogYW55O1xyXG4gICAgZm9ybWF0c0NvdW50ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5tYXRjaChuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpKTtcclxuICAgIGZvcm1hdHNDb3VudCA9IGZvcm1hdHNDb3VudC5sZW5ndGg7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTk8gT0YgRk9STUFUUyBBTExPV0VEPSBcIitmb3JtYXRzQ291bnQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcblxyXG4gICAgLy9JVEVSQVRFIFNFTEVDVEVEIEZJTEVTXHJcbiAgICBsZXQgZmlsZTogRmlsZUxpc3Q7XHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PSBcImRyb3BcIikge1xyXG4gICAgICBmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogZHJvcFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXMgfHwgZXZlbnQuc3JjRWxlbWVudC5maWxlcztcclxuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGNoYW5nZVwiKTtcclxuICAgIH1cclxuICAgIC8vY29uc29sZS5sb2coZmlsZSk7XHJcbiAgICBsZXQgY3VycmVudEZpbGVFeHQ6IGFueTtcclxuICAgIGxldCBleHQ6IGFueTtcclxuICAgIGxldCBmcm10QWxsb3dlZDogYm9vbGVhbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvL0NIRUNLIEZPUk1BVFxyXG4gICAgICAvL0NVUlJFTlQgRklMRSBFWFRFTlNJT05cclxuICAgICAgY3VycmVudEZpbGVFeHQgPSB0aGlzLnJlZy5leGVjKGZpbGVbaV0ubmFtZSk7XHJcbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gY3VycmVudEZpbGVFeHRbMV07XHJcbiAgICAgIC8vY29uc29sZS5sb2coZmlsZVtpXS5uYW1lKTtcclxuICAgICAgZnJtdEFsbG93ZWQgPSBmYWxzZTtcclxuICAgICAgLy9GT1JNQVQgQUxMT1dFRCBMSVNUIElURVJBVEVcclxuICAgICAgZm9yIChsZXQgaiA9IGZvcm1hdHNDb3VudDsgaiA+IDA7IGotLSkge1xyXG4gICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTElTVCAoXCIraitcIik9IFwiK2V4dC5zcGxpdChcIixcIilbMF0pO1xyXG4gICAgICAgIGlmIChqID09IGZvcm1hdHNDb3VudCkge1xyXG4gICAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal0gKyBcIixcIjtcclxuICAgICAgICB9IC8vY2hlY2sgZm9ybWF0XHJcbiAgICAgICAgaWYgKGN1cnJlbnRGaWxlRXh0LnRvTG93ZXJDYXNlKCkgPT0gZXh0LnNwbGl0KFwiLFwiKVswXSkge1xyXG4gICAgICAgICAgZnJtdEFsbG93ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZybXRBbGxvd2VkKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBBTExPV0VEXCIpO1xyXG4gICAgICAgIC8vQ0hFQ0sgU0laRVxyXG4gICAgICAgIGlmIChmaWxlW2ldLnNpemUgPiB0aGlzLm1heFNpemUgKiAxMDI0MDAwKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU0laRSBOT1QgQUxMT1dFRCAoXCIrZmlsZVtpXS5zaXplK1wiKVwiKTtcclxuICAgICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXHJcbiAgICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXHJcbiAgICAgICAgICAgIGVycm9yTXNnOiBcItit2KzZhSDZgdin24zZhCDYtdit24zYrSDZhtuM2LPYqlwiXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL2Zvcm1hdCBhbGxvd2VkIGFuZCBzaXplIGFsbG93ZWQgdGhlbiBhZGQgZmlsZSB0byBzZWxlY3RlZEZpbGUgYXJyYXlcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5wdXNoKGZpbGVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIE5PVCBBTExPV0VEXCIpO1xyXG4gICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XHJcbiAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxyXG4gICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcclxuICAgICAgICAgIGVycm9yTXNnOiBcItmB2LHZhdiqINmB2KfbjNmEINi12K3bjNitINmG24zYs9iqXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gdHJ1ZTtcclxuICAgICAgaWYgKHRoaXMudGhlbWUgPT0gXCJhdHRhY2hQaW5cIikgdGhpcy51cGxvYWRGaWxlcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XHJcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gdHJ1ZTtcclxuICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gMDtcclxuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlcygpIHtcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzKTtcclxuXHJcbiAgICBsZXQgaTogYW55O1xyXG4gICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSB0cnVlO1xyXG4gICAgdGhpcy51cGxvYWRDbGljayA9IGZhbHNlO1xyXG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xyXG4gICAgbGV0IGlzRXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLkNhcHRpb25baV0gPT0gdW5kZWZpbmVkKSBcclxuICAgICAgICB0aGlzLkNhcHRpb25baV0gPSBcItmB2KfbjNmEXCIgKyBpO1xyXG4gICAgICAvL0FkZCBEQVRBIFRPIEJFIFNFTlRcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFxyXG4gICAgICAgIHRoaXMuQ2FwdGlvbltpXSxcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXNbaV0gLyosIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXS5uYW1lKi9cclxuICAgICAgKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkRmlsZXNbaV0rXCJ7XCIrdGhpcy5DYXB0aW9uW2ldK1wiIChDYXB0aW9uKX1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGkgPiAxKSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaW5nbGVGaWxlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZXZudCA9PiB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbnJlYWR5XCIpO1xyXG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcItiu2LfYpyDYr9ixINio2KfYsdqv2LLYp9ix24wgIVwiO1xyXG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dDbGFzcyA9IFwidGV4dC1kYW5nZXIgbGVhZFwiO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQpO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5BcGlSZXNwb25zZS5lbWl0KHhocik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZudCA9PiB7XHJcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7IC8vIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQgYnkgcHJvY2VzcyB1cGxvYWRpbmdcclxuICAgICAgaWYgKGV2bnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gTWF0aC5yb3VuZCgoZXZudC5sb2FkZWQgLyBldm50LnRvdGFsKSAqIDEwMCk7XHJcbiAgICAgIH1cclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlByb2dyZXNzLi4uXCIvKit0aGlzLnBlcmNlbnRDb21wbGV0ZStcIiAlXCIqLyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vbmxvYWQgPSBldm50ID0+IHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ubG9hZFwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcclxuICAgICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcclxuICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gdHJ1ZTtcclxuICAgICAgaWYgKCFpc0Vycm9yKSB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCLYqNinINmF2YjZgdmC24zYqiDYqNin2LHar9iy2KfYsduMINi02K8gIVwiO1xyXG4gICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtc3VjY2VzcyBsZWFkXCI7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQgKyBcIiBcIiArIHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggKyBcIiBmaWxlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHhoci5vbmVycm9yID0gZXZudCA9PiB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmVycm9yXCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICB4aHIub3BlbihcIlBPU1RcIiwgdGhpcy51cGxvYWRBUEksIHRydWUpO1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5oZWFkZXJzKSkge1xyXG4gICAgICAvLyBPYmplY3Qua2V5cyB3aWxsIGdpdmUgYW4gQXJyYXkgb2Yga2V5c1xyXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHRoaXMuaGVhZGVyc1trZXldKTtcclxuICAgIH1cclxuICAgIC8vbGV0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xyXG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvcGxhaW47Y2hhcnNldD1VVEYtOFwiKTtcclxuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7dG9rZW59YCk7XHJcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVGaWxlKGk6IGFueSwgc2ZfbmE6IGFueSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInJlbW92ZSBmaWxlIGNsaWNrZWQgXCIgKyBpKVxyXG4gICAgaWYgKHNmX25hID09IFwic2ZcIikge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICB0aGlzLkNhcHRpb24uc3BsaWNlKGksIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29udmVydFNpemUoZmlsZVNpemU6IG51bWJlcikge1xyXG4gICAgLy9jb25zb2xlLmxvZyhmaWxlU2l6ZSArIFwiIC0gXCIrIHN0cik7XHJcbiAgICByZXR1cm4gZmlsZVNpemUgPCAxMDI0MDAwXHJcbiAgICAgID8gKGZpbGVTaXplIC8gMTAyNCkudG9GaXhlZCgyKSArIFwiIEtCXCJcclxuICAgICAgOiAoZmlsZVNpemUgLyAxMDI0MDAwKS50b0ZpeGVkKDIpICsgXCIgTUJcIjtcclxuICB9XHJcblxyXG4gIGF0dGFjaHBpbk9uY2xpY2soKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiSUQ6IFwiLCB0aGlzLmlkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsXCIgKyB0aGlzLmlkKSEuY2xpY2soKTtcclxuICAgIC8vJChcIiNcIitcInNlbFwiK3RoaXMuaWQpLmNsaWNrKCk7XHJcbiAgfVxyXG5cclxuICBkcm9wKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImRyb3A6IFwiLCBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpO1xyXG4gICAgdGhpcy5vbkNoYW5nZShldmVudCk7XHJcbiAgfVxyXG4gIGFsbG93RHJvcChldmVudDogYW55KSB7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImFsbG93RHJvcDogXCIsZXZlbnQpXHJcbiAgfVxyXG59XHJcblxyXG4vKiBpbnRlcmZhY2UgQ09ORklHIHtcclxuICB1cGxvYWRBUEk6IHN0cmluZztcclxuICBtdWx0aXBsZT86IGJvb2xlYW47XHJcbiAgZm9ybWF0c0FsbG93ZWQ/OiBzdHJpbmc7XHJcbiAgbWF4U2l6ZT86IG51bWJlcjtcclxuICBpZD86IG51bWJlcjtcclxuICByZXNldFVwbG9hZD86IGJvb2xlYW47XHJcbiAgdGhlbWU/OiBzdHJpbmc7XHJcbiAgaGlkZVByb2dyZXNzQmFyPzogYm9vbGVhbjtcclxuIH1cclxuICovIl19