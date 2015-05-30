/**
 * Created by akos on 2014.11.07..
 */

var $template = $('#gyik-template');
var $container = $('.container');
var $sideBar = $('#sidebar');

function minimiseSidebar() {
	$sideBar.animate({
		width: "28px"
	}, 100);
	//$sideBar.style.width = '20px';
	$sideBar.find('#contents').hide();
	$sideBar.find('.verticalLine').show();
}

function maximiseSidebar() {
	$sideBar.animate({
		width: "200px"
	}, 100);
	//$sideBar.style.width = '200px';
	$sideBar.find('.verticalLine').hide();
	$sideBar.find('#contents').show();
}

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

function populateContents() {
    var ul = $('#contents');
    ul.empty();
    $('h3', '.gyik').each(function () {
        var $title = $(this);
        if ($title.text() != null && $title.text().length > 0) {
            ul.append(
                $('<li>').append(
                    $('<a>', {href: '#' + $title.parent().parent().attr('id')})
                        .text($title.text())
                )
            );
        }
    });
}

$('.gyik').each(function (index, element) {
    createGyikItem($(element));
});


$('.card pre').closest('.card').addClass('hascode');

$sideBar.mouseenter(maximiseSidebar);
$sideBar.mouseleave(minimiseSidebar);

populateContents();
