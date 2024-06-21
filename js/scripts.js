$(document).ready(function() {
    let tasks = []; // Array to store tasks

    // Function to add task to the list
    $('#taskForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Extract task details from form
        const taskName = $('#taskName').val();
        const taskDescription = $('#taskDescription').val();
        const taskImportance = parseInt($('#taskImportance').val());

        // Validate importance value
        if (isNaN(taskImportance) || taskImportance < 1 || taskImportance > 10) {
            // Show error message in modal if validation fails
            $('#errorMessage').modal('show');
            return;
        }

        // Add task to tasks array
        tasks.push({ name: taskName, description: taskDescription, importance: taskImportance });

        updateTable(); // Update table with tasks
        $('#taskForm')[0].reset(); // Reset form after adding task
    });

    // Function to update the table with current tasks
    function updateTable() {
        const tbody = $('#tasksTable tbody');
        tbody.empty(); // Clear existing rows

        // Sort tasks by importance (descending)
        tasks.sort((a, b) => b.importance - a.importance);

        // Loop through sorted tasks and create table rows
        tasks.forEach((task, index) => {
            const row = `<tr data-index="${index}">
                <td class="editable" data-field="name">${task.name}</td>
                <td class="editable" data-field="description">${task.description}</td>
                <td class="editable" data-field="importance">${task.importance}</td>
                <td><button class="btn btn-danger delete-btn" data-index="${index}">Delete</button></td>
            </tr>`;
            tbody.append(row);
        });

        // Implement inline editing for table cells
        $('.editable').click(function() {
            const td = $(this);
            const currentValue = td.text().trim();
            const field = td.data('field');
            const rowIndex = td.closest('tr').data('index');

            // Create input field for editing
            const inputField = $('<input>', {
                type: 'text',
                class: 'form-control',
                value: currentValue,
                dataField: field
            });

            // Replace text with input field
            td.html(inputField);

            // Focus on input and bind blur event to save changes
            inputField.focus().blur(function() {
                const newValue = $(this).val().trim();
                tasks[rowIndex][field] = newValue;
                updateTable(); // Update table after editing
            });
        });
    }

    // Event handler to delete task using event delegation
    $('#tasksTable').on('click', '.delete-btn', function(event) {
        event.stopPropagation(); // Prevent inline editing trigger

        // Get index of task to delete and remove it from tasks array
        const index = $(this).data('index');
        tasks.splice(index, 1);

        updateTable(); // Update table after deletion
    });

    // Function to sort table by column index
    function sortTable(columnIndex) {
        const tbody = $('#tasksTable tbody');
        const rows = tbody.find('tr').get();

        rows.sort((rowA, rowB) => {
            const cellA = $(rowA).children('td').eq(columnIndex).text().toLowerCase();
            const cellB = $(rowB).children('td').eq(columnIndex).text().toLowerCase();

            if (columnIndex === 2) {
                return parseInt(cellA) - parseInt(cellB); // Numerical sort for importance column
            } else {
                return cellA.localeCompare(cellB); // Default alphabetical sort
            }
        });

        tbody.empty(); // Clear existing rows
        rows.forEach(row => {
            tbody.append(row); // Append sorted rows
        });

        // Update active header class for sorting indicator
        $('#tasksTable th').removeClass('active');
        $('#tasksTable th').eq(columnIndex).addClass('active');
    }

    // Event handler for dark mode toggle button
    $('#darkModeToggle').click(function() {
        $('body').toggleClass('dark-mode'); // Toggle dark mode class on body
        $('.footer').toggleClass('text-white'); // Toggle text color to white for footer
        $('.btn-primary').toggleClass('btn-dark-mode'); // Toggle dark mode button style
        $('.card.avatar-bio-card').toggleClass('dark-mode'); // Toggle bio card style
    });

    // Functionality for contact form submission
    $('#contactForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Extract contact form data
        const contactName = $('#contactName').val();
        const contactEmail = $('#contactEmail').val();
        const contactPhone = $('#contactPhone').val();
        const contactMessage = $('#contactMessage').val();

        // Populate popup with submitted information
        $('#popupMessage .modal-body').html(`
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${contactEmail}</p>
            <p><strong>Phone:</strong> ${contactPhone}</p>
            <p><strong>Message:</strong><br>${contactMessage}</p>
        `);

        $('#popupMessage').modal('show'); // Display popup message
        $('#contactForm')[0].reset(); // Reset contact form after submission
    });

    // Event handler for hiding error modal after validation
    $('#errorMessage').on('hidden.bs.modal', function () {
        $('#taskImportance').focus(); // Focus back on importance input after closing modal
    });

    // Live search filtering based on input
    $('#searchInput').on('input', function() {
        const query = $(this).val().trim().toLowerCase();

        // Filter table rows based on search query
        $('#tasksTable tbody tr').each(function() {
            const name = $(this).find('td[data-field="name"]').text().toLowerCase();
            const description = $(this).find('td[data-field="description"]').text().toLowerCase();
            const importance = $(this).find('td[data-field="importance"]').text().toLowerCase();

            if (name.includes(query) || description.includes(query) || importance.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Initial table update on page load
    updateTable(); // Update table with initial data
});
