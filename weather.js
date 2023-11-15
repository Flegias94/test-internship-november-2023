document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;
    var forecastDays = document.getElementById('forecast-days').value;

    var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&forecast_days=${forecastDays}&current=is_day,rain&daily=rain_sum,wind_speed_10m_max`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.daily || !data.daily.time) {
                document.getElementById('output').innerHTML = 'No data found';
            } else {
                var table = '<table><tr><th>Date</th><th>Rain sum</th><th>Wind Speed</th><th>Day/Night</th><th>Latitude</th><th>Longitude</th><th>Timezone</th></tr>';
                data.daily.time.forEach((time, index) => {
                    var date = new Date(time).toISOString().split('T')[0];  // Format the date
                    var rainSum = (data.daily.rain_sum[index] || 0) + ' ' + data.daily_units.rain_sum;  // Append the unit
                    var windSpeed = (data.daily.wind_speed_10m_max[index] || 0) + ' ' + data.daily_units.wind_speed_10m_max;  // Append the unit
                    var isDay = data.current.is_day ? 'Day' : 'Night';  // Get the 'Day/Night' value
                    table += `<tr><td>${date}</td><td>${rainSum}</td><td>${windSpeed}</td><td>${isDay}</td><td>${data.latitude}</td><td>${data.longitude}</td><td>${data.timezone}</td></tr>`;
                });
                table += '</table>';
                document.getElementById('tableOutput').innerHTML = table;

                // Call sortTable() after the table is generated
                setTimeout(sortTable, 0);
            }
        })
        .catch(error => console.error('Error:', error));
});

function sortTable() {
    var table = document.querySelector('#tableOutput table');
    if (!table) return;  // Exit if the table doesn't exist

    // Add event listener to each column header
    Array.from(table.rows[0].cells).forEach(function(cell, index) {
        // Exclude certain columns from sorting
        if (cell.innerText === 'Longitude' || cell.innerText === 'Latitude' || cell.innerText === 'Timezone') {
            return;
        }

        cell.addEventListener('click', function() {
            sortRows(table, index);
        });
    });

    // Sort by date column by default
    sortRows(table, 1);
}

// Function to sort rows
function sortRows(table, index, asc = true) {
    var rows = Array.from(table.rows).slice(1);
    rows.sort(function(rowA, rowB) {
        var cellA = rowA.cells[index].innerText;
        var cellB = rowB.cells[index].innerText;

        // Check if cells contain numbers or dates
        if (!isNaN(cellA) || !isNaN(new Date(cellA))) {
            cellA = !isNaN(cellA) ? Number(cellA) : new Date(cellA);
            cellB = !isNaN(cellB) ? Number(cellB) : new Date(cellB);
        }

        return (cellA < cellB ? -1 : cellA > cellB ? 1 : 0) * (asc ? 1 : -1);
    });

    // Append sorted rows to the table
    rows.forEach(function(row) {
        table.tBodies[0].appendChild(row);
    });
}