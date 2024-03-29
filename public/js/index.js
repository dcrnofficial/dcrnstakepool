var stakepoolFinder = function() {

    var container = $("#stakepool-data");

    if (container.length == 0) {
        return;
    }

    var isMainnet = container.data("ismainnet");
    var host = window.location.host
    var re=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    var schema = "https://";
    if(re.test(host))
    {
        schema = "http://";
    }
    container.html("Loading...");
    tableMarkup = '<table id="pooldata" class="dtVerticalScroll table" cellspacing="0" width="100%"><thead class="thead-light"><tr class=""><th scope="col">ID</th><th scope="col">Address</th><th scope="col">VSP Fees <img src="/assets/images/arrow-up-down.svg" alt=""></th></tr></thead><tbody>';
    $.ajax({
        url: schema+host+"/assets/gsd.json",
        dataType: "json",
        success: function(data) {
            $.each(data, function(poolName, poolData) {
                if (isMainnet) {
                    if (poolData["Network"] === 'testnet') {
                        return;
                    }
                } else {
                    if (poolData["Network"] === 'mainnet') {
                        return;
                    }
                }
                var proportion = poolData["ProportionLive"] * 100;
                tableMarkup += '<tr>';
                tableMarkup += '<td>' + poolName + '</td>';
                tableMarkup += '<td><a target="_blank" rel="noopener noreferrer" href="' + poolData["URL"] + '">' + poolData["URL"].replace("https://", "") + '</a></td>';
                // tableMarkup += '<td>' + proportion.toFixed(2) + '%</td>';
                tableMarkup += '<td>' + poolData["PoolFees"] + '%</td>';
                tableMarkup += '</tr>';
            });
            tableMarkup += '</tbody></table>';
            container.html(tableMarkup);
            $('.dtVerticalScroll').DataTable({
                "scrollY": "251px",
                "scrollX": true,
                "scrollCollapse": true,
                "paging": false,
                "searching": false,
                "info": false
            });
            $('.dataTables_length').addClass('bs-select');
        },
    });
}();

//carousel dot tooltip setup
$(document).ready(function () {
    $('.carousel-nav__dot').tooltip({
        placement: 'top',
        trigger: 'hover',
        width: '100px'
    });
});

//flickity carousel setup
var $carousel = $('.main-carousel').flickity({
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    arrowShape: {
        x0: 10,
        x1: 60, y1: 50,
        x2: 60, y2: 40,
        x3: 60
    },
    prevNextButtons: false,
    pageDots: false
});

var flkty = $carousel.data('flickity');
var $cellButtonGroup = $('.carousel-nav');
//add slide buttons
var total = flkty.slides.length;

for (i = 0; i < total; i++) {
    var title = $('.carousel-cell').eq(i).find('h2').text();
    if (i === 0) {
        $cellButtonGroup.append('<li class="carousel-nav__dot is-selected" title="' + title + '"></li>');
    } else if (i === total - 1) {
        $cellButtonGroup.append('<li class="carousel-nav__dot mr-0" title="' + title + '"></li>');
    } else {
        $cellButtonGroup.append('<li class="carousel-nav__dot" title="' + title + '"></li>');
    }
}

$('.carousel-nav').prepend('<li class="carousel-nav__previous"><img src="/assets/images/arrow-prev.svg"></li>');
$('.carousel-nav').append('<li class="carousel-nav__next"><img src="/assets/images/arrow-next.svg"></li>');

var $cellButtons = $cellButtonGroup.find('.carousel-nav__dot');

// update selected cellButtons
$carousel.on('select.flickity', function () {
    $cellButtons.filter('.is-selected')
        .removeClass('is-selected');
    $cellButtons.eq(flkty.selectedIndex)
        .addClass('is-selected');
});

// select cell on button click
$cellButtonGroup.on('click', '.carousel-nav__dot', function () {
    var index = $(this).index() - 1;
    $carousel.flickity('select', index);
});

// previous
$('.carousel-nav__previous').on('click', function () {
    $carousel.flickity('previous');
});
// next
$('.carousel-nav__next').on('click', function () {
    $carousel.flickity('next');
});

