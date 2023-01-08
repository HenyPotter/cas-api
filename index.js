const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeTable() {
  const response = await axios.get('https://online.atletika.cz/Propozice/propozice/66181');
  const $ = cheerio.load(response.data);
  const table = $('table.table-striped');
  const data = [];
  table.find('tr').each((i, row) => {
    const rowData = [];
    $(row).find('span.disciplineTypeAtTime').each((j, cell) => {
      rowData.push($(cell).text().trim());
    });
    data.push(rowData);
  });
  return data;
}

scrapeTable().then(data => {
  fs.writeFileSync('table.json', JSON.stringify(data));
});
