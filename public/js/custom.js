$(document).ready(function(){
   
			
// Obtaining all checkboxes
const basic= document.querySelector('.basic');
const deluxe = document.querySelector('.deluxe');
const classic = document.querySelector('.classic');

basic.addEventListener('click',function(e){
  console.log('basic is clicked')
  // THis hides all other checkboxes
  classic.style.display = 'none';
  basic.style.display = 'none';
  deluxe.style.display = 'none';

  // This changes the label of the checkbox
  document.querySelector('.accSentence').innerHTML = '<i class="fa fa-check-circle-o"></i> Basic Plan Selected';

  // This hides the check box of the selected input
  
  // This addes a value to the hidden input box
  document.getElementById('plan').value = 'Basic Plan';
})

deluxe.addEventListener('click',function(e){
  console.log('Deluxe is clicked')
  // THis hides all other checkboxes
  basic.style.display = 'none';
  classic.style.display = 'none';
  deluxe.style.display = 'none';

// This changes the label of the checkbox
  document.querySelector('.accSentence').innerHTML = '<i class="fa fa-check-circle-o"></i> Deluxe Plan Selected';


// This addes a value to the hidden input box
document.getElementById('plan').value = 'Deluxe Plan';

})
// classic
classic.addEventListener('click',function(e){
  console.log('classic is clicked')

   // THis hides all other checkboxes
  basic.style.display = 'none';
  deluxe.style.display = 'none';
  classic.style.display = 'none';

// This changes the label of the checkbox
  document.querySelector('.accSentence').innerHTML = '<i class="fa fa-check-circle-o"></i> Classic Plan Selected';

// This addes a value to the hidden input box
document.getElementById('plan').value = 'Classic Plan';

})
})


// processing payment
$('#process_btn').click(function(e){
  e.preventDefault()
      // collecting data
      let to = $('#to_place').val();
      let from = $('#from_place').val();
      let plan = $('#plan').val();
      let date = $('#datepicker2').val();
      let time = $('#timepicker1').val();
      let price = $('#price').attr('value')
  
      if(plan == ''){
        swal({  //sweetalert.js library
          title:  `No Plan Selected`,
          text: `Error! You can't proceed without choosing a booking plan. Select one! `,
          icon: "error",    
          timer: 5500,
          closeOnClickOutside: false  
        });
      }else{
            // assigning data
        $('#booking_to').html(to)
        $('#booking_from').html(from)
        $('#booking_plan').html(plan)
        $('#booking_price').html(price)
        $('#booking_time').html(`${date} | ${time}`)
  
  
        $('.form-section').fadeOut('fast');
        $('.header-right').css('background-color', 'white')
        $('.loading').fadeIn('fast');
  
        setInterval( ()=>{     
            $('.loading').fadeOut('fast');
            $('#booking_details').fadeIn('slow')     
            $('.booking_summary').css('display','none')
        }, 3000)

      }
  
})




  $('.custom-control-input').click(function(e){
    let attr = $(this).attr('value')
    let to  = $('#to_place').val()
    let from  = $('#from_place').val()

    let price = ''
    if(attr == 'deluxe'){
      price = 200
    }else if(attr == 'classic'){
      price = 150
    }else{
      price = 100
    }

    // if(to !== '' && from !== ''){
      $('#price').attr('value', '$'+price)
      $('#price').fadeIn('slow')
    // }
    
  })




  
// booking
$('#booking_form').submit(function(e){
  e.preventDefault();
  let data = $(this).serialize();

  let priceElement = $('#price').attr('value')
  let price = parseFloat(priceElement.replace('$', '')) * 100

  var stripe = Stripe(stripePublicKey);
  stripe.redirectToCheckout({
    lineItems: [{
      // Define the product and price in the Dashboard first, and use the price
      // ID in your client-side code.
      price: price
    }],
    mode: 'payment',
    successUrl: 'https://www.example.com/success',
    cancelUrl: 'https://www.example.com/cancel'
  });


    $.ajax({
        url: '/admin/booking/create',
        type: 'post',
        data: data,
        cache: false,
        success: (data=>{

            if(!data.error){
              swal({  //sweetalert.js library
              title:  `Booking Success`,
              text: `Kudos! You've successfully booked a taxi with nodeTaxify. Enjoy the ride! `,
              icon: "success",    
              timer: 5500,
              closeOnClickOutside: false  
            });
          }else{
            swal({  //sweetalert.js library
              title:  `Booking Error`,
              text: `Opps! Due to reasons you were unable to complete your booking process. Try again!. `,
              icon: "error",    
              timer: 5500,
              closeOnClickOutside: false  
            });
          }
        })
    })


    

    
})



//   
//  $('select').selectpicker();
  $('#timepicker1').timepicker();
  $('#datepicker2').datepicker();

 

