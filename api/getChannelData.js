const { google } = require('googleapis');

const apiKey = 'YOUR_API_KEY';
const youtube = google.youtube({
  version: 'v3',
  auth: apiKey
});

module.exports = async (req, res) => {
  const { channelUrls } = req.body;
  let results = [];

  for (const channelUrl of channelUrls) {
    const match = channelUrl.match(/@([a-zA-Z0-9_\-]+)/);
    if (match) {
      const q = match[1];
      const searchResponse = await youtube.search.list({
        part: 'snippet',
        q,
        type: 'channel'
      });

      const channelId = searchResponse.data.items[0].snippet.channelId;
      const statsResponse = await youtube.channels.list({
        part: 'statistics',
        id: channelId
      });

      const subscriberCount = statsResponse.data.items[0].statistics.subscriberCount;

      results.push({ url: channelUrl, subscriberCount });
    } else {
      results.push({ url: channelUrl, error: '無法獲取頻道ID' });
    }
  }

  res.json(results);
};