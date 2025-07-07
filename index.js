const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

// ✅ Root route for browser test
app.get('/', (req, res) => {
  res.send('🟢 Scraper Backend is running! Use `/scrape?q=iphone` to get data.');
});

app.get('/scrape', async (req, res) => {
  const query = req.query.q;
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $('div.s-result-item').each((i, el) => {
      const title = $(el).find('h2 span').text();
      const image = $(el).find('img.s-image').attr('src');
      const price = $(el).find('.a-price-whole').first().text();
      const rating = $(el).find('.a-icon-alt').first().text();
      const link = 'https://www.amazon.in' + $(el).find('a.a-link-normal').attr('href');

      if (title && image && price) {
        results.push({
          title,
          image,
          price: `₹${price}`,
          rating,
          url: link,
        });
      }
    });

    res.json(results);
  } catch (error) {
    console.error('Scraping failed:', error.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
