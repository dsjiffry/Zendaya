package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.enums.PaymentMethod;
import com.coconutcoders.zendaya.zendayaBackend.model.Payment;
import com.coconutcoders.zendaya.zendayaBackend.repo.PaymentRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private ProductRepo productRepo;

    /**
     * Obtain a users Payment History
     * POST to http://localhost:8080/getPaymentHistory
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username"
     * @return NOT FOUND if no payment history, else JSON array
     */
    @RequestMapping(value = "/getPaymentHistory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getPaymentHistory(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        List<Payment> payments = paymentRepo.findByUsername(username);
        if (payments == null || payments.isEmpty()) {
            return new ResponseEntity<>("No payment History found", HttpStatus.NOT_FOUND);
        }

        Map<String, Number> response = new HashMap<>();
        for (Payment payment : payments) {
            response.put(payment.getDateTime(), payment.getTotalPrice());
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Obtain a particular payment histories details
     * POST to http://localhost:8080/getPaymentDetails
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username","dateTime"
     * @return NOT FOUND if no payment history, else JSON array
     */
    @RequestMapping(value = "/getPaymentDetails", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getPaymentDetails(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("dateTime")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String dateTime = payload.get("dateTime");

        List<Payment> payments = paymentRepo.findByUsername(username);
        if (payments == null || payments.isEmpty()) {
            return new ResponseEntity<>("No payment History found", HttpStatus.NOT_FOUND);
        }

        for (Payment payment : payments) {
            if (payment.getDateTime().equals(dateTime)) {
                return new ResponseEntity<>(payment.getItemsPurchased(), HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("No purchase found for given dateTime", HttpStatus.NOT_FOUND);
    }


    /**
     * Set the order status as either "payment invalid", "delivered" or "in transit"
     * POST to http://localhost:8080/setOrderStatus
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username", "dateTime", "status"
     * @return NOT FOUND if no payment history, else OK
     */
    @RequestMapping(value = "/setOrderStatus", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity setOrderStatus(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("dateTime") || !payload.containsKey("status")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String dateTime = payload.get("dateTime");
        final String status = payload.get("status");

        List<Payment> payments = paymentRepo.findByUsername(username);
        if (payments == null || payments.isEmpty()) {
            return new ResponseEntity<>("No payment History found", HttpStatus.NOT_FOUND);
        }

        for (Payment payment : payments) {
            if (payment.getDateTime().equals(dateTime)) {
                if (status.equalsIgnoreCase("payment invalid")) {
                    payment.setPaymentInvalid();
                } else if (status.equalsIgnoreCase("delivered")) {
                    payment.setOrderDelivered();
                } else if (status.equalsIgnoreCase("in transit")) {
                    payment.setOrderInTransit();
                } else {
                    return new ResponseEntity<>("Invalid status type", HttpStatus.BAD_REQUEST);
                }
                paymentRepo.save(payment);
                return new ResponseEntity<>("status set successfully", HttpStatus.OK);
            }
        }


        return new ResponseEntity<>("Unable to set status", HttpStatus.NOT_FOUND);
    }

    /**
     * get the current Order Status
     * POST to http://localhost:8080/getOrderStatus
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username", "dateTime"
     * @return NOT FOUND if no payment history, else OK with Order status
     */
    @RequestMapping(value = "/getOrderStatus", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getOrderStatus(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("dateTime")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String dateTime = payload.get("dateTime");
        final String status = payload.get("status");

        List<Payment> payments = paymentRepo.findByUsername(username);
        if (payments == null || payments.isEmpty()) {
            return new ResponseEntity<>("No payment History found", HttpStatus.NOT_FOUND);
        }

        for (Payment payment : payments) {
            if (payment.getDateTime().equals(dateTime)) {
                Map<String, String> temp = new HashMap<>();
                temp.put("Address", payment.getAddress());
                temp.put("Order Status", String.valueOf(payment.getOrderStatus()));
                temp.put("Total Price Paid", String.valueOf(payment.getTotalPrice()));
                temp.put("Payment Method", String.valueOf(payment.getPaymentMethod()));
                if (payment.getPaymentMethod() == PaymentMethod.CREDIT_CARD) {
                    temp.put("Credit card Number", payment.getCreditCardNumber());
                }

                return new ResponseEntity<>(temp, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("Unable to get status", HttpStatus.NOT_FOUND);
    }


}
