const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const connection = require('../connection.js');
const findUserByEmail = require('../util.js').findUserByEmail;

router.get('/', (req, res) => {
  connection.query('INSERT INTO customers (stream_key, name, theme) VALUES (?, ?)', ["dstream", "DStream", "light"], (err, result) => {
    if (err) {
      res.status(500).send("Something went wrong");
    }
    res.status(200).send();
  });
});

router.get('/customer-details', (req, res) => {
  console.log(req.query);
  connection.query('SELECT * FROM customers WHERE stream_key = ?', [req.query.stream_key], (err, result) => {
    if (err) {
      res.status(500).send("Something went wrong");
    }
    console.log(result);
    res.status(200).send(result[0]);
  });
});

const stripe = require('stripe')('sk_test_51HbBbtDSAAIAD42iPKX7HD6grCW2JyWW0JgrlhD3UnLaFkFlH5BWLPfplLxsUYIyDBQIqPcswm3lxuCsAzoQ3Fzv000nJtXO3T');

router.post(
  '/stripe-webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(err);
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(
        `⚠️  Check the env file and enter the correct webhook secret.`
      );
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    const dataObject = event.data.object;

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case 'invoice.paid':
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        break;
      case 'invoice.payment_failed':
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case 'customer.subscription.deleted':
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      default:
      // Unexpected event type
    }
    res.sendStatus(200);
  }
);

router.post('/create-customer', async (req, res) => {
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  res.send({ customer });
});


router.post('/create-subscription', async (req, res) => {
  // Attach the payment method to the customer
  console.log(req.body);
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  console.log(req.body.email);

  const user = await findUserByEmail(req.body.email);

  connection.query(
    'INSERT INTO subscriptions (stripe_id, user_id, stream_key) VALUES (?, ?, ?)',
    [subscription.id, user.id, req.body.streamKey],
    (err, result) => {
      if (err) {
        // TODO: XXX: Will want to roll back subscription if this fails
        console.log(err);
        return res.status(500).send("Something went wrong");
      }
      return res.send(subscription);
    }
  );

});

router.post('/retry-invoice', async (req, res) => {
  // Set the default payment method on the customer

  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
    await stripe.customers.update(req.body.customerId, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    });
  } catch (error) {
    // in case card_decline error
    return res
      .status('402')
      .send({ result: { error: { message: error.message } } });
  }

  const invoice = await stripe.invoices.retrieve(req.body.invoiceId, {
    expand: ['payment_intent'],
  });
  res.send(invoice);
});

module.exports = router;
