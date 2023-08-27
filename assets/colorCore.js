"use strict";

import Toast from './toast/toast.js';
import quantize from '../lib/quantize.js';

class ColorCore {
    colors = {}
    uniqueColors = {};
    palette = [];

    constructor() {
        this.swatches = document.getElementById("swatches");
        this.oldUnorderList = this.swatches.querySelector("ul");
    }

    extractImageColor(receivedImage) {

        return new Promise((resolve, reject) => {
            const imageObj = this.createCanvas(receivedImage);
            const imageData = imageObj.data;
            const palette = this.getPalette(imageData);

            resolve(this.reflectPalette(palette));
        });
    }

    createCanvas(receivedImage) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext && canvas.getContext("2d");
        const height = canvas.width = receivedImage.naturalHeight || receivedImage.offsetHeight || receivedImage.height;
        const width = canvas.height = receivedImage.naturalWidth || receivedImage.offsetWidth || receivedImage.width;
        context.drawImage(receivedImage, 0, 0, width, height);

        const getImageData = context.getImageData(0, 0, width, height);

        return getImageData;
    }

    getPalette(data) {
        const colors = this.arrangeColor(data);
        const cmap = quantize(colors, 10);
        const palette = cmap ? cmap.palette() : null;

        return palette;
    }

    arrangeColor(data) {
        let colors = [];

        for (let i = 0; i < data.length; i += 4) {

            if (typeof data[i + 3] === undefined || data[i + 3] != 0) {
                if (!(data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)) {
                    colors.push([data[i], data[i + 1], data[i + 2]]);
                }
            }
        }
        return colors;
    }

    reflectPalette(palette) {
        const newUnorderList = document.createElement("ul");

        // swatches.removeChild(oldUnorderList);

        return new Promise((resolve, reject) => {

            for (let color in palette) {
                let newColorList = document.createElement("li");
                let container = document.createElement("div");
                let embed = document.createElement("embed");

                let rgbValue = `rgb(${palette[color][0]}, ${palette[color][1]}, ${palette[color][2]})`;

                container.classList.add("container");
                embed.title = `Copy ${rgbValue}`;
                embed.src = "images/content-copy.svg";
                embed.width = "100%";
                embed.height = "100%";
                embed.type = "image/svg+xml";
                embed.classList.add("emb");

                newColorList.style.backgroundColor = rgbValue;

                // this.loadSVG(embed, rgbValue);
                this.loadSVG(embed, palette[color][0], palette[color][1], palette[color][2]);

                container.appendChild(embed);
                newColorList.appendChild(container);
                newUnorderList.appendChild(newColorList);

                if (color == palette.length - 1) {
                    // this.loadEnd();
                    const isLoading = false;
                    resolve(isLoading);
                }
            }

            // swatches.appendChild(newUnorderList);
            this.swatches.replaceChild(newUnorderList, this.oldUnorderList);
            // return this.loadSVG();
        });
    }

    decomposeSwatches() {
        const oldUnorderListItem = this.oldUnorderList.querySelectorAll("li");
        if (this.oldUnorderList) {
            for (let listItemRow = oldUnorderListItem.length - 1; listItemRow >= 0; listItemRow--) {
                this.oldUnorderList.removeChild(oldUnorderListItem[listItemRow]);
            }
            // for (let itemRow of oldUnorderListItem) {
            //     this.oldUnorderList.removeChild(itemRow);
            // }
        }
    }

    loadSVG(elms, ...bgColor) {
        // let elms = document.querySelectorAll("#swatches .emb");

        // for (let i = 0; i < elms.length; i++) {
        //     let parentElm = elms[i].closest("li");

        //     if (!elms[i].dataset.listenerLoad) {
        //         elms[i].dataset.listenerLoad = true;

        //         elms[i].addEventListener("load", () => {
        //             let style = getComputedStyle(parentElm, "");
        //             var bgColor= style.getPropertyValue("background-color");
        //             let bgColorConvert = this.convertColor(bgColor);

        //             this.findSVGElements(elms[i], bgColorConvert);
        //         });
        //     }

        //     if (i == elms.length - 1) {
        //         // this.loadEnd();
        //         let isLoading = false;
        //         return isLoading;
        //     }
        // }

        if (!elms.dataset.listenerLoad) {
            elms.dataset.listenerLoad = true;

            elms.addEventListener("load", () => {
                // let bgColorConvert = this.convertColor(bgColor);

                // this.findSVGElements(elms, bgColorConvert);
                this.findSVGElements(elms, bgColor);
            });
        }
    }

    convertColor(color) {
        let rgbColors = new Object();

        if (color[0] == 'r') {
            color = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
            rgbColors = color.split(',', 3);

            rgbColors[0] = parseInt(rgbColors[0]);
            rgbColors[1] = parseInt(rgbColors[1]);
            rgbColors[2] = parseInt(rgbColors[2]);
        }

        return rgbColors;
    }

    findSVGElements(embedding_element, bgColor) {
        let subdoc = this.getSubDocument(embedding_element);

        if (subdoc) {
            subdoc.documentElement.style.setProperty('--red', bgColor[0]);
            subdoc.documentElement.style.setProperty('--green', bgColor[1]);
            subdoc.documentElement.style.setProperty('--blue', bgColor[2]);

            if (!subdoc.querySelector("svg").dataset.listenerCopy) {
                subdoc.querySelector("svg").dataset.listenerCopy = true;

                subdoc.querySelector("svg").addEventListener("click", (event) => {
                    let rect = event.target.closest("rect");
                    if (!rect) return;

                    this.copyTextToClipboard(bgColor);

                    Toast(`Copied ${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}`);
                });
            }
        }
    }

    getSubDocument(embedding_element) {
        if (embedding_element.contentDocument) {
            return embedding_element.contentDocument;
        } else {
            let subdoc = null;

            try {
                subdoc = embedding_element.getSVGDocument();
            } catch(error) {}

            return subdoc;
        }
    }

    fallbackCopyTextToClipboard(text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log(`Fallback: Copying text command was ${msg}`);
        } catch (err) {
            console.error(`Fallback: Oops, unable to copy ${err}`);
        }

        document.body.removeChild(textArea);
    }

    copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            console.log("Async: Copying to clipboard was successful!");
        }, (err) => {
            console.log(`Async: Could not copy text: ${err}`);
        })
    }
}

export default ColorCore;