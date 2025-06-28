
document.getElementById('input-excel').addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];

        var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        var labels = [];
        var values = [];

        for (var i = 1; i < jsonData.length; i++) { // Pula o cabeçalho
            labels.push(jsonData[i][0]);
            values.push(jsonData[i][1]);
        }

        var ctx = document.getElementById('myChart').getContext('2d');

        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dados da Planilha',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
});
