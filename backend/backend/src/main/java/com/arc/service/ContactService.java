package com.arc.service;

import com.arc.dto.ContactDTO;
import jakarta.validation.Valid;
import java.util.List;

public interface ContactService {
    ContactDTO saveContact(@Valid ContactDTO contactDTO);
    List<ContactDTO> getAllContacts();
    ContactDTO getContactById(Long id);
}
