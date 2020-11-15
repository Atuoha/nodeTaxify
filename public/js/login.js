$(document).ready( ()=>{
    $('#register_activator').click( ()=>{
        $('.register_interface').fadeIn('slow'); 
        $('.login_interface').css('display','none');

    });


    $('.login_activator').click( ()=>{
        $('.login_interface').fadeIn('slow');  
        $('.register_interface').css('display','none');
        $('.forgot_interface').css('display','none');

    });


    $('#forgot_activator').click( ()=>{
        $('.forgot_interface').fadeIn('slow');        
        $('.login_interface').css('display','none');
    });

});