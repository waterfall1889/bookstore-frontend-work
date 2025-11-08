package org.example.author.model;

import java.util.List;

public record AuthorLookupResponse(String query, int total, List<BookAuthor> results) {
}

