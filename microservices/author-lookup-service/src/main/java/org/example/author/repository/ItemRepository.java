package org.example.author.repository;

import org.example.author.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, String> {

    List<ItemEntity> findAllByValidness(Integer validness);

    ItemEntity findByItemNameAndValidness(String itemName, Integer validness);

    List<ItemEntity> findTop20ByItemNameContainingIgnoreCaseAndValidness(String itemName, Integer validness);
}

