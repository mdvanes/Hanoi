(function() {
    'use strict';

    var ImgData = function(img) {
        // Create canvas
        $('body #dummyCanvas').remove();
        $('body').append('<canvas id="dummyCanvas"></canvas>');
        var $dummyCanvas = $('#dummyCanvas', this.$elem);
        // Canvas dimensions should match image dimensions
        $dummyCanvas
            .attr('height', img.height)
            .attr('width', img.width);
        var context = $dummyCanvas[0].getContext('2d');
        context.drawImage(img, 0, 0);
        this.imgData = context.getImageData(0, 0,
            context.canvas.width,
            context.canvas.height);
        //getCanvasImgData(context);
    };

    ImgData.prototype.log = function() {
        // first pixel is first 4 entries (rgba)
        var data = this.imgData.data;
        console.log('The image data array has ' +
            this.imgData.data.length + ' entries\n' +
            'i.e. ' + (this.imgData.data.length / 4) + ' pixels (' +
            this.imgData.width + 'x' + this.imgData.height + ')\n' +
            'and the value of the first pixel is rgba(' +
            data[0] + ',' +
            data[1] + ',' +
            data[2] + ',' +
            data[3] + ')');
            // TODO log first 4 pixels
        //imageData.data type is CanvasPixelArray  4*width*height
    };

    ImgData.prototype.statistics = function() {
        var dominance = this.calculateColorDominance();
        console.log('color dominance: ', dominance);
        var totalPixels = this.imgData.data.length / 4;
        this.drawDominance(dominance, totalPixels);
    };

    ImgData.prototype.calculateColorDominance = function() {
        // Color dominance RGB
        var result = [0, 0, 0, 0]; // [R, G, B, neither]
        var data = this.imgData.data;
        for(var i = 0; i < data.length; i = i + 4) {
            if(i % 100000 === 0) {
                console.log(i);
            }
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            var highest = Math.max(r,g,b);
            // If one color is higher than the others, add one point to dominance result
            if(r === highest && g !== highest && b !== highest) {
                result[0] = result[0] + 1;
            } else if(g === highest && r !== highest && b !== highest) {
                result[1] = result[1] + 1;
            } else if(b === highest && g !== highest && r !== highest) {
                result[2] = result[2] + 1;
            } else {
                result[3] = result[3] + 1;
            }
        }
        return result;
    };

    ImgData.prototype.drawDominance = function(dominance, totalPixels) {
        // TODO benchmarking of functions
        // TODO colordominance to class/util
        // TODO clean up can be better
        // TODO rename to color distribution
        // TODO better templating/constructing
        // TODO expand to color histogram: a representation of the distribution of colors in an image. For digital images, a color histogram represents the number of pixels that have colors in each of a fixed list of color ranges, that span the image's color space, the set of all possible colors.
        //      http://www.kenrockwell.com/tech/histograms.htm
        $('.distribution').empty();
        var $stats = $('<div id="colorDominance"></div>');
        var redPrc = Math.round((dominance[0] / totalPixels) * 100);
        var greenPrc = Math.round((dominance[1] / totalPixels) * 100);
        var bluePrc = Math.round((dominance[2] / totalPixels) * 100);
        var neitherPrc = Math.round((dominance[3] / totalPixels) * 100);
        $stats.append('<div class="red" title="red: ' + redPrc + '%" style="height: ' + redPrc + '%;"></div>');
        $stats.append('<div class="green" title="green: ' + greenPrc + '%" style="height: ' + greenPrc + '%;"></div>');
        $stats.append('<div class="blue" title="blue: ' + bluePrc + '%" style="height: ' + bluePrc + '%;"></div>');
        $stats.append('<div class="neither" title="neither: ' + neitherPrc + '%" style="height: ' + neitherPrc + '%;"></div>');
        $('.distribution')
            .append('<h1>color distribution</h1>')
            .append($stats);
    };

    /* #reader Object start */
    var Reader = function($elem) {
        this.$elem = $elem;
        this.$preview = this.createPreviewElem();
        this.$input = $('.fileInput', $elem);
        this.bindFileInput();
    };

    Reader.prototype.createPreviewElem = function() {
        this.$elem.append('<div class="preview"></div>');
        return $('.preview', this.$elem);
    };

    Reader.prototype.bindFileInput = function() {
        var self = this;
        self.$input.change(function() {
            //var file = $(this)[0].files[0];
            self.$preview.empty();
            $.each($(this)[0].files, function(index, file) {
                if(isImage(file)) {
                    self.processImage(file);
                } else {
                    alert('You need to select a PNG image for ' +
                    file.name + '.');
                }
            });
        });
    };

    Reader.prototype.processImage = function(image) {
        this.previewImage(image);
        this.readImageBinary(image);
    };

    Reader.prototype.previewImage = function(image) {
        var self = this;
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.src = reader.result;
            $(img)
                .attr('title', image.name)
                .addClass('preview-image');
            self.$preview
                //.empty()
                .append(img);
        };
        reader.readAsDataURL(image);
    };

    Reader.prototype.readImageBinary = function(image) {
        //var self = this;

        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            // Inject dataURL into canvas
            img.src = reader.result;
            img.onload = function() {
                var imgData = new ImgData(this);
                imgData.log();
                imgData.statistics();
            };
        };
        reader.readAsDataURL(image);
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader.readAsBinaryString
        // reader.readAsBinaryString(image);
    };
    /* #reader Object end */

    var isImage = function(file) {
        return file.type === 'image/png';
    };

    $(document).ready(function() {
        new Reader($('.reader'));
    });
})();
