const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require("express");

const app = express();

async function scrapeTable() {
  const response = await axios.get('https://online.atletika.cz/Propozice/propozice/66181');

  const $ = cheerio.load(response.data);
  const table = $('table.timeTable.table-striped');

  const data = {};

  table.find('tr').each((i, row) => {

    const rowData = {};


    const center = $(row).find('td.center').text().trim()
    const disciplineTypeAtTime = $(row).find('span.disciplineTypeAtTime').text().trim().replace(/  +/g, ' ');

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

const final_data = require('table.json')
app.get('/casak', function (req, res) {
  res.json(final_data);
})


app.listen(3000, () => {
  console.log("Server started | http://localhost:3000");
});