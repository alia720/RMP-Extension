const fetch = require('node-fetch');

const testProfessorName = 'Fadhel Ghannouchi';  // Replace with a real professor's name for testing

const testFetchRating = async (profName) => {
  const response = await fetch(`http://localhost:3000/getRating?profName=${encodeURIComponent(profName)}`);
  const data = await response.json();
  console.log(`Professor: ${profName}, Rating: ${data.rating}`);
};

testFetchRating(testProfessorName);
