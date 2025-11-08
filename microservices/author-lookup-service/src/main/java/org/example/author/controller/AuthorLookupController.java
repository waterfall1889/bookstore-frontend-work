package org.example.author.controller;

import jakarta.validation.constraints.NotBlank;
import org.example.author.model.AuthorLookupResponse;
import org.example.author.model.BookAuthor;
import org.example.author.service.AuthorLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/authors")
public class AuthorLookupController {

    private final AuthorLookupService authorLookupService;

    public AuthorLookupController(AuthorLookupService authorLookupService) {
        this.authorLookupService = authorLookupService;
    }

    @GetMapping
    public ResponseEntity<AuthorLookupResponse> getAuthorsByBookName(
            @RequestParam("bookName") @NotBlank String bookName) {

        List<BookAuthor> results = authorLookupService.findAuthorsByBookName(bookName);
        AuthorLookupResponse response = new AuthorLookupResponse(bookName, results.size(), results);
        return ResponseEntity.ok(response);
    }
}

