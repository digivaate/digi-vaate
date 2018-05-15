$(document).ready(function(){
    $('.tabs').tabs();
    $('.modal').modal();
    $('.dropdown-trigger').dropdown();
    let getCollections = document.getElementById("collections");
    let getOrders = document.getElementById("orders");
    let getMembers = document.getElementById("members");
    let getSettings = document.getElementById("settings");
    function onetime(node, type) {
        node.addEventListener(type, function() {
            if ((getCollections.className == "tab active") ||
                (getOrders.className == "tab active") ||
                (getMembers.className == "tab active") ||
                (getSettings.className == "tab active"))
            {
                getCollections.className = "tab";
                getOrders.className = "tab";
                getMembers.className = "tab";
                getSettings.className = "tab";
            }
            node.className += " active";
        });
    }
    onetime(getCollections,'click');
    onetime(getOrders,'click');
    onetime(getMembers,'click');
    onetime(getSettings,'click');
});
