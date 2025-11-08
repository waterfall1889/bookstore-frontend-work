package org.example.author.model;

import java.util.List;

public record BookAuthor(String itemId, String bookName, List<String> authors) {
}

