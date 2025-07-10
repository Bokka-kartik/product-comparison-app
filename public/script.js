async function searchProduct() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const resultsBox = document.getElementById("results");
  resultsBox.innerHTML = " Loading...";

  try {
    const response = await fetch(`http://localhost:3000/scrape?q=${query}`);
    const products = await response.json();

    if (products.length === 0) {
      resultsBox.innerHTML = "<p>No products found.</p>";
    } else {
      displayResults(products);
    }
  } catch (err) {
    console.error(" Error fetching product data gone wrong:", err);
    resultsBox.innerHTML = "<p style='color:red;'>Failed to fetch product data.</p>";
  }
}

function sortBy(criteria) {
  const cards = [...document.querySelectorAll('.card')];
  const sorted = cards.sort((a, b) => {
    const valA = parseFloat(a.dataset[criteria].replace(/[^0-9.]/g, '')) || 0;
    const valB = parseFloat(b.dataset[criteria].replace(/[^0-9.]/g, '')) || 0;
    return valA - valB;
  });
  const results = document.getElementById("results");
  results.innerHTML = "";
  sorted.forEach(card => results.appendChild(card));
}

function displayResults(products) {
  const resultBox = document.getElementById("results");
  resultBox.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.price = product.price;
    card.dataset.rating = product.rating;
    card.innerHTML = `
      <h3>${product.title}</h3>
      <img src="${product.image}" alt="product" />
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <a href="${product.url}" target="_blank">View on Amazon</a>
    `;
    resultBox.appendChild(card);
  });
}
script.js



