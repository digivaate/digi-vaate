document.addEventListener('DOMContentLoaded', function () {
    $('.collapsible').collapsible();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();

    let elem_color = document.querySelectorAll('.dropdown-trigger');
    let options_color = {
        constrainWidth:false,
        coverTrigger:false,
        closeOnClick:false
    };
    let instance_color = M.Dropdown.init(elem_color, options_color);
    document.getElementById('color-picker').addEventListener('onclick',function(){
        instance_color.open();
    });

    let elem_material = document.querySelectorAll('.dropdown-trigger');
    let options_material = {
        constrainWidth:false,
        coverTrigger:false,
        closeOnClick:false
    };
    let instance_material = M.Dropdown.init(elem_material, options_material);
    document.getElementById('material-picker').addEventListener('onclick',function(){
        instance_material.open();
    });

});
