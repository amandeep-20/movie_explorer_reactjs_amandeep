// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import React from 'react';

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) return;
    
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//       billing_details: {
//         address: {
//           postal_code: '90210',
//         },
//       },
//     });

//     if (error) {
//       console.log('[error]', error.message);
//     } else {
//       console.log('[PaymentMethod]', paymentMethod);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit" disabled={!stripe}>
//         Pay
//       </button>
//     </form>
//   );
// };

// export default CheckoutForm;