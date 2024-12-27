import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import createInvoice from '@salesforce/apex/InvoiceController.createInvoice';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateInvoiceLWC extends LightningElement {
    // URL Parameters
    originRecord;
    accountId;
    invoiceDate;
    invoiceDueDate;
    childRelationshipName;
    lineItemDescription;
    lineItemQuantity;
    lineItemUnitPrice;

    // Variables for displaying URL params
    urlParams = {};

    // Wire method to get the current page parameters
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        // Extract URL parameters from current page
        this.originRecord = currentPageReference.state.origin_record;
        this.accountId = currentPageReference.state.account;
        this.invoiceDate = currentPageReference.state.invoice_date;
        this.invoiceDueDate = currentPageReference.state.invoice_due_date;
        this.childRelationshipName = currentPageReference.state.child_relationship_name;
        this.lineItemDescription = currentPageReference.state.line_item_description;
        this.lineItemQuantity = currentPageReference.state.line_item_quantity;
        this.lineItemUnitPrice = currentPageReference.state.line_item_unit_price;

        // Update the displayable URL parameters
        this.urlParams = {
            origin_record: this.originRecord,
            account: this.accountId,
            invoice_date: this.invoiceDate,
            invoice_due_date: this.invoiceDueDate,
            child_relationship_name: this.childRelationshipName,
            line_item_description: this.lineItemDescription,
            line_item_quantity: this.lineItemQuantity,
            line_item_unit_price: this.lineItemUnitPrice,
        };
    }

    // Handle the create invoice button click
    handleCreateInvoice() {
        createInvoice({
            originRecordId: this.originRecord,
            accountId: this.accountId,
            invoiceDate: this.invoiceDate,
            invoiceDueDate: this.invoiceDueDate,
            childRelationshipName: this.childRelationshipName,
            lineItemDescription: this.lineItemDescription,
            lineItemQuantity: this.lineItemQuantity,
            lineItemUnitPrice: this.lineItemUnitPrice
        })
        .then((result) => {
            // Handle success (e.g., show success toast or navigate to created invoice)
            this.showToast('Success', 'Invoice created successfully!', 'success');
        })
        .catch((error) => {
            // Handle error (e.g., show error toast)
            this.showToast('Error', error.body.message, 'error');
        });
    }

    // Show toast notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}