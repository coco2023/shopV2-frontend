
export function convertToCSV(transactions) {
  const csvString = [
    [
      'ErrorCode',
      'ErrorMessage',
      'Transaction SN',
      'Sales Order SN',
      'Error Type',
      'Description',
      'Timestamp',
      'Date',
      'Transaction ID',
      'Fees',
      'Net Amount',
      'Status',
      'Payment Method'
    ],
    ...transactions.map(item => [
      item.reconcileErrorLog?.errorCode || '',
      item.reconcileErrorLog?.errorMessage || '',
      item.reconcileErrorLog?.transactionSn || '',
      item.reconcileErrorLog?.salesOrderSn || '',
      item.reconcileErrorLog?.errorType || '',
      item.reconcileErrorLog?.description || '',
      item.reconcileErrorLog ? new Date(
        item.reconcileErrorLog.timestamp[0],
        item.reconcileErrorLog.timestamp[1] - 1,
        item.reconcileErrorLog.timestamp[2],
        item.reconcileErrorLog.timestamp[3],
        item.reconcileErrorLog.timestamp[4],
        item.reconcileErrorLog.timestamp[5]
      ).toLocaleString() : '',
      item.paypalDBPaymentRecord?.createTime || 'N/A',
      item.paypalDBPaymentRecord?.transactionId || item.paypalTransactionRecord?.transactionId || '',
      item.paypalDBPaymentRecord?.fees || item.paypalTransactionRecord?.fees || '',
      item.paypalDBPaymentRecord?.net || item.paypalTransactionRecord?.net || '',
      item.paypalDBPaymentRecord?.status || 'N/A',
      item.paypalDBPaymentRecord?.paymentMethod || 'N/A'
    ])
  ]
    .map(e => e.join(','))
    .join('\n');

    return csvString;
  }
  
  export function downloadCSV(data) {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'reconcile_result.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  