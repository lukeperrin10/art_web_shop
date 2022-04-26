import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import store from '../../redux/store/store'
import {
  errorMessage,
  successMessage,
} from '../../redux/reducers/message.slice'
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(publishableKey)

const HopHelper = {
  totalPrice(data) {
    const total = data.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)
    if (total > 0) {
      return total
    } else {
      return ''
    }
  },

  totalAmount(data) {
    const amount = data.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
    if (amount > 0) {
      return ` (${amount})`
    } else {
      return ''
    }
  },

  popupStatus(status) {
    if (status === 'success') {
      store.dispatch(successMessage('Payment successful'))
    } else if (status === 'cancel') {
      store.dispatch(errorMessage('Payment unsuccessful'))
    }
  },

  handleShipping(cart) {
    if (this.totalPrice(cart) > 10000) {
      return { shipping_rate: 'shr_1KrM4GL7WvJmM60Hh3sFFJlf' }
    } else {
      return { shipping_rate: 'shr_1KrLXXL7WvJmM60HqbcmyWp4' }
    }
  },

  async createCheckOutSession(cart) {
    try {
      const stripe = await stripePromise
      const checkoutSession = await axios.post('/api/create-stripe-session', {
        item: cart,
      })
      await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.session.id,
      })
    } catch (error) {
      store.dispatch(
        errorMessage('Something went wrong, please try again later.')
      )
    }
  },
}

export default HopHelper
