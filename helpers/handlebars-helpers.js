const moment  = require('moment')

module.exports = {


    select: function(selected, options){
        console.log(options.fn(this))
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"')
    },

    generate_date: function(date, format){
        
        return moment(date).format(format)
    },

    ifeq: function(a, b, options){
        if (a == b) { return options.fn(this); }
        return options.inverse(this);
    },

    paginate: function(options){
        let output = ''

        // Setting up link for First Page Navigs
        if (options.hash.current === 1) {
            output += `<li class="page-item disabled"><a class="page-link" >First Page &larr;</a></li>`
        }else{
            output += `<li class="page-item "><a class="page-link" href="?page=1">First Page &larr;</a></li>`
        }

        //Assigning default values to variable i which is used for link set ups
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1)

            // Placing dots on the link while there are 4 extra pages to fetch from the left
        if(i !== 1){
            output += `<li class="page-item "><a class="page-link">...</a></li>`
        }

        // Iterating with conditions
        for (; i <=  (Number(options.hash.current)) + 4 && i <= options.hash.pages; i++ ){
            
            if (i === options.hash.current){
                // Fetching current Page and assigning active class to it's link
              output += `<li class="page-item active"><a class="page-link" href="javascript:void(0)">${i}</a></li>`
            }else{
                // Fetching middle Page Numbers
              output += `<li class="page-item "><a class="page-link" href="?page=${i}">${i}</a></li>`
            }

            // Placing dots on the link while there are 4 extra pages to fetch from the right
            if(i === Number(options.hash.current) + 4 && i < options.hash.pages ){
                output += `<li class="page-item "><a class="page-link">...</a></li>`
            }
        }

        

        // Fetcing Last Page Link
        if(options.hash.current === options.hash.pages){
            output += `<li class="page-item disabled"><a class="page-link">Last Page &rarr;</a></li>`
        }else{
            output += `<li class="page-item "><a class="page-link" href="?page=${options.hash.pages}">Last Page &rarr;</a></li>`
        }

        return output
    },

    
}