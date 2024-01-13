 function calculate() {
            const saleWeight = parseFloat(document.getElementById('sale-weight').value);
            const saleRate = parseFloat(document.getElementById('sale-rate').value);
            const collectionValue = parseFloat(document.getElementById('collection-value').value);
            const tcsToggle = document.getElementById('tcs-toggle').checked;
            const collectionToggle = document.getElementById('collection-toggle').checked;

            if (isNaN(saleWeight) || isNaN(saleRate)) {
                document.querySelector('.result').style.display = 'none';
                return;
            }

            const saleValue = saleWeight * saleRate;
            const tcs = tcsToggle ? saleValue * 0.001 : 0;
            const netSaleValue = saleValue + tcs;
            const excessCollection = collectionValue - netSaleValue;
            const dueAmount = netSaleValue - collectionValue;

            document.querySelector('.result').style.display = 'block';
            document.querySelector('.result p:first-child span').textContent = saleWeight.toFixed(2);
            document.querySelector('.result p:nth-child(2) span').textContent = saleRate.toFixed(2);
            document.querySelector('.result p:nth-child(3) span').textContent = saleValue.toFixed(2);

            if (tcsToggle) {
                document.querySelector('.result p:nth-child(4)').classList.remove('hide');
                document.querySelector('.result p:nth-child(4) span').textContent = tcs.toFixed(2);
                document.querySelector('.result p:nth-child(5)').classList.remove('hide');
                document.querySelector('.result p:nth-child(5) span').textContent = netSaleValue.toFixed(2);
            } else {
                document.querySelector('.result p:nth-child(4)').classList.add('hide');
                document.querySelector('.result p:nth-child(5)').classList.add('hide');
            }

            if (!collectionToggle) {
                document.querySelector('.result p.excess').classList.add('hide');
                document.querySelector('.result p.due').classList.add('hide');
                document.querySelector('.result p.completed').classList.add('hide');
            } else {
                document.querySelector('.result p.excess').classList.remove('hide');
                document.querySelector('.result p.due').classList.remove('hide');
                document.querySelector('.result p.completed').classList.remove('hide');

                if (excessCollection >= 0) {
                    document.querySelector('.result p.excess').classList.remove('hide');
                    document.querySelector('.result p.excess span').textContent = excessCollection.toFixed(2);
                } else {
                    document.querySelector('.result p.excess').classList.add('hide');
                }

                if (dueAmount >= 0) {
                    document.querySelector('.result p.due').classList.remove('hide');
                    document.querySelector('.result p.due span').textContent = dueAmount.toFixed(2);
                } else {
                    document.querySelector('.result p.due').classList.add('hide');
                }

                if (excessCollection === dueAmount) {
                    document.querySelector('.result p.excess').classList.add('hide');
                    document.querySelector('.result p.due').classList.add('hide');
                    document.querySelector('.result p.completed').classList.remove('hide');
                } else {
                    document.querySelector('.result p.completed').classList.add('hide');
                }
            }
        }

        const inputFields = document.querySelectorAll('.input-field input');
        inputFields.forEach(input => {
            input.addEventListener('input', calculate);
        });

        const collectionToggle = document.getElementById('collection-toggle');
        const collectionInputField = document.getElementById('collection-input-field');

        function toggleCollectionInput() {
            if (collectionToggle.checked) {
                collectionInputField.style.display = 'block';
            } else {
                collectionInputField.style.display = 'none';
                document.querySelector('.result p.excess').classList.add('hide');
                document.querySelector('.result p.due').classList.add('hide');
                document.querySelector('.result p.completed').classList.add('hide');
            }
        }

        collectionToggle.addEventListener('change', () => {
            calculate();
            toggleCollectionInput();
        });

        const tcsToggle = document.getElementById('tcs-toggle');
        tcsToggle.addEventListener('change', calculate);
		
		function shareScreenshot() {
    // Capture the screenshot using html2canvas
    html2canvas(document.querySelector('.calculator-container')).then(function (canvas) {
        // Convert canvas to data URL
        const screenshotUrl = canvas.toDataURL('image/png');

        // Create a temporary anchor element for sharing
        const link = document.createElement('a');
        link.href = screenshotUrl;
        link.download = 'sales_calculator.png';
        link.target = '_blank';

        // Trigger the anchor element to simulate a click
        link.click();
    });
}
