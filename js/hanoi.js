(function() {
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
            var file = $(this)[0].files[0];
            self.$preview.empty();
            $.each($(this)[0].files, function(index, file) {
                if(isImage(file)) {
                    self.processImage(file);
                } else {
                    alert('You need to select a PNG image for ' +
                    file.name + '.');
                }
            });
            // if(isImage(file)) {
            //     self.processImage(file);
            // } else {
            //     alert('You need to select a PNG image.');
            // }
        });
    };

    Reader.prototype.processImage = function(image) {
        this.previewImage(image);
        this.readImageBinary(image);

        // var reader = new FileReader();
        // reader.onload = function() {
        //     console.log(reader.result);
        // };
        // reader.readAsBinaryString(image);
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
        var bin;
        //var reader = new FileReader();

        // create canvas
        this.$elem.append('<canvas id="dummyCanvas"></canvas>');
        var $dummyCanvas = $('#dummyCanvas', this.$elem);
        var context = $dummyCanvas[0].getContext('2d');

        // Inject dataURL into canvas
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.onload = function() {
                context.drawImage(this, 0, 0);
                getCanvasImgData(context);
            };
            img.src = reader.result;
            //console.info(img);
            //console.info(context);
        };
        reader.readAsDataURL(image);
// function loadCanvas(dataURL) {
//         var canvas = document.getElementById('myCanvas');
//         var context = canvas.getContext('2d');
//
//         // load image from data url
//         var imageObj = new Image();
//         imageObj.onload = function() {
//           context.drawImage(this, 0, 0);
//         };
//
//         imageObj.src = dataURL;
//       }
        // Convert canvas to width,height,binary
        // context.getImageData(left, top, width, height);

        // reader.onloadend = function() {
        //     //console.log(reader.result);
        //     bin = reader.result;
        //     console.log('binary of ' + image.name, bin);
        // };
        // // https://developer.mozilla.org/en-US/docs/Web/API/FileReader.readAsBinaryString
        // reader.readAsBinaryString(image);
    };
    /* #reader Object end */

    var getCanvasImgData = function(context) {
        // Convert canvas to width,height,binary
        var imageData = context.getImageData(0, 0,
            context.canvas.width,
            context.canvas.height);
        console.log(imageData.data.length);
        // first pixel is first 4 entries (rgba)
        var data = imageData.data;
        console.log('pixel 1 rgba(' +
        data[0] + ',' +
        data[1] + ',' +
        data[2] + ',' +
        data[3] + ')');
        //imageData.data type is CanvasPixelArray  4*width*height
    };

    var isImage = function(file) {
        return file.type === 'image/png';
    };

    $(document).ready(function() {
        //console.log($('#main').text());
        //bindFileInput($('.reader'));
        new Reader($('.reader'));
    });
})();
