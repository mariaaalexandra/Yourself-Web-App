package com.app.repository;


import com.app.models.CheckoutPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckoutPaymentRepository  extends JpaRepository<CheckoutPayment, Long> {

    @Query("SELECT SUM(cp.amount) FROM CheckoutPayment cp")
    long sumTotalAmount();


}
