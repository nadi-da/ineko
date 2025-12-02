$(window).scroll(function() {
    stickyHeader();
});

$(document).ready(function() {

    $('.header-menu-btn').on('click', function() {
        if(window.innerWidth <= 550) {
            let imgPath = $(this).find('img').attr('src');
            imgPath = imgPath.split('/').slice(0, -1).join('/');
            if( $('header').hasClass('menu-open')) {
                $('header').removeClass('menu-open');
                $(this).find('img').attr('src',imgPath + '/menu.svg');
            } else {
                $('header').addClass('menu-open');
                $(this).find('img').attr('src',imgPath + '/close.svg');
            }


        }
    })

    stickyHeader();

    lightbox.option({
        'albumLabel': "%1 из %2",
    })

    if($('[data-type="top-slider"]').length > 0) {
        $('[data-type="top-slider"]').slick({
            dots: true,
            arrows: false,
            infinite: true,
            speed: 1500,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            //fade: true,
        });
    };

    if($('[data-type="slider-review"]').length > 0) {
        $('[data-type="slider-review"]').slick({
            dots: true,
            arrows: true,
            infinite: false,
            speed: 1500,
            slidesToShow: 1,
            autoplay: false,
        });

        let arrMargin = parseInt($('[data-type="slider-review"]').find('.slick-dots').innerWidth()) / 2;
        if(window.innerWidth > 500) {
            arrMargin += 80;
        } else {
            arrMargin += 40;
        }
        $('.slick-prev').css('margin-left', '-' + arrMargin + 'px');
        $('.slick-next').css('margin-right', '-' + arrMargin + 'px');
    };

    if($('[data-type="gallery-slider"]').length > 0) {
        $('[data-type="gallery-slider"]').slick({
            dots: false,
            arrows: true,
            infinite: false,
            speed: 1500,
            slidesToShow: 3,
            autoplay: false,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1,
                    }
                },
            ]
        });
    };


});

function stickyHeader() {
    let headerBotPos = $('header').outerHeight(true);
    if ($(window).scrollTop() >= headerBotPos)
    {
        $('header').addClass('sticky');
        setTimeout(function() {
            $('header').addClass('on');
        }, 100);
    }
    else
    {
        $('header').removeClass('sticky');
        setTimeout(function() {
            $('header').removeClass('on');
        }, 50);
    }
}