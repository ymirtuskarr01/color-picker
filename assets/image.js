"use strict"

import ColorCore from './colorCore.js';

class Image {

    constructor() {
        // this.storage = window.localStorage;
        this.extractImageColor = new ColorCore();

        this.container = document.getElementById("image");
        this.images = document.getElementsByTagName("img")[1];
        this.loadingElement = document.querySelector("#loading img");

        this.loadStart();
        // this.start,this.previousTimeStamp;
        // this.done = false;
        // this.repeat = true;

        this.decomposeImage();
        this.extractImageColor.decomposeSwatches();
    }

    updateImage(input) {

        this.newImage = document.createElement("img");
        this.currentFile = input.files;
        // window.requestAnimationFrame(this.step.bind(this));

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
            // .then(this.extractImageColor.loadEnd.bind(this));
            // .then(this.loadEnd);
            .then((val) => {
                if (!val) this.loadEnd();
            });
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

    loadStart() {
        this.actionOff();

        this.loadingElement.style.opacity = 1;
    }

    loadEnd() {
        this.actionOn();

        this.loadingElement.style.opacity = 0;
    }

    actionOn() {
        const actionAble = document.querySelectorAll(".actionable");

        for (let action of actionAble) {
            action.removeAttribute("disabled");
        }
    }

    actionOff() {
        const actionAble = document.querySelectorAll(".actionable");

        for (let action of actionAble) {
            action.setAttribute("disabled", "disabled");
        }
    }

    // step(timeStamp) {

    //     console.log("timestamp: ", timeStamp);
    //     if (this.start === undefined) {
    //         this.start = timeStamp;
    //     }

    //     const elapsed = timeStamp - this.start;
    //     console.log("elapsed:", elapsed);

    //     if (this.previousTimeStamp !== timeStamp) {
    //         const count = Math.min(10 * elapsed, 360);
    //         // this.loadingElement.style.transform = `translateX(${count}px)`;
    //         this.loadingElement.style.transform = `rotate(${count}deg)`;
    //         // this.loadingElement.classList.add("rotate");
    //         if (count === 360) {
    //             this.done = true;
    //             // this.loadingElement.classList.remove("rotate");
    //         }
    //     }

    //     if (elapsed < 360) {
    //         this.previousTimeStamp = timeStamp;
    //         if (!this.done) {
    //             // window.cancelAnimationFrame(this.step.bind(this));
    //             window.requestAnimationFrame(this.step.bind(this));
    //         }
    //     }
    // }
}

export default Image;