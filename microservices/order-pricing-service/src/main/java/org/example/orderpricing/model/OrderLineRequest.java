package org.example.orderpricing.model;

import java.math.BigDecimal;

public record OrderLineRequest(BigDecimal unitPrice, Integer quantity) {
}

