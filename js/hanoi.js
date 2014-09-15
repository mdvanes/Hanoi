(function() {
    var ImgData = function(img) {
        // Create canvas
        $('body')
            .remove('#dummyCanvas')
            .append('<canvas id="dummyCanvas"></canvas>');
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
        var self = this;

        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            // Inject dataURL into canvas
            img.src = reader.result;
            img.onload = function() {
                var imgData = new ImgData(this);
                imgData.log();
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
