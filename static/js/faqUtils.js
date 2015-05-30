/**
 * Created by akos on 2014.11.07..
 */

var $template = $('#gyik-template');
var $container = $('.container');

function createGyikItem($content) {
    var $current = $template.clone();

    $current.addClass('gyik');

    // set section's id attribute
    $current.attr('id', $content.attr('id'));

    // set title
    $current.find('.gyik-outer h3').html($content.children('h3').html());

    var $gyikCards = $current.find('.gyik-cards');
    $content.children('img').each(function (idx, element) {
        var $origImage = $(element);
        var $header = $('<div/>')
            .addClass('index')
            .text((idx + 1)+'.');
        var $img = $('<img>')
            .attr('src', $origImage.attr('src'));
        var $caption = $('<div>')
            .addClass('caption')
            .html($origImage.next().html());

        $('<div>')
            .addClass('card')
            .append($header)
            .append($img)
            .append($caption)
            .appendTo($gyikCards);
    });

    $current.find('.description').html($content.children('.description').html());
    $content.remove();
    $container.append($current);
}

function populateContents()
{
	var ul = $('#contents');
	ul.empty();
	$('h3').each(function() {
		if ($(this).text() != null && $(this).text().length > 0)
		{
			ul.append($('<li/>').append($('<a/>', {text: $(this).text(), href: '#'+$(this).parent().parent().attr('id')})));
		}
	});
}

$('.gyik').each(function (index, element) {
    createGyikItem($(element));
});

$('.card pre').closest('.card').addClass('hascode');

populateContents();
