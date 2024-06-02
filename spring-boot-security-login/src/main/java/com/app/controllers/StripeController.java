package com.app.controllers;

import java.util.HashMap;
import java.util.Map;

import com.app.models.Checkout;
import com.app.models.CheckoutPayment;
import com.app.repository.CheckoutPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.google.gson.Gson;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@RestController
@RequestMapping(value = "/api")
public class StripeController {
    private static Gson gson = new Gson();

    @Autowired
    CheckoutPaymentRepository checkoutPaymentRepository;
    @PostMapping("/payment")
    /**
     * Payment with Stripe checkout page
     *
     * @param payment
     * @return
     * @throws StripeException
     */
    public String paymentWithCheckoutPage(@RequestBody CheckoutPayment payment) throws StripeException {
        // We initilize stripe object with the api key
        init();
        // We create a stripe session
        SessionCreateParams params = SessionCreateParams.builder()
                // We will use the credit card payment method
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT).setSuccessUrl(payment.getSuccessUrl())
                .setCancelUrl(
                        payment.getCancelUrl())
                .addLineItem(
                        SessionCreateParams.LineItem.builder().setQuantity(payment.getQuantity())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(payment.getCurrency()).setUnitAmount(payment.getAmount())
                                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData
                                                        .builder().setName(payment.getName()).build())
                                                .build())
                                .build())
                .build();

        Session session = Session.create(params);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("id", session.getId());
        checkoutPaymentRepository.save(payment);

        return gson.toJson(responseData);
    }

    @PostMapping("/subscription")
    /**
     * Used to create a subscription with strpe checkout page
     *
     * @param checkout
     * @return the subscription id
     * @throws StripeException
     */
    public String subscriptionWithCheckoutPage(@RequestBody Checkout checkout) throws StripeException {
        SessionCreateParams params = new SessionCreateParams.Builder().setSuccessUrl(checkout.getSuccessUrl())
                .setCancelUrl(checkout.getCancelUrl()).addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION).addLineItem(new SessionCreateParams.LineItem.Builder()
                        .setQuantity(1L).setPrice(checkout.getPriceId()).build())
                .build();

        try {
            Session session = Session.create(params);
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("sessionId", session.getId());
            return gson.toJson(responseData);
        } catch (Exception e) {
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("message", e.getMessage());
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("error", messageData);
            return gson.toJson(responseData);
        }
    }

    private static void init() {
        Stripe.apiKey = "sk_test_51PLVHkRvWgDRXXMz8K50jZHUSMqiAcxcTTL5aKVV8OYzPvKg57Ga1QiXD1RSUYBYT1V1O3CB2ZedrOEr62IsEGbb00M8mkQhZx";
    }

    @GetMapping("/total-amount")
    public long getTotalAmount() {
        return checkoutPaymentRepository.sumTotalAmount()/100;
    }
}