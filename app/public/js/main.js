function deleteBook(bookID, buttonRef) {
    if (buttonRef !== null) {
        $.ajax({
            url: "prwebStep2.json",
            method: "POST",
            data: {
                "bookID" : bookID,
            },
            success: function (theResult) {
                var ref = buttonRef;
                while ((ref !== null) && (ref.tagName !== "TR")) {
                    ref = ref.parentElement;
                }
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
    var isEditing = buttonRef.textContent === 'Save';
    if (!isEditing) {
        for (var i = 1; i < cells.length - 1; i++) {
            var cell = $(cells[i]);
            var text = cell.text();
            cell.empty();
            $('<input type="text">').val(text).appendTo(cell);
        }
        buttonRef.textContent = 'Save';
    } else {
        for (var i = 1; i < cells.length - 1; i++) {
            var cell = $(cells[i]);
            var text = cell.find('input').val();
            cell.empty();
            cell.text(text);
        }
        buttonRef.innerHTML = '<img src="assets/edit.png" alt="Edit" class="icon">';
    }
}