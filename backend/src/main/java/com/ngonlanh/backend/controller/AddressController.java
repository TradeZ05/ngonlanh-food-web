package com.ngonlimage.backend.controller;

import com.ngonlimage.backend.entity.Address;
import com.ngonlimage.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired private AddressService addressService;

    @GetMapping
    public ResponseEntity<?> getMyAddresses() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(addressService.getMyAddresses(username));
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Address address) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(addressService.addAddress(username, address));
    }

    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        addressService.setDefault(username, id);
        return ResponseEntity.ok("Đã đặt làm địa chỉ mặc định");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            addressService.deleteAddress(username, id);
            return ResponseEntity.ok("Xóa thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}