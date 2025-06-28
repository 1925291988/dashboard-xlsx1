<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Excel Simples</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f7f7f7;
        }
        h1 {
            margin-bottom: 20px;
        }
        canvas {
            margin-top: 20px;
        }
        button, input {
            padding: 10px 15px;
            margin: 10px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
        }
        button {
            background-color: #007bff;
            color: white;
        }
        button:hover {
            background-color: #0056b3;
        }
        .btn-clear {
            background-color: #dc3545;
        }
        .btn-clear:hover {
            background-color: #a71d2a;
        }
    </style>
</head>
<body>
    <h1>Dashboard Interativo - XLSX</h1>

    <input type="file" id="input-excel" accept=".xlsx" style="display:none;" />
    <button id="btn-import">Importar Planilha</button>
    <button id="btn-clear" class="btn-clear">Limpar Dados</button>
    <button id="btn-refresh">Atualizar Dados</button>

    <div style="width: 80%; margin: auto;">
        <canvas id="myChart" width="400" height="200"></canvas>
    </div>

    <!-- SheetJS (leitor de Excel) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <!-- Chart.js (gráficos) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.min.js"></script>

    <script>
        let chart;
        let currentFile;

        const inputExcel = document.getElementById('input-excel');
        const btnImport = document.getElementById('btn-import');
        const btnClear = document.getElementById('btn-clear');
        const btnRefresh = document.getElementById('btn-refresh');

        btnImport.addEventListener('click', () => inputExcel.click());

        inputExcel.addEventListener('change', function (e) {
            if (e.target.files.length > 0) {
                currentFile = e.target.files[0];
                readExcel(currentFile);
            }
        });

        btnClear.addEventListener('click', () => {
            if (chart) chart.destroy();
            alert('Dados limpos com sucesso!');
        });

        btnRefresh.addEventListener('click', () => {
            if (currentFile) {
                readExcel(currentFile);
            } else {
                alert('Nenhum arquivo carregado para atualizar.');
            }
        });

        function readExcel(file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const labels = [];
                const values = [];

                for (let i = 1; i < jsonData.length; i++) {
                    labels.push(jsonData[i][0]);
                    values.push(jsonData[i][1]);
                }

                drawChart(labels, values);
            };
            reader.readAsArrayBuffer(file);
        }

        function drawChart(labels, values) {
            const ctx = document.getElementById('myChart').getContext('2d');

            if (chart) chart.destroy();

            chart = new Chart(ctx, {
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
        }
    </script>
</body>
</html>
