"use strict"

import ColorCore from './colorCore.js';

class Image {
    constructor() {
        // this.storage = window.localStorage;
        this.extractImageColor = new ColorCore();
        this.extractImageColor.loadStart();
        this.isLoading = true;
        this.checkLoading();

        this.container = document.getElementById("image");
        this.images = document.getElementsByTagName("img")[0];
    }

    updateImage(input) {
        this.decomposeImage();

        this.newImage = document.createElement("img");
        this.currentFile = input.files;

        this.getImage(URL.createObjectURL(this.currentFile[0]), (val) => {
            this.newImage.src = `${val}#t=${new Date().getTime()}`;

            this.newImage.onload = () => {
                this.isLoading = this.extractImageColor.extractImageColor(this.newImage);
            }
        });
        this.container.appendChild(this.newImage);
    };

    decomposeImage() {
        if (this.images) this.container.removeChild(this.images);
    }

    getImage(fileUrl, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", fileUrl);
        xhr.responseType = "blob";
        xhr.send();
    }

    checkLoading() {
        if (this.isLoading) {
            setTimeout(() => {
                this.checkLoading();
            },1000);
        } else {
            this.extractImageColor.loadEnd();
        }
    }
}

export default Image;