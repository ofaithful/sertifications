$(document).ready(function () {
    var dropZone = $('#dropZone'),
        maxFileSize = 1000000;

    drowItems();

    $('body').on('click', '.items .item', function() {
        $('.item-info div').hide();
        dropZone.hide();
        $('[data-info-id=' + $(this).data().id + ']').show();
    });

    $('.add').click(function() {
        $('.item-info .item').hide();
        dropZone.show();
    });

    if (typeof (window.FileReader) == 'undefined') {
        dropZone.text('Не поддерживается бразуером.');
        dropZone.addClass('error');
    }

    dropZone[0].ondragover = function() {
        dropZone.addClass('hover');
        return false;
    };

    dropZone[0].ondragleave = function() {
        dropZone.removeClass('hover');
        return false;
    };

    dropZone[0].ondrop = function(event) {
        event.preventDefault();
        var file = event.dataTransfer.files[0];

        if (file.size > maxFileSize) {
            dropZone.text('Файл слишком большой!');
            dropZone.addClass('error');
            return false;
        }
        read(file, getInfo);

        dropZone.removeClass('hover');
    };
});

function getInfo() {
    var info = $('.temp .node .head .preview'),
        obj = {
            id: localStorage.length + 1,
            issuerName: info[0].innerText,
            name: info[1].innerText,
            validFrom: info[2].innerText,
            validTo: info[3].innerText
        };


    localStorage.setItem(obj.id, JSON.stringify(obj));


    $('.items-wrap .items').append("<div class='item' data-id=" + obj.id + ">" + obj.name + "</div>");
    $('.item-info').append(
        "<div class='item' data-info-id=" + obj.id + ">" +
        "<p>Common name: " + obj.name + "</p>" +
        "<p>Issuer name: " + obj.issuerName + "</p>" +
        "<p>Valid from: " + obj.validFrom + "</p>" +
        "<p>Valid Till: " + obj.validTo + "</p>" +
        "</div>"
    );
    $('.temp').empty();
}

function drowItems() {
    var objects = [];
    for (var i = 0; i < localStorage.length; i++) {
        objects.push(JSON.parse(localStorage.getItem(i + 1)));
    }
    if (objects.length) {
        for (var j = 0; j < objects.length; j++ ) {
            $('.items-wrap .items').append("<div class='item' data-id=" + (j + 1) + ">" + objects[j].name + "</div>");
            $('.item-info').append(
                "<div class='item' data-info-id=" + (j + 1) + ">" +
                "<p>Common name: " + objects[j].name + "</p>" +
                "<p>Issuer name: " + objects[j].issuerName + "</p>" +
                "<p>Valid from: " + objects[j].validFrom + "</p>" +
                "<p>Valid Till: " + objects[j].validTo + "</p>" +
                "</div>"
            )
        }
    } else  return;
}