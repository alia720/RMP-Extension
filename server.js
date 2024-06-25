const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/getRating', async (req, res) => {
  const profName = req.query.profName;
  console.log(`Received request for professor: ${profName}`);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const searchURL = `https://www.ratemyprofessors.com/search/professors/1416?q=${encodeURIComponent(profName)}`;
    console.log(`Navigating to: ${searchURL}`);

    await page.goto(searchURL);

    const rating = await page.evaluate(() => {
      const ratingElement = document.querySelector('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.icXUyq');
      return ratingElement ? ratingElement.innerText : 'N/A';
    });

    console.log(`Scraped rating: ${rating}`);

    await browser.close();
    res.json({ rating });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
