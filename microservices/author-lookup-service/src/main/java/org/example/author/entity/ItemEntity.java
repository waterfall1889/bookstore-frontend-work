package org.example.author.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "item_meta")
public class ItemEntity {

    @Id
    @Column(name = "item_id", length = 9)
    private String itemId;

    @Column(name = "item_name", length = 40)
    private String itemName;

    @Column(name = "author", length = 20)
    private String author;

    @Column(name = "validness")
    private Integer validness;

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getValidness() {
        return validness;
    }

    public void setValidness(Integer validness) {
        this.validness = validness;
    }
}

