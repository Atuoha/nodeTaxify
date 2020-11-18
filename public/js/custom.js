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
classic
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

// booking
$('#distance_form').submit(function(e){
    e.preventDefault();
    let data = $(this).serialize();

    // collecting data
    let to = $('#to_place').val();
    let from = $('#from_place').val();
    let plan = $('#plan').val();
    let date = $('#datepicker2').val();
    let time = $('#timepicker1').val();

    // assigning data
    $('#booking_to').html(to)
    $('#booking_from').html(from)
    $('#booking_plan').html(plan)
    $('#booking_time').html(`${date} | ${time}`)


    $('#distance_form').fadeOut('fast');
    $('.loading').fadeIn('fast');

    setTimeout( ()=>{     
        $('.loading').fadeOut('fast');
        $('#booking_details').fadeIn('fast');
    }, 3000)

    $.ajax({
        url: '',
        type: 'post',
        data: data,
        cache: false,
        success: (data=>{

            if(!data.error){
                $('#booking_details').fadeIn('slow')
                $('.booking_summary').css('display','none')
            }
        })
    })
})



 //   
//  $('select').selectpicker();
    $('#timepicker1').timepicker();

    // $('select').selectpicker();

   
    // multi_action     
  $('#del_form').submit(function(e){
    e.preventDefault()
    let data = $(this).serialize()
    let action = $(this).attr('action')
    console.log(data)

    $.ajax({
      url: action,
      data: data,
      type: 'Post',
       cache: false,
      success: function(response){
          if(!response.error){
            $('.multi_action').fadeOut('slow')
            $('.checkboxes').each(function(){
                this.checked = false
            })
            $('#checkbox').checked = false
          
            swal({  //sweetalert.js library
              title:  `Delete Success`,
              text: `Kudos! You've successfully performed operation on marked contacts. `,
              icon: "success",    
              timer: 5500,
              closeOnClickOutside: false  
            });

          }
      }

    })
  })


 })


