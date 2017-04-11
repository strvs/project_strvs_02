$(document).ready(function() {

    $.validator.addMethod('maskPhone',
        function(value, element) {
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.gallery-list-inner').slick({
        infinite: true,
        centerMode: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        slidesToShow: 1,
        speed: 1000,
        dots: true,
        variableWidth: true
    });

    $('.catalogue-menu > li > a').click(function(e) {
        var curLi = $(this).parent();
        if (curLi.find('ul').length > 0) {
            curLi.toggleClass('open');
            e.preventDefault();
        }
    });

    $('.catalogue-text-more-link a').click(function(e) {
        $(this).parent().prev().toggleClass('open');
        e.preventDefault();
    });

    $('.main-services .row').slick({
        infinite: true,
        prevArrow: '<button type="button" class="slick-prev btn-prev">Назад</button>',
        nextArrow: '<button type="button" class="slick-next btn-next">Вперед</button>',
        speed: 1000,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 4
    });

    $('.order-btn-back').click(function() {
        var curStep = $(this).parents().filter('.order-step');
        curStep.removeClass('active success');
        var prevStep = curStep.prev();
        if (prevStep) {
            prevStep.addClass('active').removeClass('success error');
        }
    });

    $('.btn-finale').click(function(e) {
        $('.order-step').each(function() {
            var curStep = $(this);
            if (curStep.find('form').valid()) {
                if (!curStep.hasClass('active')) {
                    curStep.addClass('success').removeClass('error');
                }
            } else {
                if (!curStep.hasClass('active')) {
                    curStep.addClass('error').removeClass('success');
                }
            }
        });
        e.preventDefault();
    });

    $('.order-step-header').click(function() {
        var curStep = $(this).parents().filter('.order-step');
        if (!curStep.hasClass('active')) {
            $('.order-step').removeClass('active');
            curStep.removeClass('success error').addClass('active');
        }
    });

    $('input[type="number"]').each(function() {
        var curBlock = $(this).parent();
        var curHTML = curBlock.html();
        curBlock.html(curHTML.replace(/type=\"number\"/g, 'type="text"'));
        curBlock.find('input').spinner();
        curBlock.find('input').keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 43 || charCode > 57)) {
                return false;
            }
            return true;
        });
    });

    $('.product-count input').on('spinstop', function(event, ui) {
        if ($('.product-count input').val() > 10) {
            $('.btn-order').prop('disabled', true);
            $('.btn-calc').prop('disabled', false);
        } else {
            $('.btn-order').prop('disabled', false);
            $('.btn-calc').prop('disabled', true);
        }
    });

    $('.basket-count input').on('spinstop', function(event, ui) {
        recalcCart();
    });

    $('.basket').each(function() {
        recalcCart();
    });

    $('.basket-delete a').click(function(e) {
        $(this).parent().parent().remove();
        recalcCart();
        e.preventDefault();
    });

    $('.faq-header').click(function() {
        var curItem = $(this).parent();
        if (curItem.hasClass('open')) {
            curItem.removeClass('open');
        } else {
            $('.faq-item').removeClass('open');
            curItem.addClass('open');
        }
    });

    $('.product-menu li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curIndex = $('.product-menu li').index(curLi);
            $('.product-menu li.active').removeClass('active');
            curLi.addClass('active');
            $('.product-tab.active').removeClass('active');
            $('.product-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('input.onlogo').each(function() {
        if ($(this).prop('checked')) {
            $('.product-photo img.nologo').hide();
            $('.product-photo img.onlogo').show();
        }
    });

    $('input.nologo').each(function() {
        if ($(this).prop('checked')) {
            $('.product-photo img.nologo').show();
            $('.product-photo img.onlogo').hide();
        }
    });

    $('input.onlogo').change(function() {
        if ($(this).prop('checked')) {
            $('.product-photo img.nologo').hide();
            $('.product-photo img.onlogo').show();
        } else {
            $('.product-photo img.nologo').show();
            $('.product-photo img.onlogo').hide();
        }
    });

    $('input.nologo').change(function() {
        if ($(this).prop('checked')) {
            $('.product-photo img.nologo').show();
            $('.product-photo img.onlogo').hide();
        } else {
            $('.product-photo img.nologo').hide();
            $('.product-photo img.onlogo').show();
        }
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    if (curForm.parent().hasClass('order-step-container')) {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            },
            submitHandler: function(form) {
                var curStep = $(form).parents().filter('.order-step');
                curStep.removeClass('active').addClass('success');
                var nextStep = curStep.next();
                if (nextStep) {
                    nextStep.addClass('active').removeClass('error');
                }
            }
        });
    } else if (curForm.hasClass('window-form')) {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            },
            submitHandler: function(form) {
                windowOpen($(form).attr('action'), $(form).serialize());
            }
        });
    } else {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            }
        });
    }
}

function checkErrors() {
    $('.form-checkbox').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
    });
}

function recalcCart() {
    var curSumm = 0;
    var curCount = 0;
    $('.basket-row').each(function() {
        var curRow = $(this);
        var rowSumm = Number(curRow.find('.basket-count input').val()) * Number(curRow.find('.basket-price span').html().replace(' ', ''))
        curRow.find('.basket-summ span').html(String(rowSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));

        curSumm += rowSumm;
        curCount += Number(curRow.find('.basket-count input').val());
    });

    if (curCount > 10) {
        $('.btn-order').prop('disabled', true);
        $('.btn-calc').prop('disabled', false);
    } else {
        $('.btn-order').prop('disabled', false);
        $('.btn-calc').prop('disabled', true);
    }

    $('.basket-all-summ span').html(String(curSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
}

function windowOpen(linkWindow, dataWindow) {
    $('html').addClass('window-open');

    if ($('.window').length > 0) {
        $('.window').remove();
    }

    $('body').append('<div class="window"><div class="window-loading"></div></div>')

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

            if ($('.window-container img').length > 0) {
                $('.window-container img').each(function() {
                    $(this).attr('src', $(this).attr('src'));
                });
                $('.window-container').data('curImg', 0);
                $('.window-container img').load(function() {
                    var curImg = $('.window-container').data('curImg');
                    curImg++;
                    $('.window-container').data('curImg', curImg);
                    if ($('.window-container img').length == curImg) {
                        $('.window-container').removeClass('window-container-load');
                        windowPosition();
                    }
                });
            } else {
                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }

            $(window).resize(function() {
                windowPosition();
            });

            $('.window-close').click(function(e) {
                windowClose();
                e.preventDefault();
            });

            $('body').on('keyup', function(e) {
                if (e.keyCode == 27) {
                    windowClose();
                }
            });

            $('.window form').each(function() {
                initForm($(this));
            });
        }
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
    }
}