package org.example.orderpricing.function;

import org.example.orderpricing.model.OrderLineRequest;
import org.example.orderpricing.model.OrderLineResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.function.Function;

@Component("orderLineTotal")
public class OrderLineTotalFunction implements Function<OrderLineRequest, OrderLineResponse> {

    private static final Logger log = LoggerFactory.getLogger(OrderLineTotalFunction.class);

    @Override
    public OrderLineResponse apply(OrderLineRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body must not be null");
        }
        BigDecimal unitPrice = Objects.requireNonNull(request.unitPrice(), "unitPrice must not be null");
        Integer quantity = Objects.requireNonNull(request.quantity(), "quantity must not be null");
        if (quantity < 0) {
            throw new IllegalArgumentException("quantity must not be negative");
        }
        BigDecimal safeUnitPrice = unitPrice.max(BigDecimal.ZERO);
        BigDecimal total = safeUnitPrice.multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP);
        log.info("orderLineTotal invoked, unitPrice={}, quantity={}, total={}",
                safeUnitPrice, quantity, total);
        return new OrderLineResponse(total);
    }
}

