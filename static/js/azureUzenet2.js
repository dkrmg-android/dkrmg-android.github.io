/**
 * A custom Azure Mobile Services client (only a wrapper really).
 *
 * @type {{init: Function, fetchMessages: Function, _handleError: Function}}
 */
var uzenetClient = {
    /**
     * Initializes the custom client with the provided url and key. Also
     * opens a table that stores the messages.
     *
     * @param url The URL of the service
     * @param key The key to the service.
     */
    init: function (url, key) {
        var client = this.client = new WindowsAzure.MobileServiceClient(
            'https://dkrmg-szakkor-uzenofal.azure-mobile.net/',
            'kZkkgmDCeseSiEjjJrwRgKKFKNjPAq13'
        );
        this.uzenetTable = client.getTable('uzenet');
    },

    /**
     * Fetches the messages from the server, ordered by their creation date,
     * most recent first. Optionally limits the results by takeValue.
     *
     * @param takeValue Fetch at most this many records. Optional.
     * @param displayCallback Callback to process the fetched records.
     * @param errorHandler Optional error handler.
     */
    fetchMessages: function (takeValue, skipValue, displayCallback, errorHandler) {
        errorHandler = (typeof errorHandler === "function")
            ? errorHandler
            : this._handleError;

        var query = this.uzenetTable.orderByDescending("__createdAt");
		if (skipValue) {
			query.skip(skipValue);
		}
        if (takeValue) {
            query.take(takeValue);
        }

        query.read().then(displayCallback, errorHandler);
    },
    _handleError: function (error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        alert(text);
    }
};


//
// ############################################################################################################
//


/**
 * Various helper methods used on the site.
 */
 
var skipNumber = 0;
const listLen = 10;

function nextPage() {
	skipNumber += listLen;
	uzenetClient.fetchMessages(listLen, skipNumber, displayMessages);
}

function prevPage() {
	skipNumber = Math.max(0, skipNumber - listLen);
	uzenetClient.fetchMessages(listLen, skipNumber, displayMessages);
}
		
		

/**
 * Variables to hold the necessary DOM elments.
 */
var $messageTemplate, $messageList, $emptyMessage, $loadingMessage;

// take a date object and covert it to a neat string with hu loc.
function dateToString(dateToConvert) {
    var text = dateToConvert.getFullYear() + "." + (dateToConvert.getMonth()+1) + "." + dateToConvert.getDate() + ". ";
    text +=  dateToConvert.getHours() + ":" + dateToConvert.getMinutes() + ":" + dateToConvert.getSeconds();
    return text;
}

/**
 * Creates a DOM element by filling in the fields of the provided template
 * with the data in the message
 *
 * @param message The object with the data.
 * @param $template The template to inflate.
 * @returns A DOM element displaying the message data.
 */
function inflateMessage(message) {
    var $container = $messageTemplate.clone();

    $container.data('messageId', message.id);
    $container.find('.sender').text(message.felado);
    $container.find('.timestamp').text(dateToString(message.__createdAt));
    $container.find('.text').html(message.szoveg);
    $container.hide(); // initially hidden

    return $container;
}

/**
 * Displays the array of messages.
 *
 * @param messages The array of messages.
 */
function displayMessages(messages) {
    $messageList.empty();
    $loadingMessage.hide();
    if (messages.length > 0) {
        $emptyMessage.hide();
        var containers = $.map(messages, inflateMessage);
        $messageList.append(containers);
        animateSequentially($messageList.children().eq(0), 'show', [115]);
        $('#summary').html('Üzenetek: ' + (skipNumber + 1) + ' - ' + (skipNumber + 1 + messages.length));
		
		if (skipNumber > 0) {
			$('#prev-page').show();
		} else {
			$('#prev-page').hide();
		}
    } else {
        $messageList.hide();
        $messageList.empty();
        $emptyMessage.show();
    }
	
	if (messages.length == listLen) {
		$('#next-page').show();
	} else {
		$('#next-page').hide();
	}
}

/**
 * Sequentially calls the named function on all the siblings of the firstElem.
 *
 * @param firstElem The DOM element to start the animation with.
 * @param funcName A jQuery animation method that accepts a completion callback.
 * @param args The array of arguments to provide to the function.
 */
// from: http://www.paulirish.com/2008/sequentially-chain-your-callbacks-in-jquery-two-ways/
function animateSequentially(firstElem, funcName, args) {
    var newArgs = (args && args.constructor === Array) ? args.slice() : []; // http://stackoverflow.com/a/26633883/1119508
    newArgs.push(function () {
        $(this).next().length && animateSequentially($(this).next(), funcName, args);
    });
    firstElem[funcName].apply(firstElem, newArgs);
}
