$(function () { //Same as document.addEventListener("DOMContentLoaded" ...

    // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
    $("#navbarToggle").blur(function (event) {
        var screenWidth = window.innerWidth; //width of browser window not montior
        if (screenWidth < 768) { 
            $("#collapsable-nav").collapse('hide');
        }
    });
});

(function (global) {

    var dc = {};

    var homeHTML = "snippets/home-snippet.html";
    var allCategoriesUrl =
      "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl =
      "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    //inserting HTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // show loading icon inside element identified by selector
    var showloading = function (selector) {
        var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        // flag g means everywhere it is found
        return string;
    }

    // on page load
    document.addEventListener("DOMContentLoaded", function (event) {
        showloading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHTML, 
            function (responseText) {
                document.querySelector('#main-content').innerHTML = responseText;
            },
        false);
    });

    // load menu categories view
    dc.loadMenuCategories = function () {
        showloading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCatergoriesHTML);
    };

    function buildAndShowCatergoriesHTML (categories) {
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                $ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
                    var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                        categoriesTitleHtml,
                        categoryHtml);
                    insertHtml("#main-content", categoriesViewHtml);
                },
                false);
            },
            false);
    }

    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {

        var finalHTML = categoriesTitleHtml;
        finalHTML += "<section class='row'>";

        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHTML += html;
        }
        finalHTML += "</section>";
        return finalHTML;
    }

    global.$dc = dc;
    })(window);
