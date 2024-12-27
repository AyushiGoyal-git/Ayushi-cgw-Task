public class InvoiceController {
    @AuraEnabled
    public static String createInvoice(
        Id originRecordId,
        Id accountId,
        Date invoiceDate,
        Date invoiceDueDate,
        String childRelationshipName,
        String lineItemDescription,
        Integer lineItemQuantity,
        Decimal lineItemUnitPrice
    ) {
        try {
            // Create the Invoice record
            Invoice newInvoice = new Invoice(
                BillingAccountId = accountId,
                InvoiceDate = invoiceDate,
                DueDate = invoiceDueDate,
                Invoice_Reference__c = 'INV-' + System.currentTimeMillis(),
                Total__c = 0
            );
            insert newInvoice;

            // Create Line Item record
            InvoiceLine newLineItem = new InvoiceLine(
                InvoiceId = newInvoice.Id,
                Description = lineItemDescription,
                Quantity = lineItemQuantity,
                UnitPrice = lineItemUnitPrice
            );
            insert newLineItem;

             // Update Invoice Total (if necessary)
            // Use aggregate query and access the result properly
            AggregateResult totalAmountResult = [
                SELECT SUM(Amount__c) totalAmount 
                FROM InvoiceLine 
                WHERE InvoiceId = :newInvoice.Id
            ];

            // Now, access the sum from the AggregateResult
            Decimal totalAmount = (totalAmountResult != null && totalAmountResult.get('totalAmount') != null)
                                    ? (Decimal) totalAmountResult.get('totalAmount') 
                                    : 0;

            // Update the Invoice total field
            newInvoice.Total__c = totalAmount;
            update newInvoice;

            // Return the Invoice ID or any other identifier
            return newInvoice.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating invoice: ' + e.getMessage());
        }
    }
}