"use strict";

import Image from './image.js';

class ColorPicker {
    constructor() {
        const fileButton = document.getElementById("uploadimage");

        document.getElementsByTagName("button")[0].addEventListener("click", (e) => {
            e.preventDefault();
            fileButton.click();
        });

        fileButton.addEventListener("change", (e) => {
            e.preventDefault();
            this.currentFile = e.target.files;

            if (this.currentFile[0] === undefined) return;

            this.image = new Image();
            this.image.updateImage(e.target);
        });
    }
}

export default ColorPicker;