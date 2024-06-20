$(document).ready(function() {
    let items = [];

    // Add item to list
    $('#addItemForm').submit(function(event) {
        event.preventDefault();
        const itemName = $('#itemName').val();
        const itemCategory = $('#itemCategory').val();
        items.push({ name: itemName, category: itemCategory });
        updateTable();
        $('#addItemForm')[0].reset();
    });

    // Update table
    function updateTable() {
        const tbody = $('#itemsTable tbody');
        tbody.empty();
        items.forEach((item, index) => {
            const row = `<tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td><button class="btn btn-danger delete-btn" data-index="${index}">Delete</button></td>
            </tr>`;
            tbody.append(row);
        });

        // Attach delete event
        $('.delete-btn').click(function() {
            const index = $(this).data('index');
            items.splice(index, 1);
            updateTable();
        });
    }

    // Dark mode toggle
    $('#darkModeToggle').click(function() {
        $('body, header, footer').toggleClass('dark-mode');
        $('#itemsTable').toggleClass('table-dark');
        $('.btn').toggleClass('btn-dark-mode');
    });

    // Contact form submit
    $('#contactForm').submit(function(event) {
        event.preventDefault();
        const name = $('#contactName').val();
        const email = $('#contactEmail').val();
        const phone = $('#contactPhone').val();
        const message = $('#contactMessage').val();
        alert(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`);
        $('#contactForm')[0].reset();
    });
});
