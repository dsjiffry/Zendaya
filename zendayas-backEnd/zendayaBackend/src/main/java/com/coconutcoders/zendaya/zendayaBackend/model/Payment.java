package com.coconutcoders.zendaya.zendayaBackend.model;

import com.coconutcoders.zendaya.zendayaBackend.enums.OrderStatus;
import com.coconutcoders.zendaya.zendayaBackend.enums.PaymentMethod;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Payment {
    @Id
    private ObjectId id;

    private String username;
    private String dateTime;
    private HashMap<String, HashMap<String, Number>> itemsPurchased;// Name of item, price per item and quantity per
    private double totalPrice;
    private OrderStatus orderStatus;
    private String address;
    private PaymentMethod paymentMethod;
    private String creditCardNumber;
    private int creditCardCVC;
    private String creditCardExpiryDate;

    public Payment(String username) {
        this.username = username;
        dateTime = new Date().toString();
        orderStatus = OrderStatus.PAYMENT_MADE;
        itemsPurchased = new HashMap<>();
    }

    public void setItems(ShoppingCart shoppingCart, ProductRepo productRepo) {
        totalPrice = shoppingCart.getTotalPrice(productRepo);

        for (Map.Entry<String, Integer> item : shoppingCart.getProductAndQuantity().entrySet()) {
            String productName = item.getKey();
            Product product = productRepo.findByNameIgnoreCase(productName);

            HashMap<String, Number> temp = new HashMap<>();
            temp.put("quantity", item.getValue());
            temp.put("pricePerItem", product.getPriceWithDiscount());

            itemsPurchased.put(productName, temp);
        }
    }

    public void setOrderInTransit() {
        this.orderStatus = OrderStatus.IN_TRANSIT;
    }

    public void setOrderDelivered() {
        this.orderStatus = OrderStatus.DELIVERED;
    }

    public void setPaymentInvalid() {
        this.orderStatus = OrderStatus.PAYMENT_INVALID;
    }

    public void setStoreCancelled() {
        this.orderStatus = OrderStatus.STORE_CANCELLED;
    }

    public void setUserCancelled() {
        this.orderStatus = OrderStatus.USER_CANCELLED;
    }


    public String getDateTime() {
        return dateTime;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public HashMap<String, HashMap<String, Number>> getItemsPurchased() {
        return itemsPurchased;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public String getUsername() {
        return username;
    }

    public void setPaymentCash(String address) {
        this.paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        this.address = address;
    }

    public void setPaymentCard(String creditCardNumber, int creditCardCVC, String creditCardExpiryDate, String address) {
        this.creditCardNumber = creditCardNumber;
        this.creditCardCVC = creditCardCVC;
        this.creditCardExpiryDate = creditCardExpiryDate;
        this.paymentMethod = PaymentMethod.CREDIT_CARD;
        this.address = address;
    }

    public String getAddress() {
        return address;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public String getCreditCardNumber() {
        return creditCardNumber;
    }
}
