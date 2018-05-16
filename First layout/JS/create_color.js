document.addEventListener('DOMContentLoaded', function () {
    $('.dropdown-trigger').dropdown();
    $('.collapsible').collapsible();

    const regColorHex = RegExp(/^#(?:[0-9a-f]{3}){1,2}$/i);
    let colorPicker = true;
    // create canvas and context objects
    let canvas = document.getElementById('picker');
    if (canvas === null) {
        $.getScript('JS/createColors.js');
    } else {
        let ctx = canvas.getContext('2d');

        // drawing active image
        let image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
        };
        let imageSrc = './Materials/IMG/colorpalette.jpg';
        image.src = imageSrc;

        $('#picker').mousemove(function (e) {
            if (colorPicker) {

                var canvasOffset = $(canvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);


                var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
                console.log(pixel);

                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? '0' + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    var colorcode = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
                    return colorcode;
                }

                var pixelColor = 'rgb(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ')';
                $('.preview').css('backgroundColor', pixelColor);
                $('#color-code').val(rgbToHex(pixel[0], pixel[1], pixel[2]));
            }
        });

        $('#picker').click(function (e) {
            colorPicker = !colorPicker;
            $('.colorpicker').fadeToggle('linear');
        });
        $('.preview').click(function (e) {
            $('.colorpicker').fadeToggle('linear');
            colorPicker = true;
        });

        let colorset = new Object();

        document.getElementById('color-code').addEventListener('input', function () {
            let colorCode = document.getElementById('color-code').value;
            $('.preview').css('backgroundColor', colorCode);

        });
    }
});

