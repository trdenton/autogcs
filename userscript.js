// ==UserScript==
// @name         gcsurplus 2
// @namespace    troydenton.ca
// @version      0.2
// @description  only local deals plz
// @author       Troy Denton
// @match        https://gcsurplus.ca/mn-eng.cfm*
// @icon         https:/gcsurplus.ca/assets/favicon-mobile.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==


(
    function() {
    'use strict';
    var dkey = "GCITEMS" + (new Date()).getDate();
    function next() {
        console.log("NEXT");
        var btns = $(".next a");
        if (btns.length > 0) {
            btns[0].click();
        }
        //this is the "next page" timer
        //page should reload before this triggers
        //when the next button is not clickable, we dont go anywhere, just display
        setTimeout(displayAll,5000);
    }
        
    function set_json(key,val) {
        GM_setValue(key,JSON.stringify(val));
    }
        
    function get_json(key) {
        if (GM_getValue(key))
            return JSON.parse(GM_getValue(key));
        else
            return [];
    }

    /*
    clear out today's data so we dont inflate the users cache
    */
    function clearData() {
        set_json(dkey,[]);
    }

    /*
    display items at the end of the next-page routine
    */
    function displayAll() {
        console.log("DISPLAY ALL");
        var newhtml = "";
        var items = get_json(dkey);
        console.log("ITEMS IS: ");
        console.log(typeof(items));
        console.log(items);
        items.forEach(function (val, index, array){
            newhtml += "<div>"+val+"</div>";
        });
        $("main").html(newhtml);
        $(".hideOverflow").removeClass("hideOverflow")
        // we got to this spot, after a minute clear the item cache
        setTimeout(clearData,60000);
    }

    /*
    log all items to persistant storage
    navigate to successive 'next' pages
    */
    function letsgo() {
        var currentPageEntries = [];
        $("tbody tr").each(function() {
            if (!$(this).html().match(/(North York)|(Toronto)/i)) {
                $(this).hide();
            } else {
                console.log("ADDING ITEM");
                currentPageEntries.push($(this).html());
            }
        }).promise().done(function() {
            console.log("DONE");
            var otherObjects = get_json(dkey);
            var objects = otherObjects.concat(currentPageEntries);
            set_json(dkey,objects);
            setTimeout(next,1000);
        });
    }

    // only run if theres a next button e.g. there are results on the page
    if ( $(".next a").length > 0 ) {
        letsgo();
    }


})();
