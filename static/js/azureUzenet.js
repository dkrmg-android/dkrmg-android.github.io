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
						.append(item.__createdAt)))
					.append($('<p>').append(item.szoveg))
					.append($('<hr/>'));
            });

            $('#uzenet-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + todoItems.length + '</strong> üzenet');
        }, handleError);
		
    }

	/*
	return $('<div>')
                    .attr('data-todoitem-id', item.id)
                    .append($('<p>').append(item.felado)
						.append($('<span>')
						.attr("style=\"float:right;\"")
						.append(item.__createdAt)))
					.append($('<p>').append(item.szoveg))
					.append($('<hr/>'));
	*/
    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    // On initial load, start by fetching the current data
    refreshTodoItems();
});