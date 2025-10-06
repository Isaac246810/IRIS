nav.wallet.addEventListener('click', () => showSection('wallet'));
nav.card.addEventListener('click', () => showSection('card'));
nav.more.addEventListener('click', () => showSection('more'));

// ================================
// Transfer Modal
// ================================
sendMoneyBtn.addEventListener('click', () => {
  transferModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  transferModal.classList.add('hidden');
});

// ================================
// Confirm Send
// ================================
confirmSend.addEventListener('click', () => {
  const recipient = document.getElementById('recipientName').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const note = document.getElementById('note').value;

  if(!recipient  !amount  amount <= 0){
    alert('Fill all fields correctly');
    if(soundEnabled) errorSound.play();
    return;
  }

  balance -= amount;
  balanceEl.textContent = ₦${balance.toLocaleString()}.00;

  const txn = {
    recipient,
    amount,
    note,
    date: new Date().toLocaleString(),
    status: 'Success'
  };

  transactions.unshift(txn);
  renderTransactions();
  transferModal.classList.add('hidden');

  if(soundEnabled) successSound.play();

  document.getElementById('recipientName').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('note').value = '';
});

// ================================
// Render Transactions
// ================================
function renderTransactions(){
  transactionsDiv.innerHTML = '';
  transactions.forEach((t, index) => {
    const div = document.createElement('div');
    div.classList.add('transaction-card');
    div.innerHTML = 
      <p><strong>${t.recipient}</strong></p>
      <p>₦${t.amount.toLocaleString()}</p>
      <p>${t.date}</p>
    ;
    div.addEventListener('click', () => showTransactionDetails(t));
    transactionsDiv.appendChild(div);
  });
}

// ================================
// Transaction Details Page
// ================================
function showTransactionDetails(txn){
  tdRecipient.textContent = txn.recipient;
  tdAmount.textContent = ₦${txn.amount.toLocaleString()};
  tdDate.textContent = txn.date;
  tdNote.textContent = txn.note || '—';
  tdStatus.textContent = txn.status;
  tdStatus.className = txn.status === 'Success' ? 'status-success' : 'status-failed';

  screens.dashboard.classList.add('hidden');
  screens.transactionDetails.classList.remove('hidden');
}

backToWallet.addEventListener('click', () => {
  screens.transactionDetails.classList.add('hidden');
  screens.dashboard.classList.remove('hidden');
});

// ================================
// OTP Verification
// ================================
otpBoxes.forEach(box => {
  box.addEventListener('keyup', () => {
    if(collectOTP().length === 6){
      if(collectOTP() === generatedOTP){
        screens.otp.classList.add('hidden');
        screens.dashboard.classList.remove('hidden');
        if(soundEnabled) successSound.play();
      } else {
        if(soundEnabled) errorSound.play();
      }
    }
  });
});

// ================================
// CSV Export
// ================================
document.getElementById('exportCsv').addEventListener('click', () => {
  if(transactions.length === 0){
    alert('No transactions to export!');
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,Recipient,Amount,Date,Note,Status\n";
  transactions.forEach(t => {
    csvContent += ${t.recipient},${t.amount},${t.date},${t.note || ''},${t.status}\n;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "IRIS_PAY_Transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
