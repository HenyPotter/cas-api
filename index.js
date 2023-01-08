const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTable() {
  const response = await axios.get('https://online.atletika.cz/Propozice/propozice/66181');

  const $ = cheerio.load(response.data);
  const table = $('table.timeTable.table-striped');

  const data = {};

  table.find('tr').each((i, row) => {

    const rowData = {};


    const center = $(row).find('td.center').text().trim().replace(/ {6}/g, '');
    const disciplineTypeAtTime = $(row).find('span.disciplineTypeAtTime').text().trim();

    rowData['time'] = center;
    rowData['discipline'] = disciplineTypeAtTime;

    data[i] = rowData;
  });

  // Return the data
  return data;
}

scrapeTable().then(data => {
  // Write the data to the file
  fs.writeFileSync('table.json', JSON.stringify(data).replace(/\\n                                                                /g, ''));
});
