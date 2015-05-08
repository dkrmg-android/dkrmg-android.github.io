$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://dkrmg-szakkor-uzenofal.azure-mobile.net/', 'kZkkgmDCeseSiEjjJrwRgKKFKNjPAq13'),
        uzenetTable = client.getTable('uzenet');
		
    function refreshTodoItems() {
        var query = uzenetTable.orderByDescending("__createdAt").take(10);

        query.read({
            systemProperties: ['*']}).then(function(todoItems) {
            var listItems = $.map(todoItems, function(item) {
                return $('<div>')
                    .attr('data-todoitem-id', item.id)
                    .append($('<p>').append("<strong>" + item.felado + "</strong>")
						.append($('<span>')
						.attr('style','float:right; font-style: italic;')
						.append(dateToString(item.__createdAt))))
					.append($('<p>').append(item.szoveg))
					.append($('<hr/>'));
            });

            $('#uzenet-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + todoItems.length + '</strong> üzenet');
        }, handleError);
    }
    
    // take a date object and covert it to a neat string with hu loc.
    function dateToString(dateToConvert) {
    	var text = dateToConvert.getFullYear() + "." + (dateToConvert.getMonth()+1) + "." + dateToConvert.getDate() + ". ";
        text +=  dateToConvert.getHours() + ":" + dateToConvert.getMinutes() + ":" + dateToConvert.getSeconds();
        return text;
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    // On initial load, start by fetching the current data
    refreshTodoItems();
});
