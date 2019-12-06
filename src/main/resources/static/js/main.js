/*
Double exposure is photographic technique that combines 2 different img into a single image. 
Then I use this technique with canvas blend modes.
*/
// 轮播图
window.onload = function() {
    var loading = document.getElementById("loading");
    loading.classList.add("loading-done");

    var property = {
        element: "#img",
        parallax: .6,
        interval: 2200,
        animDuration: 1300,
        easing: easingInOutQuad
    };


    var slider = new DXslider(property);
    slider.init();
};

class DXslider {
    constructor(property) {
        this.img = document.querySelector(property.element);
        this.preButton = document.querySelector(property.element + " nav .pre");
        this.nextButton = document.querySelector(property.element + " nav .next");
        this.lightenimg = document.querySelectorAll(".lighten img");
        this.normalimg = document.querySelectorAll(".normal img");
        this.canvasBox = document.createElement("div");
        this.paraEffect = property.parallax; //have to clamp 0 ~ 1
        this.canvasArray = [];
        this.progress = 0;
        this.animating = false;
        this.interval = property.interval;
        this.left = true;
        this.duration = property.animDuration;
        this.easing = property.easing;
        this.img.appendChild(this.canvasBox);
        this.canvasBox.classList.add("canvas");
    }

    init() {
        this.settingStyle();
        this.settingCanvas();

        this.preButton.addEventListener("click", function(e) {
            if (!this.animating) {
                this.left = false;
                clearTimeout(this.timer);
                this.slide();
            }
        }.bind(this), false);

        this.preButton.addEventListener("touchend", function(e) {
            if (!this.animating) {
                this.left = false;
                clearTimeout(this.timer);
                this.slide();
            }
        }.bind(this), false);

        this.nextButton.addEventListener("click", function(e) {
            if (!this.animating) {
                this.left = true;
                clearTimeout(this.timer);
                this.slide();
            }
        }.bind(this), false);

        this.nextButton.addEventListener("touchend", function(e) {
            if (!this.animating) {
                this.left = true;
                clearTimeout(this.timer);
                this.slide();
            }
        }.bind(this), false);
    }

    settingStyle() {
        this.imgWidth = this.img.offsetWidth;
        this.width = this.lightenimg[0].width;
        this.height = this.lightenimg[0].height;
        this.dpi = this.width / this.imgWidth;
        this.img.style.height = this.canvasBox.style.height = this.imgWidth * this.height / this.width + "px";

        this.preButton.classList.add("after-loading");
        this.nextButton.classList.add("after-loading");
    }

    settingCanvas() {
        var canvas, context, normal, lighten, n;
        for (var i = 0, len = this.normalimg.length * 2; i < len; i++) {
            canvas = document.createElement("canvas");
            this.canvasBox.appendChild(canvas);
            context = canvas.getContext("2d");

            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.width = this.imgWidth + "px";
            canvas.style.height = this.imgWidth * this.height / this.width + "px";

            //add img(lighten and normal) into canvasArray
            n = i % (len / 2);
            normal = this.normalimg[n];
            lighten = this.lightenimg[n];
            this.canvasArray.push({
                canvas: canvas,
                context: context,
                normal: normal,
                lighten: lighten
            });

        }

        this.render(this.progress, -this.imgWidth);
        this.timer = setTimeout(this.slide.bind(this), this.interval);
    }

    slide() {
        this.left ?
            this.tween(-this.imgWidth, this.duration, this.easing) :
            this.tween(this.imgWidth, this.duration, this.easing);
    }

    tween(change, duration, easingFunc) {
        var startTime = new Date();
        this.progress = 0;
        this.animating = true;
        this.update(startTime, change, duration, easingFunc);
    }

    update(startTime, change, duration, easingFunc) {
        var time = new Date() - startTime;
        if (time < duration) {
            this.progress = easingFunc(time / duration);
            this.render(this.progress, change);
            requestAnimationFrame(this.update.bind(this, startTime, change, duration, easingFunc));
        } else {
            if (this.left) {
                var firstEle = this.canvasArray[0];
                this.canvasArray.shift();
                this.canvasArray.push(firstEle);
            } else {
                var lastEle = this.canvasArray[this.canvasArray.length - 1];
                this.canvasArray.pop();
                this.canvasArray.unshift(lastEle);
            }
            this.progress = 1;
            this.animating = false;
            time = duration;
            this.left = true;
            this.render(0, -this.imgWidth);
            this.timer = setTimeout(this.slide.bind(this), this.interval);
        }
    }

    render(progress, position) {
        for (var i = 0, len = this.canvasArray.length; i < len; i++) {
            var canvas = this.canvasArray[i].canvas;
            canvas.style.setProperty("-webkit-transform", "translate(" + (progress * position - (len / 2 - i) * this.imgWidth) + "px, 0)");
            canvas.style.transform = "translate(" + (progress * position - (len / 2 - i) * this.imgWidth) + "px, 0)";

            var context = this.canvasArray[i].context;
            context.clearRect(0, 0, this.width, this.height);
            context.globalCompositeOperation = "source-over";
            context.drawImage(this.canvasArray[i].normal, 0, 0, this.width, this.height);
            context.globalCompositeOperation = "lighten";
            context.drawImage(this.canvasArray[i].lighten, ((len / 2 - i) * this.imgWidth - progress * position) * this.dpi * this.paraEffect, 0, this.width, this.height);
        }
    }
}


//easing
//prepare only easingInOutQuad
function easingInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 栅格部分
$(function() {
    $("#gallery-wrapper").pinterest_grid({
        no_columns: 4,
        padding_x: 10,
        padding_y: 10,
        margin_bottom: 50,
        single_column_breakpoint: 700
    });

});