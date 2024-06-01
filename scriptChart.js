// color palette menggunakan format RGBA manual
const colorPalette = [
  'rgba(120, 90, 186, 1)',
  'rgba(65, 43, 154, 1)',
  'rgba(88, 152, 226, 1)',
  'rgba(157, 204, 246, 1)',
  'rgba(226, 213, 255, 1)',
  'rgba(226, 213, 255, 1)'
];

const createChart = (ctx, type, data, options) => {
  return new Chart(ctx, {
    type: type,
    data: data,
    options: options
  });
};

const fetchData = (url, callback) => {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(data => {
      callback(data);
    });
};

const sumOfRevenueCtx = document.getElementById('sumOfRevenue').getContext('2d');
fetchData('./data/SumOfRevenue.json', data => {
  // Group data by country
  const groupedData = {};
  data.forEach(row => {
    if (!groupedData[row.Country]) {
      groupedData[row.Country] = [];
    }
    groupedData[row.Country].push(row);
  });

  // Create datasets for each country
  const datasets = Object.keys(groupedData).map((country, index) => ({
    label: country,
    data: groupedData[country].map(row => row.Revenue),
    backgroundColor: colorPalette[index % colorPalette.length],
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }));

  // Create chart
  createChart(sumOfRevenueCtx, 'bar', {
    labels: data.map(row => row.Year),
    datasets: datasets
  });
});


// Data Rata-rata Penjualan Bulanan berdasarkan Continent (NA, Europa, Aust)
const monthlyRevenueByContinentCtx = document.getElementById('monthlyRevenueByContinent').getContext('2d');
fetchData('./data/Continent_Australia.json', data => {
  // You can fetch data for other continents in a similar manner
  const months = [...new Set(data.map(item => item.month))];
  const years = [...new Set(data.map(item => item.year))];

  // Assuming the structure of the fetched data is similar to Continent_Australia.json
  const datasets = years.map((year, index) => {
    return {
      label: year,
      data: months.map(month => {
        const item = data.find(d => d.year === year && d.month === month);
        return item ? item.average_revenue : 0;
      }),
      borderColor: colorPalette[index % colorPalette.length],
      backgroundColor: colorPalette[index % colorPalette.length].replace(', 1)', ', 0.2)')
    };
  });

  createChart(monthlyRevenueByContinentCtx, 'line', {
    labels: months,
    datasets: datasets
  });
});

// Average Revenue by Country
const avgRevenueCtx = document.getElementById('avgRevenue').getContext('2d');
fetchData('./data/Average Rev per Continent per Year.json', data => {
  const continents = [...new Set(data.map(item => item.continent))];
  const years = [...new Set(data.map(item => item.year))];

  const datasets = continents.map((continent, index) => {
    return {
      label: continent,
      data: years.map(year => {
        const item = data.find(d => d.year === year && d.continent === continent);
        return item ? item.average_revenue : 0;
      }),
      borderColor: colorPalette[index % colorPalette.length],
      backgroundColor: colorPalette[index % colorPalette.length].replace(', 1)', ', 0.2)')
    };
  });

  createChart(avgRevenueCtx, 'line', {
    labels: years,
    datasets: datasets
  });
});

// Revenue by Country
const pieSegmentCtx = document.getElementById('pieSegment').getContext('2d');
fetchData('./data/AverageRevperCountry.json', data => {
  createChart(pieSegmentCtx, 'pie', {
    labels: data.map(row => row.Country),
    datasets: [{
      label: 'Revenue',
      data: data.map(row => row.average_revenue),
      backgroundColor: colorPalette,
      hoverOffset: 6
    }]
  });
});

const topProductCategoryCtx = document.getElementById('topProductCategory').getContext('2d');
fetchData('./data/Top Product Categories.json', data => {
  const categories = [...new Set(data.map(item => item.category))];

  const datasets = categories.map((category, index) => ({
    label: category,
    data: data.filter(d => d.category === category).map(d => d.Revenue),
    backgroundColor: colorPalette[index % colorPalette.length].replace(', 1)', ', 0.2)'),
    borderColor: colorPalette[index % colorPalette.length],
    borderWidth: 1
  }));

  createChart(topProductCategoryCtx, 'bar', {
    labels: [...new Set(data.map(item => item.Year))],
    datasets: datasets
  });
});

// Average Revenue by Age Group
const monthlyRevenueCtx = document.getElementById('monthlyRevenue').getContext('2d');
fetchData('./data/Average Rev per Age Group.json', data => {
  createChart(monthlyRevenueCtx, 'bar', {
    labels: data.map(row => row.Age_Group),
    datasets: [{
      axis: 'y',
      label: 'Average Revenue by Age Group',
      data: data.map(row => row.Average_Revenue),
      fill: false,
      backgroundColor: [
        colorPalette[0].replace(', 1)', ', 0.2)'), // Adjust alpha value to 0.2
        colorPalette[1].replace(', 1)', ', 0.2)'), // Adjust alpha value to 0.2
        colorPalette[2].replace(', 1)', ', 0.2)'), // Adjust alpha value to 0.2
        colorPalette[3].replace(', 1)', ', 0.2)')  // Adjust alpha value to 0.2
      ],
      borderColor: [
        colorPalette[0],
        colorPalette[1],
        colorPalette[2],
        colorPalette[3]
      ],
      borderWidth: 1
    }]
  }, {
    indexAxis: 'y'
  });
});


document.getElementById('applyFilters').addEventListener('click', applyFilters);