export const legalPages = {
  '/privacy': {
    title: 'Privacy Policy',
    sections: [
      ['Who handles your data', '[Add the data controller’s name, address and privacy contact.]'],
      ['Forms and accounts', 'Contact forms ask for your name, email and message. Custom orders ask for your email, order details and any optional image you attach. If enabled, accounts use your email and display name.'],
      ['Purpose and retention', 'We use your details to reply, handle custom requests or manage your account. If you request the newsletter, your email is used to send a confirmation link. You receive newsletters only after confirming. [Confirm legal bases, recipients, retention periods and any international transfers.]'],
      ['Your choices', '[Add how to request access, correction, deletion or other applicable rights, and how to complain to the relevant authority.]'],
      ['Browser storage', 'The store saves preferences and cart items in your browser. The preview profile and text drafts also use browser storage.'],
    ],
  },
  '/terms': {
    title: 'Terms of Sale',
    sections: [
      ['Seller and ordering', '[Add seller identity, acceptance steps and the point when an order becomes binding.]'],
      ['Prices and delivery', '[Confirm currency, taxes, shipping charges, payment terms and delivery commitments.]'],
      ['Cancellations and complaints', '[Confirm withdrawal, returns, statutory remedies and the complaint process.]'],
    ],
  },
  '/imprint': {
    title: 'Legal Notice',
    sections: [
      ['Seller name', '[Add the seller’s legal name.]'],
      ['Registration number', '[Add the registration number and register.]'],
      ['Registered address', '[Add the registered postal address.]'],
      ['VAT ID', '[Add the VAT ID, if applicable.]'],
      ['Contact details', '[Add the seller’s monitored email address and any required contact details.]'],
    ],
  },
} as const

export type LegalPath = keyof typeof legalPages
