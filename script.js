// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// ===== Populate filter dropdowns =====
const regionFilter = document.getElementById('regionFilter');
const productFilter = document.getElementById('productFilter');

const regions = [...new Set(salesData.map(d => d.Region))].sort();
const products = [...new Set(salesData.map(d => d.Product))].sort();

regions.forEach(r => {
  const opt = document.createElement('option');
  opt.value = r;
  opt.textContent = r;
  regionFilter.appendChild(opt);
});

products.forEach(p => {
  const opt = document.createElement('option');
  opt.value = p;
  opt.textContent = p;
  productFilter.appendChild(opt);
});

// ===== Render functions =====
function formatMoney(num) {
  return '$' + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function getFilteredData() {
  const region = regionFilter.value;
  const product = productFilter.value;
  return salesData.filter(d => {
    return (region === 'all' || d.Region === region) &&
           (product === 'all' || d.Product === product);
  });
}

function renderSummary(data) {
  const totalRevenue = data.reduce((sum, d) => sum + d.TotalPrice, 0);
  const totalOrders = data.length;
  const totalQuantity = data.reduce((sum, d) => sum + d.Quantity, 0);
  const totalReturned = data.filter(d => d.Returned === 1).length;

  document.getElementById('totalRevenue').textContent = formatMoney(totalRevenue);
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalReturned').textContent = totalReturned;
}

function renderRegionBars(data) {
  const container = document.getElementById('regionBars');
  container.innerHTML = '';

  const totalsByRegion = {};
  regions.forEach(r => totalsByRegion[r] = 0);
  data.forEach(d => {
    if (totalsByRegion[d.Region] !== undefined) {
      totalsByRegion[d.Region] += d.TotalPrice;
    }
  });

  const maxVal = Math.max(...Object.values(totalsByRegion), 1);

  Object.entries(totalsByRegion).forEach(([region, value]) => {
    const row = document.createElement('div');
    row.className = 'bar-row';

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = region;

    const track = document.createElement('div');
    track.className = 'bar-track';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = ((value / maxVal) * 100) + '%';

    const amount = document.createElement('span');
    amount.className = 'bar-amount';
    amount.textContent = formatMoney(value);

    track.appendChild(fill);
    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(amount);
    container.appendChild(row);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('ordersBody');
  tbody.innerHTML = '';

  // show latest 25 rows for performance
  const rows = data.slice(0, 25);

  rows.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.OrderID}</td>
      <td>${d.Date}</td>
      <td>${d.Region}</td>
      <td>${d.Product}</td>
      <td>${d.Quantity}</td>
      <td>${formatMoney(d.TotalPrice)}</td>
      <td>${d.Salesperson}</td>
    `;
    tbody.appendChild(tr);
  });
}

function update() {
  const filtered = getFilteredData();
  renderSummary(filtered);
  renderRegionBars(filtered);
  renderTable(filtered);
}

regionFilter.addEventListener('change', update);
productFilter.addEventListener('change', update);

// initial render
update();
