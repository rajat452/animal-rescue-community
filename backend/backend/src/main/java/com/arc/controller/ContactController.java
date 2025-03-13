package com.arc.controller;

import com.arc.dto.ContactDTO;
import com.arc.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // Endpoint to create a new contact with validation
    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody ContactDTO contactDTO) {
        ContactDTO savedContact = contactService.saveContact(contactDTO);
        return new ResponseEntity<>(savedContact, HttpStatus.CREATED);
    }

    // Endpoint to get all contacts
    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAllContacts() {
        List<ContactDTO> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }

    // Endpoint to get contact by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id) {
        ContactDTO contact = contactService.getContactById(id);
        return ResponseEntity.ok(contact);
    }
}
