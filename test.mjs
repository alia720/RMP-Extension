import fetch from 'node-fetch';

const testProfessorName = 'whoosh';  // Professors name to test scraping

const testFetchRating = async (profName) => {
  try {
    const response = await fetch(`http://localhost:3000/getRating?profName=${encodeURIComponent(profName)}`);
    const data = await response.json();
    console.log(`Professor: ${profName}, Rating: ${data.rating}`);
  } catch (error) {
    console.error('Error fetching rating:', error);
  }
};

testFetchRating(testProfessorName);
