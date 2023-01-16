const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require("express");

const app = express();

async function scrapeTable() {
  const response = await axios.get('https://online.atletika.cz/Propozice/propozice/');

  const $ = cheerio.load(response.data);
  const table = $('table.timeTable.table-striped');

  const data = {};

  table.find('tr').each((i, row) => {

    const rowData = {};

    const center = $(row).find('td.center').text().trim()
    const disciplineTypeAtTime = $(row).find('span.disciplineTypeAtTime').text().trim().replace(/\s+/g, " ").split('|').map(s => s.trim());;
    
    rowData['time'] = center;
    rowData['discipline'] = disciplineTypeAtTime.split('/n').map(s => s.trim());

    data[i] = rowData;
  });

  delete data[0]
  return data;
}

scrapeTable().then(data => {
  fs.writeFileSync('table.json', JSON.stringify(data).replace(/\\n/g, ''));
});

scrapeTable().then(data => {
  // Write the data to the file
  fs.writeFileSync('table.json', JSON.stringify(data).replace(/\\n                                                                /g, ''));
});

const final_data = require('table.json')
app.get('/casak/',casakID, function (req, res) {
  res.json(final_data);
})


app.listen(3000, () => {
  console.log("Server started | http://localhost:3000");
});
