"use strict"

import ColorCore from './colorCore.js';

class Image {
    constructor() {
        // this.storage = window.localStorage;
        this.extractImageColor = new ColorCore();
        this.extractImageColor.loadStart();
        this.isLoading = true;

        this.container = document.getElementById("image");
        this.images = document.getElementsByTagName("img")[0];

        this.decomposeImage();
    }

    updateImage(input) {

        this.newImage = document.createElement("img");
        this.currentFile = input.files;

        // this.getImage(URL.createObjectURL(this.currentFile[0]), (val) => {
        //     this.newImage.src = `${val}#t=${new Date().getTime()}`;

        //     this.newImage.onload = () => {
        //         this.isLoading = this.extractImageColor.extractImageColor(this.newImage);
        //     }
        // });

        // this.getImage(this.currentFile[0])
        this.getImage(URL.createObjectURL(this.currentFile[0]))
            .then((response) => {
                    this.newImage.src = `${response}#t=${new Date().getTime()}`;
                    this.container.appendChild(this.newImage);
                },
                (error) => {
                    console.log(error);
                }
            )
            .then(this.loadImage.bind(this))
            .then(this.extractImageColor.loadEnd.bind(this));
    };

    decomposeImage() {
        if (this.images) this.container.removeChild(this.images);
    }

    getImage(fileUrl) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", fileUrl);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    }
                    reader.readAsDataURL(xhr.response);
                } else {
                    reject(new Error(`Image didn't load successfully; error code: ${xhr.statusText}`));
                }
            //     let reader = new FileReader();
            //     reader.onloadend = () => {
            //         callback(reader.result);
            //     }
            //     reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = () => {
                reject(new Error(`There was a network error.`));
            }
            // xhr.open("GET", fileUrl);
            // xhr.responseType = "blob";
            xhr.send();
        });
    }

    loadImage() {
        return new Promise((resolve, reject) => {
            resolve(this.extractImageColor.extractImageColor(this.newImage));
        })
    }
}

export default Image;