document.getElementById('word').addEventListener('input', function() {
    const word = this.value;
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
                    const meaning = data[0].meanings[0].definitions[0].definition;
                    const example = data[0].meanings[0].definitions[0].example;
                    document.getElementById('meaning').textContent = meaning;
                    document.getElementById('example').textContent = example;
                } else {
                    document.getElementById('meaning').textContent = 'No definition found';
                    document.getElementById('example').textContent = '';
                }
            })
            .catch(error => {
                document.getElementById('meaning').textContent = 'Error occurred';
                document.getElementById('example').textContent = '';
            });
    } else {
        document.getElementById('meaning').textContent = '';
        document.getElementById('example').textContent = '';
    }
});