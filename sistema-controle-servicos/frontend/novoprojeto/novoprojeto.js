document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projectForm");
  const hoursInput = document.getElementById("hours");
  const quoteInput = document.getElementById("quote");
  const invoiceCheckbox = document.getElementById("invoice");
  const totalCostsEl = document.getElementById("totalCosts");
  const taxEl = document.getElementById("tax");
  const profitEl = document.getElementById("profit");

  function atualizarValores() {
    const hours = parseFloat(hoursInput.value) || 0;
    const quote = parseFloat(quoteInput.value) || 0;

    // custo fictício: 50 reais por hora
    const custo = hours * 50;

    // imposto só se emitir nota (10% do orçamento)
    const imposto = invoiceCheckbox.checked ? quote * 0.1 : 0;

    // lucro = orçamento - (custos + impostos)
    const lucro = quote - (custo + imposto);

    totalCostsEl.textContent = `R$ ${custo.toFixed(2)}`;
    taxEl.textContent = `R$ ${imposto.toFixed(2)}`;
    profitEl.textContent = `R$ ${lucro.toFixed(2)}`;
  }

  [hoursInput, quoteInput, invoiceCheckbox].forEach(el =>
    el.addEventListener("input", atualizarValores)
  );

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Projeto salvo com sucesso!");
  });

  atualizarValores();
});
