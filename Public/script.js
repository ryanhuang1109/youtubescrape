document.getElementById('channel-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const channelUrls = document.getElementById('channel_urls').value.split('\n').filter(url => url.trim() !== '');
    fetch('/get_channel_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel_urls: channelUrls })
    })
    .then(response => response.json())
    .then(data => {
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
        data.forEach(channelData => {
            if (channelData.error) {
                resultDiv.innerHTML += `<p>${channelData.url}: ${channelData.error}</p>`;
            } else {
                resultDiv.innerHTML += `
                    <p>URL: ${channelData.url}</p>
                    <p>訂閱數: ${channelData.subscriber_count}</p>
                    <p>2024年5月影片上傳數: ${channelData.upload_count}</p>
                    <p>2024年5月影片總觀看數: ${channelData.total_views}</p>
                    <hr>
                `;
            }
        });
    })
    .catch(error => console.error('Error:', error));
});