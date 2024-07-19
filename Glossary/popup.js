document.getElementById('search').addEventListener('click', function() {
    const word = document.getElementById('word').value;
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
                    const meaning = data[0].meanings[0].definitions[0].definition;
                    document.getElementById('meaning').textContent = meaning;
                } else {
                    document.getElementById('meaning').textContent = 'No definition found';
                }
            })
            .catch(error => {
                document.getElementById('meaning').textContent = 'Error occurred';
            });
    } else {
        document.getElementById('meaning').textContent = 'Loading...';
    }
});




