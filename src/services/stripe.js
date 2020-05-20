import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/users'

const getStripeSecred = async () => {

  const response = await axios.get(`${BACKEND_URL}kafbakery/stripe/gimmefood_secred`);
  const responseJson = await response.json();
  return responseJson.client_secret
  // Call stripe.confirmCardPayment() with the client secret.
};

const getIntent = async (user) => {
  const config = {
    headers: { 'Stripe-Account': user.stripe_id },
  }

  const response = await axios.post(`${BACKEND_URL}stripe/create-intent`, user, {});
  console.log('Intent response: ', response)
  // const responseJson = await response.json();
  return response.data//responseJson.client_secret
  // Call stripe.confirmCardPayment() with the client secret.
};

export default {
  getStripeSecred,
  getIntent
}