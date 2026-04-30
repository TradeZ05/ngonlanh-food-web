package com.ngonlanh.backend.service;

import com.ngonlanh.backend.entity.Address;
import com.ngonlanh.backend.entity.User;
import com.ngonlanh.backend.repository.AddressRepository;
import com.ngonlanh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    @Autowired private AddressRepository addressRepository;
    @Autowired private UserRepository userRepository;

    public List<Address> getMyAddresses(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return addressRepository.findByUserOrderByIsDefaultDesc(user);
    }

    @Transactional
    public Address addAddress(String username, Address address) {
        User user = userRepository.findByUsername(username).orElseThrow();
        address.setUser(user);
        
        // Nếu là địa chỉ đầu tiên, tự động set làm mặc định luôn cho tiện
        List<Address> existing = addressRepository.findByUserOrderByIsDefaultDesc(user);
        if (existing.isEmpty()) {
            address.setDefault(true);
        } else if (address.isDefault()) {
            // Nếu User cố tình tick "Đặt làm mặc định" khi thêm mới
            unsetDefaultAll(user);
        }
        
        return addressRepository.save(address);
    }

    @Transactional
    public void setDefault(String username, Long addressId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        
        // 1. Gỡ mặc định của tất cả địa chỉ cũ
        unsetDefaultAll(user);
        
        // 2. Set cái mới chọn làm mặc định
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));
        
        if (!address.getUser().equals(user)) throw new RuntimeException("Quyền truy cập bị từ chối");
        
        address.setDefault(true);
        addressRepository.save(address);
    }

    private void unsetDefaultAll(User user) {
        List<Address> addresses = addressRepository.findByUserOrderByIsDefaultDesc(user);
        addresses.forEach(a -> a.setDefault(false));
        addressRepository.saveAll(addresses);
    }

    public void deleteAddress(String username, Long addressId) {
        Address address = addressRepository.findById(addressId).orElseThrow();
        if (!address.getUser().getUsername().equals(username)) throw new RuntimeException("Không có quyền xóa");
        if (address.isDefault()) throw new RuntimeException("Không thể xóa địa chỉ mặc định, hãy set cái khác làm mặc định trước");
        
        addressRepository.delete(address);
    }
}