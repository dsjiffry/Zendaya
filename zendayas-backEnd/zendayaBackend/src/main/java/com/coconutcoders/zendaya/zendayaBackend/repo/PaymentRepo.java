package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentRepo extends MongoRepository<Payment, String> {
    List<Payment> findByUsername(String username);
}

