document.addEventListener('DOMContentLoaded', function () {
    let elem = document.querySelector('.modal');
    let options = {opacity: 0.5};
    let instance = M.Modal.init(elem, options);
    document.getElementById('start-form').addEventListener('onclick',function(){
        instance.open();
    });

    let elem_profile = document.querySelectorAll('.dropdown-trigger');
    let options_profile = {
        constrainWidth:false,
        coverTrigger:false
    };
    let instance_profile = M.Dropdown.init(elem_profile, options_profile);
    document.getElementById('profile-nav').addEventListener('onclick',function(){
        instance_profile.open();
    });

    let elem_noti = document.querySelectorAll('.dropdown-trigger');
    let options_noti = {
        constrainWidth:false,
        coverTrigger:false
    };
    let instance_noti = M.Dropdown.init(elem_noti, options_noti);
    document.getElementById('notification-nav').addEventListener('onclick',function(){
        instance_noti.open();
    });

});