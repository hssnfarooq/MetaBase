Main = {
    scrolledOnce: {},
    menuToggler: "#menu-toggle",
    colors_array: {
        'pomegranate': 'background-image : linear-gradient(45deg, #9B3CB7, #FF396F)',
        'king-yna': 'background-image : linear-gradient(45deg, #1A2A6C, #B21F1F)',
        'ibiza-sunset': 'background-image : linear-gradient(45deg, #EE0979, #FF6A00)',
        'flickr': 'background-image : linear-gradient(45deg, #33001B, #FF0084)',
    },

    init: function () {
        try {
            Main.toggelSideBar();
            Main.bindScrollSpys();
            Main.bindDataTables();
            Main.handleMobile();
            Main.setStorage();
            Main.shoppingCart();
            Main.mobileTables();
        } catch (e){
            console.log(e);
        }
    },

    setSidebarWidthValue: function () {
        try {
            let config_array = JSON.parse(localStorage.getItem('platform'));
            if (!config_array) {
                return;
            }
            $('#cz-sidebar-width').val(config_array.sidebar);
        } catch (e){
            console.log("Theming is disabled");
        }

    },

    shoppingCart: function () {
        if (typeof unauthorized === 'undefined') {
            $.get('/campaigns/get_cart_items', function (data) {
                $('#shopping-cart-items-count').html(data);
            });
        }
    },

    toggelSideBar: function () {
        $(Main.menuToggler).click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    },

    bindScrollSpys: function () {
        const that = this;
        $('.nav-item').removeClass('active');//disable bootstrap onload activations
        $(".scrollspy-link").on('click', function (e) {
            e.preventDefault();
            $('.nav-item .nav-link').removeClass('active');
            let navRef = $(this).attr("nav-ref");
            $(".nav-item." + navRef + " .nav-link").addClass("active");
            let hash = this.hash; //required

            if (typeof that.scrolledOnce[hash] === 'undefined') {
                that.scrolledOnce[hash] = true;

                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 1000, function () {
                    window.location.hash = hash;
                });
            }
        });
    },

    bindDataTables: function () {

    },


    handleMobile: function () {
        if (Main.isMobile()) {
            $(Main.menuToggler).click();
        }
    },

    isMobile: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    },

    setStorage: function () {
        try {
            let config = {
                color: 'bg-b-black',
                image: 'none',
                menu: 'large',
                sidebar: 'large'
            };
            if (localStorage.getItem('platform') === null || localStorage.getItem('platform') === undefined) {
                localStorage.setItem('platform', JSON.stringify(config));
            }
            Main.setUserThemePrefrences();
        } catch (e) {
            console.log(e);
        }
    },


    configUserTheme: function (preference) {
        try {
            let config_array = JSON.parse(localStorage.getItem('platform'));

            switch (preference.dataset.type) {
                case 'color':
                    config_array.color = preference.dataset.colorName;
                    break;
                case 'menu':
                    console.log(preference.checked === true);
                    config_array.menu = preference.checked === true ? 'small' : 'large';
                    break;
                case 'image':
                    config_array.image = preference.checked === true;
                case 'sidebar':
                    config_array.sidebar = preference.dataset.value;
            }

            localStorage.setItem('platform', JSON.stringify(config_array));
            Main.setUserThemePrefrences();
        } catch(e) {
            console.log("Sorry theming is disabled by your browser");
        }
    },

    setUserThemePrefrences: function () {
        try {
            let config_array = JSON.parse(localStorage.getItem('platform'));
            Main.setUserColorPrefrences(config_array);
            Main.setUserMenuPrefrences(config_array);
            Main.setUserImgPrefrences(config_array);
            Main.setUserSidebarWidth(config_array);
        } catch (e){
            console.log("Sorry theming is disabled by your browser");
        }
    },

    setUserImgPrefrences: function (config_array) {
        let img_element = document.getElementById('cz-bg-image');
        if (config_array.image) {
            $('.sidebar-background').css('display', 'block');
        } else {
            $('.sidebar-background').css('display', 'none');
        }
    },
    setUserColorPrefrences: function (config_array) {
        let color_elements_array = document.getElementsByClassName('theme-color');
        for (let i in color_elements_array) {
            if (color_elements_array[i].dataset.colorName === config_array.color) {
                color_elements_array[i].click();
                break;
            }
        }
        $('.thead-inverse th').removeClass(() => {
            let classes = $('.thead-inverse th').attr('class');
            if (classes != undefined) {
                let el_class = classes.match(/(^|\s)bg-\S+/g) + " ";
                el_class += classes.match(/(^|\s)gradient-\S+/g) + " ";
                $('.thead-inverse th').removeClass(el_class);
            }
        });
        $('.thead-inverse th').addClass(config_array.color);
    },

    setUserSidebarWidth: function (config_array) {
        var width = config_array.sidebar;
        var wrapper = $('.wrapper');

        if (width === 'small') {
            $(wrapper).removeClass('sidebar-lg').addClass('sidebar-sm');
        } else if (width === 'large') {
            $(wrapper).removeClass('sidebar-sm').addClass('sidebar-lg');
        } else {
            $(wrapper).removeClass('sidebar-sm sidebar-lg');
        }
    },

    setUserMenuPrefrences: function (config_array) {
        let menu_element = document.getElementById('cz-compact-menu');
        if (config_array.menu === 'small') {
            menu_element.click();
        }
    },

    dynamicallyLoadScript: function (url) {
        let script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    },

    tableView() {
        Main.toggleGraphTableView();
    },

    generateChart(data, element_id) {
        let chart = new Chartist.Line('#' + element_id, {
            // add  labels
            labels: data.names,
            // add data
            series: [
                data.values
            ]
        }, {
            // chart padding
            chartPadding: {
                top: 30,
                right: 0,
                bottom: 20,
                left: 20
            },
            // X-Axis specific configuration
            axisX: {
                // Disable grid
                showGrid: true
            },
            // Y-Axis specific configuration
            axisY: {
                // Disable labels and grid
                showLabel: true,
                showGrid: true
            }
        });
    },

    mobileTables: function () {
        var tables = $('.mtable');
        initMobileTables();
        collapseAll();

        tables.on('page.dt', function () {
            initMobileTables();
        });
        $(window).resize(function () {
            collapseAll();
            setClickers();
        });

        function initMobileTables() {
            var table_headers = [];
            tables.each(function () {
                var th = [];
                $(this).find('thead th').each(function () {
                    th.push($(this).text());
                });
                table_headers.push(th);
            });
            tables.each(function (table) {
                var table_index = table;
                // Iterate through each row
                $(this).find('tbody tr').each(function () {
                    $(this).find('td').each(function (column) {
                        $(this).attr('data-label', table_headers[table_index][column]);
                    });
                });
            });
            setClickers();
        }

        function setClickers() {
            if (isMobileScreen()) {
                $('td[data-label="Name"]').on('click', function () {
                    $(this).siblings().slideToggle(100, function () {
                    });
                });
                $('td[data-label="Date"]').on('click', function () {
                    $(this).siblings().slideToggle(100, function () {
                    });
                });
            } else {
                $('td[data-label="Name"]').off('click', () => {
                });
                $('td[data-label="Date"]').off('click', () => {
                });
            }
        }

        function collapseAll() {
            if (isMobileScreen()) {
                $('td[data-label="Name"]').each(function () {
                    $(this).siblings().css('display', 'none');
                });
                $('td[data-label="Date"]').each(function () {
                    $(this).siblings().css('display', 'none');
                });

            } else {
                $('td[data-label="Name"]').each(function () {
                    $(this).siblings().css('display', '');
                });
                $('td[data-label="Date"]').each(function () {
                    $(this).siblings().css('display', '');
                });
            }
        }
    }
};

$(function () {
    Main.init();
});


$(document).ready(function () {

    $('#campaign-select').on('change', function () {
        window.location = '/campaigns?selectedCampaignId=' + $(this).val();
    });

    if (typeof unauthorized === 'undefined') {
        $.get('/payment_methods/get_balance', function (data) {
            $('#userCurrentBalance, .totalAmount').html(Number(data).toLocaleString());
        });
    }

    $('.theme-color').click((e) => {
        let element = e.target;
        Main.configUserTheme(element);
    });

});

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
};

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
};

function isMobileScreen() {
    if ($(window).width() <= 576) {
        return true;
    }
    return false;
}

function scroolToElement(elTag) {
    var el = document.querySelector(elTag);
    if (el) {
        el.scrollIntoView({
            behavior: 'smooth'
        });
    }
}


function fireCustomEvent(eventName, data) {
    data = typeof data !== "undefined" ? data : null;
    var event = new CustomEvent(eventName, {'detail': data});
    window.dispatchEvent(event);
}