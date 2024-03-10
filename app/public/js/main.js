function deleteBook(bookID, buttonRef) {
    if (buttonRef !== null) {
        // Ajax call
        $.ajax({
            url: "prwebStep2.json",
            method: "POST",
            data: {
                "bookID" : bookID,
            },
            success: function (theResult) {
                var ref = buttonRef;
                // Find the closest ancestor that is a table row.
                while ((ref !== null) && (ref.tagName !== "TR")) {
                    ref = ref.parentElement;
                }
                // If a table row was found, remove it from the DOM.
                if (ref !== null) { 
                    ref.parentElement.removeChild(ref);
                }
            },
            error: function(theResult, theStatus, theError) {
                console.log("Error : "+theStatus +" - "+theResult);
                console.log("The error : "+theError);
            }
        });
    }
}

// Function without AJAX call
function deleteBook2(bookID, buttonRef) {
    if (buttonRef != null) {
        $(buttonRef).closest('tr').remove();
    }
}

// Function without AJAX call
function editBook2(bookID, buttonRef) {
    var row = $(buttonRef).closest('tr');
    var cells = row.find('td');

    // Check the button's text content before it's changed
    var isEditing = buttonRef.textContent === 'Save';

    if (!isEditing) {
        // Replace the text with input fields
        for (var i = 1; i < cells.length - 1; i++) {
            var cell = $(cells[i]);
            var text = cell.text();
            cell.empty();
            $('<input type="text">').val(text).appendTo(cell);
        }

        // Change the button's text content to 'Save'
        buttonRef.textContent = 'Save';
    } else {
        // Replace the input fields with the new text
        for (var i = 1; i < cells.length - 1; i++) {
            var cell = $(cells[i]);
            var text = cell.find('input').val();
            cell.empty();
            cell.text(text);
        }

        // Change the button's text content back to 'Edit'
        // Replace the text with the image
        buttonRef.innerHTML = '<img src="assets/edit.png" alt="Edit" class="icon">';
    }
}