package org.example.author.service;

import org.example.author.entity.ItemEntity;
import org.example.author.model.BookAuthor;
import org.example.author.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class AuthorLookupService {

    private final ItemRepository itemRepository;

    public AuthorLookupService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<BookAuthor> findAuthorsByBookName(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return List.of();
        }
        String trimmedKeyword = keyword.trim();

        ItemEntity exact = itemRepository.findByItemNameAndValidness(trimmedKeyword, 1);
        if (exact != null) {
            return List.of(mapToBookAuthor(exact));
        }

        List<ItemEntity> fuzzy = itemRepository
                .findTop20ByItemNameContainingIgnoreCaseAndValidness(trimmedKeyword, 1);

        if (fuzzy.isEmpty()) {
            List<ItemEntity> allValid = itemRepository.findAllByValidness(1);
            fuzzy = allValid.stream()
                    .filter(item -> item.getItemName() != null
                            && item.getItemName().toLowerCase().contains(trimmedKeyword.toLowerCase()))
                    .limit(20)
                    .toList();
        }

        return fuzzy.stream()
                .map(this::mapToBookAuthor)
                .toList();
    }

    private BookAuthor mapToBookAuthor(ItemEntity entity) {
        List<String> authors = parseAuthors(entity.getAuthor());
        return new BookAuthor(entity.getItemId(), entity.getItemName(), authors);
    }

    private static List<String> parseAuthors(String authorField) {
        if (!StringUtils.hasText(authorField)) {
            return Collections.emptyList();
        }
        return Arrays.stream(authorField.split("[,，/|;]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }
}

