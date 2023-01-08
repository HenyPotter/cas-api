const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTable() {
  // Make a request to the webpage
  const response = await axios.get('https://online.atletika.cz/Propozice/propozice/66181');

  // Load the HTML into cheerio
  const $ = cheerio.load(response.data);

  // Select the table using the element selector
  const table = $('table.timeTable.table-striped');

  // Initialize an empty array to store the data
  const data = [];

  // Loop through each row in the table
  table.find('tr').each((i, row) => {
    // Initialize an empty array to store the row data
    const rowData = [];

    // Loop through each cell in the row
    $(row).find('td').each((j, cell) => {
      // Push the cell data to the row data array
      rowData.push($(cell).text().trim());
    });

    // Push the row data to the overall data array
    data.push(rowData);
  });

  // Return the data
  return data;
}

scrapeTable().then(data => {
  // Write the data to the file, replacing \n characters with an empty string
  fs.writeFileSync('table.json', JSON.stringify(data).originalString.replace(/\\n                                                                /g, ''));
});
